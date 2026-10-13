import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';
import { z } from 'zod';
import { enviarEmailRecuperacaoSenha } from '@/lib/email/brevo';

export const dynamic = 'force-dynamic';

const SolicitarRecuperacaoSchema = z
  .object({
    email: z.string().optional(),
    emailOrIdentifier: z.string().optional(),
    identificador: z.string().optional(),
  })
  .refine(
    (data) => Boolean((data.email || data.emailOrIdentifier || data.identificador)?.trim()),
    {
      message: 'Por favor, informe seu e-mail institucional ou matrícula.',
    }
  );

function mascararEmail(email: string): string {
  const [usuario, dominio] = email.split('@');
  if (!dominio) return email;
  if (usuario.length <= 2) {
    return `${usuario[0]}*@${dominio}`;
  }
  const visivelInicio = usuario.slice(0, 2);
  const visivelFim = usuario.slice(-1);
  return `${visivelInicio}${'*'.repeat(Math.max(2, usuario.length - 3))}${visivelFim}@${dominio}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const dados = SolicitarRecuperacaoSchema.parse(body);

    const termo = (dados.email || dados.emailOrIdentifier || dados.identificador || '').trim().toLowerCase();

    if (!termo) {
      return NextResponse.json(
        { error: 'Por favor, informe seu e-mail institucional ou matrícula.' },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        { error: 'Configuração do servidor Supabase incompleta.' },
        { status: 500 }
      );
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // 1. Busca todos os usuários para localizar correspondência com e-mail institucional, secundário ou matrícula
    const { data: usersData, error: listError } = await supabaseAdmin.auth.admin.listUsers();

    if (listError) {
      console.error('Erro ao listar usuários no Supabase Admin:', listError);
      return NextResponse.json(
        { error: 'Falha temporária ao consultar base institucional.' },
        { status: 500 }
      );
    }

    let usuarioEncontrado = usersData.users.find((u) => {
      const emailInst = u.email?.toLowerCase();
      const emailSec = (u.user_metadata?.email_secundario as string | undefined)?.toLowerCase();
      const matricula = (u.user_metadata?.matricula as string | undefined)?.toLowerCase();
      return emailInst === termo || emailSec === termo || matricula === termo;
    });

    // Se não encontrou no metadata direto, busca na tabela perfis_usuarios por e-mail ou matrícula
    if (!usuarioEncontrado) {
      const { data: perfilMatch } = await supabaseAdmin
        .from('perfis_usuarios')
        .select('id, email, matricula')
        .or(`email.ilike.${termo},matricula.ilike.${termo}`)
        .maybeSingle();

      if (perfilMatch) {
        usuarioEncontrado = usersData.users.find((u) => u.id === perfilMatch.id);
      }
    }

    // Defesa contra enumeração de e-mails: Se não encontrar, responde positivamente sem vazar detalhes
    if (!usuarioEncontrado) {
      return NextResponse.json({
        message:
          'Se a identificação informada estiver registrada no sistema, as orientações de redefinição de senha foram encaminhadas para o e-mail alternativo vinculado.',
      });
    }

    // 2. Localiza o e-mail secundário do usuário (onde o Brevo pode entregar a mensagem)
    let emailDestino = usuarioEncontrado.user_metadata?.email_secundario as string | undefined;

    // Tratamento especial para o e-mail seed da Direção caso ainda não tenha secundário cadastrado
    if (!emailDestino && usuarioEncontrado.email === 'direcao.carangola@uemg.br') {
      emailDestino = 'cursosiuemgcarangola@gmail.com';
    }

    if (!emailDestino) {
      return NextResponse.json(
        {
          error:
            'Esta conta institucional não possui um e-mail alternativo cadastrado para receber links de recuperação. Entre em contato com o Gabinete da Direção ou Secretaria Acadêmica.',
        },
        { status: 400 }
      );
    }

    // 3. Gera token criptograficamente seguro e define validade de 2 horas
    const token = crypto.randomBytes(32).toString('hex');
    const expiraEm = Date.now() + 2 * 60 * 60 * 1000; // 2 horas

    // 4. Grava token e expiração nos metadados seguros do usuário
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      usuarioEncontrado.id,
      {
        user_metadata: {
          ...usuarioEncontrado.user_metadata,
          token_recuperacao: token,
          token_recuperacao_expira_em: expiraEm,
          email_secundario: emailDestino,
        },
      }
    );

    if (updateError) {
      console.error('Erro ao gravar token de recuperação:', updateError);
      return NextResponse.json(
        { error: 'Não foi possível gerar a chave de redefinição de acesso.' },
        { status: 500 }
      );
    }

    // 5. Determina a URL base da aplicação de forma dinâmica e segura
    const originHeader = request.headers.get('origin');
    const hostHeader = request.headers.get('x-forwarded-host') || request.headers.get('host');
    const protoHeader = request.headers.get('x-forwarded-proto') || (hostHeader?.includes('localhost') ? 'http' : 'https');

    let origin = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || 'https://carangola.uemg.br';

    // Se a requisição partiu de um ambiente local (desenvolvimento), preserva localhost para testes locais
    if (originHeader?.includes('localhost') || hostHeader?.includes('localhost')) {
      origin = originHeader || (hostHeader ? `${protoHeader}://${hostHeader}` : 'http://localhost:3000');
    }

    const linkRecuperacao = `${origin}/redefinir-senha?token=${token}`;

    const nomeDestinatario =
      (usuarioEncontrado.user_metadata?.nome_completo as string) ||
      (usuarioEncontrado.user_metadata?.nome as string) ||
      'Servidor(a) UEMG';

    // 6. Dispara o e-mail com layout institucional pelo Brevo
    const envioBrevo = await enviarEmailRecuperacaoSenha({
      destinatarioEmail: emailDestino,
      destinatarioNome: nomeDestinatario,
      emailInstitucional: usuarioEncontrado.email || termo,
      linkRecuperacao,
    });

    if (!envioBrevo.sucesso) {
      console.error('Falha no envio de e-mail pela plataforma Brevo:', envioBrevo.erro);
      return NextResponse.json(
        {
          error:
            'O link foi gerado, mas houve uma falha de entrega no provedor Brevo. Tente novamente em alguns instantes.',
        },
        { status: 502 }
      );
    }

    const emailMascarado = mascararEmail(emailDestino);

    return NextResponse.json({
      message: `Instruções de redefinição enviadas com sucesso para o e-mail alternativo: ${emailMascarado}. Verifique sua caixa de entrada e spam.`,
      emailDestino: emailMascarado,
      emailMascarado: emailMascarado,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0]?.message || 'Dados inválidos.' },
        { status: 400 }
      );
    }

    console.error('Erro na solicitação de recuperação de senha:', error);
    return NextResponse.json(
      { error: 'Erro interno ao processar recuperação de senha.' },
      { status: 500 }
    );
  }
}
