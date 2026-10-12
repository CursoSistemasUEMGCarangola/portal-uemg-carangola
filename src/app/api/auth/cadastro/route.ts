import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

const CURSOS_MAPA: Record<string, string> = {
  BIO: 'd1a5cdae-a35a-43ff-956b-08b51438a8b9',
  GEO: '6031bdbf-d4dd-4c76-8817-204197177858',
  HIS: '7f1d3356-4a16-419c-a7df-ef65277c849f',
  LET: '1f69fffc-7066-4e49-b1f0-4b1e3d11f098',
  MAT: '347dbeb6-bf71-4ec8-8bea-af897068048b',
  PED: 'f278305a-90ed-4b2f-b45d-01f3230084c8',
  SSO: '56501442-c0be-4bdb-b89c-a7e8228fd7df',
  SIS: '3aac4a44-09e3-4520-95f8-0444b5566e35',
};

const CadastroSchema = z.object({
  nomeCompleto: z.string().min(3, 'Nome completo deve ter pelo menos 3 caracteres'),
  email: z.string().email('E-mail institucional inválido'),
  senha: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  matricula: z.string().min(2, 'Matrícula ou MASP obrigatório'),
  vinculo: z.enum(['autor', 'coordenador_curso']),
  cursoSigla: z.string().min(2, 'Selecione um curso válido'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const dados = CadastroSchema.parse(body);

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

    const cursoId = CURSOS_MAPA[dados.cursoSigla.toUpperCase()];
    if (!cursoId) {
      return NextResponse.json(
        { error: 'Curso institucional não encontrado na base de dados.' },
        { status: 400 }
      );
    }

    // 1. Cria usuário no Supabase Auth com confirmação direta de e-mail
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: dados.email,
      password: dados.senha,
      email_confirm: true,
      user_metadata: {
        nome_completo: dados.nomeCompleto,
        matricula: dados.matricula,
        curso_sigla: dados.cursoSigla,
        role: dados.vinculo,
      },
    });

    if (authError) {
      if (authError.message.includes('already registered') || authError.message.includes('unique')) {
        return NextResponse.json(
          { error: 'Este e-mail institucional já está cadastrado no sistema.' },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { error: `Erro na autenticação: ${authError.message}` },
        { status: 400 }
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: 'Falha ao gerar registro de usuário.' },
        { status: 500 }
      );
    }

    // 2. Insere ou vincula registro na tabela public.perfis_usuarios
    const { error: perfilError } = await supabaseAdmin.from('perfis_usuarios').insert({
      id: authData.user.id,
      nome_completo: dados.nomeCompleto,
      email: dados.email,
      role: dados.vinculo,
      curso_id: cursoId,
      matricula: dados.matricula,
    });

    if (perfilError) {
      // Reverte criação de auth para evitar estados inconsistentes
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      return NextResponse.json(
        { error: `Falha ao criar perfil acadêmico: ${perfilError.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: 'Cadastro realizado com sucesso! Você já pode acessar com seu e-mail e senha.',
        userId: authData.user.id,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0]?.message || 'Dados inválidos.' },
        { status: 400 }
      );
    }

    console.error('Erro no endpoint de cadastro:', error);
    return NextResponse.json(
      { error: 'Erro interno ao processar cadastro institucional.' },
      { status: 500 }
    );
  }
}
