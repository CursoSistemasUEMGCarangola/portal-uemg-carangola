/**
 * Gerenciador de Rascunhos Voláteis (Modo Computador Compartilhado)
 * Armazena temporariamente dados digitados pelo autor para evitar perda
 * em conexões instáveis, utilizando sessionStorage para autodestruição ao fechar a aba.
 */

export interface RascunhoArtigo {
  titulo: string;
  resumo: string;
  corpoMarkdown: string;
  cursoSigla: string;
  autorNome: string;
  autorMatricula: string;
  coautores?: string;
  linkExternoMidia?: string;
  ultimaAtualizacao: number;
}

const CHAVE_RASCUNHO = 'portal_uemg_rascunho_artigo_v1';

export function salvarRascunho(dados: Partial<RascunhoArtigo>): void {
  if (typeof window === 'undefined') return;
  try {
    const payload: RascunhoArtigo = {
      titulo: dados.titulo || '',
      resumo: dados.resumo || '',
      corpoMarkdown: dados.corpoMarkdown || '',
      cursoSigla: dados.cursoSigla || 'SIS',
      autorNome: dados.autorNome || '',
      autorMatricula: dados.autorMatricula || '',
      coautores: dados.coautores || '',
      linkExternoMidia: dados.linkExternoMidia || '',
      ultimaAtualizacao: Date.now(),
    };
    sessionStorage.setItem(CHAVE_RASCUNHO, JSON.stringify(payload));
  } catch (err) {
    console.warn('Não foi possível persistir rascunho temporário na sessão:', err);
  }
}

export function carregarRascunho(): RascunhoArtigo | null {
  if (typeof window === 'undefined') return null;
  try {
    const bruto = sessionStorage.getItem(CHAVE_RASCUNHO);
    if (!bruto) return null;
    return JSON.parse(bruto) as RascunhoArtigo;
  } catch {
    return null;
  }
}

export function limparRascunho(): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.removeItem(CHAVE_RASCUNHO);
  } catch {}
}
