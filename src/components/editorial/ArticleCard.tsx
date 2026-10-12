import React from 'react';
import Link from 'next/link';
import { Clock, Calendar, ArrowRight, User } from 'lucide-react';
import { Artigo } from '@/types/editorial';

interface ArticleCardProps {
  artigo: Artigo;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ artigo }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
      <div className="p-6">
        {/* Badge do Curso e Data */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className={`inline-block px-2.5 py-0.5 rounded text-xs font-bold border ${artigo.curso.corBadge}`}>
            {artigo.curso.sigla}
          </span>
          <span className="text-xs text-slate-400 flex items-center space-x-1">
            <Calendar className="w-3 h-3" aria-hidden="true" />
            <span>{artigo.dataPublicacao}</span>
          </span>
        </div>

        {/* Título */}
        <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-[#0056B3] transition-colors leading-snug mb-2.5">
          <Link href={`/artigos/${artigo.slug}`}>
            {artigo.titulo}
          </Link>
        </h3>

        {/* Resumo */}
        <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed mb-4">
          {artigo.resumo}
        </p>

        {/* Autor */}
        <div className="flex items-center space-x-1.5 text-xs text-slate-500">
          <User className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
          <span className="truncate font-medium">{artigo.autorNome}</span>
        </div>
      </div>

      {/* Rodapé do Card */}
      <div className="px-6 py-3.5 bg-slate-50/75 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className="text-slate-400 flex items-center space-x-1">
          <Clock className="w-3 h-3" aria-hidden="true" />
          <span>{artigo.tempoLeituraMinutos} min</span>
        </span>

        <Link
          href={`/artigos/${artigo.slug}`}
          className="text-[#0056B3] font-bold hover:text-[#0B3B60] inline-flex items-center space-x-1"
        >
          <span>Ler artigo</span>
          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
};
