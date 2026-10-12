'use client';

import React, { useState } from 'react';
import { Download, Check, Loader2 } from 'lucide-react';
import { Artigo } from '@/types/editorial';
import { gerarHtmlArtigo, executarImpressaoHtml } from '@/lib/pdf/print-service';

interface PdfDownloadButtonProps {
  artigo: Artigo;
  className?: string;
}

/**
 * Componente de UI para Acionamento de Download/Impressão de Artigo.
 * Arquitetura Zero-Storage: Os binários nunca trafegam nem são persistidos no servidor.
 * Todo o processamento e montagem é delegado ao serviço puro de impressão client-side.
 */
export const PdfDownloadButton: React.FC<PdfDownloadButtonProps> = ({
  artigo,
  className = '',
}) => {
  const [gerando, setGerando] = useState(false);
  const [concluido, setConcluido] = useState(false);

  const handleGerarPdf = async () => {
    if (gerando) return;
    setGerando(true);

    try {
      const htmlArtigo = gerarHtmlArtigo(artigo);
      const sucesso = await executarImpressaoHtml(htmlArtigo);

      if (sucesso) {
        setConcluido(true);
        setTimeout(() => setConcluido(false), 3000);
      }
    } catch {
      alert('Não foi possível gerar a versão em PDF no navegador.');
    } finally {
      setGerando(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleGerarPdf}
      disabled={gerando}
      aria-label="Baixar versão oficial em PDF gerada na memória do navegador"
      className={`inline-flex items-center space-x-2 px-4 py-2.5 rounded-lg bg-[#0B3B60] hover:bg-[#003366] text-white text-xs sm:text-sm font-bold shadow-sm transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#0056B3] disabled:opacity-75 ${className}`}
    >
      {gerando ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
          <span>Compilando PDF...</span>
        </>
      ) : concluido ? (
        <>
          <Check className="w-4 h-4 text-emerald-300" aria-hidden="true" />
          <span>PDF Pronto</span>
        </>
      ) : (
        <>
          <Download className="w-4 h-4 text-blue-200" aria-hidden="true" />
          <span>Baixar PDF Oficial</span>
        </>
      )}
    </button>
  );
};
