import React from 'react';
import Link from 'next/link';
import { Artigo } from '@/types/editorial';
import { StatusBadge } from '@/components/editorial/StatusBadge';
import {
  Calendar,
  User,
  ExternalLink,
  CheckCircle,
} from 'lucide-react';

interface ArtigoCuradoriaCardProps {
  artigo: Artigo;
  aoAprovar: (artigo: Artigo) => void;
  aoAbrirAcaoModal: (artigo: Artigo, acao: 'solicitar_ajustes' | 'rejeitar') => void;
}

export function ArtigoCuradoriaCard({
  artigo,
  aoAprovar,
  aoAbrirAcaoModal,
}: ArtigoCuradoriaCardProps) {
  return (
    <article
      aria-label={`Artigo submetido: ${artigo.titulo}`}
      className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:border-slate-300 transition-all space-y-4"
    >
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="space-y-2 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={artigo.status} />
            <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
              {artigo.dataPublicacao}
            </span>
          </div>

          <h3 className="text-base font-bold text-slate-900 leading-snug">
            {artigo.titulo}
          </h3>

          <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
            {artigo.resumo}
          </p>

          {/* Conferência visual de discente/docente */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">
                Autor Principal
              </span>
              <strong className="text-slate-800 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
                {artigo.autorNome}
              </strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">
                Matrícula / MASP
              </span>
              <span className="font-mono text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200 inline-block mt-0.5 font-bold">
                {artigo.autorMatricula || 'Não informada'}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">
                Coautoria / Vínculo
              </span>
              <span className="text-slate-700 truncate block">
                {artigo.coautores || 'Autoria individual'}
              </span>
            </div>
          </div>

          {artigo.notasRevisao && (
            <div className="bg-amber-50 border border-amber-300 rounded-lg p-2.5 text-xs text-amber-950">
              <span className="font-bold">Último Despacho da Coordenação:</span> {artigo.notasRevisao}
            </div>
          )}
        </div>
      </div>

      {/* Barra de Ações de 1 Clique */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
        <div className="flex items-center gap-2">
          {artigo.slug && (
            <Link
              href={`/artigos/${artigo.slug}`}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#0056B3] hover:underline"
            >
              Visualizar Texto Completo
              <ExternalLink className="w-3 h-3" aria-hidden="true" />
            </Link>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => aoAbrirAcaoModal(artigo, 'rejeitar')}
            className="px-3.5 py-2 rounded-lg text-xs font-bold text-red-800 hover:bg-red-50 border border-red-300 transition-colors"
          >
            Rejeitar
          </button>

          <button
            type="button"
            onClick={() => aoAbrirAcaoModal(artigo, 'solicitar_ajustes')}
            className="px-3.5 py-2 rounded-lg text-xs font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-300 transition-colors"
          >
            Solicitar Ajustes
          </button>

          <button
            type="button"
            onClick={() => aoAprovar(artigo)}
            className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 shadow-sm transition-all flex items-center gap-1.5"
          >
            <CheckCircle className="w-3.5 h-3.5" aria-hidden="true" />
            Aprovar &amp; Publicar (1 Clique)
          </button>
        </div>
      </div>
    </article>
  );
}
