'use client';

import React from 'react';
import { Printer } from 'lucide-react';

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => {
        if (typeof window !== 'undefined') {
          window.print();
        }
      }}
      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold shadow-2xs transition-colors cursor-pointer"
      title="Imprimir ou salvar este guia em PDF"
    >
      <Printer className="w-4 h-4 text-slate-500" aria-hidden="true" />
      <span>Imprimir / Salvar PDF</span>
    </button>
  );
}
