'use client';

import React from 'react';
import { Search, X } from 'lucide-react';
import { Curso } from '@/types/editorial';

interface ArticleFiltersProps {
  cursos: Curso[];
  cursoSelecionado: string | null;
  busca: string;
  onSelectCurso: (sigla: string | null) => void;
  onBuscaChange: (termo: string) => void;
}

export const ArticleFilters: React.FC<ArticleFiltersProps> = ({
  cursos,
  cursoSelecionado,
  busca,
  onSelectCurso,
  onBuscaChange,
}) => {
  return (
    <div className="w-full space-y-4">
      {/* Campo de Busca Textual */}
      <div className="relative">
        <label htmlFor="busca-artigos" className="sr-only">
          Buscar artigos por título, autor ou resumo
        </label>
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Search className="w-4 h-4" aria-hidden="true" />
        </div>
        <input
          id="busca-artigos"
          type="text"
          value={busca}
          onChange={(e) => onBuscaChange(e.target.value)}
          placeholder="Buscar artigos por título, autor ou palavras-chave..."
          className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#0056B3] focus:ring-2 focus:ring-[#0056B3]/20 transition-all shadow-sm"
        />
        {busca && (
          <button
            onClick={() => onBuscaChange('')}
            aria-label="Limpar busca"
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Pílulas de Filtragem por Curso */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none" role="group" aria-label="Filtrar publicações por curso">
        <button
          onClick={() => onSelectCurso(null)}
          aria-pressed={cursoSelecionado === null}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex-shrink-0 ${
            cursoSelecionado === null
              ? 'bg-[#0B3B60] text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Todos os Cursos
        </button>

        {cursos.map((c) => {
          const isSelected = cursoSelecionado === c.sigla;
          return (
            <button
              key={c.sigla}
              onClick={() => onSelectCurso(isSelected ? null : c.sigla)}
              aria-pressed={isSelected}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex-shrink-0 ${
                isSelected
                  ? 'bg-[#0056B3] text-white shadow-sm ring-2 ring-[#0056B3]/30'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {c.sigla} — {c.nome}
            </button>
          );
        })}
      </div>
    </div>
  );
};
