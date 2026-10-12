import { z } from 'zod';

export const esquemasSubmissaoArtigo = z.object({
  titulo: z
    .string()
    .min(5, 'O título deve conter pelo menos 5 caracteres.')
    .max(255, 'O título não pode exceder 255 caracteres.'),
  resumo: z
    .string()
    .min(20, 'O resumo deve conter pelo menos 20 caracteres.')
    .max(1500, 'O resumo não pode exceder 1500 caracteres.'),
  corpoMarkdown: z
    .string()
    .min(50, 'O corpo do artigo deve conter pelo menos 50 caracteres formatados.'),
  cursoSigla: z.enum(['BIO', 'GEO', 'HIS', 'LET', 'MAT', 'PED', 'SSO', 'SIS'], {
    errorMap: () => ({ message: 'Selecione um curso válido da UEMG Carangola.' }),
  }),
  autorNome: z
    .string()
    .min(3, 'O nome do autor deve conter pelo menos 3 caracteres.')
    .max(255, 'Nome muito longo.'),
  autorMatricula: z
    .string()
    .min(4, 'A matrícula institucional deve conter pelo menos 4 caracteres.')
    .max(30, 'Matrícula inválida.'),
  coautores: z.string().max(500, 'Lista de coautores muito longa.').optional(),
  linkExternoMidia: z
    .string()
    .url('Informe uma URL válida (ex: https://...)')
    .optional()
    .or(z.literal('')),
  capaBase64Webp: z
    .string()
    .min(10, 'A imagem de capa comprimida em WebP é obrigatória.'),
});

export type SubmissaoArtigoFormData = z.infer<typeof esquemasSubmissaoArtigo>;

export const esquemaManifestacaoOuvidoria = z
  .object({
    tipo: z.enum(['solicitacao', 'sugestao', 'elogio', 'denuncia'], {
      errorMap: () => ({ message: 'Selecione o tipo da manifestação.' }),
    }),
    cursoSigla: z.enum(['BIO', 'GEO', 'HIS', 'LET', 'MAT', 'PED', 'SSO', 'SIS', 'GERAL'], {
      errorMap: () => ({ message: 'Selecione um curso ou setor válido.' }),
    }),
    assunto: z
      .string()
      .min(5, 'O assunto deve conter ao menos 5 caracteres.')
      .max(200, 'O assunto não pode exceder 200 caracteres.'),
    mensagem: z
      .string()
      .min(20, 'A mensagem deve conter ao menos 20 caracteres detalhados.')
      .max(5000, 'A mensagem não pode exceder 5000 caracteres.'),
    isAnonimo: z.boolean(),
    autorNome: z.string().optional(),
    autorMatricula: z.string().max(30, 'Matrícula inválida.').optional().or(z.literal('')),
    autorEmail: z.string().email('Informe um e-mail válido.').optional().or(z.literal('')),
  })
  .refine(
    (dados) => {
      if (!dados.isAnonimo) {
        return !!dados.autorNome && dados.autorNome.trim().length >= 3;
      }
      return true;
    },
    {
      message: 'Informe seu nome completo ou selecione o Modo Anônimo.',
      path: ['autorNome'],
    }
  );

export type ManifestacaoOuvidoriaFormData = z.infer<typeof esquemaManifestacaoOuvidoria>;
