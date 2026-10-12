import { createBrowserClient } from '@supabase/ssr';

/**
 * Cliente público do Supabase para execução no navegador.
 * Princípio Zero-Trust: utiliza estritamente NEXT_PUBLIC_SUPABASE_ANON_KEY.
 * NUNCA injeta permissões de service_role no lado do cliente.
 */
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    '';

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
