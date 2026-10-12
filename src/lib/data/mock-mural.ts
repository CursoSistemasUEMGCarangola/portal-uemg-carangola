/**
 * Mural Público de Transparência Institucional (UEMG Carangola)
 * Conforme Regra Inviolável do DNA #3: Desacoplamento Físico de Banco
 * A tabela mural_publico não possui chave estrangeira para protocolos_internos
 * e armazena estritamente textos previamente sanitizados e homologados pelo Diretor Geral.
 */

import { ItemMuralPublico, HomologacaoMuralInput } from '@/types/ouvidoria';

const CHAVE_STORAGE_MURAL = 'portal_uemg_mural_publico_v1';

export const MURAL_SEED: ItemMuralPublico[] = [];

export function obterItensMuralPublico(): ItemMuralPublico[] {
  if (typeof window === 'undefined') return MURAL_SEED;

  try {
    const salvos = localStorage.getItem(CHAVE_STORAGE_MURAL);
    if (!salvos) return MURAL_SEED;
    const lista = JSON.parse(salvos) as ItemMuralPublico[];
    const ids = new Set(lista.map((m) => m.id));
    const restantes = MURAL_SEED.filter((m) => !ids.has(m.id));
    return [...lista, ...restantes];
  } catch {
    return MURAL_SEED;
  }
}

/**
 * Publica um resumo previamente higienizado e uma resposta oficial na tabela desacoplada mural_publico
 */
export function publicarNoMuralSanitizado(input: HomologacaoMuralInput): ItemMuralPublico {
  const novoItem: ItemMuralPublico = {
    id: `mural-${Date.now()}`,
    protocoloReferencia: input.protocoloReferencia,
    cursoSigla: input.cursoSigla,
    tipo: input.tipo,
    manifestacaoResumo: input.resumoSanitizado,
    respostaOficial: input.respostaOficial,
    numeroPortaria: input.numeroPortaria || undefined,
    statusHomologacao: 'Homologado e Respondido',
    isActive: true,
    dataManifestacao: input.dataManifestacao,
    publicadoEm: new Date().toLocaleDateString('pt-BR'),
  };

  if (typeof window !== 'undefined') {
    try {
      const atuais = obterItensMuralPublico();
      const atualizados = [novoItem, ...atuais.filter((m) => m.id !== novoItem.id)];
      localStorage.setItem(CHAVE_STORAGE_MURAL, JSON.stringify(atualizados));
    } catch (e) {
      console.warn('Erro ao persistir item no mural público:', e);
    }
  }

  return novoItem;
}
