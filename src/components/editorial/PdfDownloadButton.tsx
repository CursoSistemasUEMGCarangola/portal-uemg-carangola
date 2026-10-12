'use client';

import React, { useState } from 'react';
import { Download, Printer, Check, Loader2 } from 'lucide-react';
import { Artigo } from '@/types/editorial';

interface PdfDownloadButtonProps {
  artigo: Artigo;
}

/**
 * Componente Client-Side para Compilação On-the-Fly de Documento PDF.
 * Regra Inviolável do Zero-Storage de PDFs:
 * Compila o layout oficial da UEMG diretamente no navegador do leitor
 * sem consumir requisições de arquivos binários ou storage no Supabase.
 */
export const PdfDownloadButton: React.FC<PdfDownloadButtonProps> = ({ artigo }) => {
  const [gerando, setGerando] = useState(false);
  const [concluido, setConcluido] = useState(false);

  const handleGerarPdf = () => {
    setGerando(true);

    try {
      // Abre janela de impressão formatada exclusivamente com estilos institucionais UEMG
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        alert('Por favor, permita pop-ups para gerar a versão oficial para download do PDF.');
        setGerando(false);
        return;
      }

      printWindow.document.write(`
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
          <meta charset="utf-8">
          <title>${artigo.titulo} - UEMG Carangola</title>
          <style>
            @page {
              size: A4;
              margin: 20mm 15mm 20mm 15mm;
            }
            body {
              font-family: 'Segoe UI', Arial, sans-serif;
              color: #1a202c;
              line-height: 1.6;
              padding: 0;
              margin: 0;
            }
            .header {
              border-bottom: 2px solid #0B3B60;
              padding-bottom: 12px;
              margin-bottom: 24px;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            .header-title {
              font-size: 14px;
              font-weight: bold;
              color: #0B3B60;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .header-sub {
              font-size: 11px;
              color: #4a5568;
            }
            .badge {
              display: inline-block;
              background-color: #E6EFF7;
              color: #0B3B60;
              font-weight: bold;
              font-size: 11px;
              padding: 4px 8px;
              border-radius: 4px;
              margin-bottom: 12px;
              text-transform: uppercase;
            }
            h1 {
              font-size: 20px;
              color: #0B3B60;
              line-height: 1.3;
              margin: 0 0 16px 0;
            }
            .meta {
              font-size: 12px;
              color: #4a5568;
              margin-bottom: 20px;
              border-left: 3px solid #0056B3;
              padding-left: 10px;
            }
            .resumo-box {
              background-color: #f7fafc;
              border: 1px solid #e2e8f0;
              padding: 12px 16px;
              border-radius: 6px;
              margin-bottom: 24px;
              font-size: 13px;
              font-style: italic;
            }
            .content {
              font-size: 13px;
              text-align: justify;
            }
            .content h2 {
              font-size: 15px;
              color: #0B3B60;
              border-bottom: 1px solid #e2e8f0;
              padding-bottom: 4px;
              margin-top: 20px;
            }
            .footer {
              margin-top: 30px;
              border-top: 1px solid #cbd5e0;
              padding-top: 12px;
              font-size: 10px;
              color: #718096;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="header-title">Universidade do Estado de Minas Gerais</div>
              <div class="header-sub">Unidade Acadêmica de Carangola — Portal de Publicações</div>
            </div>
            <div style="text-align: right; font-size: 10px; color: #718096;">
              Publicado em: ${artigo.dataPublicacao}
            </div>
          </div>

          <div class="badge">${artigo.curso.nome} (${artigo.curso.sigla})</div>
          <h1>${artigo.titulo}</h1>

          <div class="meta">
            <strong>Autor Principal:</strong> ${artigo.autorNome}<br>
            ${artigo.coautores ? `<strong>Coautores:</strong> ${artigo.coautores}<br>` : ''}
            <strong>Citação ABNT:</strong> ${artigo.citacaoAbnt}
          </div>

          <div class="resumo-box">
            <strong>Resumo:</strong> ${artigo.resumo}
          </div>

          <div class="content">
            ${artigo.corpoMarkdown
              .replace(/## (.*?)\n/g, '<h2>$1</h2>')
              .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
              .replace(/\n\n/g, '<p>')
              .replace(/\n/g, '<br>')}
          </div>

          <div class="footer">
            Documento emitido eletronicamente pelo Portal de Publicações da UEMG Carangola. Registro científico perene e de livre acesso.
          </div>

          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
        </html>
      `);

      printWindow.document.close();

      setConcluido(true);
      setTimeout(() => setConcluido(false), 3000);
    } catch {
      alert('Não foi possível gerar a versão em PDF no navegador.');
    } finally {
      setGerando(false);
    }
  };

  return (
    <button
      onClick={handleGerarPdf}
      disabled={gerando}
      aria-label="Baixar versão oficial em PDF gerada na memória do navegador"
      className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-lg bg-[#0B3B60] hover:bg-[#003366] text-white text-xs sm:text-sm font-bold shadow-sm transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#0056B3] disabled:opacity-75"
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
