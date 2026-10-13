import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { enviarEmailAprovacaoCoordenador } from '@/lib/email/brevo';
import { CURSOS_LISTA } from '@/lib/data/mock-articles';

export const dynamic = 'force-dynamic';

const CURSO_NOME_MAPA: Record<string, string> = {
  BIO: 'Ciências Biológicas',
  GEO: 'Geografia',
  HIS: 'História',
  LET: 'Letras (Português/Inglês)',
  MAT: 'Matemática',
  PED: 'Pedagogia',
  SSO: 'Serviço Social',
  SIS: 'Sistemas de Informação',
};

// GET: Lista coordenadores e status de homologação (Exclusivo Gabinete da Direção)
export async function GET() {
  try {
    const supabaseUserClient = createServerSupabaseClient();
    const {
      data: { user },
    } = await supabaseUserClient.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 });
    }

    const role = user.user_metadata?.role;
    if (role !== 'direcao') {
      return NextResponse.json(
        { error: 'Acesso restrito ao Gabinete da Direção Geral.' },
        { status: 403 }
      );
    }

    const supabaseAdmin = getSupabaseAdmin();
    const { data: usersData, error: listError } = await supabaseAdmin.auth.admin.listUsers();

    if (listError) {
      return NextResponse.json({ error: listError.message }, { status: 500 });
    }

    const coordenadores = (usersData.users || [])
      .filter((u) => u.user_metadata?.role === 'coordenador_curso')
      .map((u) => {
        const meta = u.user_metadata || {};
        const sigla = (meta.curso_sigla || 'SIS').toUpperCase();
        return {
          id: u.id,
          nomeCompleto: meta.nome_completo || 'Não informado',
          emailInstitucional: u.email || '',
          emailSecundario: meta.email_secundario || '',
          matricula: meta.matricula || '',
          cursoSigla: sigla,
          cursoNome: CURSO_NOME_MAPA[sigla] || sigla,
          status: meta.status || 'ativo',
          solicitadoEm: meta.solicitado_em || u.created_at,
          aprovadoEm: meta.aprovado_em || null,
        };
      })
      .sort((a, b) => new Date(b.solicitadoEm).getTime() - new Date(a.solicitadoEm).getTime());

    return NextResponse.json({ coordenadores }, { status: 200 });
  } catch (error: any) {
    console.error('Erro ao listar coordenadores:', error);
    return NextResponse.json(
      { error: error?.message || 'Erro ao processar solicitação.' },
      { status: 500 }
    );
  }
}

// POST: Homologar ou Rejeitar acesso de Coordenador de Curso
export async function POST(request: Request) {
  try {
    const supabaseUserClient = createServerSupabaseClient();
    const {
      data: { user: callerUser },
    } = await supabaseUserClient.auth.getUser();

    if (!callerUser) {
      return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 });
    }

    if (callerUser.user_metadata?.role !== 'direcao') {
      return NextResponse.json(
        { error: 'Apenas a Direção Geral pode homologar acessos.' },
        { status: 403 }
      );
    }

    const { userId, acao } = await request.json();

    if (!userId || !['aprovar', 'rejeitar', 'reenviar_email'].includes(acao)) {
      return NextResponse.json(
        { error: 'Parâmetros inválidos (userId e acao: aprovar | rejeitar | reenviar_email obrigatórios).' },
        { status: 400 }
      );
    }

    const supabaseAdmin = getSupabaseAdmin();
    const { data: targetData, error: getUserError } = await supabaseAdmin.auth.admin.getUserById(userId);

    if (getUserError || !targetData.user) {
      return NextResponse.json({ error: 'Usuário não localizado.' }, { status: 404 });
    }

    const targetUser = targetData.user;
    const currentMeta = targetUser.user_metadata || {};
    const emailSecundario = currentMeta.email_secundario;

    if (!emailSecundario) {
      return NextResponse.json(
        { error: 'O coordenador selecionado não possui um e-mail alternativo/pessoal registrado.' },
        { status: 400 }
      );
    }

    // Ação: Reenviar Notificação por e-mail
    if (acao === 'reenviar_email') {
      const sigla = (currentMeta.curso_sigla || 'SIS').toUpperCase();
      const cursoNome = CURSO_NOME_MAPA[sigla] || sigla;

      const envioRes = await enviarEmailAprovacaoCoordenador({
        destinatarioEmail: emailSecundario,
        destinatarioNome: currentMeta.nome_completo || 'Coordenador',
        emailInstitucional: targetUser.email || '',
        cursoNome,
      });

      if (!envioRes.sucesso) {
        return NextResponse.json(
          { error: `Falha ao reenviar e-mail via Brevo: ${envioRes.erro}` },
          { status: 502 }
        );
      }

      return NextResponse.json(
        {
          message: `Notificação reenviada com sucesso para o e-mail alternativo: ${emailSecundario}.`,
          emailDestino: emailSecundario,
          messageId: envioRes.messageId,
        },
        { status: 200 }
      );
    }

    // Ação: Aprovar ou Rejeitar
    const novoStatus = acao === 'aprovar' ? 'ativo' : 'rejeitado';

    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      user_metadata: {
        ...currentMeta,
        status: novoStatus,
        homologado_em: new Date().toISOString(),
        homologado_por: callerUser.email,
      },
    });

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    // Se aprovado, dispara e-mail de notificação de homologação via Brevo exclusivamente para o e-mail secundário
    let emailStatus = '';
    if (acao === 'aprovar') {
      const sigla = (currentMeta.curso_sigla || 'SIS').toUpperCase();
      const cursoNome = CURSO_NOME_MAPA[sigla] || sigla;

      const envioRes = await enviarEmailAprovacaoCoordenador({
        destinatarioEmail: emailSecundario,
        destinatarioNome: currentMeta.nome_completo || 'Coordenador',
        emailInstitucional: targetUser.email || '',
        cursoNome,
      });

      if (envioRes.sucesso) {
        emailStatus = ` E-mail de confirmação enviado com sucesso para o e-mail alternativo: ${emailSecundario}.`;
      } else {
        emailStatus = ` (Atenção: Acesso ativado, porém houve falha de envio no Brevo: ${envioRes.erro})`;
      }
    }

    return NextResponse.json(
      {
        message:
          acao === 'aprovar'
            ? `Acesso de Coordenador homologado com sucesso!${emailStatus}`
            : 'Solicitação de acesso indeferida pela Direção Geral.',
        status: novoStatus,
        emailDestino: emailSecundario,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Erro ao homologar coordenador:', error);
    return NextResponse.json(
      { error: error?.message || 'Erro ao homologar cadastro.' },
      { status: 500 }
    );
  }
}
