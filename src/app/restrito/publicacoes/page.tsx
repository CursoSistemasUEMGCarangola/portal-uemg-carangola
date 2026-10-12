'use client';

import React from 'react';
import { CURSOS_LISTA } from '@/lib/data/mock-articles';
import { SiglaCurso } from '@/types/editorial';
import { CourseBadge } from '@/components/editorial/CourseBadge';
import EditorialDecisionModal from '@/components/editorial/EditorialDecisionModal';
import { ArtigoCuradoriaCard } from '@/components/editorial/ArtigoCuradoriaCard';
import { useCuradoriaEditorial } from '@/hooks/useCuradoriaEditorial';
import {
  ShieldCheck,
  CheckCircle,
  FileCheck,
  Building,
  Search,
} from 'lucide-react';
import { PushNotificationToggle } from '@/components/seguranca/PushNotificationToggle';

export default function PainelCoordenacaoPage() {
  const {
    cursoSelecionado,
    setCursoSelecionado,
    artigosFiltrados,
    filtroAba,
    setFiltroAba,
    busca,
    setBusca,
    artigoEmAcao,
    setArtigoEmAcao,
    acaoModal,
    setAcaoModal,
    mensagemSucesso,
    contadores,
    handleAprovar,
    handleConfirmarModal,
  } = useCuradoriaEditorial();

  const cursoInfo = CURSOS_LISTA.find((c) => c.sigla === cursoSelecionado);

  return (
    <div className="min-h-screen bg-[#F7F9FC] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Banner de Sucesso */}
        {mensagemSucesso && (
          <div
            role="status"
            aria-live="polite"
            className="bg-emerald-50 border border-emerald-300 p-4 rounded-xl flex items-center gap-3 text-emerald-900 shadow-sm animate-fade-in"
          >
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" aria-hidden="true" />
            <p className="text-xs sm:text-sm font-semibold">{mensagemSucesso}</p>
          </div>
        )}

        {/* Barra de Notificações e Modo Terminal */}
        <div className="flex justify-end">
          <PushNotificationToggle />
        </div>

        {/* Topo Institucional */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#0B3B60] text-white mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-300" aria-hidden="true" />
              Painel Monocrático da Coordenação • Rota Restrita
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B3B60] tracking-tight">
              Curadoria Editorial de Artigos
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Decisão em 1 clique sem burocracias colegiadas, com isolamento estrito por departamento (RLS).
            </p>
          </div>

          {/* Seletor Departamental de Simulação/Auditoria de RBAC */}
          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm shrink-0">
            <label
              htmlFor="seletor-departamento"
              className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1"
            >
              <Building className="w-3 h-3 text-[#0B3B60]" aria-hidden="true" />
              Departamento Moderado:
            </label>
            <select
              id="seletor-departamento"
              value={cursoSelecionado}
              onChange={(e) => setCursoSelecionado(e.target.value as SiglaCurso)}
              className="text-xs font-bold text-[#0B3B60] bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-[#0056B3] outline-none"
            >
              {CURSOS_LISTA.map((c) => (
                <option key={c.sigla} value={c.sigla}>
                  {c.sigla} — {c.nome}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Card do Departamento Ativo */}
        <div className="bg-white border-l-4 border-l-[#0B3B60] border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            {cursoInfo && <CourseBadge curso={cursoInfo} className="mb-1" />}
            <h2 className="text-lg font-bold text-slate-800 mt-1">{cursoInfo?.nome}</h2>
            <p className="text-xs text-slate-500 mt-0.5">{cursoInfo?.descricao}</p>
          </div>
          <div className="flex items-center gap-6 text-xs text-slate-600 shrink-0">
            <div>
              <span className="block font-bold text-base text-amber-700">
                {contadores.pendentes}
              </span>
              <span>Pendentes</span>
            </div>
            <div className="h-8 w-px bg-slate-200" aria-hidden="true" />
            <div>
              <span className="block font-bold text-base text-emerald-700">
                {contadores.publicados}
              </span>
              <span>Publicados</span>
            </div>
          </div>
        </div>

        {/* Barra de Ferramentas e Filtros */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200">
          <nav aria-label="Abas de moderação" className="flex items-center gap-2">
            <button
              onClick={() => setFiltroAba('pendentes')}
              aria-pressed={filtroAba === 'pendentes'}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filtroAba === 'pendentes'
                  ? 'bg-[#0B3B60] text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Fila de Decisão ({contadores.pendentes})
            </button>
            <button
              onClick={() => setFiltroAba('publicados')}
              aria-pressed={filtroAba === 'publicados'}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filtroAba === 'publicados'
                  ? 'bg-[#0B3B60] text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Homologados ({contadores.publicados})
            </button>
            <button
              onClick={() => setFiltroAba('todos')}
              aria-pressed={filtroAba === 'todos'}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filtroAba === 'todos'
                  ? 'bg-[#0B3B60] text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Todos ({contadores.todos})
            </button>
          </nav>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" aria-hidden="true" />
            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar autor ou título..."
              aria-label="Buscar autor ou título"
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0056B3] outline-none"
            />
          </div>
        </div>

        {/* Fila de Artigos */}
        <div className="space-y-4">
          {artigosFiltrados.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
              <FileCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" aria-hidden="true" />
              <h3 className="text-base font-bold text-slate-700">Fila limpa para este departamento</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Não há artigos pendentes de avaliação para {cursoInfo?.nome} neste momento.
              </p>
            </div>
          ) : (
            artigosFiltrados.map((artigo) => (
              <ArtigoCuradoriaCard
                key={artigo.id}
                artigo={artigo}
                aoAprovar={handleAprovar}
                aoAbrirAcaoModal={(art, acao) => {
                  setArtigoEmAcao(art);
                  setAcaoModal(acao);
                }}
              />
            ))
          )}
        </div>
      </div>

      {/* Modal de Decisão Editorial */}
      <EditorialDecisionModal
        artigo={artigoEmAcao}
        acao={acaoModal}
        aoFechar={() => {
          setArtigoEmAcao(null);
          setAcaoModal(null);
        }}
        aoConfirmar={handleConfirmarModal}
      />
    </div>
  );
}
