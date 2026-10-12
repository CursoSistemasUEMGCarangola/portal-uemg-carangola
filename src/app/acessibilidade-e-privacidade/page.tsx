import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import {
  ShieldCheck,
  Eye,
  Lock,
  Volume2,
  Keyboard,
  FileCheck2,
  Scale,
  ArrowLeft,
  CheckCircle2,
  HelpCircle,
  Sparkles,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Acessibilidade Digital (eMAG/WCAG) & Política de Privacidade (LGPD) — UEMG Carangola',
  description:
    'Documentação técnica detalhada sobre a aplicação dos padrões de acessibilidade eMAG e WCAG 2.1 AA, guia de uso para leitores de tela e a Política de Privacidade e Proteção de Dados (LGPD) do Portal UEMG Carangola.',
};

export default function AcessibilidadeEPrivacidadePage() {
  return (
    <div className="w-full bg-[#F7F9FC] py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-8 space-y-8">
        {/* Breadcrumb / Voltar */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center space-x-1.5 text-xs sm:text-sm font-semibold text-[#0056B3] hover:text-[#0B3B60] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span>Voltar para o início do portal</span>
          </Link>
        </div>

        {/* Cabeçalho Principal */}
        <header className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-sm">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-[#0B3B60] border border-blue-200">
              <Eye className="w-3.5 h-3.5 text-[#0056B3]" aria-hidden="true" />
              <span>eMAG & WCAG 2.1 Nível AA</span>
            </span>
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
              <span>LGPD Compliant (Lei 13.709/2018)</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-3.5xl font-extrabold text-[#0B3B60] leading-tight mb-4">
            Acessibilidade Digital &amp; Política de Privacidade
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            O Portal da <strong>Universidade do Estado de Minas Gerais — Unidade Acadêmica de Carangola</strong> foi
            concebido como uma infraestrutura pública soberana, garantindo acesso universal, inclusivo e transparente a
            toda a comunidade acadêmica e à sociedade civil, com proteção rigorosa da privacidade e dos dados dos cidadãos.
          </p>
        </header>

        {/* Bloco 1: Acessibilidade Digital (eMAG / WCAG 2.1 AA) */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl font-bold text-[#0B3B60] flex items-center space-x-2">
              <Eye className="w-6 h-6 text-[#0056B3]" aria-hidden="true" />
              <span>1. Padrões de Acessibilidade Digital (eMAG &amp; WCAG 2.1 AA)</span>
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              Atendimento ao Modelo de Acessibilidade em Governo Eletrônico (eMAG), ao Estatuto da Pessoa com Deficiência
              (Lei Federal 13.146/2015) e às diretrizes internacionais do W3C/WAI.
            </p>
          </div>

          {/* Recursos Implementados */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="flex items-center space-x-2 text-[#0B3B60] font-bold text-sm">
                <Keyboard className="w-4 h-4 text-[#0056B3]" aria-hidden="true" />
                <span>Atalho de Salto (Skip Link)</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Pressionar a tecla <kbd className="px-1.5 py-0.5 bg-white border rounded font-mono text-2xs">Tab</kbd> no
                carregamento da página revela o botão de salto imediato para o conteúdo principal, dispensando a navegação
                repetitiva por menus de cabeçalho.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="flex items-center space-x-2 text-[#0B3B60] font-bold text-sm">
                <Eye className="w-4 h-4 text-[#0056B3]" aria-hidden="true" />
                <span>Alto Contraste Cromático (&ge; 4.5:1)</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                A paleta institucional emprega azul escuro (<code className="text-2xs font-mono">#0B3B60</code>) sobre
                branco com proporção superior a <strong>10.4:1</strong> (superando a recomendação nível AAA), assegurando
                leitura confortável para pessoas com baixa visão ou daltonismo.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="flex items-center space-x-2 text-[#0B3B60] font-bold text-sm">
                <Volume2 className="w-4 h-4 text-[#0056B3]" aria-hidden="true" />
                <span>Leitura em Voz Alta Integrada</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                O portal possui reprodutor nativo com síntese de voz (Web Speech API) nos artigos acadêmicos, permitindo
                ouvir o resumo e o corpo do trabalho com controle de velocidade e pausa sem exigir softwares externos.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="flex items-center space-x-2 text-[#0B3B60] font-bold text-sm">
                <FileCheck2 className="w-4 h-4 text-[#0056B3]" aria-hidden="true" />
                <span>Semântica HTML5 &amp; ARIA</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Estruturação rigorosa com cabeçalhos ordenados (<code className="text-2xs font-mono">&lt;h1&gt;</code> a{' '}
                <code className="text-2xs font-mono">&lt;h3&gt;</code>), formulários com labels explicitamente vinculados
                por ID e ícones anotados com <code className="text-2xs font-mono">aria-hidden=&quot;true&quot;</code>.
              </p>
            </div>
          </div>

          {/* Guia de Atalhos e Como Usar */}
          <div className="bg-blue-50/60 rounded-xl p-5 border border-blue-200 space-y-3">
            <h3 className="text-sm font-bold text-[#0B3B60] flex items-center space-x-1.5">
              <HelpCircle className="w-4 h-4 text-[#0056B3]" aria-hidden="true" />
              <span>Como Utilizar os Recursos de Acessibilidade no seu Computador</span>
            </h3>

            <div className="space-y-2 text-xs text-slate-700 leading-relaxed">
              <p>
                <strong>1. Navegação Exclusiva por Teclado:</strong> Utilize{' '}
                <kbd className="px-1.5 py-0.5 bg-white border rounded font-mono">Tab</kbd> para avançar entre links e
                campos de formulários,{' '}
                <kbd className="px-1.5 py-0.5 bg-white border rounded font-mono">Shift + Tab</kbd> para retroceder e{' '}
                <kbd className="px-1.5 py-0.5 bg-white border rounded font-mono">Enter</kbd> ou{' '}
                <kbd className="px-1.5 py-0.5 bg-white border rounded font-mono">Espaço</kbd> para acionar botões. Modais e
                janelas de diálogo podem ser fechados a qualquer instante com a tecla{' '}
                <kbd className="px-1.5 py-0.5 bg-white border rounded font-mono">Esc</kbd>.
              </p>
              <p>
                <strong>2. Ativação do Narrador Nativo do Windows:</strong> Pressione o atalho{' '}
                <kbd className="px-1.5 py-0.5 bg-white border rounded font-mono">Windows + Ctrl + Enter</kbd>. O Narrador
                será iniciado imediatamente e vocalizará os elementos da tela. Para desativar, pressione o mesmo atalho.
              </p>
              <p>
                <strong>3. Leitura em Voz Alta nos Navegadores (Edge / Chrome):</strong> Pressione{' '}
                <kbd className="px-1.5 py-0.5 bg-white border rounded font-mono">Ctrl + Shift + U</kbd> ou clique com o
                botão direito do mouse em qualquer texto e selecione <em>&quot;Ler em voz alta&quot;</em>.
              </p>
              <p>
                <strong>4. Ajuste de Tamanho e Zoom:</strong> O layout é totalmente elástico e suporta ampliações de até
                <strong> 200% a 400%</strong> através do atalho{' '}
                <kbd className="px-1.5 py-0.5 bg-white border rounded font-mono">Ctrl + +</kbd> sem perda de conteúdo ou
                quebra de fluxo visual.
              </p>
            </div>
          </div>
        </section>

        {/* Bloco 2: LGPD Compliant & Política de Privacidade */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl font-bold text-[#0B3B60] flex items-center space-x-2">
              <ShieldCheck className="w-6 h-6 text-emerald-600" aria-hidden="true" />
              <span>2. Política de Privacidade &amp; Conformidade LGPD (Lei 13.709/2018)</span>
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              Transparência pública, minimização de dados e segurança da informação aplicadas às manifestações de ouvidoria
              e submissões acadêmicas.
            </p>
          </div>

          <div className="space-y-5 text-sm text-slate-700 leading-relaxed">
            <div>
              <h3 className="font-bold text-[#0B3B60] text-base mb-1.5 flex items-center space-x-1.5">
                <Lock className="w-4 h-4 text-[#0056B3]" aria-hidden="true" />
                <span>A. Criptografia de Envelope e Blindagem Zero-Trust na Ouvidoria</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                No canal <strong>&quot;Fale com a Direção&quot;</strong>, denúncias, solicitações e elogios são protegidos por
                criptografia de ponta a ponta processada estritamente no navegador do cidadão (*Client-Side Encryption*):
              </p>
              <ul className="mt-2 space-y-1.5 text-xs text-slate-600 list-disc list-inside pl-2">
                <li>
                  O conteúdo da mensagem é cifrado com o algoritmo simétrico <strong>AES-GCM de 256 bits</strong> utilizando
                  uma chave efêmera de dados (DEK).
                </li>
                <li>
                  A chave de dados é envelopada assimetricamente com <strong>RSA-OAEP de 4096 bits</strong> utilizando a chave
                  pública institucional do Gabinete da Direção.
                </li>
                <li>
                  O banco de dados na nuvem armazena unicamente o conteúdo cifrado e bytes ilegíveis. Nem desenvolvedores,
                  monitores ou terceiros com acesso à infraestrutura possuem meios técnicos para acessar o teor das mensagens.
                </li>
                <li>
                  A abertura de manifestações sigilosas exige a recombinação descentralizada de chaves via algoritmo de
                  partição de segredos de <strong>Shamir (quórum 2-de-3)</strong>, custodiadas pela Direção Geral, Secretaria
                  e Congregação da Unidade.
                </li>
              </ul>
            </div>

            <div className="border-t border-slate-100 pt-4">
              <h3 className="font-bold text-[#0B3B60] text-base mb-1.5 flex items-center space-x-1.5">
                <Scale className="w-4 h-4 text-[#0056B3]" aria-hidden="true" />
                <span>B. Anonimato Real e Proteção Anti-Enumeração</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                O cidadão possui o direito de se manifestar de forma <strong>100% anônima</strong>. Nesses casos, o sistema
                não solicita nome, e-mail, matrícula ou qualquer outro dado pessoal identificável. Para manifestações
                identificadas, os dados são restritos ao Gabinete da Direção e jamais são divulgados no Mural de Transparência.
              </p>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                A consulta de andamento exige obrigatoriamente a tupla formada pelo <strong>Código de Protocolo</strong> e um{' '}
                <strong>Token Secreto de 24 caracteres</strong> de alta entropia. O sistema implementa defesas ativas contra
                tentativas de força bruta e ataques de temporização (*timing attacks*) com atraso fixo proposital de 400ms.
              </p>
            </div>

            <div className="border-t border-slate-100 pt-4">
              <h3 className="font-bold text-[#0B3B60] text-base mb-1.5 flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" aria-hidden="true" />
                <span>C. Higiene Operacional em Terminais Compartilhados</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Pensando nos acessos realizados em bibliotecas e laboratórios de informática, o portal não utiliza cookies
                persistentes de rastreamento de terceiros nem armazena dados confidenciais permanentemente no disco local. O
                botão de encerramento de sessão emite a diretiva HTTP oficial{' '}
                <code className="text-xs font-mono bg-slate-100 px-1 py-0.5 rounded">Clear-Site-Data</code>, instruindo o
                navegador a purgar imediatamente o cache e memórias residuais daquela máquina.
              </p>
            </div>

            <div className="border-t border-slate-100 pt-4">
              <h3 className="font-bold text-[#0B3B60] text-base mb-1.5 flex items-center space-x-1.5">
                <FileCheck2 className="w-4 h-4 text-[#0056B3]" aria-hidden="true" />
                <span>D. Direitos dos Titulares de Dados Pessoais</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Em consonância com o Artigo 18 da LGPD, qualquer membro da comunidade acadêmica que tenha submetido artigos
                ou manifestações identificadas poderá solicitar confirmação da existência de tratamento, retificação de dados
                incompletos ou esclarecimentos diretamente ao Gabinete da Direção Geral da UEMG Carangola ou ao Encarregado de
                Proteção de Dados da Universidade.
              </p>
            </div>
          </div>
        </section>

        {/* Rodapé Interno com Contato */}
        <div className="bg-slate-100 rounded-2xl p-6 border border-slate-200 text-xs text-slate-600 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-bold text-slate-800">Universidade do Estado de Minas Gerais — Unidade Carangola</p>
            <p>Gabinete da Direção Geral &amp; Colegiado de Sistemas de Informação</p>
          </div>
          <Link
            href="/termos-de-uso"
            className="text-[#0056B3] hover:text-[#0B3B60] font-semibold underline underline-offset-2 transition-colors"
          >
            Consultar Termos de Uso do Portal →
          </Link>
        </div>
      </div>
    </div>
  );
}
