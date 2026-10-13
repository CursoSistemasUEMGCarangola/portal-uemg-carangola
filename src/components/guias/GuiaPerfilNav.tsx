'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { podeAcessarGuia } from '@/lib/auth/guias-access';
import { Lock } from 'lucide-react';

interface GuiaPerfilNavProps {
  slugAtual: string;
}

const PERFIS_ITEMS = [
  { slug: 'estudante', rotulo: 'Estudante' },
  { slug: 'docente', rotulo: 'Docente' },
  { slug: 'coordenador', rotulo: 'Coordenação' },
  { slug: 'direcao', rotulo: 'Direção Geral' },
];

export function GuiaPerfilNav({ slugAtual }: GuiaPerfilNavProps) {
  const { user, perfil } = useAuth();
  const role = perfil?.role || (user?.user_metadata?.role as string) || null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
      {PERFIS_ITEMS.map((item) => {
        const isAtual = item.slug === slugAtual;
        const temAcesso = podeAcessarGuia(role, item.slug);

        if (temAcesso) {
          return (
            <Link
              key={item.slug}
              href={`/guias/${item.slug}`}
              className={`text-center py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                isAtual
                  ? 'bg-[#0B3B60] text-white border-[#0B3B60] shadow-xs'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              {item.rotulo}
            </Link>
          );
        }

        return (
          <div
            key={item.slug}
            className="text-center py-2 px-2.5 rounded-xl text-xs font-medium bg-slate-100/70 text-slate-400 border border-slate-200/80 cursor-not-allowed flex items-center justify-center gap-1.5"
            title={`Acesso restrito ao perfil de ${item.rotulo}`}
          >
            <Lock className="w-3 h-3 text-slate-400" aria-hidden="true" />
            <span>{item.rotulo}</span>
          </div>
        );
      })}
    </div>
  );
}
