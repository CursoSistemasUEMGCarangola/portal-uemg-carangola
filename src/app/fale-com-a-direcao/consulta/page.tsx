import React, { Suspense } from 'react';
import Link from 'next/link';
import ConsultaProtocoloForm from '@/components/ouvidoria/ConsultaProtocoloForm';
import { ArrowLeft, Search, Building, ShieldCheck } from 'lucide-react';

export const metadata = {
  title: 'Consulta de Protocolo | Fale com a Direção | Portal UEMG Carangola',
  description:
    'Consulte o andamento da sua manifestação ou despacho oficial do Gabinete da Direção Geral por meio da dupla chave institucional.',
};

export default function ConsultaProtocoloPage() {
  return (
    <div className="min-h-screen bg-[#F7F9FC] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Navegação e Cabeçalho */}
        <div>
          <Link
            href="/fale-com-a-direcao"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0B3B60] hover:text-[#0056B3] mb-4 group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" aria-hidden="true" />
            Voltar para Canal Fale com a Direção
          </Link>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#0B3B60] text-white mb-2">
                <Building className="w-3.5 h-3.5 text-cyan-300" aria-hidden="true" />
                Gabinete da Direção Geral
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B3B60] tracking-tight">
                Consulta de Manifestação & Ouvidoria
              </h1>
              <p className="text-sm text-slate-600 mt-1">
                Acompanhamento com dupla chave (Protocolo + Token Secreto) e proteção anti-enumeração.
              </p>
            </div>

            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3.5 py-2 rounded-xl text-emerald-800 text-xs font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" aria-hidden="true" />
              <span>Validação Cega via Hash SHA-256</span>
            </div>
          </div>
        </div>

        {/* Formulário com Suspense Boundary */}
        <Suspense
          fallback={
            <div className="flex items-center justify-center p-12 text-slate-400 text-xs">
              <div className="w-5 h-5 border-2 border-[#0B3B60] border-t-transparent rounded-full animate-spin mr-2" />
              Carregando módulo de consulta...
            </div>
          }
        >
          <ConsultaProtocoloForm />
        </Suspense>
      </div>
    </div>
  );
}
