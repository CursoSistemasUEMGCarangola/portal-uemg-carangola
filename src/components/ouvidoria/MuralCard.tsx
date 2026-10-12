import React from 'react';
import { ItemMuralPublico } from '@/types/ouvidoria';
import { CourseBadge } from '@/components/editorial/CourseBadge';
import { OuvidoriaTipoBadge } from '@/components/ouvidoria/OuvidoriaBadge';
import {
  FileText,
  Calendar,
  CheckCircle2,
  Building,
  Scale,
  Award,
} from 'lucide-react';

interface MuralCardProps {
  item: ItemMuralPublico;
}

export const MuralCard: React.FC<MuralCardProps> = ({ item }) => {
  return (
    <article
      className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:border-slate-300 transition-all space-y-4"
      aria-labelledby={`mural-titulo-${item.id}`}
    >
      {/* Topo do Card com Metadados */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex flex-wrap items-center gap-2">
          <OuvidoriaTipoBadge tipo={item.tipo} />

          {item.cursoSigla !== 'GERAL' ? (
            <CourseBadge
              curso={{
                sigla: item.cursoSigla,
                nome: `Curso de ${item.cursoSigla}`,
              }}
            />
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
              <Building className="w-3 h-3 text-slate-500" aria-hidden="true" />
              Administração Geral
            </span>
          )}

          <span className="font-mono text-xs font-bold text-slate-600 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
            {item.protocoloReferencia}
          </span>
        </div>

        <div className="text-[11px] text-slate-500 flex items-center gap-1.5 font-medium">
          <Calendar className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
          <span>Manifestação: {item.dataManifestacao}</span>
          <span className="text-slate-300">•</span>
          <span>Publicado: {item.publicadoEm}</span>
        </div>
      </div>

      {/* Resumo Sanitizado da Manifestação */}
      <div className="space-y-1">
        <h3
          id={`mural-titulo-${item.id}`}
          className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5"
        >
          <Scale className="w-3.5 h-3.5 text-[#0B3B60]" aria-hidden="true" />
          Resumo da Manifestação Sanitizada (Lei 12.527/2011)
        </h3>
        <p className="text-sm text-slate-800 leading-relaxed font-sans bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/80">
          {item.manifestacaoResumo}
        </p>
      </div>

      {/* Resposta e Despacho Oficial do Gabinete */}
      <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h4 className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" aria-hidden="true" />
            Resposta Oficial do Gabinete da Direção Geral
          </h4>

          {item.numeroPortaria && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white text-emerald-800 border border-emerald-300 shadow-2xs">
              <Award className="w-3 h-3 text-emerald-600" aria-hidden="true" />
              {item.numeroPortaria}
            </span>
          )}
        </div>

        <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-sans bg-white p-3.5 rounded-lg border border-emerald-200">
          {item.respostaOficial}
        </p>
      </div>
    </article>
  );
};
