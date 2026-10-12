import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CURSOS_LISTA, ARTIGOS_MOCK } from '@/lib/data/mock-articles';
import { ArticlesCatalog } from '@/components/editorial/ArticlesCatalog';
import { GraduationCap, ArrowLeft } from 'lucide-react';

interface CursoPageProps {
  params: {
    sigla: string;
  };
}

export async function generateStaticParams() {
  return CURSOS_LISTA.map((curso) => ({
    sigla: curso.sigla.toLowerCase(),
  }));
}

export async function generateMetadata({ params }: CursoPageProps): Promise<Metadata> {
  const siglaUpper = params.sigla.toUpperCase();
  const curso = CURSOS_LISTA.find((c) => c.sigla === siglaUpper);

  if (!curso) {
    return {
      title: 'Curso não encontrado — UEMG Carangola',
    };
  }

  return {
    title: `${curso.nome} (${curso.sigla}) — Publicações Acadêmicas UEMG Carangola`,
    description: curso.descricao,
  };
}

export default function CursoDetalhePage({ params }: CursoPageProps) {
  const siglaUpper = params.sigla.toUpperCase();
  const curso = CURSOS_LISTA.find((c) => c.sigla === siglaUpper);

  if (!curso) {
    notFound();
  }

  const artigosDoCurso = ARTIGOS_MOCK.filter((a) => a.curso.sigla === siglaUpper);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 sm:py-14">
      {/* Navegação Retrô */}
      <div className="mb-6">
        <Link
          href="/cursos"
          className="inline-flex items-center space-x-1.5 text-xs sm:text-sm font-semibold text-[#0056B3] hover:text-[#0B3B60] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>Voltar para todos os cursos</span>
        </Link>
      </div>

      {/* Cabeçalho do Curso */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 mb-10 shadow-sm">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className={`px-3 py-1 rounded-md text-xs font-black tracking-wider border ${curso.corBadge}`}>
            {curso.sigla}
          </span>
          <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider flex items-center space-x-1">
            <GraduationCap className="w-4 h-4 text-[#0056B3]" aria-hidden="true" />
            <span>Colegiado de Graduação</span>
          </span>
        </div>

        <h1 className="text-2xl sm:text-3.5xl font-extrabold text-[#0B3B60] tracking-tight mb-3">
          {curso.nome}
        </h1>

        <p className="text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
          {curso.descricao}
        </p>
      </div>

      {/* Catálogo Filtrado pelo Curso */}
      <ArticlesCatalog
        artigosIniciais={artigosDoCurso}
        cursos={CURSOS_LISTA}
        cursoPadrao={curso.sigla}
      />
    </div>
  );
}
