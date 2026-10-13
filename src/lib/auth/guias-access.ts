/**
 * Utilitário de Governança Institucional e Controle de Acesso (RBAC) para os Guias de Uso.
 * 
 * Regras Institucionais:
 * - Estudante (anônimo / visitante / discente): apenas Guia do Estudante ('estudante').
 * - Docente (papel 'autor'): apenas Guia do Docente ('docente').
 * - Coordenador (papel 'coordenador_curso'): apenas Guia do Coordenador ('coordenador').
 * - Direção Geral (papel 'direcao'): acesso total a TODOS os guias ('estudante', 'docente', 'coordenador', 'direcao').
 */

export type GuiaSlug = 'estudante' | 'docente' | 'coordenador' | 'direcao';

export interface InfoPerfilAcesso {
  role: string | null;
  nomePerfil: string;
  guiaPermitidoSlug: GuiaSlug;
  guiaPermitidoNome: string;
  temAcessoTotal: boolean;
}

/**
 * Normaliza o papel do usuário em uma categoria canônica.
 */
export function normalizarRole(role: string | null | undefined): 'direcao' | 'coordenador' | 'docente' | 'estudante' {
  if (!role) return 'estudante';
  const r = role.toLowerCase().trim();
  if (r === 'direcao') return 'direcao';
  if (r === 'coordenador_curso' || r === 'coordenador') return 'coordenador';
  if (r === 'autor' || r === 'docente') return 'docente';
  return 'estudante';
}

/**
 * Verifica se um papel de usuário possui permissão de acesso a um determinado guia.
 */
export function podeAcessarGuia(userRole: string | null | undefined, guiaSlug: string): boolean {
  const papel = normalizarRole(userRole);

  // Direção Geral possui acesso irrestrito a todos os guias institucionais
  if (papel === 'direcao') {
    return true;
  }

  // Coordenador só pode ter acesso ao guia do coordenador
  if (papel === 'coordenador') {
    return guiaSlug === 'coordenador';
  }

  // Docente só pode ter acesso ao guia do docente
  if (papel === 'docente') {
    return guiaSlug === 'docente';
  }

  // Estudante só pode ter acesso ao guia do estudante
  return guiaSlug === 'estudante';
}

/**
 * Obtém os metadados descritivos do perfil do usuário para renderização amigável de restrições.
 */
export function obterInfoPerfilAcesso(userRole: string | null | undefined): InfoPerfilAcesso {
  const papel = normalizarRole(userRole);

  switch (papel) {
    case 'direcao':
      return {
        role: 'direcao',
        nomePerfil: 'Gabinete da Direção Geral',
        guiaPermitidoSlug: 'direcao',
        guiaPermitidoNome: 'Guia da Direção',
        temAcessoTotal: true,
      };
    case 'coordenador':
      return {
        role: 'coordenador_curso',
        nomePerfil: 'Coordenador de Curso',
        guiaPermitidoSlug: 'coordenador',
        guiaPermitidoNome: 'Guia do Coordenador de Curso',
        temAcessoTotal: false,
      };
    case 'docente':
      return {
        role: 'autor',
        nomePerfil: 'Professor / Docente',
        guiaPermitidoSlug: 'docente',
        guiaPermitidoNome: 'Guia do Docente',
        temAcessoTotal: false,
      };
    case 'estudante':
    default:
      return {
        role: null,
        nomePerfil: 'Estudante / Discente',
        guiaPermitidoSlug: 'estudante',
        guiaPermitidoNome: 'Guia do Estudante',
        temAcessoTotal: false,
      };
  }
}
