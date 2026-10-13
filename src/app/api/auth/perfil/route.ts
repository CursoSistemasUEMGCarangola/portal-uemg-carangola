import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { CURSOS_LISTA } from '@/lib/data/mock-articles';

export const dynamic = 'force-dynamic';

const AtualizarPerfilSchema = z
  .object({
    nomeCompleto: z.string().min(3, 'Nome completo deve ter pelo menos 3 caracteres'),
    emailSecundario: z
      .string()
      .email('E-mail alternativo/pessoal inválido')
      .refine(
        (val) => !val.toLowerCase().endsWith('@uemg.br'),
        'O e-mail alternativo deve ser pessoal/externo (ex: Gmail, Outlook). Contas @uemg.br rejeitam scripts automáticos.'
      ),
    matricula: z.string().min(2, 'Matrícula ou MASP obrigatório'),
    novaSenha: z.string().optional().or(z.literal('')),
    confirmarSenha: z.string().optional().or(z.literal('')),
  })
  .refine(
    (data) => {
      if (data.novaSenha && data.novaSenha.length > 0) {
        return data.novaSenha.length >= 6;
      }
      return true;
    },
    {
      message: 'A nova senha deve ter no mínimo 6 caracteres.',
      path: ['novaSenha'],
    }
  )
  .refine(
    (data) => {
      if (data.novaSenha && data.novaSenha.length > 0) {
        return data.novaSenha === data.confirmarSenha;
      }
      return true;
    },
    {
      message: 'A confirmação de senha não confere com a nova senha digitada.',
      path: ['confirmarSenha'],
    }
  );

export async function GET() {
  try {
    const supabase = createServerSupabaseClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: 'Sessão não autorizada ou expirada.' }, { status: 401 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json({ error: 'Configuração do servidor ausente.' }, { status: 500 });
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

    // Consulta perfil na tabela perfis_usuarios
    const { data: perfil } = await supabaseAdmin
      .from('perfis_usuarios')
      .select('*')
      .eq('id', user.id)
      .single();

    const userMeta = user.user_metadata || {};
    const cursoSigla = userMeta.curso_sigla || '';
    const cursoInfo = CURSOS_LISTA.find((c) => c.sigla === cursoSigla);

    const dadosPerfil = {
      id: user.id,
      nomeCompleto: perfil?.nome_completo || userMeta.nome_completo || '',
      emailInstitucional: user.email || perfil?.email || '',
      emailSecundario: userMeta.email_secundario || '',
      matricula: perfil?.matricula || userMeta.matricula || '',
      role: perfil?.role || userMeta.role || 'autor',
      cursoSigla: cursoSigla,
      cursoNome: cursoInfo ? cursoInfo.nome : cursoSigla || 'Não vinculado',
      status: userMeta.status || 'ativo',
      solicitadoEm: userMeta.solicitado_em || perfil?.criado_em || null,
      aprovadoEm: userMeta.aprovado_em || null,
      atualizadoEm: perfil?.atualizado_em || null,
    };

    return NextResponse.json({ perfil: dadosPerfil }, { status: 200 });
  } catch (error: any) {
    console.error('Erro ao buscar dados do perfil:', error);
    return NextResponse.json(
      { error: error?.message || 'Erro interno ao consultar perfil.' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = createServerSupabaseClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: 'Sessão não autorizada ou expirada.' }, { status: 401 });
    }

    const body = await request.json();
    const dados = AtualizarPerfilSchema.parse(body);

    // Impede que o e-mail secundário seja igual ao e-mail institucional do usuário logado
    if (user.email && dados.emailSecundario.toLowerCase() === user.email.toLowerCase()) {
      return NextResponse.json(
        { error: 'O e-mail alternativo deve ser diferente do e-mail institucional.' },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json({ error: 'Configuração do servidor ausente.' }, { status: 500 });
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

    // 1. Atualiza registro na tabela public.perfis_usuarios (apenas campos permitidos)
    const { error: perfilUpdateError } = await supabaseAdmin
      .from('perfis_usuarios')
      .update({
        nome_completo: dados.nomeCompleto,
        matricula: dados.matricula,
        atualizado_em: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (perfilUpdateError) {
      console.error('Erro ao atualizar perfis_usuarios:', perfilUpdateError);
      return NextResponse.json(
        { error: `Falha ao salvar dados no perfil acadêmico: ${perfilUpdateError.message}` },
        { status: 500 }
      );
    }

    // 2. Prepara atualização no Supabase Auth (user_metadata e senha opcional)
    const currentMeta = user.user_metadata || {};
    const updatedMeta = {
      ...currentMeta,
      nome_completo: dados.nomeCompleto,
      matricula: dados.matricula,
      email_secundario: dados.emailSecundario,
      atualizado_em: new Date().toISOString(),
      // Preserva rigidamente role, curso_sigla e status para não afetar processos do sistema
      role: currentMeta.role,
      curso_sigla: currentMeta.curso_sigla,
      status: currentMeta.status,
    };

    const updateAuthPayload: {
      user_metadata: Record<string, any>;
      password?: string;
    } = {
      user_metadata: updatedMeta,
    };

    if (dados.novaSenha && dados.novaSenha.trim().length >= 6) {
      updateAuthPayload.password = dados.novaSenha.trim();
    }

    const { error: authUpdateError } = await supabaseAdmin.auth.admin.updateUserById(
      user.id,
      updateAuthPayload
    );

    if (authUpdateError) {
      console.error('Erro ao atualizar auth user:', authUpdateError);
      return NextResponse.json(
        { error: `Falha ao atualizar dados de autenticação: ${authUpdateError.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: 'Dados cadastrais atualizados com sucesso!',
        perfil: {
          nomeCompleto: dados.nomeCompleto,
          emailSecundario: dados.emailSecundario,
          matricula: dados.matricula,
          senhaAlterada: Boolean(dados.novaSenha && dados.novaSenha.length >= 6),
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0]?.message || 'Dados inválidos.' },
        { status: 400 }
      );
    }

    console.error('Erro no endpoint de atualização de perfil:', error);
    return NextResponse.json(
      { error: 'Erro interno ao processar atualização cadastral.' },
      { status: 500 }
    );
  }
}
