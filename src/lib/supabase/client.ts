import { createBrowserClient } from '@supabase/ssr';

/**
 * Cliente público do Supabase para execução no navegador.
 * Princípio Zero-Trust: utiliza estritamente NEXT_PUBLIC_SUPABASE_ANON_KEY.
 * Padrão Singleton: reaproveita a mesma instância para evitar recriações e loops de re-render.
 */
let clientInstance: ReturnType<typeof createBrowserClient> | null = null;

export function createClient() {
  if (clientInstance) {
    return clientInstance;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    '';

  clientInstance = createBrowserClient(supabaseUrl, supabaseAnonKey);
  return clientInstance;
}
