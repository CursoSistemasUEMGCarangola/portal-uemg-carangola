'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { podeAcessarGuia, normalizarRole, obterInfoPerfilAcesso } from '@/lib/auth/guias-access';
import {
  GraduationCap,
  FileText,
  UserCheck,
  Building2,
  ArrowRight,
  BookOpen,
  Lock,
  ShieldCheck,
  ShieldAlert,
  LogIn,
} from 'lucide-react';

const GUIAS_CARDS = [
  {
    slug: 'estudante',
    titulo: 'Guia do Estudante / Discente',
    perfilLabel: 'Estudante',
    descricao: 'Orientações para busca e leitura de artigos, geração de PDFs, submissão de trabalhos e ouvidoria cidadã.',
    icone: GraduationCap,
    corBadge: 'bg-sky-50 text-sky-800 border-sky-200',
    corIcone: 'text-sky-600 bg-sky-100',
  },
  {
    slug: 'docente',
    titulo: 'Guia do Professor / Docente',
    perfilLabel: 'Docente',
    descricao: 'Instruções para publicação científica, submissão de relatos de extensão, acompanhamento in-app e citações ABNT.',
    icone: FileText,
    corBadge: 'bg-indigo-50 text-indigo-800 border-indigo-200',
    corIcone: 'text-indigo-600 bg-indigo-100',
  },
  {
    slug: 'coordenador',
    titulo: 'Guia do Coordenador de Curso',
    perfilLabel: 'Coordenação',
    descricao: 'Instruções para curadoria editorial departamental em 1 clique, modais de ajustes e gestão de colegiado.',
    icone: UserCheck,
    corBadge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    corIcone: 'text-emerald-600 bg-emerald-100',
  },
  {
    slug: 'direcao',
    titulo: 'Guia do Gabinete da Direção',
    perfilLabel: 'Direção Geral',
    descricao: 'Orientações de governança institucional, análise de ouvidoria com decodificação em RAM, despacho sanitizado e custódia Shamir.',
    icone: Building2,
    corBadge: 'bg-blue-50 text-[#0B3B60] border-blue-200',
    corIcone: 'text-[#0B3B60] bg-blue-100',
  },
];

export function GuiasIndexView() {
  const { user, perfil, isLoading } = useAuth();

  const role = perfil?.role || (user?.user_metadata?.role as string) || null;
  const papel = normalizarRole(role);
  const info = obterInfoPerfilAcesso(role);
  const isAnonimo = !user;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Cabeçalho da Central */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-[#0B3B60] mb-3">
          <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Documentação Oficial UEMG Carangola</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0B3B60] tracking-tight mb-3">
          Guias de Uso do Sistema
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          Consulte normas de conformidade, fluxos da plataforma e procedimentos operacionais padronizados conforme o seu perfil institucional.
        </p>
      </div>

      {/* Banner de Identificação de Perfil e Autorização (RBAC) */}
      {!isLoading && (
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                papel === 'direcao'
                  ? 'bg-blue-100 text-[#0B3B60]'
                  : papel === 'coordenador'
                  ? 'bg-emerald-100 text-emerald-800'
                  : papel === 'docente'
                  ? 'bg-indigo-100 text-indigo-800'
                  : 'bg-sky-100 text-sky-800'
              }`}
            >
              {papel === 'direcao' ? (
                <ShieldCheck className="w-5 h-5" aria-hidden="true" />
              ) : isAnonimo ? (
                <GraduationCap className="w-5 h-5" aria-hidden="true" />
              ) : (
                <ShieldAlert className="w-5 h-5" aria-hidden="true" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Seu Perfil Atual:
                </span>
                <span className="text-xs font-extrabold text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                  {info.nomePerfil}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                {papel === 'direcao' ? (
                  <span className="text-emerald-700 font-semibold">
                    ✓ Prerrogativa executiva: acesso concedido a todos os 4 Guias de Uso.
                  </span>
                ) : isAnonimo ? (
                  <span>
                    Acesso exclusivo ao <strong>Guia do Estudante</strong>. Servidores devem entrar com sua conta institucional.
                  </span>
                ) : (
                  <span>
                    Acesso exclusivo ao <strong>{info.guiaPermitidoNome}</strong> conforme regulamento de governança.
                  </span>
                )}
              </p>
            </div>
          </div>

          {isAnonimo && (
            <Link
              href="/login?redirectTo=/guias"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#0B3B60] hover:bg-[#0056B3] text-white shadow-2xs transition-all shrink-0"
            >
              <LogIn className="w-4 h-4" aria-hidden="true" />
              <span>Login de Servidor</span>
            </Link>
          )}
        </div>
      )}

      {/* Grid de Cards dos 4 Guias */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {GUIAS_CARDS.map((card) => {
          const Icon = card.icone;
          const temAcesso = podeAcessarGuia(role, card.slug);

          if (temAcesso) {
            return (
              <Link
                key={card.slug}
                href={`/guias/${card.slug}`}
                className="group bg-white p-6 rounded-2xl border-2 border-transparent hover:border-[#0B3B60]/30 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.corIcone}`}>
                      <Icon className="w-6 h-6" aria-hidden="true" />
                    </div>
                    <span className={`text-[11px] font-extrabold px-2.5 py-1 rounded-full border ${card.corBadge}`}>
                      Acesso Liberado
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-slate-900 group-hover:text-[#0B3B60] transition-colors mb-2">
                    {card.titulo}
                  </h2>
                  <p className="text-xs text-slate-600 leading-relaxed mb-6">
                    {card.descricao}
                  </p>
                </div>

                <div className="flex items-center text-xs font-bold text-[#0056B3] group-hover:text-[#0B3B60] transition-colors">
                  <span>Acessar Guia de Uso</span>
                  <ArrowRight className="w-4 h-4 ml-1.5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </div>
              </Link>
            );
          }

          // Card Bloqueado para o perfil do usuário
          return (
            <div
              key={card.slug}
              className="bg-slate-50/80 p-6 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between opacity-85"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-slate-200 text-slate-500">
                    <Icon className="w-6 h-6" aria-hidden="true" />
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-200/80 text-slate-700 border border-slate-300">
                    <Lock className="w-3 h-3 text-slate-500" aria-hidden="true" />
                    <span>Acesso Restrito</span>
                  </span>
                </div>
                <h2 className="text-lg font-bold text-slate-700 mb-2">
                  {card.titulo}
                </h2>
                <p className="text-xs text-slate-500 leading-relaxed mb-6">
                  {card.descricao}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500">
                <span className="text-[11px] font-medium">
                  {isAnonimo
                    ? `Exclusivo para ${card.perfilLabel}`
                    : `Restrito: exclusivo para ${card.perfilLabel}`}
                </span>
                {isAnonimo ? (
                  <Link
                    href={`/login?redirectTo=/guias/${card.slug}`}
                    className="inline-flex items-center gap-1 font-bold text-[#0056B3] hover:underline text-[11px]"
                  >
                    <span>Entrar</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                ) : (
                  <span className="text-slate-400 font-semibold text-[11px]">Não autorizado</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
