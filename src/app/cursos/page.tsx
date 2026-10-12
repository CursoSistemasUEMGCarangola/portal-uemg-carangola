import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { CURSOS_LISTA, ARTIGOS_MOCK } from '@/lib/data/mock-articles';
import { GraduationCap, BookOpen, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Cursos de Graduação — UEMG Carangola',
  description:
    'Conheça os 8 cursos de graduação da Universidade do Estado de Minas Gerais — Unidade Carangola e suas respectivas produções acadêmicas.',
};

export default function CursosPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 sm:py-14">
      {/* Cabeçalho */}
      <div className="mb-12">
        <div className="inline-flex items-center space-x-2 text-xs font-bold text-[#0056B3] uppercase tracking-wider mb-2">
          <GraduationCap className="w-4 h-4" aria-hidden="true" />
          <span>Estrutura Departamental</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#0B3B60] tracking-tight">
          Cursos de Graduação — Unidade Carangola
        </h1>
        <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-3xl leading-relaxed">
          Navegue pela produção científica, pedagógica e extensionista específica de cada um dos
          colegiados acadêmicos do campus de Carangola.
        </p>
      </div>

      {/* Grade de Cursos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {CURSOS_LISTA.map((curso) => {
          const totalArtigos = ARTIGOS_MOCK.filter((a) => a.curso.sigla === curso.sigla).length;

          return (
            <div
              key={curso.sigla}
              className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-2.5 py-1 rounded-md text-xs font-black tracking-wider border ${curso.corBadge}`}>
                    {curso.sigla}
                  </span>
                  <span className="text-xs text-slate-400 font-medium flex items-center space-x-1">
                    <BookOpen className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                    <span>{totalArtigos} {totalArtigos === 1 ? 'artigo' : 'artigos'}</span>
                  </span>
                </div>

                <h2 className="text-lg font-bold text-slate-900 group-hover:text-[#0056B3] transition-colors mb-2">
                  <Link href={`/cursos/${curso.sigla.toLowerCase()}`}>
                    {curso.nome}
                  </Link>
                </h2>

                <p className="text-xs text-slate-600 leading-relaxed mb-6">
                  {curso.descricao}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <Link
                  href={`/cursos/${curso.sigla.toLowerCase()}`}
                  className="text-xs font-bold text-[#0056B3] hover:text-[#0B3B60] inline-flex items-center space-x-1 group-hover:translate-x-1 transition-transform"
                >
                  <span>Ver artigos do curso</span>
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
