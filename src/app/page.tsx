import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  MessageSquare,
  Shield,
  CheckCircle2,
  ArrowRight,
  Building2,
  Send,
  Search,
  FileText,
  ShieldCheck,
  Lock,
  BookOpen,
  GraduationCap,
  UserCheck,
} from 'lucide-react';
import { ARTIGOS_MOCK, CURSOS_LISTA } from '@/lib/data/mock-articles';
import { SiglaCurso } from '@/types/editorial';
import { FeaturedArticle } from '@/components/editorial/FeaturedArticle';
import { ArticleCard } from '@/components/editorial/ArticleCard';
import { InstallPwaButton } from '@/components/pwa/InstallPwaButton';

const FAIXA_CORES: Record<SiglaCurso, { borderTop: string }> = {
  BIO: { borderTop: 'border-t-emerald-600' },
  GEO: { borderTop: 'border-t-amber-600' },
  HIS: { borderTop: 'border-t-purple-600' },
  LET: { borderTop: 'border-t-violet-600' },
  MAT: { borderTop: 'border-t-cyan-600' },
  PED: { borderTop: 'border-t-sky-500' },
  SSO: { borderTop: 'border-t-teal-700' },
  SIS: { borderTop: 'border-t-[#0056B3]' },
};

export default function HomePage() {
  const artigoEmDestaque = ARTIGOS_MOCK[0];
  const ultimosArtigos = ARTIGOS_MOCK.slice(1, 4);

  return (
    <div className="w-full">
      {/* Hero Institucional com Fachada da Unidade como Fundo */}
      <section className="relative overflow-hidden bg-[#002244] text-white py-16 sm:py-24 px-4 sm:px-8 border-b border-blue-900">
        {/* Imagem de Fundo (Fachada UEMG Carangola) com Iluminação e Nitidez Total */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/UEMG-fachada-2.jpg"
            alt="Fachada UEMG Carangola"
            fill
            className="object-cover object-center"
            priority
          />
          {/* Degradê suave e localizado apenas à esquerda: protege os textos sem encobrir a fachada */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#001428]/80 via-[#001c38]/45 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight max-w-4xl leading-tight mb-6 drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)]">
            Divulgação Científica e Governança Participativa em um Ponto Único
          </h1>

          <p className="text-base sm:text-xl text-white max-w-3xl leading-relaxed mb-10 drop-shadow-[0_1px_6px_rgba(0,0,0,0.85)]">
            Conectamos a produção acadêmica dos nossos 8 cursos de graduação ao canal direto
            de diálogo com a Direção Geral, assegurando transparência ativa e engajamento comunitário.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
            <InstallPwaButton />

            <Link
              href="/fale-com-a-direcao"
              className="inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-lg bg-[#0056B3] text-white font-bold text-sm shadow-md hover:bg-blue-600 transition-colors border border-blue-400/30"
            >
              <MessageSquare className="w-4 h-4" aria-hidden="true" />
              <span>Fale com a Direção</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Seção de Destaque Automático */}
      {artigoEmDestaque && (
        <section className="max-w-7xl mx-auto px-4 sm:px-8 -mt-10 relative z-10 mb-14">
          <FeaturedArticle artigo={artigoEmDestaque} />
        </section>
      )}


      {/* Recentes do Campus */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 mb-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold text-[#0056B3] uppercase tracking-wider block mb-1">
              Produções Recentes
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0B3B60]">
              Últimas Publicações Acadêmicas
            </h2>
          </div>
          <Link
            href="/artigos"
            className="text-sm font-bold text-[#0056B3] hover:underline inline-flex items-center space-x-1"
          >
            <span>Ver catálogo completo</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>

        {ultimosArtigos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ultimosArtigos.map((artigo) => (
              <ArticleCard key={artigo.id} artigo={artigo} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 px-4 text-xs text-slate-500 bg-white rounded-xl border border-dashed border-slate-200">
            Novos artigos submetidos pela comunidade acadêmica serão listados aqui após homologação pelas coordenações.
          </div>
        )}
      </section>

      {/* Cursos da Unidade */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-12 bg-white rounded-2xl border border-slate-200 mb-16 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0B3B60]">
              Cursos da Unidade Carangola
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Produção editorial e pedagógica dos 8 cursos de graduação do campus.
            </p>
          </div>
          <Link
            href="/cursos"
            className="text-sm font-bold text-[#0056B3] hover:underline inline-flex items-center space-x-1"
          >
            <span>Conhecer todos os cursos</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {CURSOS_LISTA.map((curso) => {
            const estiloFaixa = FAIXA_CORES[curso.sigla];

            return (
              <Link
                key={curso.sigla}
                href={`/cursos/${curso.sigla.toLowerCase()}`}
                className={`group relative p-5 rounded-2xl border ${curso.corBadge} ${estiloFaixa.borderTop} border-t-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-md block text-decoration-none`}
              >
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className="text-xs font-black tracking-wider uppercase font-mono px-2 py-0.5 rounded-md bg-white/90 border border-current shadow-2xs">
                    {curso.sigla}
                  </span>
                  {curso.grau && (
                    <span className="text-[10px] font-bold uppercase tracking-wider opacity-75">
                      {curso.grau}
                    </span>
                  )}
                </div>

                <h3 className="text-sm sm:text-base font-extrabold leading-snug tracking-tight">
                  {curso.nome}
                </h3>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Novo Quadro Dedicado: Fale com a Direção */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 mb-16">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0B3B60] via-[#082d4a] to-[#041a2e] text-white shadow-xl border border-blue-900/40 p-6 sm:p-10">
          {/* Elementos visuais de iluminação em degradê */}
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 -mb-12 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Cabeçalho do Quadro */}
          <div className="relative z-10 max-w-3xl mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs border border-white/20 text-xs font-bold uppercase tracking-wider text-blue-200 mb-3">
              <MessageSquare className="w-3.5 h-3.5 text-blue-300" aria-hidden="true" />
              <span>Canal de Governança Participativa</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
              Fale com a Direção
            </h2>
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
              Canal institucional seguro e direto com o Gabinete da Direção da Unidade Carangola.
              Envie suas manifestações com total garantia de sigilo, anonimato constitucional e acompanhamento transparente.
            </p>
          </div>

          {/* Cards de Ação Rápida dentro do Quadro */}
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
            {/* Ação 1: Nova Manifestação */}
            <div className="bg-white/10 hover:bg-white/15 backdrop-blur-md rounded-2xl p-6 border border-white/15 flex flex-col justify-between transition-all duration-200 shadow-sm">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/25 text-white flex items-center justify-center">
                    <Send className="w-5 h-5 text-blue-300" aria-hidden="true" />
                  </div>
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-orange-500/30 text-orange-200 border border-orange-400/50">
                    Opção de Sigilo Total
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  Nova Manifestação
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-6">
                  Registre elogios, sugestões, solicitações administrativas ou denúncias para avaliação prioritária do Gabinete.
                </p>
              </div>
              <Link
                href="/fale-com-a-direcao"
                className="w-full inline-flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-white text-[#0B3B60] font-bold text-xs hover:bg-slate-100 transition-colors shadow-sm"
              >
                <span>Acessar Formulário</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>

            {/* Ação 2: Consultar Protocolo */}
            <div className="bg-white/10 hover:bg-white/15 backdrop-blur-md rounded-2xl p-6 border border-white/15 flex flex-col justify-between transition-all duration-200 shadow-sm">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/25 text-white flex items-center justify-center">
                    <Search className="w-5 h-5 text-emerald-300" aria-hidden="true" />
                  </div>
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-emerald-500/25 text-emerald-200 border border-emerald-400/40">
                    Acompanhamento
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  Consultar Protocolo
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-6">
                  Acompanhe respostas e andamentos de manifestações utilizando seu Protocolo e Chave Secreta emitida no envio.
                </p>
              </div>
              <Link
                href="/fale-com-a-direcao/consulta"
                className="w-full inline-flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs transition-colors border border-white/20"
              >
                <span>Consultar Resposta</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>

            {/* Ação 3: Mural de Transparência */}
            <div className="bg-white/10 hover:bg-white/15 backdrop-blur-md rounded-2xl p-6 border border-white/15 flex flex-col justify-between transition-all duration-200 shadow-sm">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/25 text-white flex items-center justify-center">
                    <FileText className="w-5 h-5 text-purple-300" aria-hidden="true" />
                  </div>
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-purple-500/25 text-purple-200 border border-purple-400/40">
                    Público
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  Mural de Transparência
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-6">
                  Consulte resoluções, despachos e decisões homologadas pela Direção para ciência de toda a comunidade acadêmica.
                </p>
              </div>
              <Link
                href="/mural-de-transparencia"
                className="w-full inline-flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs transition-colors border border-white/20"
              >
                <span>Ver Mural Público</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
          </div>

          {/* Rodapé Informativo do Quadro */}
          <div className="relative z-10 pt-6 border-t border-white/15 flex flex-wrap items-center justify-between gap-4 text-xs text-blue-200">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" aria-hidden="true" />
              <span>Criptografia no cliente (Zero-Trust) • Conformidade com LAI (12.527/11) e LGPD (13.709/18)</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Lock className="w-4 h-4 text-amber-400 shrink-0" aria-hidden="true" />
              <span>Garantia de sigilo e não rastreabilidade para manifestantes anônimos</span>
            </div>
          </div>
        </div>
      </section>

      {/* Seção Dedicada: Guias de Uso do Sistema */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 mb-16">
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-[#0B3B60] mb-3">
                <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Documentação e Procedimentos Operacionais</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B3B60] tracking-tight mb-2">
                Guias de Uso do Sistema
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Consulte orientações passo a passo, normas de submissão acadêmica, procedimentos de curadoria e fluxos da ouvidoria institucional específicos para cada perfil da comunidade universitária.
              </p>
            </div>
            <Link
              href="/guias"
              className="text-sm font-bold text-[#0056B3] hover:text-[#0B3B60] hover:underline inline-flex items-center space-x-1 shrink-0"
            >
              <span>Acessar Central de Guias</span>
              <ArrowRight className="w-4 h-4 ml-1" aria-hidden="true" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* 1. Guia do Estudante */}
            <Link
              href="/guias/estudante"
              className="group bg-[#F7F9FC] hover:bg-white p-5 rounded-2xl border border-slate-200 hover:border-sky-300 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
                    <GraduationCap className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-sky-50 text-sky-800 border border-sky-200">
                    Estudante
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-[#0B3B60] transition-colors mb-1.5">
                  Guia do Estudante
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Pesquisa e leitura de artigos, download de PDFs oficiais, submissão de trabalhos e ouvidoria cidadã.
                </p>
              </div>
              <div className="flex items-center text-xs font-bold text-sky-700 group-hover:text-[#0B3B60] transition-colors pt-2 border-t border-slate-200/60">
                <span>Acessar Guia</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>

            {/* 2. Guia do Docente */}
            <Link
              href="/guias/docente"
              className="group bg-[#F7F9FC] hover:bg-white p-5 rounded-2xl border border-slate-200 hover:border-indigo-300 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                    <FileText className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-800 border border-indigo-200">
                    Docente
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-[#0B3B60] transition-colors mb-1.5">
                  Guia do Docente
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Submissão de artigos científicos e relatos de extensão, pipeline WebP, citações ABNT e acompanhamento in-app.
                </p>
              </div>
              <div className="flex items-center text-xs font-bold text-indigo-700 group-hover:text-[#0B3B60] transition-colors pt-2 border-t border-slate-200/60">
                <span>Acessar Guia</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>

            {/* 3. Guia da Coordenação */}
            <Link
              href="/guias/coordenador"
              className="group bg-[#F7F9FC] hover:bg-white p-5 rounded-2xl border border-slate-200 hover:border-emerald-300 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <UserCheck className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    Coordenação
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-[#0B3B60] transition-colors mb-1.5">
                  Guia da Coordenação
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Curadoria editorial departamental em 1 clique, modais de ajustes e gestão de publicações do colegiado.
                </p>
              </div>
              <div className="flex items-center text-xs font-bold text-emerald-700 group-hover:text-[#0B3B60] transition-colors pt-2 border-t border-slate-200/60">
                <span>Acessar Guia</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>

            {/* 4. Guia da Direção */}
            <Link
              href="/guias/direcao"
              className="group bg-[#F7F9FC] hover:bg-white p-5 rounded-2xl border border-slate-200 hover:border-blue-300 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#0B3B60] flex items-center justify-center">
                    <Building2 className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-blue-50 text-[#0B3B60] border border-blue-200">
                    Direção Geral
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-[#0B3B60] transition-colors mb-1.5">
                  Guia da Direção
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Governança, análise e despacho em ouvidoria com decodificação em RAM, homologação e custódia Shamir.
                </p>
              </div>
              <div className="flex items-center text-xs font-bold text-[#0B3B60] group-hover:text-[#0056B3] transition-colors pt-2 border-t border-slate-200/60">
                <span>Acessar Guia</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Selo de Governança & Conformidade */}
      <section className="bg-slate-50 border-t border-slate-200 py-12 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left">
          <div className="flex items-start space-x-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">Custo Zero e Sustentável</h3>
              <p className="text-xs text-slate-500 mt-1">
                Arquitetura soberana gratuita ancorada como projeto de extensão do curso de Sistemas de Informação.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Shield className="w-6 h-6 text-[#0056B3] flex-shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">Privacidade por Design (LGPD)</h3>
              <p className="text-xs text-slate-500 mt-1">
                Criptografia no navegador para manifestações privadas e desacoplamento do mural público.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Building2 className="w-6 h-6 text-[#0B3B60] flex-shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">Acessibilidade eMAG / WCAG</h3>
              <p className="text-xs text-slate-500 mt-1">
                Conformidade com os padrões governamentais brasileiros de acessibilidade digital.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
