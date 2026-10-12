import React from 'react';
import { RestritoNav } from '@/components/restrito/RestritoNav';

export default function RestritoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Barra de Menu de Opções da Direção */}
      <RestritoNav />

      {/* Conteúdo do Módulo Selecionado */}
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}
