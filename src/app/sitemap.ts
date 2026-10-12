import { MetadataRoute } from 'next';
import { CURSOS_LISTA, ARTIGOS_MOCK } from '@/lib/data/mock-articles';

const BASE_URL = 'https://carangola.uemg.br';

export default function sitemap(): MetadataRoute.Sitemap {
  const agora = new Date().toISOString();

  // Rotas Estáticas Públicas Principais
  const rotasEstaticas: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/`,
      lastModified: agora,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/artigos`,
      lastModified: agora,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/cursos`,
      lastModified: agora,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/mural-de-transparencia`,
      lastModified: agora,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/fale-com-a-direcao`,
      lastModified: agora,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/meus-artigos`,
      lastModified: agora,
      changeFrequency: 'daily',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/acessibilidade-e-privacidade`,
      lastModified: agora,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/termos-de-uso`,
      lastModified: agora,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  // Páginas Dedicadas aos 8 Cursos de Graduação
  const rotasCursos: MetadataRoute.Sitemap = CURSOS_LISTA.map((curso) => ({
    url: `${BASE_URL}/cursos/${curso.sigla.toLowerCase()}`,
    lastModified: agora,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // Páginas Individuais de Artigos Homologados
  const artigosPublicados = ARTIGOS_MOCK.filter((a) => a.status === 'publicado');
  const rotasArtigos: MetadataRoute.Sitemap = artigosPublicados.map((artigo) => ({
    url: `${BASE_URL}/artigos/${artigo.slug}`,
    lastModified: agora,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [...rotasEstaticas, ...rotasCursos, ...rotasArtigos];
}
