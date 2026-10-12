import React from 'react';
import { TipoManifestacao, StatusProtocolo } from '@/types/ouvidoria';

interface TipoBadgeProps {
  tipo: TipoManifestacao;
  className?: string;
}

interface StatusBadgeProps {
  status: StatusProtocolo;
  className?: string;
}

const CONFIG_TIPO: Record<
  TipoManifestacao,
  { rotulo: string; estilo: string }
> = {
  solicitacao: {
    rotulo: 'Solicitação',
    estilo: 'bg-blue-100 text-[#0B3B60] border-blue-200',
  },
  sugestao: {
    rotulo: 'Sugestão',
    estilo: 'bg-amber-100 text-amber-950 border-amber-300',
  },
  elogio: {
    rotulo: 'Elogio',
    estilo: 'bg-emerald-100 text-emerald-950 border-emerald-300',
  },
  denuncia: {
    rotulo: 'Denúncia',
    estilo: 'bg-purple-100 text-purple-950 border-purple-300',
  },
};

const CONFIG_STATUS: Record<
  StatusProtocolo,
  { rotulo: string; estilo: string }
> = {
  pendente: {
    rotulo: 'Pendente',
    estilo: 'bg-amber-100 text-amber-950 border-amber-300',
  },
  em_analise_assessoria: {
    rotulo: 'Em Análise (Assessoria)',
    estilo: 'bg-blue-100 text-[#0B3B60] border-blue-300',
  },
  em_analise_diretoria: {
    rotulo: 'Em Análise (Diretoria)',
    estilo: 'bg-purple-100 text-purple-950 border-purple-300',
  },
  respondido_privado: {
    rotulo: 'Respondido (Privado)',
    estilo: 'bg-teal-100 text-teal-950 border-teal-300',
  },
  homologado_publico: {
    rotulo: 'Homologado no Mural',
    estilo: 'bg-emerald-100 text-emerald-950 border-emerald-300',
  },
};

export const OuvidoriaTipoBadge: React.FC<TipoBadgeProps> = ({ tipo, className = '' }) => {
  const config = CONFIG_TIPO[tipo] || {
    rotulo: tipo,
    estilo: 'bg-slate-100 text-slate-800 border-slate-300',
  };

  return (
    <span
      role="status"
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider border shadow-2xs ${config.estilo} ${className}`}
    >
      {config.rotulo}
    </span>
  );
};

export const OuvidoriaStatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const config = CONFIG_STATUS[status] || {
    rotulo: status,
    estilo: 'bg-slate-100 text-slate-800 border-slate-300',
  };

  return (
    <span
      role="status"
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border shadow-2xs ${config.estilo} ${className}`}
    >
      {config.rotulo}
    </span>
  );
};
