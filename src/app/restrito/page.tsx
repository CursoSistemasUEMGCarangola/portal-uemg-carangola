import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Building,
  BookOpen,
  Key,
  ArrowRight,
  FileCheck2,
  Lock,
  Eye,
  CheckCircle,
  HelpCircle,
  Clock,
  Sparkles,
} from 'lucide-react';

import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { HomologacaoCoordenadores } from '@/components/restrito/HomologacaoCoordenadores';

export const metadata = {
  title: 'Painel da Direção | Portal UEMG Carangola',
  description: 'Painel executivo com atribuições objetivas do Gabinete da Direção da UEMG Unidade Carangola.',
};

export default async function AcessoRestritoHubPage() {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redireciona coordenadores e autores para suas respectivas áreas de trabalho
  if (user) {
    const role = user.user_metadata?.role;
    if (role === 'coordenador_curso') {
      redirect('/restrito/publicacoes');
    }
    if (role === 'autor') {
      redirect('/meus-artigos');
    }
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Cabeçalho Executivo com Identificação Institucional */}
      <div className="bg-gradient-to-r from-[#0B3B60] via-[#082d4a] to-[#041a2e] text-white rounded-3xl p-6 sm:p-10 shadow-lg border border-blue-900/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs border border-white/20 text-xs font-bold uppercase tracking-wider text-blue-200 mb-3">
            <ShieldCheck className="w-4 h-4 text-emerald-400" aria-hidden="true" />
            <span>Gabinete da Direção Geral • Gestão Soberana</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-2">
            Painel Executivo da Direção
          </h1>
          <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
            Área restrita de governança institucional da UEMG Unidade Carangola.
            Selecione abaixo a ação administrativa pertinente ao seu expediente.
          </p>
        </div>
      </div>

      {/* Homologação de Coordenações de Curso (Alçada da Direção) */}
      <HomologacaoCoordenadores />

      {/* Seção Principal: Ações Pertinentes à Direção */}
      <section className="space-y-4">
        <div>
          <span className="text-xs font-bold text-[#0056B3] uppercase tracking-wider block mb-1">
            Módulos Operacionais
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-[#0B3B60]">
            Atribuições e Ações Pertinentes à Direção
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Cada bloco abaixo concentra uma responsabilidade oficial com acesso direto aos painéis executivos.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
          {/* Ação 1: Gabinete & Ouvidoria */}
          <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 shadow-xs hover:border-[#0B3B60] hover:shadow-md transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-900 flex items-center justify-center font-bold">
                  <Building className="w-6 h-6" aria-hidden="true" />
                </div>
                <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
                  Gabinete
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-[#0B3B60] mb-1">
                  1. Ouvidoria & Despachos
                </h3>
                <p className="text-xs font-semibold text-slate-500 mb-3">
                  Atendimento oficial e transparência pública
                </p>
                <div className="space-y-2 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Decifrar manifestações anônimas e identificadas com segurança Zero-Trust.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Emitir despachos, pareceres e portarias em resposta às demandas.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Homologar respostas sanitizadas para publicação no Mural de Transparência.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <Link
                href="/restrito/ouvidoria"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#0B3B60] hover:bg-[#0056B3] text-white text-xs font-bold transition-colors shadow-xs"
              >
                <span>Acessar Painel de Despachos</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Ação 2: Coordenações & Publicações */}
          <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 shadow-xs hover:border-[#0B3B60] hover:shadow-md transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-[#0056B3] flex items-center justify-center font-bold">
                  <BookOpen className="w-6 h-6" aria-hidden="true" />
                </div>
                <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-100 text-[#0056B3] border border-blue-200">
                  Acadêmico
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-[#0B3B60] mb-1">
                  2. Coordenações & Cursos
                </h3>
                <p className="text-xs font-semibold text-slate-500 mb-3">
                  Supervisão editorial dos 8 cursos de graduação
                </p>
                <div className="space-y-2 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Acompanhar a produção científica de docentes e discentes de todos os cursos.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Realizar curadoria e homologação editorial monocrática por departamento.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Aprovar publicações que compõem o acervo digital oficial da Unidade.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <Link
                href="/restrito/publicacoes"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#0056B3] hover:bg-blue-600 text-white text-xs font-bold transition-colors shadow-xs"
              >
                <span>Acessar Painel de Publicações</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Ação 3: Cerimônia de Chaves */}
          <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 shadow-xs hover:border-[#0B3B60] hover:shadow-md transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center font-bold">
                  <Key className="w-6 h-6" aria-hidden="true" />
                </div>
                <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Soberania
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-[#0B3B60] mb-1">
                  3. Cerimônia de Chaves
                </h3>
                <p className="text-xs font-semibold text-slate-500 mb-3">
                  Custódia compartilhada e integridade perene
                </p>
                <div className="space-y-2 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Realizar o rito solene de custódia da Chave Mestra do Gabinete da Direção.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Dividir segredos via Shamir (2 de 3: Direção, Vice-Direção e Secretaria Acadêmica).</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Garantir sucessão administrativa e soberania tecnológica sem custo.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <Link
                href="/restrito/cerimonia-chaves"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-xs"
              >
                <span>Acessar Cerimônia de Chaves</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Roteiro Prático: Ordem Recomendada de Ações da Direção */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-[#0056B3]" />
          <h3 className="text-base sm:text-lg font-bold text-[#0B3B60]">
            Roteiro de Expediente da Direção Geral
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <span className="font-extrabold text-[#0B3B60] text-sm block">1º Despacho de Demandas</span>
            <p className="leading-relaxed">
              Consulte a aba <strong>Gabinete & Ouvidoria</strong> para verificar se há protocolos de discentes, docentes ou cidadãos aguardando despacho formal da Direção.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <span className="font-extrabold text-[#0B3B60] text-sm block">2º Supervisão dos Cursos</span>
            <p className="leading-relaxed">
              Acesse <strong>Coordenações & Cursos</strong> para acompanhar os artigos acadêmicos submetidos e homologar publicações em conjunto com os coordenadores de colegiado.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <span className="font-extrabold text-[#0B3B60] text-sm block">3º Segurança Institucional</span>
            <p className="leading-relaxed">
              Certifique-se de que a <strong>Cerimônia de Chaves</strong> foi devidamente lavrada e os fragmentos de segurança foram distribuídos entre os custodiantes legais da Unidade.
            </p>
          </div>
        </div>
      </section>

      {/* Selo de Governança e Base Legal */}
      <div className="bg-slate-100/80 border border-slate-200 rounded-xl p-4 text-center">
        <p className="text-xs text-slate-500 flex items-center justify-center gap-1.5 flex-wrap">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>
            Expediente oficial protegido por criptografia de ponta a ponta e conforme a Lei 12.527/2011 (LAI), Lei 13.709/2018 (LGPD) e Lei 8.159/1991 (Arquivos Públicos).
          </span>
        </p>
      </div>
    </div>
  );
}
