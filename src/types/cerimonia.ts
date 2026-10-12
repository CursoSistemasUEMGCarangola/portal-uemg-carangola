/**
 * Tipos e Definições de Domínio para a Cerimônia de Custódia Compartilhada
 * e Continuidade Institucional da UEMG Carangola (Shamir's Secret Sharing 2-de-3).
 * Em estrita conformidade com a Restrição Inviolável #4 (Hard Box DNA).
 */

export type CustodiantePapel =
  | 'direcao'
  | 'vice_direcao'
  | 'secretaria_academica';

export interface CustodianteInfo {
  papel: CustodiantePapel;
  tituloInstitucional: string;
  titularAtual: string;
  indiceX: number; // 1, 2 ou 3
  descricao: string;
}

export interface FragmentoChaveShamir {
  indice: number; // 1, 2 ou 3
  papel: CustodiantePapel;
  tituloInstitucional: string;
  shareHex: string;
  comprovanteHash: string; // Hash SHA-256 do fragmento para verificação de integridade
  geradoEm: string;
}

export interface ResultadoCerimoniaParticao {
  chaveOriginalHexPreview: string; // Primeiros e últimos caracteres para checagem visual
  quoromMinimo: number; // 2
  totalCustodiantes: number; // 3
  fragmentos: FragmentoChaveShamir[];
  dataHoraCerimonia: string;
}

export interface ResultadoRecomposicaoChave {
  sucesso: boolean;
  chaveReconstruida?: string;
  mensagemErro?: string;
  custodiantesPresentes: CustodiantePapel[];
}
