import React from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, ShieldCheck, Sparkles } from 'lucide-react';
import SubmissionForm from '@/components/editorial/SubmissionForm';

export const metadata = {
  title: 'Nova Submissão de Artigo | Portal UEMG Carangola',
  description: 'Submeta seu trabalho científico para avaliação pelo Coordenador do seu curso na UEMG Carangola.',
};

export default function NovaSubmissaoPage() {
  return (
    <div className="min-h-screen bg-[#F7F9FC] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Navegação e Cabeçalho */}
        <div>
          <Link
            href="/meus-artigos"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0B3B60] hover:text-[#0056B3] mb-4 group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Voltar para Meus Artigos
          </Link>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-[#0B3B60] mb-2">
                <BookOpen className="w-3.5 h-3.5" />
                Esteira Editorial Monocrática — Épico 3
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B3B60] tracking-tight">
                Nova Submissão Acadêmica
              </h1>
              <p className="text-sm text-slate-600 mt-1">
                Envio direto ao Coordenador de Curso com compressão de capa WebP no navegador.
              </p>
            </div>

            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3.5 py-2 rounded-xl text-emerald-800 text-xs font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Modo Custo Zero: PDFs sob demanda & WebP no cliente</span>
            </div>
          </div>
        </div>

        {/* Formulário Interativo */}
        <SubmissionForm />
      </div>
    </div>
  );
}
