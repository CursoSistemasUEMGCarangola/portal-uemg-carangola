'use client';

import React, { useState } from 'react';
import { ComprovanteProtocolo } from '@/types/ouvidoria';
import { Printer, Loader2 } from 'lucide-react';
import { gerarHtmlComprovante, executarImpressaoHtml } from '@/lib/pdf/print-service';

interface ReceiptDownloadButtonProps {
  comprovante: ComprovanteProtocolo;
  className?: string;
}

/**
 * Componente de UI para Impressão/Salvamento do Comprovante de Ouvidoria.
 * Desacoplado da montagem do template, delegando ao serviço puro de impressão.
 */
export const ReceiptDownloadButton: React.FC<ReceiptDownloadButtonProps> = ({
  comprovante,
  className = '',
}) => {
  const [gerando, setGerando] = useState(false);

  async function handleImprimirOuBaixar() {
    if (gerando) return;
    setGerando(true);

    try {
      const htmlComprovante = gerarHtmlComprovante(comprovante);
      await executarImpressaoHtml(htmlComprovante);
    } catch {
      alert('Não foi possível gerar o comprovante de ouvidoria.');
    } finally {
      setGerando(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleImprimirOuBaixar}
      disabled={gerando}
      aria-label="Salvar comprovante oficial de ouvidoria em PDF"
      className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-[#0B3B60] hover:bg-[#0056B3] shadow-md hover:shadow-lg transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0056B3] disabled:opacity-75 ${className}`}
    >
      {gerando ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
          <span>Gerando Comprovante...</span>
        </>
      ) : (
        <>
          <Printer className="w-4 h-4" aria-hidden="true" />
          <span>Salvar Comprovante em PDF</span>
        </>
      )}
    </button>
  );
};
