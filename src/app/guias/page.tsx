import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import {
  GraduationCap,
  FileText,
  UserCheck,
  Building2,
  ArrowRight,
  BookOpen,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Guias de Uso Institucionais | Portal UEMG Carangola',
  description: 'Documentos e guias de uso oficiais para estudantes, professores, coordenações e direção da UEMG Carangola.',
};

const GUIAS_CARDS = [
  {
    slug: 'estudante',
    titulo: 'Guia do Estudante / Discente',
    descricao: 'Orientações para busca e leitura de artigos, geração de PDFs, submissão de trabalhos e ouvidoria cidadã.',
    icone: GraduationCap,
    corBadge: 'bg-sky-50 text-sky-800 border-sky-200',
    corIcone: 'text-sky-600 bg-sky-100',
  },
  {
    slug: 'docente',
    titulo: 'Guia do Professor / Docente',
    descricao: 'Instruções para publicação científica, submissão de relatos de extensão, acompanhamento in-app e citações ABNT.',
    icone: FileText,
    corBadge: 'bg-indigo-50 text-indigo-800 border-indigo-200',
    corIcone: 'text-indigo-600 bg-indigo-100',
  },
  {
    slug: 'coordenador',
    titulo: 'Guia do Coordenador de Curso',
    descricao: 'Instruções para curadoria editorial departamental em 1 clique, modais de ajustes e gestão de colegiado.',
    icone: UserCheck,
    corBadge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    corIcone: 'text-emerald-600 bg-emerald-100',
  },
  {
    slug: 'direcao',
    titulo: 'Guia do Gabinete da Direção',
    descricao: 'Orientações de governança institucional, análise de ouvidoria com decodificação em RAM, despacho sanitizado e custódia Shamir.',
    icone: Building2,
    corBadge: 'bg-blue-50 text-[#0B3B60] border-blue-200',
    corIcone: 'text-[#0B3B60] bg-blue-100',
  },
];

export default function GuiasIndexPage() {
  return (
    <div className="min-h-screen bg-[#F7F9FC] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-[#0B3B60] mb-3">
            <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Documentação Oficial UEMG Carangola</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0B3B60] tracking-tight mb-3">
            Guias de Uso do Sistema
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            Selecione o seu perfil institucional para consultar orientações passo a passo, normas de conformidade, procedimentos operacionais e fluxos da plataforma.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {GUIAS_CARDS.map((card) => {
            const Icon = card.icone;
            return (
              <Link
                key={card.slug}
                href={`/guias/${card.slug}`}
                className="group bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.corIcone}`}>
                      <Icon className="w-6 h-6" aria-hidden="true" />
                    </div>
                    <span className={`text-[11px] font-extrabold px-2.5 py-1 rounded-full border ${card.corBadge}`}>
                      Guia Oficial
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
          })}
        </div>
      </div>
    </div>
  );
}
