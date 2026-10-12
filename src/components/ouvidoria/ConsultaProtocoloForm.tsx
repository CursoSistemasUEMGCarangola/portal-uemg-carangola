'use client';

import React from 'react';
import {
  Search,
  Lock,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Building,
  Calendar,
  ShieldCheck,
} from 'lucide-react';
import { OuvidoriaTipoBadge } from '@/components/ouvidoria/OuvidoriaBadge';
import { ProtocoloTimeline } from '@/components/ouvidoria/ProtocoloTimeline';
import { useConsultaProtocolo } from '@/hooks/useConsultaProtocolo';

export default function ConsultaProtocoloForm() {
  const {
    codigoProtocolo,
    setCodigoProtocolo,
    tokenSecreto,
    setTokenSecreto,
    consultando,
    resultado,
    handleSubmit,
  } = useConsultaProtocolo();

  return (
    <div className="space-y-8">
      {/* Formulário de Busca por Dupla Chave */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h2 className="text-lg font-bold text-[#0B3B60] flex items-center gap-2">
            <Search className="w-5 h-5 text-[#0056B3]" aria-hidden="true" />
            Consulta por Dupla Chave Institucional
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Informe o número de protocolo e o token secreto emitidos no momento da sua manifestação.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="codigoProtocolo" className="block text-xs font-semibold text-slate-700 mb-1">
              Código do Protocolo *
            </label>
            <input
              id="codigoProtocolo"
              type="text"
              required
              value={codigoProtocolo}
              onChange={(e) => setCodigoProtocolo(e.target.value)}
              placeholder="Ex: #CAR-2026-8942"
              className="w-full px-3 py-2.5 text-sm font-mono uppercase tracking-wider border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0056B3] outline-none"
            />
          </div>

          <div>
            <label htmlFor="tokenSecreto" className="block text-xs font-semibold text-slate-700 mb-1">
              Chave Secreta de Consulta (24 caracteres) *
            </label>
            <div className="relative">
              <input
                id="tokenSecreto"
                type="text"
                required
                value={tokenSecreto}
                onChange={(e) => setTokenSecreto(e.target.value)}
                placeholder="Ex: k7X9_mQ2vL81pZ40wT6bC8vN"
                className="w-full px-3 py-2.5 text-sm font-mono border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0056B3] outline-none"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-3" aria-hidden="true" />
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <span className="text-[11px] text-slate-500 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
            Proteção Anti-Enumeração: Consultas inválidas retornam 404 padronizado.
          </span>

          <button
            type="submit"
            disabled={consultando}
            className={`w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all ${
              consultando ? 'bg-slate-400 cursor-not-allowed' : 'bg-[#0B3B60] hover:bg-[#0056B3]'
            }`}
          >
            {consultando ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Verificando...
              </>
            ) : (
              <>
                <Search className="w-4 h-4" aria-hidden="true" />
                Consultar Protocolo
              </>
            )}
          </button>
        </div>
      </form>

      {/* Exibição do Resultado */}
      {resultado && (
        <div className="animate-fade-in">
          {resultado.encontrado ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
              {/* Topo do resultado */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Protocolo Verificado com Sucesso
                  </span>
                  <h3 className="text-2xl font-black text-[#0B3B60] font-mono mt-0.5">
                    {resultado.codigoProtocolo}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <OuvidoriaTipoBadge tipo={resultado.tipo!} />
                  {resultado.isAnonimo && (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                      Anônimo
                    </span>
                  )}
                </div>
              </div>

              {/* Linha do Tempo */}
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Trâmite da Manifestação
                </h4>
                <ProtocoloTimeline status={resultado.status} />
              </div>

              {/* Metadados */}
              <div className="bg-slate-50 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs border border-slate-200">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Data de Envio</span>
                  <span className="font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                    {resultado.dataEnvio}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Curso / Setor</span>
                  <span className="font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
                    <Building className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                    {resultado.cursoSigla}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Última Atualização</span>
                  <span className="font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                    {resultado.dataResposta || 'Aguardando'}
                  </span>
                </div>
              </div>

              {/* Despacho Oficial do Gabinete */}
              {resultado.despachoOficial ? (
                <div className="bg-emerald-50/60 border border-emerald-300 rounded-xl p-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-emerald-950 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700" aria-hidden="true" />
                      Despacho do Gabinete da Direção Geral
                    </h4>
                    {resultado.numeroPortaria && (
                      <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-white text-emerald-800 border border-emerald-300">
                        {resultado.numeroPortaria}
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-sans bg-white p-3.5 rounded-lg border border-emerald-200">
                    {resultado.despachoOficial}
                  </p>
                </div>
              ) : (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-900 flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-[#0B3B60] shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <strong className="block font-bold">Em processo de deliberação:</strong>
                    Sua manifestação foi recebida e está em triagem pela equipe do Gabinete. A resposta oficial será disponibilizada nesta mesma tela.
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div
              role="alert"
              className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center space-y-2"
            >
              <AlertTriangle className="w-10 h-10 text-red-600 mx-auto" aria-hidden="true" />
              <h3 className="text-base font-bold text-red-950">Registro Não Localizado (404)</h3>
              <p className="text-xs text-red-800 max-w-md mx-auto">
                {resultado.mensagemErro ||
                  'Nenhuma manifestação foi encontrada com a combinação exata de Protocolo e Chave Secreta fornecida.'}
              </p>
              <p className="text-[11px] text-slate-500 pt-1">
                Certifique-se de que o código começa com <code className="font-bold">#CAR-2026-</code> e que a chave de 24 caracteres foi digitada sem espaços adicionais.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
