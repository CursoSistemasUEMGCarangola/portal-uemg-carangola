'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ComprovanteProtocolo } from '@/types/ouvidoria';
import { ReceiptDownloadButton } from '@/components/ouvidoria/ReceiptDownloadButton';
import {
  CheckCircle2,
  Copy,
  Check,
  Search,
  Lock,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Building,
} from 'lucide-react';

function SucessoConteudo() {
  const searchParams = useSearchParams();
  const protocoloUrl = searchParams.get('protocolo') || '#CAR-2026-XXXX';
  const tokenUrl = searchParams.get('token') || 'Chave-Secreta-Nao-Informada';

  const [copiadoProtocolo, setCopiadoProtocolo] = useState(false);
  const [copiadoToken, setCopiadoToken] = useState(false);
  const [comprovante, setComprovante] = useState<ComprovanteProtocolo | null>(null);

  useEffect(() => {
    // Tenta recuperar os metadados do comprovante recente armazenados na sessão
    try {
      const salvo = sessionStorage.getItem('portal_uemg_comprovante_recente');
      if (salvo) {
        setComprovante(JSON.parse(salvo));
      } else {
        // Fallback básico caso o usuário recarregue a página
        setComprovante({
          codigoProtocolo: protocoloUrl,
          tokenSecreto: tokenUrl,
          tipo: 'solicitacao',
          cursoSigla: 'GERAL',
          isAnonimo: false,
          dataHoraEnvio: new Date().toLocaleDateString('pt-BR'),
          hashIntegridade: 'SEC-UEMG-VERIFIED',
        });
      }
    } catch {
      // Ignora erro de JSON
    }
  }, [protocoloUrl, tokenUrl]);

  function copiarTexto(texto: string, tipo: 'protocolo' | 'token') {
    navigator.clipboard.writeText(texto);
    if (tipo === 'protocolo') {
      setCopiadoProtocolo(true);
      setTimeout(() => setCopiadoProtocolo(false), 3000);
    } else {
      setCopiadoToken(true);
      setTimeout(() => setCopiadoToken(false), 3000);
    }
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Topo de Sucesso */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-9 h-9" aria-hidden="true" />
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-[#0B3B60]">
          <Building className="w-3.5 h-3.5" aria-hidden="true" />
          Gabinete da Direção • Protocolo Registrado
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B3B60]">
          Manifestação Cifrada e Enviada com Sucesso!
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
          Sua manifestação foi criptografada no seu navegador (AES-GCM 256 + RSA-OAEP 4096) e recebida pelo Gabinete.
          Guarde rigorosamente a <strong>Dupla Chave</strong> abaixo para consultar a resposta privada.
        </p>
      </div>

      {/* Caixa de Destaque da Dupla Chave */}
      <div className="bg-white rounded-2xl border-2 border-[#0B3B60] p-6 sm:p-8 shadow-md space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Chave 1: Código do Protocolo */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              1. Código Oficial do Protocolo
            </span>
            <div className="flex items-center justify-between gap-2 bg-white px-3.5 py-2.5 rounded-lg border border-slate-300">
              <span className="font-mono text-xl sm:text-2xl font-black text-[#0B3B60]">
                {protocoloUrl}
              </span>
              <button
                type="button"
                onClick={() => copiarTexto(protocoloUrl, 'protocolo')}
                className="p-2 rounded-lg text-slate-500 hover:text-[#0B3B60] hover:bg-slate-100 transition-colors"
                title="Copiar código do protocolo"
              >
                {copiadoProtocolo ? (
                  <Check className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
            <p className="text-[11px] text-slate-500">
              Identificador público sequencial para localização no sistema.
            </p>
          </div>

          {/* Chave 2: Token Secreto de 24 Chars */}
          <div className="bg-emerald-50/60 border border-emerald-300 rounded-xl p-5 space-y-2">
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-emerald-700" aria-hidden="true" />
              2. Chave Secreta de Consulta (24 caracteres)
            </span>
            <div className="flex items-center justify-between gap-2 bg-white px-3.5 py-2.5 rounded-lg border border-emerald-300">
              <span className="font-mono text-sm sm:text-base font-bold text-emerald-900 truncate">
                {tokenUrl}
              </span>
              <button
                type="button"
                onClick={() => copiarTexto(tokenUrl, 'token')}
                className="p-2 rounded-lg text-emerald-700 hover:text-emerald-900 hover:bg-emerald-100 transition-colors shrink-0"
                title="Copiar chave secreta"
              >
                {copiadoToken ? (
                  <Check className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
            <p className="text-[11px] text-emerald-800 font-medium">
              Chave criptográfica indispensável. Não é possível recuperar o despacho sem ela.
            </p>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
          {comprovante && <ReceiptDownloadButton comprovante={comprovante} />}

          <Link
            href={`/fale-com-a-direcao/consulta?protocolo=${encodeURIComponent(
              protocoloUrl
            )}&token=${encodeURIComponent(tokenUrl)}`}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-white border border-slate-300 hover:border-[#0056B3] text-[#0B3B60] hover:text-[#0056B3] font-bold text-xs sm:text-sm shadow-sm transition-all"
          >
            <Search className="w-4 h-4" aria-hidden="true" />
            <span>Testar Consulta Imediata</span>
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>

      {/* Alerta de Segurança em Computadores de Laboratório */}
      <div className="bg-amber-50 border-l-4 border-amber-600 p-4 sm:p-5 rounded-r-xl space-y-1.5 shadow-sm">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0" aria-hidden="true" />
          <h2 className="text-sm font-bold text-amber-950">
            Atenção: Acesso em Computadores Compartilhados da UEMG
          </h2>
        </div>
        <p className="text-xs text-amber-900 leading-relaxed">
          Se você está utilizando este portal em um computador de laboratório, biblioteca ou sala pública, <strong>salve ou anote seu token agora</strong> e clique em <strong>Sair</strong> ou feche esta aba. O sistema opera com isolamento estrito e purgará todos os dados voláteis ao encerrar a sessão.
        </p>
      </div>

      {/* Retorno */}
      <div className="text-center pt-2">
        <Link
          href="/"
          className="text-xs font-semibold text-slate-500 hover:text-[#0B3B60] underline"
        >
          Voltar para a Página Inicial do Portal
        </Link>
      </div>
    </div>
  );
}

export default function SucessoPage() {
  return (
    <div className="min-h-screen bg-[#F7F9FC] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Suspense
          fallback={
            <div className="flex items-center justify-center p-12 text-slate-400 text-xs">
              <div className="w-5 h-5 border-2 border-[#0B3B60] border-t-transparent rounded-full animate-spin mr-2" />
              Carregando dados do protocolo...
            </div>
          }
        >
          <SucessoConteudo />
        </Suspense>
      </div>
    </div>
  );
}
