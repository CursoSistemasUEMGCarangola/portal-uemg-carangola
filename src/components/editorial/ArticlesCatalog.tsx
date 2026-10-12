'use client';

import React, { useState, useMemo } from 'react';
import { Artigo, Curso } from '@/types/editorial';
import { ArticleCard } from '@/components/editorial/ArticleCard';
import { ArticleFilters } from '@/components/editorial/ArticleFilters';
import { BookOpen } from 'lucide-react';

interface ArticlesCatalogProps {
  artigosIniciais: Artigo[];
  cursos: Curso[];
  cursoPadrao?: string;
}

export const ArticlesCatalog: React.FC<ArticlesCatalogProps> = ({
  artigosIniciais,
  cursos,
  cursoPadrao = null,
}) => {
  const [cursoSelecionado, setCursoSelecionado] = useState<string | null>(cursoPadrao);
  const [busca, setBusca] = useState('');

  const artigosFiltrados = useMemo(() => {
    return artigosIniciais.filter((art) => {
      // Filtro por Curso
      if (cursoSelecionado && art.curso.sigla !== cursoSelecionado) {
        return false;
      }

      // Filtro por Busca Textual
      if (busca.trim()) {
        const termo = busca.toLowerCase();
        const noTitulo = art.titulo.toLowerCase().includes(termo);
        const noResumo = art.resumo.toLowerCase().includes(termo);
        const noAutor = art.autorNome.toLowerCase().includes(termo);
        const nasTags = art.tags ? art.tags.some((t) => t.toLowerCase().includes(termo)) : false;

        return noTitulo || noResumo || noAutor || nasTags;
      }

      return true;
    });
  }, [artigosIniciais, cursoSelecionado, busca]);

  return (
    <div className="space-y-8">
      {/* Controles de Filtro e Busca */}
      <ArticleFilters
        cursos={cursos}
        cursoSelecionado={cursoSelecionado}
        busca={busca}
        onSelectCurso={setCursoSelecionado}
        onBuscaChange={setBusca}
      />

      {/* Contador de Resultados */}
      <div className="flex items-center justify-between text-xs text-slate-500 border-b border-slate-200 pb-3">
        <span>
          Mostrando <strong>{artigosFiltrados.length}</strong> {artigosFiltrados.length === 1 ? 'publicação' : 'publicações'}
          {cursoSelecionado && ` no curso ${cursoSelecionado}`}
        </span>
        {(cursoSelecionado || busca) && (
          <button
            onClick={() => {
              setCursoSelecionado(null);
              setBusca('');
            }}
            className="text-[#0056B3] hover:underline font-semibold"
          >
            Limpar todos os filtros
          </button>
        )}
      </div>

      {/* Grade de Artigos */}
      {artigosFiltrados.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {artigosFiltrados.map((artigo) => (
            <ArticleCard key={artigo.id} artigo={artigo} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800 mb-1">
            Nenhum artigo encontrado
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed mb-6">
            Não localizamos produções que correspondam aos filtros de busca informados.
            Tente pesquisar por outros termos ou selecionar outro curso.
          </p>
          <button
            onClick={() => {
              setCursoSelecionado(null);
              setBusca('');
            }}
            className="px-4 py-2 rounded-lg bg-[#0056B3] text-white text-xs font-bold hover:bg-[#0B3B60] transition-colors"
          >
            Ver Todas as Publicações
          </button>
        </div>
      )}
    </div>
  );
};
