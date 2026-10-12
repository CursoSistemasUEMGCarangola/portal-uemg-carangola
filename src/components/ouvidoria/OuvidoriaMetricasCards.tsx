import React from 'react';

interface OuvidoriaMetricasCardsProps {
  total: number;
  pendentes: number;
  emAnalise: number;
  respondidos: number;
  homologados: number;
}

export function OuvidoriaMetricasCards({
  total,
  pendentes,
  emAnalise,
  respondidos,
  homologados,
}: OuvidoriaMetricasCardsProps) {
  const itens = [
    {
      rotulo: 'Total',
      valor: total,
      bg: 'bg-slate-50',
      border: 'border-slate-200',
      textoRotulo: 'text-slate-500',
      textoValor: 'text-slate-900',
      spanCol: '',
    },
    {
      rotulo: 'Pendentes',
      valor: pendentes,
      bg: 'bg-amber-50/60',
      border: 'border-amber-200',
      textoRotulo: 'text-amber-800',
      textoValor: 'text-amber-900',
      spanCol: '',
    },
    {
      rotulo: 'Em Análise',
      valor: emAnalise,
      bg: 'bg-blue-50/60',
      border: 'border-blue-200',
      textoRotulo: 'text-blue-800',
      textoValor: 'text-blue-900',
      spanCol: '',
    },
    {
      rotulo: 'Respondidos',
      valor: respondidos,
      bg: 'bg-teal-50/60',
      border: 'border-teal-200',
      textoRotulo: 'text-teal-800',
      textoValor: 'text-teal-900',
      spanCol: '',
    },
    {
      rotulo: 'Mural Público',
      valor: homologados,
      bg: 'bg-emerald-50/60',
      border: 'border-emerald-200',
      textoRotulo: 'text-emerald-800',
      textoValor: 'text-emerald-900',
      spanCol: 'col-span-2 sm:col-span-1',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mt-8 pt-6 border-t border-slate-100">
      {itens.map((item) => (
        <div
          key={item.rotulo}
          className={`${item.bg} p-4 rounded-xl border ${item.border} ${item.spanCol}`}
        >
          <span className={`text-xs font-semibold ${item.textoRotulo} uppercase tracking-wider block`}>
            {item.rotulo}
          </span>
          <span className={`text-2xl font-black ${item.textoValor} mt-1 block font-mono`}>
            {item.valor}
          </span>
        </div>
      ))}
    </div>
  );
}
