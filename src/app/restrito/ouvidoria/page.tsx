'use client';

import React from 'react';
import Link from 'next/link';
import { CURSOS_LISTA } from '@/lib/data/mock-articles';
import GabineteDespachoModal from '@/components/ouvidoria/GabineteDespachoModal';
import { OuvidoriaMetricasCards } from '@/components/ouvidoria/OuvidoriaMetricasCards';
import { ProtocoloCardItem } from '@/components/ouvidoria/ProtocoloCardItem';
import { useGabineteOuvidoria, FiltroStatusGabinete } from '@/hooks/useGabineteOuvidoria';
import {
  ShieldCheck,
  Search,
  CheckCircle,
  Clock,
  ExternalLink,
  Scale,
  FileText,
  Key,
} from 'lucide-react';
import { PushNotificationToggle } from '@/components/seguranca/PushNotificationToggle';

export default function GabineteOuvidoriaPage() {
  const {
    protocolosFiltrados,
    busca,
    setBusca,
    filtroStatus,
    setFiltroStatus,
    filtroCurso,
    setFiltroCurso,
    protocoloEmAcao,
    setProtocoloEmAcao,
    mensagemSucesso,
    metricas,
    handleConfirmarDespacho,
  } = useGabineteOuvidoria();

  const abasStatus: { id: FiltroStatusGabinete; label: string; total: number }[] = [
    { id: 'todos', label: 'Todos', total: metricas.total },
    { id: 'pendentes', label: 'Pendentes', total: metricas.pendentes },
    { id: 'em_analise', label: 'Em Análise', total: metricas.emAnalise },
    { id: 'respondidos', label: 'Respondidos', total: metricas.respondidos },
    { id: 'homologados', label: 'Homologados', total: metricas.homologados },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Cabeçalho da Página */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-[#0B3B60]">
                <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Gabinete da Direção Geral • Ouvidoria Segura</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B3B60] tracking-tight">
                Painel do Gabinete da Direção
              </h1>
              <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
                Gestão com criptografia assimétrica de envelope, despacho oficial e homologação
                desacoplada para o Mural de Transparência da UEMG Carangola.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <PushNotificationToggle />
              <Link
                href="/restrito/cerimonia-chaves"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors"
              >
                <Key className="w-4 h-4 text-emerald-700" aria-hidden="true" />
                <span>Cerimônia de Chaves</span>
              </Link>
              <Link
                href="/mural-de-transparencia"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-[#0B3B60] bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors"
              >
                <Scale className="w-4 h-4 text-[#0056B3]" aria-hidden="true" />
                <span>Mural Público</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
              </Link>
              <Link
                href="/restrito/publicacoes"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors"
              >
                <FileText className="w-4 h-4 text-slate-600" aria-hidden="true" />
                <span>Painel de Publicações</span>
              </Link>
            </div>
          </div>

          {/* Cards de Métricas */}
          <OuvidoriaMetricasCards
            total={metricas.total}
            pendentes={metricas.pendentes}
            emAnalise={metricas.emAnalise}
            respondidos={metricas.respondidos}
            homologados={metricas.homologados}
          />
        </div>

        {/* Notificação de Sucesso */}
        {mensagemSucesso && (
          <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 px-5 py-4 rounded-xl flex items-start gap-3 shadow-sm animate-fade-in">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-sm font-medium">{mensagemSucesso}</p>
          </div>
        )}

        {/* Filtros e Controles */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Abas de Status */}
            <div className="flex flex-wrap gap-2">
              {abasStatus.map((aba) => (
                <button
                  key={aba.id}
                  type="button"
                  onClick={() => setFiltroStatus(aba.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                    filtroStatus === aba.id
                      ? 'bg-[#0B3B60] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <span>{aba.label}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                      filtroStatus === aba.id
                        ? 'bg-blue-900 text-white'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {aba.total}
                  </span>
                </button>
              ))}
            </div>

            {/* Filtro por Curso */}
            <div className="flex items-center gap-2">
              <label htmlFor="filtro-curso-ouvidoria" className="text-xs font-bold text-slate-600 whitespace-nowrap">
                Filtrar Curso:
              </label>
              <select
                id="filtro-curso-ouvidoria"
                value={filtroCurso}
                onChange={(e) => setFiltroCurso(e.target.value)}
                className="bg-slate-50 border border-slate-300 text-slate-800 text-xs rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-[#0B3B60] focus:outline-none"
              >
                <option value="TODOS">Todos os Cursos</option>
                <option value="GERAL">Administração Geral</option>
                {CURSOS_LISTA.map((c) => (
                  <option key={c.sigla} value={c.sigla}>
                    {c.sigla} - {c.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Campo de Busca Textual */}
          <div className="relative">
            <Search
              className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"
              aria-hidden="true"
            />
            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar por código de protocolo (#CAR-2026-...), tipo ou texto de despacho..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-800 focus:bg-white focus:border-[#0B3B60] focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Lista de Protocolos */}
        <div className="space-y-4">
          {protocolosFiltrados.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
              <Clock className="w-10 h-10 text-slate-400 mx-auto" aria-hidden="true" />
              <h3 className="text-base font-bold text-slate-800">
                Nenhum protocolo encontrado
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Não existem protocolos correspondentes aos filtros selecionados.
              </p>
            </div>
          ) : (
            protocolosFiltrados.map((proto) => (
              <ProtocoloCardItem
                key={proto.id}
                proto={proto}
                aoDespachar={setProtocoloEmAcao}
              />
            ))
          )}
        </div>
      </div>

      {/* Modal de Despacho e Descriptografia */}
      {protocoloEmAcao && (
        <GabineteDespachoModal
          protocolo={protocoloEmAcao}
          aoFechar={() => setProtocoloEmAcao(null)}
          aoConfirmar={handleConfirmarDespacho}
        />
      )}
    </div>
  );
}
