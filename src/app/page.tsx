import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BookOpen, MessageSquare, Shield, CheckCircle2, ArrowRight, Building2 } from 'lucide-react';
import { ARTIGOS_MOCK, CURSOS_LISTA } from '@/lib/data/mock-articles';
import { FeaturedArticle } from '@/components/editorial/FeaturedArticle';
import { ArticleCard } from '@/components/editorial/ArticleCard';

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
            <Link
              href="/artigos"
              className="inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-lg bg-white text-[#0B3B60] font-bold text-sm shadow-md hover:bg-slate-100 transition-colors"
            >
              <BookOpen className="w-4 h-4 text-[#0B3B60]" aria-hidden="true" />
              <span>Explorar Publicações</span>
              <ArrowRight className="w-4 h-4 ml-1" aria-hidden="true" />
            </Link>

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

      {/* Dois Pilares Institucionais */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pilar 1 */}
          <div className="bg-white rounded-xl p-6 sm:p-8 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-lg bg-blue-50 text-[#0056B3] flex items-center justify-center mb-5">
              <BookOpen className="w-6 h-6" aria-hidden="true" />
            </div>
            <h2 className="text-xl font-bold text-[#0B3B60] mb-3">
              1. Disseminação do Conhecimento
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed mb-6">
              Artigos, ensaios técnicos, crônicas e projetos de extensão categorizados por curso,
              com destaques automatizados e geração on-the-fly de cópias oficiais em PDF.
            </p>
            <Link
              href="/artigos"
              className="text-sm font-bold text-[#0056B3] hover:text-[#0B3B60] inline-flex items-center space-x-1"
            >
              <span>Ver acervo de publicações</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>

          {/* Pilar 2 */}
          <div className="bg-white rounded-xl p-6 sm:p-8 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-lg bg-blue-50 text-[#0056B3] flex items-center justify-center mb-5">
              <MessageSquare className="w-6 h-6" aria-hidden="true" />
            </div>
            <h2 className="text-xl font-bold text-[#0B3B60] mb-3">
              2. Governança & Fale com a Direção
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed mb-6">
              Envio anônimo ou identificado com chave criptográfica exclusiva (Zero-Trust),
              acompanhamento por protocolo institucional e mural público de resoluções homologadas.
            </p>
            <Link
              href="/fale-com-a-direcao"
              className="text-sm font-bold text-[#0056B3] hover:text-[#0B3B60] inline-flex items-center space-x-1"
            >
              <span>Enviar demanda ou consultar mural</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

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

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {CURSOS_LISTA.map((curso) => (
            <Link
              key={curso.sigla}
              href={`/cursos/${curso.sigla.toLowerCase()}`}
              className={`p-4 rounded-xl border ${curso.corBadge} transition-all hover:-translate-y-1 hover:shadow-sm block text-decoration-none`}
            >
              <span className="text-xs font-black tracking-wider block opacity-75">
                {curso.sigla}
              </span>
              <span className="text-sm font-bold block mt-1 leading-snug">
                {curso.nome}
              </span>
            </Link>
          ))}
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
