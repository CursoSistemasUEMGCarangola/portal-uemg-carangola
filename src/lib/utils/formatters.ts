/**
 * Mascara um endereço de e-mail para exibição segura sem expor a identidade completa.
 * Exemplo: "usuario@gmail.com" -> "us*****o@gmail.com"
 *
 * @param email E-mail a ser mascarado
 * @returns E-mail ofuscado de forma segura
 */
export function mascararEmail(email: string): string {
  if (!email || !email.includes('@')) {
    return email || '';
  }

  const [usuario, dominio] = email.split('@');
  if (!dominio) return email;

  if (usuario.length <= 2) {
    return `${usuario[0]}*@${dominio}`;
  }

  const visivelInicio = usuario.slice(0, 2);
  const visivelFim = usuario.slice(-1);
  const asteriscos = '*'.repeat(Math.max(2, usuario.length - 3));

  return `${visivelInicio}${asteriscos}${visivelFim}@${dominio}`;
}
