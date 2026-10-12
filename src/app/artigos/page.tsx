import React from 'react';
import { Metadata } from 'next';
import { ARTIGOS_MOCK, CURSOS_LISTA } from '@/lib/data/mock-articles';
import { ArticlesCatalog } from '@/components/editorial/ArticlesCatalog';
import { BookOpen } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Catálogo de Publicações Acadêmicas — UEMG Carangola',
  description:
    'Repositório e vitrine científica da produção acadêmica, cultural e técnica dos 8 cursos de graduação da UEMG Unidade Carangola.',
};

export default function ArtigosPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 sm:py-14">
      {/* Cabeçalho da Seção */}
      <div className="mb-10">
        <div className="inline-flex items-center space-x-2 text-xs font-bold text-[#0056B3] uppercase tracking-wider mb-2">
          <BookOpen className="w-4 h-4" aria-hidden="true" />
          <span>Produção Científica & Cultural</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#0B3B60] tracking-tight">
          Catálogo Geral de Publicações
        </h1>
        <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-3xl leading-relaxed">
          Artigos, ensaios técnicos, pesquisas de iniciação científica e relatos de extensão
          submetidos por discentes e docentes da UEMG Carangola, com download gratuito em PDF.
        </p>
      </div>

      {/* Catálogo com Filtros Reativos */}
      <ArticlesCatalog artigosIniciais={ARTIGOS_MOCK} cursos={CURSOS_LISTA} />
    </div>
  );
}
