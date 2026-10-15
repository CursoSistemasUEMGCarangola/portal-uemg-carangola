'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  BookOpen,
  MessageSquare,
  ShieldCheck,
  GraduationCap,
  FileText,
  CheckSquare,
  Scale,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  // Fecha o menu automaticamente quando a rota mudar
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Fecha o menu ao pressionar a tecla Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMenuOpen]);

  const navLinks = [
    {
      href: '/artigos',
      label: 'Artigos',
      desc: 'Produção científica e acadêmica',
      icon: BookOpen,
      iconColor: 'text-slate-500',
    },
    {
      href: '/cursos',
      label: 'Cursos',
      desc: 'Estrutura departamental e colegiados',
      icon: GraduationCap,
      iconColor: 'text-slate-500',
    },
    {
      href: '/mural-de-transparencia',
      label: 'Mural',
      desc: 'Transparência ativa e resoluções',
      icon: Scale,
      iconColor: 'text-slate-500',
    },
    {
      href: '/meus-artigos',
      label: 'Meus Artigos',
      desc: 'Submissão e fluxo editorial discente/docente',
      icon: FileText,
      iconColor: 'text-[#0056B3]',
      highlight: true,
    },
    {
      href: '/restrito/publicacoes',
      label: 'Coordenação',
      desc: 'Curadoria e revisão de artigos por colegiado',
      icon: CheckSquare,
      iconColor: 'text-emerald-600',
    },
    {
      href: '/fale-com-a-direcao',
      label: 'Fale com a Direção',
      desc: 'Ouvidoria cidadã com sigilo Zero-Trust',
      icon: MessageSquare,
      iconColor: 'text-[#0056B3]',
      special: true,
    },
    {
      href: '/restrito',
      label: 'Acesso Restrito',
      desc: 'Painel institucional da Direção e equipe',
      icon: ShieldCheck,
      iconColor: 'text-slate-600',
    },
  ];

  return (
    <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-50 shadow-2xs">
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
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-2.5 sm:py-3 flex items-center justify-between gap-4">
        {/* Identidade Institucional */}
        <Link href="/" className="flex items-center space-x-3.5 group text-decoration-none shrink-0">
          <div className="w-12 h-12 sm:w-14 sm:h-14 relative flex-shrink-0 flex items-center justify-center">
            <Image
              src="/images/logo_uemg.png"
              alt="Logo UEMG"
              width={56}
              height={56}
              className="w-12 h-12 sm:w-14 sm:h-14 object-contain transition-transform group-hover:scale-105 drop-shadow-sm"
              priority
            />
          </div>
          <div>
            <span className="block text-base sm:text-lg font-bold text-[#0B3B60] leading-tight">
              Portal UEMG Carangola
            </span>
            <span className="block text-[11px] sm:text-xs text-slate-500 font-medium">
              Publicações Acadêmicas & Canal da Direção
            </span>
          </div>
        </Link>

        {/* Links de Acesso Rápido - Visualização Desktop (md+) */}
        <nav aria-label="Navegação Principal Desktop" className="hidden md:flex items-center flex-wrap gap-1 lg:gap-1.5">
          <Link
            href="/artigos"
            className={`flex items-center space-x-1.5 px-2.5 lg:px-3 py-2 rounded-md text-sm font-semibold transition-colors ${
              pathname === '/artigos'
                ? 'text-[#0B3B60] bg-slate-100 font-bold'
                : 'text-slate-700 hover:text-[#0B3B60] hover:bg-slate-100'
            }`}
          >
            <BookOpen className="w-4 h-4 text-slate-500" aria-hidden="true" />
            <span>Artigos</span>
          </Link>

          <Link
            href="/cursos"
            className={`flex items-center space-x-1.5 px-2.5 lg:px-3 py-2 rounded-md text-sm font-semibold transition-colors ${
              pathname.startsWith('/cursos')
                ? 'text-[#0B3B60] bg-slate-100 font-bold'
                : 'text-slate-700 hover:text-[#0B3B60] hover:bg-slate-100'
            }`}
          >
            <GraduationCap className="w-4 h-4 text-slate-500" aria-hidden="true" />
            <span>Cursos</span>
          </Link>

          <Link
            href="/mural-de-transparencia"
            className={`flex items-center space-x-1.5 px-2.5 lg:px-3 py-2 rounded-md text-sm font-semibold transition-colors ${
              pathname === '/mural-de-transparencia'
                ? 'text-[#0B3B60] bg-slate-100 font-bold'
                : 'text-slate-700 hover:text-[#0B3B60] hover:bg-slate-100'
            }`}
          >
            <Scale className="w-4 h-4 text-slate-500" aria-hidden="true" />
            <span>Mural</span>
          </Link>

          <Link
            href="/meus-artigos"
            className={`flex items-center space-x-1.5 px-2.5 lg:px-3 py-2 rounded-md text-sm font-semibold transition-colors border ${
              pathname.startsWith('/meus-artigos')
                ? 'text-[#0B3B60] bg-blue-100/60 border-blue-300 font-bold'
                : 'text-[#0B3B60] bg-transparent hover:bg-blue-50 border-blue-200/60'
            }`}
          >
            <FileText className="w-4 h-4 text-[#0056B3]" aria-hidden="true" />
            <span>Meus Artigos</span>
          </Link>

          <Link
            href="/restrito/publicacoes"
            className={`flex items-center space-x-1.5 px-2.5 lg:px-3 py-2 rounded-md text-sm font-semibold transition-colors ${
              pathname === '/restrito/publicacoes'
                ? 'text-[#0B3B60] bg-emerald-50 border border-emerald-200 font-bold'
                : 'text-slate-700 hover:text-[#0B3B60] hover:bg-slate-100'
            }`}
          >
            <CheckSquare className="w-4 h-4 text-emerald-600" aria-hidden="true" />
            <span>Coordenação</span>
          </Link>

          <Link
            href="/fale-com-a-direcao"
            className={`flex items-center space-x-1.5 px-2.5 lg:px-3 py-2 rounded-md text-sm font-semibold transition-colors border ${
              pathname.startsWith('/fale-com-a-direcao')
                ? 'text-[#0B3B60] bg-blue-100 border-blue-300 font-bold shadow-2xs'
                : 'text-[#0B3B60] bg-blue-50 hover:bg-blue-100 border-blue-200'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-[#0056B3]" aria-hidden="true" />
            <span>Fale com a Direção</span>
          </Link>

          <Link
            href="/restrito"
            className={`flex items-center space-x-1.5 px-2.5 lg:px-3 py-2 rounded-md text-sm font-semibold transition-colors ${
              pathname === '/restrito'
                ? 'text-slate-900 bg-slate-200 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-slate-500" aria-hidden="true" />
            <span>Acesso Restrito</span>
          </Link>
        </nav>

        {/* Botão Sanduíche para Dispositivos Móveis (Mobile / Tablet estreito) */}
        <div className="flex items-center md:hidden">
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="inline-flex items-center justify-center p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:text-[#0B3B60] hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0056B3] transition-all"
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? 'Fechar menu de navegação móvel' : 'Abrir menu de navegação móvel'}
            aria-controls="menu-navegacao-mobile"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-[#0B3B60]" aria-hidden="true" />
            ) : (
              <Menu className="w-6 h-6 text-[#0B3B60]" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Menu Sanduíche Móvel Retrátil (Dropdown responsivo) */}
      {isMenuOpen && (
        <div
          id="menu-navegacao-mobile"
          className="md:hidden border-t border-slate-200 bg-white/98 backdrop-blur-md px-4 py-4 sm:px-6 shadow-xl animate-fade-in transition-all"
        >
          <div className="mb-2 px-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Menu de Navegação
          </div>
          <nav aria-label="Navegação Principal Móvel" className="flex flex-col space-y-1.5">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(item.href);

              let itemStyle = 'text-slate-700 hover:text-[#0B3B60] hover:bg-slate-100 border-transparent';
              if (isActive) {
                itemStyle = 'bg-blue-50/80 text-[#0B3B60] font-bold border-blue-200';
              } else if (item.special) {
                itemStyle = 'bg-blue-50 text-[#0B3B60] font-semibold border-blue-200/80 hover:bg-blue-100';
              } else if (item.highlight) {
                itemStyle = 'text-[#0B3B60] font-semibold hover:bg-blue-50/50 border-blue-100';
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center justify-between p-3 rounded-xl border text-sm transition-all ${itemStyle}`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-white shadow-2xs border border-slate-100 flex items-center justify-center shrink-0">
                      <Icon className={`w-4 h-4 ${item.iconColor}`} aria-hidden="true" />
                    </div>
                    <div>
                      <span className="block font-bold leading-tight">{item.label}</span>
                      <span className="block text-[11px] text-slate-500 font-normal leading-snug">
                        {item.desc}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
                </Link>
              );
            })}
          </nav>

          {/* Rodapé institucional com atalho para Acessibilidade */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 px-2">
            <span>UEMG Unidade Carangola</span>
            <Link
              href="/acessibilidade-e-privacidade"
              onClick={() => setIsMenuOpen(false)}
              className="text-[#0056B3] hover:underline font-medium"
            >
              Acessibilidade & Privacidade
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

