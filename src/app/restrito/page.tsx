import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  BookOpen,
  ArrowRight,
  Building,
  Key,
} from 'lucide-react';
import { PushNotificationToggle } from '@/components/seguranca/PushNotificationToggle';

export const metadata = {
  title: 'Acesso Restrito | Portal UEMG Carangola',
  description: 'Módulos restritos para coordenações de curso, gabinete da direção e custódia institucional da UEMG Carangola.',
};

export default function AcessoRestritoHubPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-[#0B3B60]">
            <ShieldCheck className="w-4 h-4" aria-hidden="true" />
            <span>Módulos de Governança Acadêmica e Institucional</span>
          </div>

          <PushNotificationToggle />
        </div>

        <div className="text-center space-y-3">
          <h1 className="text-3xl font-extrabold text-[#0B3B60] tracking-tight sm:text-4xl">
            Ambiente Administrativo Restrito
          </h1>
          <p className="text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
            Selecione o módulo correspondente ao seu papel institucional na Unidade Acadêmica de Carangola.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          {/* Card Coordenação de Curso */}
          <Link
            href="/restrito/publicacoes"
            className="group bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs hover:border-[#0B3B60] hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0B3B60] flex items-center justify-center font-bold group-hover:bg-[#0B3B60] group-hover:text-white transition-colors">
                <BookOpen className="w-6 h-6" aria-hidden="true" />
              </div>
              <h2 className="text-lg font-bold text-slate-900 group-hover:text-[#0B3B60] transition-colors">
                Coordenação de Cursos
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                Revisão e homologação editorial monocrática de artigos acadêmicos submetidos por docentes e discentes vinculados ao seu curso.
              </p>
            </div>
            <div className="pt-6 flex items-center text-xs font-bold text-[#0B3B60] group-hover:translate-x-1 transition-transform">
              <span>Painel de Publicações</span>
              <ArrowRight className="w-4 h-4 ml-1.5" aria-hidden="true" />
            </div>
          </Link>

          {/* Card Gabinete da Direção */}
          <Link
            href="/restrito/ouvidoria"
            className="group bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs hover:border-[#0B3B60] hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-800 flex items-center justify-center font-bold group-hover:bg-[#0B3B60] group-hover:text-white transition-colors">
                <Building className="w-6 h-6" aria-hidden="true" />
              </div>
              <h2 className="text-lg font-bold text-slate-900 group-hover:text-[#0B3B60] transition-colors">
                Gabinete da Direção
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                Gestão com criptografia de envelope de manifestações de ouvidoria, emissão de despachos oficiais e publicação sanitizada no Mural.
              </p>
            </div>
            <div className="pt-6 flex items-center text-xs font-bold text-[#0B3B60] group-hover:translate-x-1 transition-transform">
              <span>Painel do Gabinete</span>
              <ArrowRight className="w-4 h-4 ml-1.5" aria-hidden="true" />
            </div>
          </Link>

          {/* Card Custódia & Cerimônia de Chaves */}
          <Link
            href="/restrito/cerimonia-chaves"
            className="group bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs hover:border-[#0B3B60] hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold group-hover:bg-[#0B3B60] group-hover:text-white transition-colors">
                <Key className="w-6 h-6" aria-hidden="true" />
              </div>
              <h2 className="text-lg font-bold text-slate-900 group-hover:text-[#0B3B60] transition-colors">
                Cerimônia de Chaves
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                Custódia compartilhada (Shamir 2-de-3) entre Direção, Secretaria e Congregação para garantir a continuidade administrativa perene.
              </p>
            </div>
            <div className="pt-6 flex items-center text-xs font-bold text-[#0B3B60] group-hover:translate-x-1 transition-transform">
              <span>Abrir Custódia de Chaves</span>
              <ArrowRight className="w-4 h-4 ml-1.5" aria-hidden="true" />
            </div>
          </Link>
        </div>

        <div className="bg-slate-100/70 border border-slate-200 rounded-xl p-4 text-center">
          <p className="text-xs text-slate-500">
            Acesso auditado em conformidade com as diretrizes de integridade, Lei de Arquivos (8.159/1991) e segurança da UEMG.
          </p>
        </div>
      </div>
    </div>
  );
}
