'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ProtocoloInterno,
  StatusProtocolo,
  TipoManifestacao,
  DespachoDirecaoInput,
} from '@/types/ouvidoria';
import { SiglaCurso } from '@/types/editorial';
import { CURSOS_LISTA } from '@/lib/data/mock-articles';
import {
  obterProtocolosArmazenados,
  aplicarDespachoDirecao,
} from '@/lib/data/mock-ouvidoria';
import { CourseBadge } from '@/components/editorial/CourseBadge';
import {
  OuvidoriaTipoBadge,
  OuvidoriaStatusBadge,
} from '@/components/ouvidoria/OuvidoriaBadge';
import GabineteDespachoModal from '@/components/ouvidoria/GabineteDespachoModal';
import {
  ShieldCheck,
  Building,
  Search,
  Filter,
  CheckCircle,
  Clock,
  Lock,
  User,
  ExternalLink,
  Scale,
  Award,
  Layers,
  FileText,
  AlertCircle,
  Eye,
  Key,
} from 'lucide-react';
import { PushNotificationToggle } from '@/components/seguranca/PushNotificationToggle';

export default function GabineteOuvidoriaPage() {
  const [protocolos, setProtocolos] = useState<ProtocoloInterno[]>([]);
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState<'todos' | 'pendentes' | 'em_analise' | 'respondidos' | 'homologados'>('todos');
  const [filtroCurso, setFiltroCurso] = useState<string>('TODOS');
  const [protocoloEmAcao, setProtocoloEmAcao] = useState<ProtocoloInterno | null>(null);
  const [mensagemSucesso, setMensagemSucesso] = useState<string | null>(null);

  function carregarProtocolos() {
    setProtocolos(obterProtocolosArmazenados());
  }

  useEffect(() => {
    carregarProtocolos();
  }, []);

  function handleConfirmarDespacho(dados: DespachoDirecaoInput) {
    const atualizado = aplicarDespachoDirecao(
      dados.protocoloId,
      dados.acao,
      dados.despachoOficial,
      dados.numeroPortaria,
      dados.resumoSanitizadoMural
    );

    if (atualizado) {
      setMensagemSucesso(
        `Despacho aplicado com sucesso para o protocolo ${atualizado.codigoProtocolo}! Status: ${atualizado.status}`
      );
      setProtocoloEmAcao(null);
      carregarProtocolos();
      setTimeout(() => setMensagemSucesso(null), 6000);
    }
  }

  // Métricas
  const totalProtocolos = protocolos.length;
  const pendentes = protocolos.filter((p) => p.status === 'pendente').length;
  const emAnalise = protocolos.filter(
    (p) => p.status === 'em_analise_assessoria' || p.status === 'em_analise_diretoria'
  ).length;
  const respondidos = protocolos.filter((p) => p.status === 'respondido_privado').length;
  const homologados = protocolos.filter((p) => p.status === 'homologado_publico').length;

  // Filtragem
  const protocolosFiltrados = protocolos.filter((p) => {
    // Busca textual
    const termo = busca.toLowerCase();
    const bateTexto =
      !busca ||
      p.codigoProtocolo.toLowerCase().includes(termo) ||
      p.tipo.toLowerCase().includes(termo) ||
      (p.despachoOficial && p.despachoOficial.toLowerCase().includes(termo)) ||
      (p.numeroPortaria && p.numeroPortaria.toLowerCase().includes(termo));

    if (!bateTexto) return false;

    // Filtro por curso
    if (filtroCurso !== 'TODOS') {
      if (p.cursoSigla !== filtroCurso) return false;
    }

    // Filtro por aba de status
    if (filtroStatus === 'pendentes') return p.status === 'pendente';
    if (filtroStatus === 'em_analise') {
      return p.status === 'em_analise_assessoria' || p.status === 'em_analise_diretoria';
    }
    if (filtroStatus === 'respondidos') return p.status === 'respondido_privado';
    if (filtroStatus === 'homologados') return p.status === 'homologado_publico';

    return true;
  });


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
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mt-8 pt-6 border-t border-slate-100">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                Total
              </span>
              <span className="text-2xl font-black text-slate-900 mt-1 block">
                {totalProtocolos}
              </span>
            </div>

            <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200">
              <span className="text-xs font-semibold text-amber-800 uppercase tracking-wider block">
                Pendentes
              </span>
              <span className="text-2xl font-black text-amber-900 mt-1 block">
                {pendentes}
              </span>
            </div>

            <div className="bg-blue-50/60 p-4 rounded-xl border border-blue-200">
              <span className="text-xs font-semibold text-blue-800 uppercase tracking-wider block">
                Em Análise
              </span>
              <span className="text-2xl font-black text-blue-900 mt-1 block">
                {emAnalise}
              </span>
            </div>

            <div className="bg-teal-50/60 p-4 rounded-xl border border-teal-200">
              <span className="text-xs font-semibold text-teal-800 uppercase tracking-wider block">
                Respondidos
              </span>
              <span className="text-2xl font-black text-teal-900 mt-1 block">
                {respondidos}
              </span>
            </div>

            <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-200 col-span-2 sm:col-span-1">
              <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider block">
                Mural Público
              </span>
              <span className="text-2xl font-black text-emerald-900 mt-1 block">
                {homologados}
              </span>
            </div>
          </div>
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
              {[
                { id: 'todos', label: 'Todos', total: totalProtocolos },
                { id: 'pendentes', label: 'Pendentes', total: pendentes },
                { id: 'em_analise', label: 'Em Análise', total: emAnalise },
                { id: 'respondidos', label: 'Respondidos', total: respondidos },
                { id: 'homologados', label: 'Homologados', total: homologados },
              ].map((aba) => (
                <button
                  key={aba.id}
                  type="button"
                  onClick={() => setFiltroStatus(aba.id as any)}
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
            protocolosFiltrados.map((proto) => {
              return (
                <div
                  key={proto.id}
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:border-slate-300 transition-all space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-sm font-black text-[#0B3B60] bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
                        {proto.codigoProtocolo}
                      </span>

                      <OuvidoriaTipoBadge tipo={proto.tipo} />

                      {proto.cursoSigla !== 'GERAL' ? (
                        <CourseBadge
                          curso={{
                            sigla: proto.cursoSigla as SiglaCurso,
                            nome: `Curso de ${proto.cursoSigla}`,
                          }}
                        />
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                          <Building className="w-3 h-3 text-slate-500" aria-hidden="true" />
                          Administração Geral
                        </span>
                      )}

                      <OuvidoriaStatusBadge status={proto.status} />
                    </div>

                    <div className="text-xs text-slate-500 font-medium flex items-center gap-2">
                      <span>Criado em: {proto.criadoEm}</span>
                      {proto.isAnonimo ? (
                        <span className="inline-flex items-center gap-1 text-slate-600 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                          <Lock className="w-3 h-3 text-slate-500" aria-hidden="true" />
                          Manifestação Anônima
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-blue-700 bg-blue-50 px-2 py-0.5 rounded text-[11px]">
                          <User className="w-3 h-3 text-blue-500" aria-hidden="true" />
                          Manifestação Identificada
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Resumo do Conteúdo Cifrado e Despacho Existente */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-1">
                      <span className="font-bold text-slate-600 uppercase tracking-wider block flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-[#0B3B60]" aria-hidden="true" />
                        Envelope Criptográfico
                      </span>
                      <p className="font-mono text-[11px] text-slate-500 truncate">
                        Ciphertext: {proto.envelopeCifrado.ciphertextBase64.substring(0, 36)}...
                      </p>
                      <span className="text-[10px] text-slate-400 block">
                        Padrão: AES-GCM-256 (DEK cifrada com chave pública RSA-OAEP-4096)
                      </span>
                    </div>

                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-1">
                      <span className="font-bold text-slate-600 uppercase tracking-wider block flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-emerald-700" aria-hidden="true" />
                        Despacho Oficial / Portaria
                      </span>
                      {proto.despachoOficial ? (
                        <p className="text-slate-800 line-clamp-2">
                          {proto.despachoOficial}
                        </p>
                      ) : (
                        <p className="text-slate-400 italic">
                          Ainda sem despacho registrado pelo Gabinete.
                        </p>
                      )}
                      {proto.numeroPortaria && (
                        <span className="text-[10px] font-bold text-emerald-800 block">
                          {proto.numeroPortaria}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setProtocoloEmAcao(proto)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#0B3B60] hover:bg-[#0056B3] shadow-xs transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Descriptografar & Despachar</span>
                    </button>
                  </div>
                </div>
              );
            })
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
