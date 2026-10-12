import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'E-mail e senha são obrigatórios.' },
        { status: 400 }
      );
    }

    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      );
    }

    const user = data.user;
    const status = user?.user_metadata?.status;
    const role = user?.user_metadata?.role;

    // Bloqueia coordenadores com aprovação pendente ou rejeitada
    if (role === 'coordenador_curso' && status === 'pendente_aprovacao') {
      await supabase.auth.signOut();
      return NextResponse.json(
        {
          error:
            'Seu cadastro como Coordenador de Curso está pendente de homologação pelo Gabinete da Direção Geral. Aguarde a aprovação para acessar o sistema.',
        },
        { status: 403 }
      );
    }

    if (status === 'rejeitado') {
      await supabase.auth.signOut();
      return NextResponse.json(
        {
          error:
            'Sua solicitação de acesso como Coordenador de Curso foi indeferida pelo Gabinete da Direção Geral.',
        },
        { status: 403 }
      );
    }

    return NextResponse.json(
      {
        message: 'Autenticado com sucesso',
        user: data.user,
        role: role || 'autor',
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    console.error('Erro no endpoint de login:', err);
    return NextResponse.json(
      { error: 'Erro interno ao processar autenticação.' },
      { status: 500 }
    );
  }
}
