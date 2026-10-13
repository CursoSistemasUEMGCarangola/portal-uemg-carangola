import React from 'react';
import { Metadata } from 'next';
import { GuiasIndexView } from '@/components/guias/GuiasIndexView';

export const metadata: Metadata = {
  title: 'Guias de Uso Institucionais | Portal UEMG Carangola',
  description: 'Documentos e guias de uso oficiais para estudantes, professores, coordenações e direção da UEMG Carangola.',
};

export default function GuiasIndexPage() {
  return (
    <div className="min-h-screen bg-[#F7F9FC] py-12 px-4 sm:px-6 lg:px-8">
      <GuiasIndexView />
    </div>
  );
}

