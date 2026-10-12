'use client';

import React, { useState } from 'react';
import { ComprovanteProtocolo } from '@/types/ouvidoria';
import { Download, Printer, CheckCircle, ShieldCheck } from 'lucide-react';

interface ReceiptDownloadButtonProps {
  comprovante: ComprovanteProtocolo;
  className?: string;
}

export const ReceiptDownloadButton: React.FC<ReceiptDownloadButtonProps> = ({
  comprovante,
  className = '',
}) => {
  const [gerando, setGerando] = useState(false);

  function handleImprimirOuBaixar() {
    setGerando(true);

    const janelaImpressao = window.open('', '_blank', 'width=800,height=900');
    if (!janelaImpressao) {
      alert('Por favor, permita pop-ups no seu navegador para gerar o comprovante oficial.');
      setGerando(false);
      return;
    }

    const htmlConteudo = `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="utf-8" />
        <title>Comprovante Oficial de Ouvidoria — UEMG Carangola</title>
        <style>
          @page { size: A4 portrait; margin: 15mm; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            color: #1e293b;
            line-height: 1.5;
            margin: 0;
            padding: 20px;
          }
          .topo-gov {
            border-bottom: 2px solid #002244;
            padding-bottom: 12px;
            margin-bottom: 24px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .topo-titulos h1 {
            color: #0B3B60;
            font-size: 18px;
            margin: 0;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .topo-titulos p {
            color: #64748b;
            font-size: 11px;
            margin: 2px 0 0 0;
            font-weight: 600;
          }
          .caixa-protocolo {
            background-color: #f8fafc;
            border: 2px solid #0B3B60;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
            text-align: center;
          }
          .rotulo-protocolo {
            font-size: 11px;
            text-transform: uppercase;
            color: #64748b;
            font-weight: 700;
            letter-spacing: 1px;
          }
          .numero-protocolo {
            font-size: 26px;
            font-weight: 900;
            color: #0B3B60;
            margin: 6px 0;
            font-family: monospace;
          }
          .caixa-token {
            background-color: #f0fdf4;
            border: 1px dashed #16a34a;
            border-radius: 6px;
            padding: 12px;
            margin: 15px 0;
            text-align: center;
          }
          .token-valor {
            font-family: monospace;
            font-size: 16px;
            font-weight: 700;
            color: #15803d;
            letter-spacing: 1px;
          }
          .tabela-dados {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            font-size: 12px;
          }
          .tabela-dados th, .tabela-dados td {
            padding: 10px 12px;
            text-align: left;
            border-bottom: 1px solid #e2e8f0;
          }
          .tabela-dados th {
            background-color: #f1f5f9;
            color: #334155;
            width: 35%;
            font-weight: 700;
          }
          .alerta-seguranca {
            background-color: #fffbeb;
            border-left: 4px solid #f59e0b;
            padding: 12px;
            font-size: 11px;
            color: #92400e;
            margin-top: 24px;
            border-radius: 0 6px 6px 0;
          }
          .rodape {
            margin-top: 40px;
            border-top: 1px solid #cbd5e1;
            padding-top: 12px;
            font-size: 10px;
            color: #94a3b8;
            text-align: center;
          }
          @media print {
            body { padding: 0; }
          }
        </style>
      </head>
      <body>
        <div class="topo-gov">
          <div class="topo-titulos">
            <h1>Universidade do Estado de Minas Gerais</h1>
            <p>Unidade Acadêmica de Carangola • Gabinete da Direção Geral</p>
            <p>Canal de Ouvidoria & Governança Participativa (Fale com a Direção)</p>
          </div>
          <div style="font-size: 11px; font-weight: bold; color: #002244;">
            GOVERNO DE MINAS GERAIS
          </div>
        </div>

        <div class="caixa-protocolo">
          <div class="rotulo-protocolo">Código Oficial de Registro</div>
          <div class="numero-protocolo">${comprovante.codigoProtocolo}</div>
          <div style="font-size: 11px; color: #64748b;">
            Protocolado em: <strong>${comprovante.dataHoraEnvio}</strong>
          </div>
        </div>

        <div class="caixa-token">
          <div style="font-size: 11px; font-weight: bold; color: #166534; text-transform: uppercase;">
            Chave Secreta de Consulta (Guarda Obrigatória)
          </div>
          <div class="token-valor">${comprovante.tokenSecreto}</div>
          <div style="font-size: 10px; color: #15803d; margin-top: 4px;">
            Necessária junto ao protocolo para consultar a resposta privada da Direção Geral
          </div>
        </div>

        <table class="tabela-dados">
          <tr>
            <th>Tipo de Manifestação:</th>
            <td>${comprovante.tipo.toUpperCase()}</td>
          </tr>
          <tr>
            <th>Identificação do Solicitante:</th>
            <td>${comprovante.autorNome || 'Manifestação Anônima'}</td>
          </tr>
          <tr>
            <th>Curso / Setor de Encaminhamento:</th>
            <td>${comprovante.cursoSigla}</td>
          </tr>
          <tr>
            <th>Criptografia Utilizada:</th>
            <td>Criptografia de Envelope (AES-GCM-256 + RSA-OAEP-4096)</td>
          </tr>
          <tr>
            <th>Hash de Integridade:</th>
            <td><code style="font-family: monospace;">${comprovante.hashIntegridade}</code></td>
          </tr>
        </table>

        <div class="alerta-seguranca">
          <strong>IMPORTANTE — POLÍTICA ZERO-TRUST:</strong>
          Sua manifestação foi criptografada no seu navegador antes do envio. O Gabinete da Direção é o único detentor da chave privada para leitura. Guarde este comprovante em local seguro. Caso acesse de um computador público, encerre a sessão imediatamente.
        </div>

        <div class="rodape">
          Documento gerado eletronicamente no cliente conforme Lei 12.527/2011 (LAI) e Lei 13.709/2018 (LGPD).<br/>
          Portal UEMG Carangola — Praça dos Estudantes, Carangola - MG.
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 300);
          };
        </script>
      </body>
      </html>
    `;

    janelaImpressao.document.open();
    janelaImpressao.document.write(htmlConteudo);
    janelaImpressao.document.close();
    setGerando(false);
  }

  return (
    <button
      type="button"
      onClick={handleImprimirOuBaixar}
      disabled={gerando}
      className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-[#0B3B60] hover:bg-[#0056B3] shadow-md hover:shadow-lg transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0056B3] ${className}`}
    >
      <Printer className="w-4 h-4" aria-hidden="true" />
      <span>{gerando ? 'Gerando Comprovante...' : 'Salvar Comprovante em PDF'}</span>
    </button>
  );
};
