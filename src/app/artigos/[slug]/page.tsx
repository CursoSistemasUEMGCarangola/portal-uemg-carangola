import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ARTIGOS_MOCK } from '@/lib/data/mock-articles';
import { PdfDownloadButton } from '@/components/editorial/PdfDownloadButton';
import { CopyCitationButton } from '@/components/editorial/CopyCitationButton';
import { ArticleCard } from '@/components/editorial/ArticleCard';
import { Calendar, Clock, User, ExternalLink, ArrowLeft, Bookmark } from 'lucide-react';

interface ArticlePageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  return ARTIGOS_MOCK.map((artigo) => ({
    slug: artigo.slug,
  }));
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const artigo = ARTIGOS_MOCK.find((a) => a.slug === params.slug);
  if (!artigo) {
    return {
      title: 'Artigo não encontrado — UEMG Carangola',
    };
  }

  return {
    title: `${artigo.titulo} — UEMG Carangola`,
    description: artigo.resumo,
  };
}

export default function ArticlePage({ params }: ArticlePageProps) {
  const artigo = ARTIGOS_MOCK.find((a) => a.slug === params.slug);

  if (!artigo) {
    notFound();
  }

  // Artigos recomendados do mesmo curso (excluindo o atual)
  const recomendados = ARTIGOS_MOCK.filter(
    (a) => a.curso.sigla === artigo.curso.sigla && a.id !== artigo.id
  ).slice(0, 3);

  // Se não houver do mesmo curso, recomenda outros cursos
  const outrosRecomendados = recomendados.length > 0 
    ? recomendados 
    : ARTIGOS_MOCK.filter((a) => a.id !== artigo.id).slice(0, 3);

  return (
    <div className="w-full bg-[#F7F9FC] py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-8">
        {/* Navegação Retrô / Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/artigos"
            className="inline-flex items-center space-x-1.5 text-xs sm:text-sm font-semibold text-[#0056B3] hover:text-[#0B3B60] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span>Voltar para o catálogo de artigos</span>
          </Link>
        </div>

        {/* Artigo - Container Principal */}
        <article className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-12 shadow-sm">
          {/* Cabeçalho do Artigo */}
          <header className="border-b border-slate-100 pb-8 mb-8">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className={`inline-block px-3 py-1 rounded-md text-xs font-bold border ${artigo.curso.corBadge}`}>
                {artigo.curso.nome} ({artigo.curso.sigla})
              </span>
            </div>

            <h1 className="text-2xl sm:text-3.5xl font-extrabold text-[#0B3B60] leading-tight mb-6">
              {artigo.titulo}
            </h1>

            {/* Metadados: Autores, Data, Tempo */}
            <div className="flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm text-slate-500 bg-slate-50 p-4 rounded-xl border border-slate-200/70">
              <div className="space-y-1">
                <div className="flex items-center space-x-2 text-slate-800 font-semibold">
                  <User className="w-4 h-4 text-[#0056B3]" aria-hidden="true" />
                  <span>{artigo.autorNome}</span>
                </div>
                {artigo.coautores && (
                  <p className="text-xs text-slate-500 pl-6">
                    Coautores: {artigo.coautores}
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-4 text-xs text-slate-500">
                <span className="flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{artigo.dataPublicacao}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{artigo.tempoLeituraMinutos} min de leitura</span>
                </span>
              </div>
            </div>

            {/* Barra de Ações: Download PDF + Link Externo */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
              <PdfDownloadButton artigo={artigo} />

              {artigo.linkExternoMidia && (
                <a
                  href={artigo.linkExternoMidia}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                >
                  <span>Acessar acervo visual / código complementar</span>
                  <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                </a>
              )}
            </div>
          </header>

          {/* Caixa de Resumo / Lead */}
          <div className="bg-blue-50/50 border-l-4 border-[#0056B3] p-5 sm:p-6 rounded-r-xl mb-10">
            <h2 className="text-xs font-bold text-[#0B3B60] uppercase tracking-wider mb-2 flex items-center space-x-1">
              <Bookmark className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Resumo do Trabalho</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed italic">
              {artigo.resumo}
            </p>
          </div>

          {/* Corpo do Artigo Renderizado */}
          <div className="prose prose-slate max-w-none text-slate-800 leading-relaxed text-sm sm:text-base space-y-6">
            {artigo.corpoMarkdown.split('\n\n').map((paragrafo, index) => {
              if (paragrafo.startsWith('## ')) {
                return (
                  <h2
                    key={index}
                    className="text-lg sm:text-xl font-bold text-[#0B3B60] border-b border-slate-200 pb-2 mt-8 pt-4"
                  >
                    {paragrafo.replace('## ', '')}
                  </h2>
                );
              }
              if (paragrafo.startsWith('1. ') || paragrafo.startsWith('- ')) {
                return (
                  <div key={index} className="pl-4 border-l-2 border-slate-200 text-slate-700 text-sm py-1">
                    {paragrafo}
                  </div>
                );
              }
              return (
                <p key={index} className="text-justify leading-relaxed">
                  {paragrafo}
                </p>
              );
            })}
          </div>

          {/* Ficha Técnica & Citação ABNT */}
          <footer className="mt-12 pt-8 border-t border-slate-200">
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Como citar este artigo (Padrão ABNT):
                </span>
                <CopyCitationButton citacao={artigo.citacaoAbnt} />
              </div>
              <p className="text-xs sm:text-sm font-mono text-slate-600 bg-white p-3 rounded border border-slate-200 select-all">
                {artigo.citacaoAbnt}
              </p>
            </div>
          </footer>
        </article>

        {/* Publicações Recomendadas */}
        <section className="mt-14">
          <h2 className="text-xl font-bold text-[#0B3B60] mb-6">
            Outras Publicações Recomendadas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {outrosRecomendados.map((rec) => (
              <ArticleCard key={rec.id} artigo={rec} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
