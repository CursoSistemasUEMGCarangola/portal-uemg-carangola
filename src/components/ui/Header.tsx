'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  BookOpen,
  MessageSquare,
  ShieldCheck,
  GraduationCap,
  FileText,
  CheckSquare,
  Scale,
  LogIn,
  LogOut,
  User,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export const Header: React.FC = () => {
  const { user, perfil, isLoading, signOut } = useAuth();

  const getRotuloPapel = () => {
    if (!perfil) return 'Usuário Conectado';
    switch (perfil.role) {
      case 'direcao':
        return 'Direção Geral';
      case 'coordenador_curso':
        return 'Coordenação';
      case 'autor':
        return 'Docente / Autor';
      default:
        return 'Autenticado';
    }
  };

  return (
    <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-50">
      {/* Barra de Governo do Estado de Minas Gerais */}
      <div className="bg-[#002244] text-slate-100 text-xs py-1.5 px-4 sm:px-8 flex justify-between items-center">
        <div className="flex items-center space-x-2 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" aria-hidden="true"></span>
          <span>Governo do Estado de Minas Gerais</span>
          <span className="text-slate-400">•</span>
          <span>Universidade do Estado de Minas Gerais</span>
        </div>
        <div className="hidden sm:flex items-center space-x-4 text-slate-300">
          <span>Unidade Acadêmica de Carangola</span>
        </div>
      </div>

      {/* Navegação Principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Identidade Institucional */}
        <Link href="/" className="flex items-center space-x-3.5 group text-decoration-none">
          <div className="w-14 h-14 relative flex-shrink-0 flex items-center justify-center">
            <Image
              src="/images/logo_uemg.png"
              alt="Logo UEMG"
              width={56}
              height={56}
              className="w-14 h-14 object-contain transition-transform group-hover:scale-105 drop-shadow-sm"
              priority
            />
          </div>
          <div>
            <span className="block text-lg font-bold text-[#0B3B60] leading-tight">
              Portal UEMG Carangola
            </span>
            <span className="block text-xs text-slate-500 font-medium">
              Publicações Acadêmicas & Canal da Direção
            </span>
          </div>
        </Link>

        {/* Links de Acesso Rápido e Autenticação */}
        <nav aria-label="Navegação Principal" className="flex items-center flex-wrap gap-1 sm:gap-2">
          <Link
            href="/artigos"
            className="flex items-center space-x-1.5 px-3 py-2 rounded-md text-sm font-semibold text-slate-700 hover:text-[#0B3B60] hover:bg-slate-100 transition-colors"
          >
            <BookOpen className="w-4 h-4 text-slate-500" aria-hidden="true" />
            <span>Artigos</span>
          </Link>

          <Link
            href="/cursos"
            className="flex items-center space-x-1.5 px-3 py-2 rounded-md text-sm font-semibold text-slate-700 hover:text-[#0B3B60] hover:bg-slate-100 transition-colors"
          >
            <GraduationCap className="w-4 h-4 text-slate-500" aria-hidden="true" />
            <span>Cursos</span>
          </Link>

          <Link
            href="/mural-de-transparencia"
            className="flex items-center space-x-1.5 px-3 py-2 rounded-md text-sm font-semibold text-slate-700 hover:text-[#0B3B60] hover:bg-slate-100 transition-colors"
          >
            <Scale className="w-4 h-4 text-slate-500" aria-hidden="true" />
            <span>Mural</span>
          </Link>

          <Link
            href="/meus-artigos"
            className="flex items-center space-x-1.5 px-3 py-2 rounded-md text-sm font-semibold text-[#0B3B60] hover:bg-blue-50 transition-colors border border-blue-200/60"
          >
            <FileText className="w-4 h-4 text-[#0056B3]" aria-hidden="true" />
            <span>Meus Artigos</span>
          </Link>

          <Link
            href="/restrito/publicacoes"
            className="flex items-center space-x-1.5 px-3 py-2 rounded-md text-sm font-semibold text-slate-700 hover:text-[#0B3B60] hover:bg-slate-100 transition-colors"
          >
            <CheckSquare className="w-4 h-4 text-emerald-600" aria-hidden="true" />
            <span>Coordenação</span>
          </Link>

          <Link
            href="/fale-com-a-direcao"
            className="flex items-center space-x-1.5 px-3 py-2 rounded-md text-sm font-semibold text-[#0B3B60] bg-blue-50 hover:bg-blue-100 transition-colors border border-blue-200"
          >
            <MessageSquare className="w-4 h-4 text-[#0056B3]" aria-hidden="true" />
            <span>Fale com a Direção</span>
          </Link>

          <Link
            href="/restrito"
            className="flex items-center space-x-1.5 px-3 py-2 rounded-md text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            <ShieldCheck className="w-4 h-4 text-slate-500" aria-hidden="true" />
            <span>Acesso Restrito</span>
          </Link>

          {/* Área de Autenticação */}
          {!isLoading && (
            <div className="ml-1 sm:ml-2 pl-2 border-l border-slate-200 flex items-center gap-1.5">
              {user ? (
                <div className="flex items-center gap-2">
                  <Link
                    href="/restrito"
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-xs font-bold text-[#0B3B60] hover:bg-blue-100 transition-colors"
                    title={`Conectado como ${user.email}`}
                  >
                    <User className="w-3.5 h-3.5 text-[#0056B3]" />
                    <span className="max-w-[130px] truncate">{getRotuloPapel()}</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => signOut()}
                    aria-label="Sair da sessão"
                    title="Encerrar sessão com segurança"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0B3B60] text-white text-xs font-bold hover:bg-[#0056B3] transition-colors shadow-2xs"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Entrar</span>
                </Link>
              )}
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};
