export type SiglaCurso = 'BIO' | 'GEO' | 'HIS' | 'LET' | 'MAT' | 'PED' | 'SSO' | 'SIN';

export interface Curso {
  id: string;
  nome: string;
  sigla: SiglaCurso;
  descricao: string;
  corBadge: string;
}

export type StatusArtigo = 'rascunho' | 'submetido' | 'em_revisao' | 'publicado' | 'rejeitado';

export interface Artigo {
  id: string;
  slug: string;
  titulo: string;
  resumo: string;
  corpoMarkdown: string;
  capaUrl: string;
  curso: Curso;
  autorNome: string;
  autorMatricula?: string;
  autorRole?: string;
  coautores?: string;
  doi?: string;
  linkExternoMidia?: string;
  tempoLeituraMinutos: number;
  dataPublicacao: string;
  citacaoAbnt: string;
  tags?: string[];
  status?: StatusArtigo;
  notasRevisao?: string;
}

export interface SubmissaoArtigoInput {
  titulo: string;
  resumo: string;
  corpoMarkdown: string;
  cursoSigla: SiglaCurso;
  autorNome: string;
  autorMatricula: string;
  coautores?: string;
  doi?: string;
  linkExternoMidia?: string;
  capaBase64Webp: string;
  capaTamanhoBytes: number;
}

export interface DecisaoEditorialInput {
  artigoId: string;
  acao: 'aprovar' | 'solicitar_ajustes' | 'rejeitar';
  notas?: string;
}

export type PapelUsuario = 'autor' | 'coordenador_curso' | 'direcao';

export interface UsuarioAtivo {
  id: string;
  nome: string;
  email: string;
  matricula: string;
  role: PapelUsuario;
  cursoSigla?: SiglaCurso;
}
