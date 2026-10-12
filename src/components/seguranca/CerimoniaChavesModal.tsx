'use client';

import React, { useEffect, useState } from 'react';
import { CUSTODIANTES_INSTITUCIONAIS } from '@/lib/crypto/shamir-secret-sharing';
import { useCerimoniaShamir } from '@/hooks/useCerimoniaShamir';
import {
  Key,
  ShieldCheck,
  Users,
  Copy,
  Check,
  Unlock,
  AlertTriangle,
  X,
  FileCheck,
  RefreshCw,
  Building,
  FlaskConical,
} from 'lucide-react';

interface CerimoniaChavesModalProps {
  aoFechar: () => void;
}

export default function CerimoniaChavesModal({ aoFechar }: CerimoniaChavesModalProps) {
  const [modoCerimonia, setModoCerimonia] = useState<'oficial' | 'simulacao'>('oficial');

  const {
    abaAtiva,
    setAbaAtiva,
    segredoInput,
    setSegredoInput,
    resultadoParticao,
    copiadoIndice,
    erroParticao,
    handleGerarSegredoAleatorio,
    handleExecutarParticao,
    handleCopiarFragmento,
    handleCarregarFragmentosPredefinidosParaTeste,
    custodianteA,
    setCustodianteA,
    shareHexA,
    setShareHexA,
    custodianteB,
    setCustodianteB,
    shareHexB,
    setShareHexB,
    resultadoRecomposicao,
    handleExecutarRecomposicao,
  } = useCerimoniaShamir();

  // Acessibilidade: Fecha no Escape
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') aoFechar();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [aoFechar]);

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
              Divisão matemática incondicional da chave mestra do Gabinete entre Direção, Vice-Direção e Secretaria Acadêmica.
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
              {/* Barra de Seleção de Modo (Oficial vs Simulação) */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Regime:</span>
                  <div className="inline-flex rounded-xl p-1 bg-slate-200/80 border border-slate-300">
                    <button
                      type="button"
                      onClick={() => setModoCerimonia('oficial')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                        modoCerimonia === 'oficial'
                          ? 'bg-[#0B3B60] text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Building className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Modo Oficial</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setModoCerimonia('simulacao');
                        if (!segredoInput) handleGerarSegredoAleatorio();
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                        modoCerimonia === 'simulacao'
                          ? 'bg-amber-600 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <FlaskConical className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Modo Simulação</span>
                    </button>
                  </div>
                </div>

                {/* Selo Identificador do Modo */}
                {modoCerimonia === 'oficial' ? (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-[#0B3B60] border border-blue-300 self-start sm:self-auto">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#0056B3]" aria-hidden="true" />
                    <span>Selo Oficial • Ato Solene Institucional</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 self-start sm:self-auto">
                    <FlaskConical className="w-3.5 h-3.5 text-amber-700" aria-hidden="true" />
                    <span>Selo de Simulação • Testes de Laboratório</span>
                  </div>
                )}
              </div>

              {/* Mensagem Pertinente ao Modo Selecionado */}
              {modoCerimonia === 'oficial' ? (
                <div className="bg-blue-50/70 border border-blue-200 text-[#0B3B60] p-4 rounded-xl text-xs space-y-2">
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <Building className="w-4 h-4 text-[#0056B3]" aria-hidden="true" />
                    <span>Diretriz do Modo Oficial (Ato de Posse e Gestão):</span>
                  </div>
                  <p className="leading-relaxed text-slate-700">
                    A Cerimônia Oficial de Chaves é realizada <strong>uma única vez por mandato</strong> com a Chave Mestra autêntica do Gabinete e registrada em <strong>Ata de Custódia Compartilhada</strong> assinada pela Direção, Vice-Direção e Secretaria Acadêmica.
                  </p>
                  <p className="text-[11px] font-semibold text-amber-900 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
                    ⚠️ <strong>Atenção Institucional:</strong> A geração de uma nova partição matemática substitui e invalida permanentemente os fragmentos de sessões anteriores. As cédulas emitidas aqui devem ser lacradas e arquivadas em cofre institucional.
                  </p>
                </div>
              ) : (
                <div className="bg-amber-50/70 border border-amber-200 text-amber-950 p-4 rounded-xl text-xs space-y-2">
                  <div className="flex items-center gap-2 font-bold text-sm text-amber-900">
                    <AlertTriangle className="w-4 h-4 text-amber-700" aria-hidden="true" />
                    <span>Ambiente de Demonstração e Aprendizado (Sandbox):</span>
                  </div>
                  <p className="leading-relaxed text-slate-700">
                    Este modo gera chaves voláteis aleatórias em memória RAM. Serve exclusivamente para auditar, simular e comprovar o funcionamento matemático do algoritmo de Shamir (k=2, N=3) sem afetar a chave real da instituição.
                  </p>
                  <p className="text-[11px] font-semibold text-slate-600 bg-white/80 p-2.5 rounded-lg border border-amber-200">
                    ℹ️ Os fragmentos gerados neste modo são efêmeros para teste e <strong>não possuem validade legal</strong> perante a Ata de Posse da Unidade.
                  </p>
                </div>
              )}

              {/* Formulário de entrada da chave mestra */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <label htmlFor="segredo-mestre-input" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    {modoCerimonia === 'oficial'
                      ? 'Chave Mestra Oficial do Gabinete:'
                      : 'Chave Efêmera de Simulação (Teste):'}
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setModoCerimonia('simulacao');
                      handleGerarSegredoAleatorio();
                    }}
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
                  placeholder={
                    modoCerimonia === 'oficial'
                      ? 'Insira a Chave Mestra Oficial do Gabinete da Direção (PEM RSA ou token de alta entropia)...'
                      : 'Chave de teste gerada aleatoriamente para homologação técnica...'
                  }
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
                  className={`w-full py-2.5 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 ${
                    modoCerimonia === 'oficial'
                      ? 'bg-[#0B3B60] hover:bg-[#0056B3]'
                      : 'bg-amber-600 hover:bg-amber-700'
                  }`}
                >
                  <Key className="w-4 h-4" aria-hidden="true" />
                  <span>
                    {modoCerimonia === 'oficial'
                      ? 'Executar Cerimônia de Partição Oficial em GF(256)'
                      : 'Executar Partição de Simulação em GF(256)'}
                  </span>
                </button>
              </div>

              {/* Resultado da Partição com os 3 Custodiantes */}
              {resultadoParticao && (
                <div className="space-y-4 animate-fade-in">
                  <div className="flex items-center justify-between flex-wrap gap-2 bg-emerald-50 border border-emerald-200 text-emerald-900 px-4 py-3 rounded-xl text-xs">
                    <span className="font-bold flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-700" aria-hidden="true" />
                      {modoCerimonia === 'oficial'
                        ? 'Cerimônia Oficial Concluída! 3 Cédulas Institucionais emitidas em memória RAM.'
                        : 'Simulação Concluída! 3 fragmentos de teste gerados para verificação técnica.'}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCarregarFragmentosPredefinidosParaTeste(resultadoParticao)}
                      className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold transition-colors"
                    >
                      Testar Recomposição (Quórum 1 + 3) &rarr;
                    </button>
                  </div>

                  {modoCerimonia === 'oficial' ? (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-[#0B3B60] flex items-center gap-2">
                      <FileCheck className="w-4 h-4 text-[#0056B3] shrink-0" />
                      <span>
                        <strong>Guarda de Ata de Posse:</strong> Cada um dos 3 custodiantes oficiais deve copiar e lacrar individualmente sua cédula exclusiva.
                      </span>
                    </div>
                  ) : (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                      <span>
                        <strong>Fragmentos Efêmeros de Simulação:</strong> Estes dados servem exclusivamente para demonstração do algoritmo de Shamir. Não arquive em ata solene.
                      </span>
                    </div>
                  )}

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
                        Custodiantes que assinaram a restauração:{' '}
                        {resultadoRecomposicao.custodiantesPresentes
                          .map((p) =>
                            p === 'direcao'
                              ? 'Direção'
                              : p === 'vice_direcao'
                              ? 'Vice-Direção'
                              : 'Secretaria Acadêmica'
                          )
                          .join(', ')}
                        .
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
