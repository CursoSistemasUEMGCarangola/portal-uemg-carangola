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
  cursoSigla: z.enum(['BIO', 'GEO', 'HIS', 'LET', 'MAT', 'PED', 'SSO', 'SIN'], {
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
  doi: z
    .string()
    .max(100, 'DOI inválido.')
    .optional()
    .refine((val) => !val || /^10\.\d{4,9}\/[-._;()/:A-Za-z0-9]+$/.test(val), {
      message: 'Formato de DOI inválido (ex: 10.1000/182).',
    }),
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
