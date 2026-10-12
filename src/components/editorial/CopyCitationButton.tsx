'use client';

import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CopyCitationButtonProps {
  citacao: string;
}

export const CopyCitationButton: React.FC<CopyCitationButtonProps> = ({ citacao }) => {
  const [copiado, setCopiado] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(citacao);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2500);
    } catch {
      // Fallback
    }
  };

  return (
    <button
      onClick={handleCopy}
      aria-label="Copiar citação ABNT para a área de transferência"
      className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded bg-slate-200/70 hover:bg-slate-300 text-slate-700 text-xs font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-[#0056B3]"
    >
      {copiado ? (
        <>
          <Check className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
          <span className="text-emerald-700">Citação Copiada!</span>
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
          <span>Copiar ABNT</span>
        </>
      )}
    </button>
  );
};
