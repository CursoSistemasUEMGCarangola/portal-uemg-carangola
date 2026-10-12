'use client';

import React, { useState, useEffect } from 'react';
import {
  CUSTODIANTES_INSTITUCIONAIS,
  executarCerimoniaParticaoShamir,
  recomporSegredoDeFragmentos,
} from '@/lib/crypto/shamir-secret-sharing';
import {
  FragmentoChaveShamir,
  ResultadoCerimoniaParticao,
  ResultadoRecomposicaoChave,
  CustodianteInfo,
} from '@/types/cerimonia';
import {
  Key,
  ShieldCheck,
  Users,
  Copy,
  Check,
  Download,
  Unlock,
  AlertTriangle,
  X,
  FileCheck,
  RefreshCw,
} from 'lucide-react';

interface CerimoniaChavesModalProps {
  aoFechar: () => void;
}

export default function CerimoniaChavesModal({ aoFechar }: CerimoniaChavesModalProps) {
  const [abaAtiva, setAbaAtiva] = useState<'particao' | 'recomposicao'>('particao');

  // Estados de Partição
  const [segredoInput, setSegredoInput] = useState('');
  const [resultadoParticao, setResultadoParticao] = useState<ResultadoCerimoniaParticao | null>(null);
  const [copiadoIndice, setCopiadoIndice] = useState<number | null>(null);
  const [erroParticao, setErroParticao] = useState<string | null>(null);

  // Estados de Recomposição
  const [custodianteA, setCustodianteA] = useState<number>(1);
  const [shareHexA, setShareHexA] = useState('');
  const [custodianteB, setCustodianteB] = useState<number>(2);
  const [shareHexB, setShareHexB] = useState('');
  const [resultadoRecomposicao, setResultadoRecomposicao] = useState<ResultadoRecomposicaoChave | null>(null);

  // Fecha no Escape
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') aoFechar();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [aoFechar]);

  function handleGerarSegredoAleatorio() {
    const array = new Uint8Array(32);
    if (typeof window !== 'undefined' && window.crypto) {
      window.crypto.getRandomValues(array);
    }
    const hex = Array.from(array)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
    setSegredoInput(`UEMG-CARANGOLA-MASTER-KEK-2026-${hex.substring(0, 24)}`);
  }

  async function handleExecutarParticao() {
    setErroParticao(null);
    try {
      if (!segredoInput.trim()) {
        setErroParticao('Informe a chave mestre ou gere um segredo institucional.');
        return;
      }
      const resultado = await executarCerimoniaParticaoShamir(segredoInput.trim());
      setResultadoParticao(resultado);
    } catch (e: any) {
      setErroParticao(e?.message || 'Erro ao processar cerimônia matemática.');
    }
  }

  function handleCopiarFragmento(fragmento: FragmentoChaveShamir) {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(fragmento.shareHex);
      setCopiadoIndice(fragmento.indice);
      setTimeout(() => setCopiadoIndice(null), 3000);
    }
  }

  function handleCarregarFragmentosPredefinidosParaTeste(resultado: ResultadoCerimoniaParticao) {
    // Carrega fragmentos 1 e 3 automaticamente para teste rápido da recomposição
    setCustodianteA(1);
    setShareHexA(resultado.fragmentos[0].shareHex);
    setCustodianteB(3);
    setShareHexB(resultado.fragmentos[2].shareHex);
    setAbaAtiva('recomposicao');
  }

  function handleExecutarRecomposicao() {
    setResultadoRecomposicao(null);
    const res = recomporSegredoDeFragmentos([
      { indice: custodianteA, shareHex: shareHexA },
      { indice: custodianteB, shareHex: shareHexB },
    ]);
    setResultadoRecomposicao(res);
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cerimonia-modal-titulo"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/75 p-4 sm:p-6 overflow-y-auto backdrop-blur-xs animate-fade-in"
    >
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden">
        {/* Cabeçalho do Modal */}
        <div className="bg-slate-50 border-b border-slate-200 p-6 flex items-center justify-between">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-[#0B3B60]">
              <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Hard Box DNA #4 • Shamir Secret Sharing (2-de-3)</span>
            </div>
            <h2 id="cerimonia-modal-titulo" className="text-xl font-bold text-slate-900">
              Cerimônia de Custódia Compartilhada & Continuidade Administrativa
            </h2>
            <p className="text-xs text-slate-500">
              Divisão matemática incondicional da chave mestra do Gabinete entre Direção, Secretaria e Congregação.
            </p>
          </div>
          <button
            type="button"
            onClick={aoFechar}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-200 transition-colors"
            aria-label="Fechar modal"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Abas */}
        <div className="border-b border-slate-200 px-6 flex gap-2 pt-3 bg-white">
          <button
            type="button"
            onClick={() => setAbaAtiva('particao')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 ${
              abaAtiva === 'particao'
                ? 'border-[#0B3B60] text-[#0B3B60]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Users className="w-4 h-4" aria-hidden="true" />
            <span>1. Partição em 3 Custodiantes (k=2)</span>
          </button>
          <button
            type="button"
            onClick={() => setAbaAtiva('recomposicao')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 ${
              abaAtiva === 'recomposicao'
                ? 'border-[#0B3B60] text-[#0B3B60]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Unlock className="w-4 h-4" aria-hidden="true" />
            <span>2. Recomposição por Quórum (2-de-3)</span>
          </button>
        </div>

        {/* Conteúdo com Scroll */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {abaAtiva === 'particao' ? (
            <div className="space-y-6">
              {/* Formulário de entrada da chave mestra */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <label htmlFor="segredo-mestre-input" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Chave Mestre Institucional a ser Particionada:
                  </label>
                  <button
                    type="button"
                    onClick={handleGerarSegredoAleatorio}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold text-[#0B3B60] bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Gerar Chave de Teste da Unidade</span>
                  </button>
                </div>

                <textarea
                  id="segredo-mestre-input"
                  rows={2}
                  value={segredoInput}
                  onChange={(e) => setSegredoInput(e.target.value)}
                  placeholder="Insira a chave mestra em texto claro (PEM RSA ou token de alta entropia)..."
                  className="w-full bg-white border border-slate-300 rounded-xl p-3 text-xs font-mono text-slate-800 focus:ring-2 focus:ring-[#0B3B60] focus:outline-none"
                />

                {erroParticao && (
                  <p className="text-xs font-bold text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-200">
                    {erroParticao}
                  </p>
                )}

                <button
                  type="button"
                  onClick={handleExecutarParticao}
                  className="w-full py-2.5 bg-[#0B3B60] hover:bg-[#0056B3] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
                >
                  <Key className="w-4 h-4" aria-hidden="true" />
                  <span>Executar Cerimônia de Partição Matemática em GF(2^8)</span>
                </button>
              </div>

              {/* Resultado da Partição com os 3 Custodiantes */}
              {resultadoParticao && (
                <div className="space-y-4 animate-fade-in">
                  <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 text-emerald-900 px-4 py-3 rounded-xl text-xs">
                    <span className="font-bold flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-700" aria-hidden="true" />
                      Cerimônia Concluída com Sucesso! 3 fragmentos matemáticos gerados em memória RAM.
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCarregarFragmentosPredefinidosParaTeste(resultadoParticao)}
                      className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold transition-colors"
                    >
                      Testar Recomposição (Quórum 1 + 3) &rarr;
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {resultadoParticao.fragmentos.map((f) => (
                      <div
                        key={f.indice}
                        className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-3 flex flex-col justify-between"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                            <span className="text-[11px] font-black uppercase tracking-wider text-slate-500">
                              Custodiante #{f.indice}
                            </span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-[#0B3B60]">
                              x = {f.indice}
                            </span>
                          </div>
                          <h4 className="text-xs font-bold text-slate-800">
                            {f.tituloInstitucional}
                          </h4>
                          <div className="bg-slate-50 p-2 rounded-lg border border-slate-200 space-y-1">
                            <span className="text-[10px] text-slate-400 block font-semibold">
                              Fragmento Hex:
                            </span>
                            <p className="font-mono text-[10px] text-slate-700 break-all line-clamp-3">
                              {f.shareHex}
                            </p>
                          </div>
                          <span className="text-[9px] font-mono text-slate-400 block truncate">
                            SHA-256: {f.comprovanteHash.substring(0, 16)}...
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleCopiarFragmento(f)}
                          className="w-full mt-2 py-1.5 px-3 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 transition-colors flex items-center justify-center gap-1.5"
                        >
                          {copiadoIndice === f.indice ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
                              <span>Copiado!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
                              <span>Copiar Fragmento</span>
                            </>
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Recomposição por Quórum */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                <div className="space-y-1">
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Reconstituição da Chave Mestra por Interpolação de Lagrange em x=0
                  </h3>
                  <p className="text-xs text-slate-500">
                    Insira os fragmentos de pelo menos 2 custodiantes distintos para atingir o quórum de recuperação.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Custodiante 1 */}
                  <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                    <label htmlFor="select-custodiante-a" className="text-xs font-bold text-slate-700 block">
                      Primeiro Custodiante Presente:
                    </label>
                    <select
                      id="select-custodiante-a"
                      value={custodianteA}
                      onChange={(e) => setCustodianteA(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-bold text-slate-800"
                    >
                      {CUSTODIANTES_INSTITUCIONAIS.map((c) => (
                        <option key={c.indiceX} value={c.indiceX}>
                          Custodiante #{c.indiceX} ({c.tituloInstitucional})
                        </option>
                      ))}
                    </select>
                    <textarea
                      rows={3}
                      value={shareHexA}
                      onChange={(e) => setShareHexA(e.target.value)}
                      placeholder="Cole o fragmento Hex do primeiro custodiante..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-[11px] font-mono text-slate-800"
                    />
                  </div>

                  {/* Custodiante 2 */}
                  <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                    <label htmlFor="select-custodiante-b" className="text-xs font-bold text-slate-700 block">
                      Segundo Custodiante Presente:
                    </label>
                    <select
                      id="select-custodiante-b"
                      value={custodianteB}
                      onChange={(e) => setCustodianteB(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-bold text-slate-800"
                    >
                      {CUSTODIANTES_INSTITUCIONAIS.map((c) => (
                        <option key={c.indiceX} value={c.indiceX}>
                          Custodiante #{c.indiceX} ({c.tituloInstitucional})
                        </option>
                      ))}
                    </select>
                    <textarea
                      rows={3}
                      value={shareHexB}
                      onChange={(e) => setShareHexB(e.target.value)}
                      placeholder="Cole o fragmento Hex do segundo custodiante..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-[11px] font-mono text-slate-800"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleExecutarRecomposicao}
                  disabled={!shareHexA || !shareHexB}
                  className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
                >
                  <Unlock className="w-4 h-4" aria-hidden="true" />
                  <span>Atestar Quórum & Recompor Segredo Original</span>
                </button>
              </div>

              {/* Resultado da Recomposição */}
              {resultadoRecomposicao && (
                <div className="animate-fade-in space-y-3">
                  {resultadoRecomposicao.sucesso ? (
                    <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-5 space-y-2">
                      <div className="flex items-center gap-2 text-emerald-950 font-bold text-xs">
                        <Check className="w-4 h-4 text-emerald-700" aria-hidden="true" />
                        <span>Chave Reconstruída com Sucesso pelo Quórum Qualificado!</span>
                      </div>
                      <p className="text-xs text-emerald-800">
                        Custodiantes que assinaram a restauração: {resultadoRecomposicao.custodiantesPresentes.join(', ')}.
                      </p>
                      <div className="bg-white p-3.5 rounded-xl border border-emerald-200 mt-2">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                          Conteúdo Integral Recomposto em Memória RAM:
                        </span>
                        <p className="font-mono text-xs text-slate-900 break-all select-all mt-1">
                          {resultadoRecomposicao.chaveReconstruida}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-red-50 border border-red-300 rounded-2xl p-4 text-xs text-red-900 flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-700 shrink-0 mt-0.5" aria-hidden="true" />
                      <div>
                        <span className="font-bold block">Falha na Recomposição:</span>
                        <span>{resultadoRecomposicao.mensagemErro}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Rodapé do Modal */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-between text-xs text-slate-500">
          <span>Gabinete da Direção Geral • UEMG Carangola</span>
          <button
            type="button"
            onClick={aoFechar}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
