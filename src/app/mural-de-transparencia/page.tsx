import React from 'react';
import { Metadata } from 'next';
import { MURAL_SEED } from '@/lib/data/mock-mural';
import { MuralCatalog } from '@/components/ouvidoria/MuralCatalog';
import { Scale, ShieldCheck, Info } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Mural de Transparência Institucional — UEMG Carangola',
  description:
    'Mural público de manifestações sanitizadas e despachos oficiais do Gabinete da Direção Geral da UEMG Carangola, em conformidade com a Lei de Acesso à Informação (Lei 12.527/2011).',
};

export default function MuralTransparenciaPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 sm:py-14 space-y-10">
      {/* Cabeçalho Oficial */}
      <div className="space-y-4">
        <div className="inline-flex items-center space-x-2 text-xs font-bold text-[#0056B3] uppercase tracking-wider">
          <Scale className="w-4 h-4" aria-hidden="true" />
          <span>Transparência Pública Ativa</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0B3B60] tracking-tight">
          Mural de Transparência do Gabinete
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
          Publicação oficial de manifestações da comunidade acadêmica e respectivos despachos e
          portarias expedidas pela Direção Geral da Unidade Acadêmica de Carangola.
        </p>
      </div>

      {/* Nota Legal de Conformidade com LAI e LGPD */}
      <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-5 sm:p-6 flex items-start gap-4">
        <div className="w-9 h-9 rounded-xl bg-[#0B3B60] text-white flex items-center justify-center shrink-0 mt-0.5">
          <ShieldCheck className="w-5 h-5" aria-hidden="true" />
        </div>
        <div className="space-y-1 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <h2 className="font-bold text-[#0B3B60]">
            Higienização e Proteção de Dados (Lei Federal 12.527/2011 & Lei 13.709/2018)
          </h2>
          <p>
            Em estrita observância à Lei de Acesso à Informação (LAI) e à Lei Geral de Proteção de
            Dados (LGPD), todas as manifestações exibidas neste mural público passam por rigoroso
            processo prévio de sanitização monocrática pelo Gabinete da Direção no navegador,
            garantindo a supressão de dados pessoais identificáveis (PII) antes da publicação.
          </p>
        </div>
      </div>

      {/* Catálogo Interativo com Filtros */}
      <MuralCatalog itensIniciais={MURAL_SEED} />
    </div>
  );
}
