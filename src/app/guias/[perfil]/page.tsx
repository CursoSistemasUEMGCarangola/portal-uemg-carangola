import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { GUIAS_DE_USO, obterGuia } from '@/lib/data/guias-content';
import { MarkdownRenderer } from '@/components/editorial/MarkdownRenderer';
import { PrintButton } from '@/components/ui/PrintButton';
import { GuiaAccessGuard } from '@/components/guias/GuiaAccessGuard';
import { GuiaPerfilNav } from '@/components/guias/GuiaPerfilNav';
import {
  ArrowLeft,
  BookOpen,
  ShieldCheck,
  GraduationCap,
  FileText,
  UserCheck,
  Building2,
} from 'lucide-react';

interface GuiaPageProps {
  params: {
    perfil: string;
  };
}

export function generateStaticParams() {
  return [
    { perfil: 'estudante' },
    { perfil: 'docente' },
    { perfil: 'coordenador' },
    { perfil: 'direcao' },
  ];
}

export function generateMetadata({ params }: GuiaPageProps): Metadata {
  const guia = obterGuia(params.perfil);
  if (!guia) {
    return {
      title: 'Guia de Uso | Portal UEMG Carangola',
    };
  }

  return {
    title: `${guia.titulo} | Portal UEMG Carangola`,
    description: guia.descricao,
  };
}

const ICONES_PERFIL: Record<string, React.ReactNode> = {
  estudante: <GraduationCap className="w-5 h-5 text-sky-600" aria-hidden="true" />,
  docente: <FileText className="w-5 h-5 text-indigo-600" aria-hidden="true" />,
  coordenador: <UserCheck className="w-5 h-5 text-emerald-600" aria-hidden="true" />,
  direcao: <Building2 className="w-5 h-5 text-[#0B3B60]" aria-hidden="true" />,
};

const CORES_BADGE: Record<string, string> = {
  estudante: 'bg-sky-50 text-sky-800 border-sky-200',
  docente: 'bg-indigo-50 text-indigo-800 border-indigo-200',
  coordenador: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  direcao: 'bg-blue-50 text-[#0B3B60] border-blue-200',
};

export default function GuiaDeUsoPage({ params }: GuiaPageProps) {
  const guia = obterGuia(params.perfil);

  if (!guia) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#F7F9FC] py-10 px-4 sm:px-6 lg:px-8">
      <GuiaAccessGuard perfilSlug={guia.slug} tituloGuia={guia.titulo}>
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Barra Superior de Ações */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <Link
              href="/guias"
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-[#0B3B60] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              <span>Voltar à Central de Guias</span>
            </Link>

            <div className="flex items-center gap-2">
              <PrintButton />
            </div>
          </div>

          {/* Cabeçalho do Guia */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
            <div className="flex flex-wrap items-center gap-2.5 mb-3">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                  CORES_BADGE[guia.slug] || 'bg-slate-100 text-slate-800 border-slate-200'
                }`}
              >
                {ICONES_PERFIL[guia.slug] || <BookOpen className="w-4 h-4" aria-hidden="true" />}
                <span>{guia.perfil}</span>
              </span>
              <span className="text-xs text-slate-500 font-medium">
                • Guia Oficial de Procedimentos
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B3B60] tracking-tight mb-2">
              {guia.titulo}
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
              {guia.descricao}
            </p>

            {/* Navegação entre os 4 Guias Oficiais com validação RBAC */}
            <div className="mt-6 pt-6 border-t border-slate-100">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
                Alternar entre perfis autorizados:
              </p>
              <GuiaPerfilNav slugAtual={guia.slug} />
            </div>
          </div>

          {/* Conteúdo Renderizado do Markdown */}
          <article className="bg-white rounded-2xl p-6 sm:p-10 border border-slate-200 shadow-sm">
            <MarkdownRenderer content={guia.conteudoMarkdown} />
          </article>

          {/* Rodapé de Governança */}
          <div className="text-center py-6 text-xs text-slate-500 space-y-1">
            <p className="font-semibold text-slate-700">
              Universidade do Estado de Minas Gerais — Unidade Carangola
            </p>
            <p>
              Documentação Institucional Soberana • Conformidade com LAI (Lei 12.527/11) e LGPD (Lei 13.709/18)
            </p>
          </div>
        </div>
      </GuiaAccessGuard>
    </div>
  );
}
