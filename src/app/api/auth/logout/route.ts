import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

/**
 * Endpoint de Logout Seguro com expurgo mandatório de dados locais.
 * Regra do Modo Computador Público: Emite o cabeçalho Clear-Site-Data para limpar
 * cache de Service Worker, cookies e storage em terminais compartilhados.
 */
export async function POST() {
  const supabase = createServerSupabaseClient();

  // Encerra a sessão no Supabase Auth
  await supabase.auth.signOut();

  const response = NextResponse.json(
    { message: 'Sessão encerrada com sucesso e dados locais expurgados.' },
    { status: 200 }
  );

  // Injeção do cabeçalho de expurgo mandatório (W3C Clear Site Data)
  response.headers.set('Clear-Site-Data', '"cache", "cookies", "storage"');

  return response;
}
