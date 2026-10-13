'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { obterArtigosConsolidados } from '@/lib/data/mock-articles';
import { Artigo, StatusArtigo } from '@/types/editorial';
import { StatusBadge } from '@/components/editorial/StatusBadge';
import { CourseBadge } from '@/components/editorial/CourseBadge';
import {
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileText,
  ExternalLink,
  BookOpen,
  ChevronRight,
  UserCog,
  LogOut,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

function MeusArtigosConteudo() {
  const router = useRouter();
  const { user, perfil, isLoading, signOut } = useAuth();
  const searchParams = useSearchParams();
  const acabouDeSubmeter = searchParams.get('status') === 'sucesso';

  const [artigos, setArtigos] = useState<Artigo[]>([]);
  const [filtroStatus, setFiltroStatus] = useState<'todos' | StatusArtigo>('todos');

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login?redirectTo=/meus-artigos');
      return;
    }

    if (!user) {
      setArtigos([]);
      return;
    }

    const todos = obterArtigosConsolidados();
    const userId = user.id;
    const userEmail = user.email?.toLowerCase().trim();
    const userNome = (perfil?.nome_completo || (user.user_metadata?.nome_completo as string) || '').toLowerCase().trim();
    const userMatricula = (perfil?.matricula || (user.user_metadata?.matricula as string) || '').toLowerCase().trim();

    // Filtra exclusivamente os artigos pertencentes a este docente/autor
    const meus = todos.filter((a) => {
      if (a.autorId && a.autorId === userId) return true;
      if (a.autorEmail && userEmail && a.autorEmail.toLowerCase().trim() === userEmail) return true;
      if (userMatricula && a.autorMatricula && a.autorMatricula.toLowerCase().trim() === userMatricula) return true;
      if (userNome && a.autorNome && a.autorNome.toLowerCase().trim() === userNome) return true;
      return false;
    });

    setArtigos(meus);
  }, [user, perfil, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-500 text-xs">
        <div className="w-6 h-6 border-2 border-[#0B3B60] border-t-transparent rounded-full animate-spin mb-3" />
        <span>Verificando credenciais de acesso...</span>
      </div>
    );
  }

  // Filtragem
  const artigosFiltrados = artigos.filter((a) => {
    if (filtroStatus === 'todos') return true;
    return a.status === filtroStatus;
  });

  // Métricas
  const totalSubmetidos = artigos.filter((a) => a.status === 'submetido').length;
  const totalEmRevisao = artigos.filter((a) => a.status === 'em_revisao').length;
  const totalPublicados = artigos.filter((a) => a.status === 'publicado' || !a.status).length;

  return (
    <div className="space-y-8">
      {/* Banner de Sucesso pós-submissão */}
      {acabouDeSubmeter && (
        <div
          role="status"
          aria-live="polite"
          className="bg-emerald-50 border border-emerald-300 p-4 rounded-xl flex items-center justify-between text-emerald-900 shadow-sm animate-fade-in"
        >
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" aria-hidden="true" />
            <div>
              <p className="font-bold text-sm">Artigo submetido com sucesso!</p>
              <p className="text-xs text-emerald-700">
                Sua publicação entrou na fila monocrática da Coordenação de Curso. O status é atualizado aqui em tempo real.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Topo do Painel */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-[#0B3B60] mb-2">
            <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
            Área do Autor • UEMG Carangola
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B3B60] tracking-tight">
            Meus Artigos & Submissões
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Acompanhamento 100% In-App (Zero-Email) da sua produção intelectual na unidade.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <Link
            href="/restrito/perfil"
            id="btn-meus-dados-autor"
            className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#0B3B60] border border-slate-300/80 font-bold text-sm shadow-2xs transition-all whitespace-nowrap"
            title="Visualizar ou editar meus dados cadastrais"
          >
            <UserCog className="w-4 h-4 text-[#0056B3]" aria-hidden="true" />
            <span>Meus Dados</span>
          </Link>

          <button
            type="button"
            onClick={() => signOut()}
            id="btn-sair-autor"
            className="inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-xs transition-all whitespace-nowrap cursor-pointer"
            title="Encerrar sessão com segurança"
          >
            <LogOut className="w-4 h-4 text-white" aria-hidden="true" />
            <span>Sair</span>
          </button>

          <Link
            href="/meus-artigos/novo"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#0B3B60] hover:bg-[#0056B3] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all shrink-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0056B3]"
          >
            <PlusCircle className="w-5 h-5" aria-hidden="true" />
            <span>Nova Submissão</span>
          </Link>
        </div>
      </div>

      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Aguardando Avaliação</span>
            <Clock className="w-4 h-4 text-amber-600" aria-hidden="true" />
          </div>
          <p className="text-2xl font-black text-slate-800">{totalSubmetidos}</p>
          <p className="text-[11px] text-slate-500 mt-1">Na fila de 1 clique do Coordenador</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Ajustes Solicitados</span>
            <AlertTriangle className="w-4 h-4 text-orange-600" aria-hidden="true" />
          </div>
          <p className="text-2xl font-black text-slate-800">{totalEmRevisao}</p>
          <p className="text-[11px] text-slate-500 mt-1">Requerem apontamentos do autor</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Artigos Publicados</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" aria-hidden="true" />
          </div>
          <p className="text-2xl font-black text-slate-800">{totalPublicados}</p>
          <p className="text-[11px] text-slate-500 mt-1">Acessíveis ao público na vitrine</p>
        </div>
      </div>

      {/* Filtros por Pílulas */}
      <nav aria-label="Filtrar por status" className="flex flex-wrap items-center gap-2 bg-white p-2 rounded-xl border border-slate-200">
        <span className="text-xs font-bold text-slate-500 px-3">Filtrar por:</span>
        {(
          [
            { id: 'todos', rotulo: 'Todos' },
            { id: 'submetido', rotulo: 'Aguardando Avaliação' },
            { id: 'em_revisao', rotulo: 'Com Ajustes' },
            { id: 'publicado', rotulo: 'Publicados' },
            { id: 'rejeitado', rotulo: 'Rejeitados' },
          ] as const
        ).map((item) => (
          <button
            key={item.id}
            onClick={() => setFiltroStatus(item.id)}
            aria-pressed={filtroStatus === item.id}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filtroStatus === item.id
                ? 'bg-[#0B3B60] text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {item.rotulo}
          </button>
        ))}
      </nav>

      {/* Listagem de Artigos */}
      <div className="space-y-4">
        {artigosFiltrados.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" aria-hidden="true" />
            <h3 className="text-base font-bold text-slate-700">Nenhum artigo encontrado</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Não há trabalhos correspondentes ao filtro selecionado. Inicie uma nova submissão para publicar sua pesquisa.
            </p>
            <Link
              href="/meus-artigos/novo"
              className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0B3B60] text-white text-xs font-bold hover:bg-[#0056B3] transition-colors"
            >
              <PlusCircle className="w-4 h-4" aria-hidden="true" />
              Nova Submissão
            </Link>
          </div>
        ) : (
          artigosFiltrados.map((artigo) => (
            <article
              key={artigo.id}
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <CourseBadge curso={artigo.curso} />
                  <StatusBadge status={artigo.status} />
                  <span className="text-xs text-slate-500 font-medium">• {artigo.dataPublicacao}</span>
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {artigo.titulo}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {artigo.resumo}
                </p>

                {/* Notas de revisão se houver */}
                {artigo.notasRevisao && (
                  <div className="bg-amber-50 border border-amber-300 rounded-lg p-3 text-xs text-amber-950 mt-2">
                    <p className="font-bold flex items-center gap-1.5 text-amber-900">
                      <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" aria-hidden="true" />
                      Despacho da Coordenação de Curso:
                    </p>
                    <p className="mt-1 text-slate-800 italic font-mono bg-white/80 p-2 rounded border border-amber-200">
                      &ldquo;{artigo.notasRevisao}&rdquo;
                    </p>
                  </div>
                )}

                <div className="text-[11px] text-slate-500 pt-1">
                  Autor(a): <strong className="text-slate-800">{artigo.autorNome}</strong>
                  {artigo.autorMatricula && (
                    <span> (Matrícula: {artigo.autorMatricula})</span>
                  )}
                </div>
              </div>

              {/* Ações */}
              <div className="flex items-center gap-2 shrink-0 border-t md:border-t-0 pt-3 md:pt-0">
                {artigo.status === 'publicado' || !artigo.status ? (
                  <Link
                    href={`/artigos/${artigo.slug}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-50 text-[#0056B3] hover:bg-blue-100 text-xs font-bold transition-colors"
                  >
                    Ver no Portal
                    <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                  </Link>
                ) : artigo.status === 'em_revisao' ? (
                  <Link
                    href="/meus-artigos/novo"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-600 text-white hover:bg-amber-700 text-xs font-bold transition-colors shadow-sm"
                  >
                    Revisar & Reenviar
                    <ChevronRight className="w-4 h-4" aria-hidden="true" />
                  </Link>
                ) : (
                  <span className="text-xs font-medium text-slate-400 italic">
                    Aguardando deliberação
                  </span>
                )}
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}

export default function MeusArtigosPage() {
  return (
    <div className="min-h-screen bg-[#F7F9FC] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <Suspense
          fallback={
            <div className="flex items-center justify-center p-12 text-slate-400 text-xs">
              <div className="w-5 h-5 border-2 border-[#0B3B60] border-t-transparent rounded-full animate-spin mr-2" />
              Carregando painel de artigos...
            </div>
          }
        >
          <MeusArtigosConteudo />
        </Suspense>
      </div>
    </div>
  );
}
