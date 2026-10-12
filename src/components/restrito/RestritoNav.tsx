'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { PushNotificationToggle } from '@/components/seguranca/PushNotificationToggle';

const ITENS_MENU = [
  {
    rotulo: 'Painel Geral',
    descricao: 'Visão executiva e atribuições',
    href: '/restrito',
    icone: LayoutDashboard,
  },
];

export function RestritoNav() {
  const pathname = usePathname();

  return (
    <div className="bg-white border-b border-slate-200 sticky top-[73px] z-40 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-2 gap-3">
          {/* Menu de Opções da Direção */}
          <nav
            aria-label="Menu Administrativo da Direção"
            className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto py-1 scrollbar-none"
          >
            {ITENS_MENU.map((item) => {
              const Icone = item.icone;
              const isActive =
                item.href === '/restrito'
                  ? pathname === '/restrito'
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-[#0B3B60] text-white shadow-xs'
                      : 'text-slate-600 hover:text-[#0B3B60] hover:bg-slate-100'
                  }`}
                >
                  <Icone
                    className={`w-4 h-4 ${
                      isActive ? 'text-blue-200' : 'text-slate-400'
                    }`}
                    aria-hidden="true"
                  />
                  <span>{item.rotulo}</span>
                </Link>
              );
            })}
          </nav>

          {/* Atalhos Rápidos e Notificações */}
          <div className="flex items-center justify-between md:justify-end gap-3 shrink-0">
            <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Ambiente Autenticado • Gabinete da Direção</span>
            </div>

            <PushNotificationToggle />

            <Link
              href="/"
              className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-[#0B3B60] px-2 py-1 rounded-md hover:bg-slate-100 transition-colors"
              title="Ir para o portal público"
            >
              <span>Ver Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
