import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BookOpen, MessageSquare, ShieldCheck, Home, GraduationCap, FileText, CheckSquare, Scale } from 'lucide-react';

export const Header: React.FC = () => {
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
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Identidade Institucional */}
        <Link href="/" className="flex items-center space-x-3 group text-decoration-none">
          <div className="w-10 h-10 relative flex-shrink-0 flex items-center justify-center">
            <Image
              src="/images/logo_uemg.png"
              alt="Logo UEMG"
              width={40}
              height={40}
              className="w-10 h-10 object-contain transition-transform group-hover:scale-105"
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

        {/* Links de Acesso Rápido */}
        <nav aria-label="Navegação Principal" className="flex items-center flex-wrap gap-1 sm:gap-2">
          <Link
            href="/"
            className="flex items-center space-x-1.5 px-3 py-2 rounded-md text-sm font-semibold text-slate-700 hover:text-[#0B3B60] hover:bg-slate-100 transition-colors"
          >
            <Home className="w-4 h-4 text-slate-500" aria-hidden="true" />
            <span>Início</span>
          </Link>

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
        </nav>
      </div>
    </header>
  );
};
