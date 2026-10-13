'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { podeAcessarGuia, obterInfoPerfilAcesso } from '@/lib/auth/guias-access';
import { ShieldAlert, Lock, ArrowRight, ArrowLeft, LogIn, BookOpen } from 'lucide-react';

interface GuiaAccessGuardProps {
  perfilSlug: string;
  tituloGuia: string;
  children: React.ReactNode;
}

export function GuiaAccessGuard({ perfilSlug, tituloGuia, children }: GuiaAccessGuardProps) {
  const { user, perfil, isLoading } = useAuth();

  // Enquanto carrega o estado de autenticação institucional
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 animate-pulse space-y-6">
        <div className="h-6 w-48 bg-slate-200 rounded-lg" />
        <div className="h-32 bg-slate-200 rounded-2xl" />
        <div className="space-y-3">
          <div className="h-4 bg-slate-200 rounded w-3/4" />
          <div className="h-4 bg-slate-200 rounded w-1/2" />
          <div className="h-4 bg-slate-200 rounded w-5/6" />
        </div>
      </div>
    );
  }

  const role = perfil?.role || (user?.user_metadata?.role as string) || null;
  const autorizado = podeAcessarGuia(role, perfilSlug);

  // Usuário autorizado: renderiza o conteúdo do guia integralmente
  if (autorizado) {
    return <>{children}</>;
  }

  // Usuário não autorizado: painel institucional explicativo de restrição de acesso (RBAC)
  const info = obterInfoPerfilAcesso(role);
  const isAnonimo = !user;

  return (
    <div className="max-w-2xl mx-auto my-12 px-4 sm:px-6">
      <div className="bg-white rounded-3xl border border-amber-200 shadow-md p-6 sm:p-10 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 mx-auto flex items-center justify-center">
          {isAnonimo ? (
            <Lock className="w-8 h-8" aria-hidden="true" />
          ) : (
            <ShieldAlert className="w-8 h-8" aria-hidden="true" />
          )}
        </div>

        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
            Acesso Restrito por Papel Institucional
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            {tituloGuia}
          </h1>
        </div>

        <p className="text-sm text-slate-600 leading-relaxed max-w-lg mx-auto">
          {isAnonimo ? (
            <>
              Você está navegando como <strong>Estudante / Comunidade Externa</strong>. O acesso a este documento é restrito a servidores autenticados. Caso possua credencial de professor, coordenador ou direção, faça login para continuar.
            </>
          ) : (
            <>
              Seu perfil autenticado no sistema é <strong>{info.nomePerfil}</strong>. Conforme as normas de governança e separação de funções da UEMG Carangola, seu acesso está circunscrito ao seu respectivo Guia de Uso.
            </>
          )}
        </p>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          {isAnonimo ? (
            <>
              <Link
                href={`/login?redirectTo=/guias/${perfilSlug}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-[#0B3B60] hover:bg-[#0056B3] text-white shadow-sm transition-all"
              >
                <LogIn className="w-4 h-4" aria-hidden="true" />
                <span>Entrar com Login Institucional</span>
              </Link>
              <Link
                href="/guias/estudante"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 transition-all"
              >
                <BookOpen className="w-4 h-4 text-sky-600" aria-hidden="true" />
                <span>Ir para o Guia do Estudante</span>
              </Link>
            </>
          ) : (
            <>
              <Link
                href={`/guias/${info.guiaPermitidoSlug}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-[#0B3B60] hover:bg-[#0056B3] text-white shadow-sm transition-all"
              >
                <span>Acessar {info.guiaPermitidoNome}</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <Link
                href="/"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition-all"
              >
                <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                <span>Voltar ao Portal</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
