/**
 * Mural Público de Transparência Institucional (UEMG Carangola)
 * Conforme Regra Inviolável do DNA #3: Desacoplamento Físico de Banco
 * A tabela mural_publico não possui chave estrangeira para protocolos_internos
 * e armazena estritamente textos previamente sanitizados e homologados pelo Diretor Geral.
 */

import { ItemMuralPublico, HomologacaoMuralInput } from '@/types/ouvidoria';

const CHAVE_STORAGE_MURAL = 'portal_uemg_mural_publico_v1';

export const MURAL_SEED: ItemMuralPublico[] = [
  {
    id: 'mural-seed-1',
    protocoloReferencia: '#CAR-2026-8942',
    cursoSigla: 'SIS',
    tipo: 'solicitacao',
    manifestacaoResumo:
      'Demanda da comunidade discente solicitando ampliação das bancadas e modernização dos computadores no Laboratório de Práticas Tecnológicas da unidade.',
    respostaOficial:
      'O Gabinete da Direção Geral informa que a demanda foi deliberada favoravelmente pela Congregação da Unidade. Foram adquiridos 20 novos terminais e autorizado remanejamento físico das bancadas.',
    numeroPortaria: 'Portaria GD-UEMG-CAR nº 42/2026',
    statusHomologacao: 'Homologado e Respondido',
    isActive: true,
    dataManifestacao: '01/10/2026',
    publicadoEm: '05/10/2026',
  },
  {
    id: 'mural-seed-2',
    protocoloReferencia: '#CAR-2026-1180',
    cursoSigla: 'BIO',
    tipo: 'sugestao',
    manifestacaoResumo:
      'Proposta de criação de uma trilha ecológica educativa e herbário comunitário às margens do Rio Carangola em parceria com as escolas da rede municipal.',
    respostaOficial:
      'Acolhida com louvor pela Direção Geral e encaminhada para a Pró-Reitoria de Extensão. O projeto foi cadastrado como Programa de Extensão Contínuo com abertura de 2 bolsas discentes.',
    numeroPortaria: 'Resolução Congregação nº 15/2026',
    statusHomologacao: 'Homologado e Respondido',
    isActive: true,
    dataManifestacao: '25/09/2026',
    publicadoEm: '30/09/2026',
  },
  {
    id: 'mural-seed-3',
    protocoloReferencia: '#CAR-2026-4402',
    cursoSigla: 'PED',
    tipo: 'elogio',
    manifestacaoResumo:
      'Manifestação de reconhecimento pelo acolhimento prestado pelo corpo docente no I Seminário de Práticas Pedagógicas no Campo do Vale do Carangola.',
    respostaOficial:
      'O Gabinete agradece e congratula os professores e alunos organizadores pelo impacto sociocultural demonstrado.',
    numeroPortaria: 'Nota de Elogio GD nº 08/2026',
    statusHomologacao: 'Homologado e Respondido',
    isActive: true,
    dataManifestacao: '18/09/2026',
    publicadoEm: '22/09/2026',
  },
];

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
