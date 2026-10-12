import React from 'react';
import { StatusArtigo } from '@/types/editorial';
import { Clock, AlertTriangle, XCircle, CheckCircle2, FileEdit } from 'lucide-react';

interface StatusBadgeProps {
  status?: StatusArtigo;
  tamanho?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status = 'publicado', tamanho = 'sm' }) => {
  const padraoClasses =
    tamanho === 'sm'
      ? 'px-2.5 py-1 text-xs font-semibold'
      : 'px-3 py-1.5 text-xs sm:text-sm font-bold';

  switch (status) {
    case 'submetido':
      return (
        <span
          role="status"
          aria-label="Status: Aguardando análise da coordenação"
          className={`inline-flex items-center gap-1.5 rounded-full bg-amber-50 text-[#78350F] border border-amber-300 ${padraoClasses}`}
        >
          <Clock className="w-3.5 h-3.5 text-[#B45309] shrink-0" aria-hidden="true" />
          <span>Aguardando Coordenação</span>
        </span>
      );
    case 'em_revisao':
      return (
        <span
          role="status"
          aria-label="Status: Ajustes solicitados pela coordenação"
          className={`inline-flex items-center gap-1.5 rounded-full bg-orange-50 text-[#9A3412] border border-orange-300 ${padraoClasses}`}
        >
          <AlertTriangle className="w-3.5 h-3.5 text-[#C2410C] shrink-0" aria-hidden="true" />
          <span>Ajustes Solicitados</span>
        </span>
      );
    case 'rejeitado':
      return (
        <span
          role="status"
          aria-label="Status: Artigo arquivado ou rejeitado"
          className={`inline-flex items-center gap-1.5 rounded-full bg-red-50 text-[#991B1B] border border-red-300 ${padraoClasses}`}
        >
          <XCircle className="w-3.5 h-3.5 text-[#DC2626] shrink-0" aria-hidden="true" />
          <span>Arquivado / Rejeitado</span>
        </span>
      );
    case 'rascunho':
      return (
        <span
          role="status"
          aria-label="Status: Rascunho não submetido"
          className={`inline-flex items-center gap-1.5 rounded-full bg-slate-100 text-[#334155] border border-slate-300 ${padraoClasses}`}
        >
          <FileEdit className="w-3.5 h-3.5 text-[#64748B] shrink-0" aria-hidden="true" />
          <span>Rascunho Pendente</span>
        </span>
      );
    case 'publicado':
    default:
      return (
        <span
          role="status"
          aria-label="Status: Artigo publicado e acessível publicamente"
          className={`inline-flex items-center gap-1.5 rounded-full bg-emerald-50 text-[#065F46] border border-emerald-300 ${padraoClasses}`}
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-[#059669] shrink-0" aria-hidden="true" />
          <span>Publicado no Portal</span>
        </span>
      );
  }
};
