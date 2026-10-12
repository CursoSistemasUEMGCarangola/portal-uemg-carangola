import React from 'react';
import Link from 'next/link';
import { Clock, User, Calendar, ArrowRight, Sparkles } from 'lucide-react';
import { Artigo } from '@/types/editorial';

interface FeaturedArticleProps {
  artigo: Artigo;
}

export const FeaturedArticle: React.FC<FeaturedArticleProps> = ({ artigo }) => {
  return (
    <article className="w-full bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
        {/* Banner Visual / Identificador do Curso */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#0B3B60] to-[#002244] p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-white/5 rounded-full blur-2xl pointer-events-none" />
          
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/10 text-blue-200 text-xs font-bold tracking-wide uppercase mb-6 border border-white/15">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" aria-hidden="true" />
              <span>Publicação em Destaque</span>
            </div>

            <div className="space-y-3">
              <span className={`inline-block px-3 py-1 rounded-md text-xs font-extrabold border ${artigo.curso.corBadge}`}>
                {artigo.curso.nome} ({artigo.curso.sigla})
              </span>
              <h2 className="text-xl sm:text-2xl font-black leading-snug text-white">
                {artigo.titulo}
              </h2>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10 text-xs text-blue-200 flex items-center justify-between">
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

        {/* Resumo e Ação */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between bg-white">
          <div>
            <div className="flex items-center space-x-2 text-xs text-slate-500 mb-4">
              <User className="w-4 h-4 text-[#0056B3]" aria-hidden="true" />
              <span className="font-semibold text-slate-700">{artigo.autorNome}</span>
              {artigo.coautores && (
                <span className="text-slate-400 truncate">• {artigo.coautores}</span>
              )}
            </div>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6">
              {artigo.resumo}
            </p>
          </div>

          <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
            <Link
              href={`/artigos/${artigo.slug}`}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-[#0056B3] hover:bg-[#0B3B60] text-white text-sm font-bold shadow-sm transition-colors"
            >
              <span>Ler Artigo Completo</span>
              <ArrowRight className="w-4 h-4 ml-1" aria-hidden="true" />
            </Link>

            <span className="text-xs text-slate-400 font-medium hidden sm:inline-block">
              Acesso Aberto & Gratuito
            </span>
          </div>
        </div>
      </div>
    </article>
  );
};
