import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getSupabaseAdmin } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

const RedefinirSenhaSchema = z.object({
  token: z.string().min(10, 'Token de recuperação inválido.'),
  novaSenha: z.string().min(6, 'A nova senha deve possuir no mínimo 6 caracteres.'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token, novaSenha } = RedefinirSenhaSchema.parse(body);

    const supabaseAdmin = getSupabaseAdmin();

    // 1. Localiza usuário detentor do token de recuperação
    const { data: usersData, error: listError } = await supabaseAdmin.auth.admin.listUsers();

    if (listError) {
      console.error('Erro ao listar usuários no endpoint de redefinição:', listError);
      return NextResponse.json(
        { error: 'Falha temporária ao verificar token de segurança.' },
        { status: 500 }
      );
    }

    const usuarioEncontrado = usersData.users.find(
      (u) => u.user_metadata?.token_recuperacao === token
    );

    if (!usuarioEncontrado) {
      return NextResponse.json(
        { error: 'Link de recuperação inválido, já utilizado ou inexistente.' },
        { status: 400 }
      );
    }

    // 2. Valida janela de expiração temporal (2 horas)
    const expiraEm = usuarioEncontrado.user_metadata?.token_recuperacao_expira_em as number | undefined;

    if (!expiraEm || Date.now() > expiraEm) {
      return NextResponse.json(
        { error: 'Este link de recuperação expirou (validade máxima de 2 horas). Solicite um novo link.' },
        { status: 410 }
      );
    }

    // 3. Atualiza a senha no Supabase Auth e expurga o token consumido
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      usuarioEncontrado.id,
      {
        password: novaSenha,
        user_metadata: {
          ...usuarioEncontrado.user_metadata,
          token_recuperacao: null,
          token_recuperacao_expira_em: null,
          senha_redefinida_em: new Date().toISOString(),
        },
      }
    );

    if (updateError) {
      console.error('Erro ao redefinir senha no Supabase Auth:', updateError);
      return NextResponse.json(
        { error: `Falha ao salvar nova senha: ${updateError.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Sua senha foi redefinida com sucesso! Você já pode realizar o login com suas novas credenciais.',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0]?.message || 'Dados inválidos.' },
        { status: 400 }
      );
    }

    console.error('Erro no endpoint de redefinição de senha:', error);
    return NextResponse.json(
      { error: 'Erro interno ao processar redefinição de senha.' },
      { status: 500 }
    );
  }
}
