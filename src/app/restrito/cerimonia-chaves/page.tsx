'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Key,
  Users,
  Award,
  ArrowLeft,
  Building,
  Lock,
  FileCheck,
  CheckCircle2,
} from 'lucide-react';
import { CUSTODIANTES_INSTITUCIONAIS } from '@/lib/crypto/shamir-secret-sharing';
import CerimoniaChavesModal from '@/components/seguranca/CerimoniaChavesModal';

export default function CerimoniaChavesPage() {
  const [modalAberto, setModalAberto] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Topo de Navegação */}
        <div>
          <Link
            href="/restrito"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-[#0B3B60] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span>Voltar ao Painel Geral da Direção</span>
          </Link>
        </div>

        {/* Banner Institucional da Cerimônia */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-900">
                <ShieldCheck className="w-4 h-4 text-purple-700" aria-hidden="true" />
                <span>Hard Box DNA #4 • Continuidade Administrativa e Quórum 2-de-3</span>
              </div>
              <h1 className="text-3xl font-extrabold text-[#0B3B60] tracking-tight">
                Cerimônia de Custódia Compartilhada de Chaves
              </h1>
              <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
                Aplicação do algoritmo <strong>Shamir&apos;s Secret Sharing</strong> sobre o corpo finito de Galois GF(256) / GF(2⁸)
                para mitigar o risco de perda ou retenção isolada das chaves criptográficas do Gabinete da Direção.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setModalAberto(true)}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl text-sm font-bold text-white bg-[#0B3B60] hover:bg-[#0056B3] shadow-md transition-all shrink-0"
            >
              <Key className="w-5 h-5" aria-hidden="true" />
              <span>Abrir Painel da Cerimônia</span>
            </button>
          </div>

          {/* Destaques Técnicos e Legais */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-slate-100">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1.5">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-[#0B3B60]" aria-hidden="true" />
                3 Custodiantes Formais
              </span>
              <p className="text-xs text-slate-600 leading-relaxed">
                Fragmentação matemática entre a Direção, a Vice-Direção e a Secretaria Acadêmica da Unidade.
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1.5">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-emerald-700" aria-hidden="true" />
                Quórum de Limiar 2-de-3
              </span>
              <p className="text-xs text-slate-600 leading-relaxed">
                Qualquer combinação de 2 fragmentos reconstrói a chave mestra em memória RAM. 1 fragmento isolado não fornece informação.
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1.5">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-purple-700" aria-hidden="true" />
                Lei de Arquivos (8.159/1991)
              </span>
              <p className="text-xs text-slate-600 leading-relaxed">
                Garante que trocas de gestão ou aposentadorias de servidores nunca comprometam o acervo de documentos da autarquia estadual.
              </p>
            </div>
          </div>
        </div>

        {/* Cards dos Custodiantes Institucionais */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider">
            Membros da Custódia Institucional de Chaves
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CUSTODIANTES_INSTITUCIONAIS.map((c) => (
              <div
                key={c.indiceX}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-400 uppercase tracking-wider">
                      Cédula #{c.indiceX}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-[#0B3B60]">
                      x = {c.indiceX}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {c.tituloInstitucional}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Titular: {c.titularAtual}
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                    {c.descricao}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-semibold">
                  <span className="flex items-center gap-1 text-emerald-700">
                    <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                    Custodiante Ativo
                  </span>
                  <span>UEMG Carangola</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal da Cerimônia */}
      {modalAberto && <CerimoniaChavesModal aoFechar={() => setModalAberto(false)} />}
    </div>
  );
}
