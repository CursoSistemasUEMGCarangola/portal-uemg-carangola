'use client';

import React from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

export function RestritoNav() {
  return (
    <div className="bg-white border-b border-slate-200 sticky top-[73px] z-40 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-2.5 gap-3">
          {/* Botão Painel Geral com fundo azul escuro da Direção */}
          <nav aria-label="Navegação do Painel Geral">
            <Link
              href="/restrito"
              id="btn-painel-geral"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-[#0B3B60] hover:bg-[#0056B3] text-white shadow-xs transition-all whitespace-nowrap"
            >
              <LayoutDashboard className="w-4 h-4 text-blue-200" aria-hidden="true" />
              <span>Painel Geral</span>
            </Link>
          </nav>

          {/* Atalhos Institucionais */}
          <div className="flex items-center gap-4 shrink-0">
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Ambiente Autenticado • Gabinete da Direção</span>
            </div>

            <Link
              href="/"
              className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-[#0B3B60] px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              title="Ir para o portal público"
            >
              <span>Ver Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
