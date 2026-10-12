import React from 'react';
import { StatusProtocolo } from '@/types/ouvidoria';
import { CheckCircle2 } from 'lucide-react';

interface ProtocoloTimelineProps {
  status?: StatusProtocolo;
}

const PASSOS_TRAMITE: { id: StatusProtocolo; rotulo: string }[] = [
  { id: 'pendente', rotulo: 'Protocolado / Recebido' },
  { id: 'em_analise_assessoria', rotulo: 'Em Análise na Assessoria' },
  { id: 'em_analise_diretoria', rotulo: 'Despacho da Direção Geral' },
  { id: 'respondido_privado', rotulo: 'Respondido & Homologado' },
];

const MAPA_INDICES: Record<StatusProtocolo, number> = {
  pendente: 0,
  em_analise_assessoria: 1,
  em_analise_diretoria: 2,
  respondido_privado: 3,
  homologado_publico: 3,
};

export function ProtocoloTimeline({ status }: ProtocoloTimelineProps) {
  const indiceAtual = status ? MAPA_INDICES[status] : 0;

  return (
    <div className="py-4" aria-label="Linha do tempo do trâmite da manifestação">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2" role="list">
        {PASSOS_TRAMITE.map((passo, idx) => {
          const atingido = idx <= indiceAtual;
          const ativo = idx === indiceAtual;

          return (
            <div
              key={passo.id}
              role="listitem"
              aria-current={ativo ? 'step' : undefined}
              className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-colors ${
                atingido
                  ? 'bg-blue-50/70 border-blue-200 text-[#0B3B60]'
                  : 'bg-slate-50 border-slate-200 text-slate-400'
              } ${ativo ? 'ring-2 ring-[#0056B3]' : ''}`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[11px] font-bold ${
                  atingido ? 'bg-[#0B3B60] text-white' : 'bg-slate-200 text-slate-500'
                }`}
                aria-hidden="true"
              >
                {atingido ? <CheckCircle2 className="w-4 h-4 text-emerald-300" /> : idx + 1}
              </div>
              <span className="leading-tight">{passo.rotulo}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
