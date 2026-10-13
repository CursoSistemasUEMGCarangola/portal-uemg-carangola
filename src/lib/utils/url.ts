/**
 * Utilitário puro de Resolução de URL Base Institucional.
 * Suporta dinamicamente ambientes locais (localhost), prévias/produção na Vercel (*.vercel.app)
 * e domínios customizados (ex: carangola.uemg.br).
 *
 * @param request Objeto Request da chamada HTTP (opcional para rotas fora de contexto direto)
 * @returns URL base com protocolo (ex: "https://carangola.uemg.br" ou "http://localhost:3000")
 */
export function getBaseUrl(request?: Request): string {
  if (request) {
    const originHeader = request.headers.get('origin');
    if (originHeader) {
      return originHeader;
    }

    const hostHeader = request.headers.get('x-forwarded-host') || request.headers.get('host');
    const protoHeader =
      request.headers.get('x-forwarded-proto') || (hostHeader?.includes('localhost') ? 'http' : 'https');

    if (hostHeader) {
      return `${protoHeader}://${hostHeader}`;
    }
  }

  // Resolução nativa de variáveis de ambiente da Vercel
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // Fallback para variáveis customizadas ou domínio padrão institucional
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    'https://carangola.uemg.br'
  );
}
