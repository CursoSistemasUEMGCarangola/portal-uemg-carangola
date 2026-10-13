import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Scale, FileText, ArrowLeft, ShieldCheck, CheckCircle2, AlertCircle, BookOpen } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Termos de Uso do Portal Acadêmico — UEMG Carangola',
  description:
    'Termos e condições gerais de uso do Portal UEMG Carangola, regendo o acesso às publicações acadêmicas dos 8 cursos e a utilização do canal de ouvidoria com o Gabinete da Direção.',
};

export default function TermosDeUsoPage() {
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

        {/* Cabeçalho */}
        <header className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-sm">
          <div className="flex items-center space-x-2 text-xs font-bold text-[#0056B3] uppercase tracking-wider mb-2">
            <Scale className="w-4 h-4" aria-hidden="true" />
            <span>Regulamento Institucional do Portal</span>
          </div>

          <h1 className="text-2xl sm:text-3.5xl font-extrabold text-[#0B3B60] leading-tight mb-4">
            Termos e Condições Gerais de Uso
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Bem-vindo ao Portal Oficial da <strong>Universidade do Estado de Minas Gerais — Unidade Acadêmica de Carangola</strong>.
            Ao navegar nesta plataforma, submeter artigos científicos ou encaminhar manifestações de ouvidoria, você concorda
            com as diretrizes, termos e condições estabelecidos neste documento.
          </p>
        </header>

        {/* Conteúdo dos Termos de Uso */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-8 text-sm text-slate-700 leading-relaxed">
          {/* Seção 1 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-[#0B3B60] flex items-center space-x-2 border-b border-slate-100 pb-2">
              <span className="text-[#0056B3]">1.</span>
              <span>Objeto e Finalidade do Portal</span>
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              O Portal UEMG Carangola tem por finalidade constituir um repositório institucional e veículo unificado de
              divulgação científica, cultural e de extensão para os 8 cursos de graduação da Unidade (Ciências Biológicas,
              Geografia, História, Letras, Matemática, Pedagogia, Serviço Social e Sistemas de Informação), bem como prover um
              canal autônomo e seguro para a governança participativa e ouvidoria junto ao Gabinete da Direção Geral.
            </p>
          </section>

          {/* Seção 2 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-[#0B3B60] flex items-center space-x-2 border-b border-slate-100 pb-2">
              <span className="text-[#0056B3]">2.</span>
              <span>Acesso Livre e Universal (Open Access)</span>
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              O acesso aos artigos, ensaios e produções acadêmicas do portal é totalmente público, gratuito e universal. Não
              é cobrada qualquer taxa para leitura, download de separatas em PDF ou replicação para fins educativos e de
              pesquisa científica, desde que observada a devida atribuição de autoria conforme as normas da ABNT.
            </p>
          </section>

          {/* Seção 3 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-[#0B3B60] flex items-center space-x-2 border-b border-slate-100 pb-2">
              <span className="text-[#0056B3]">3.</span>
              <span>Propriedade Intelectual e Submissão de Trabalhos</span>
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              Ao submeter artigos através da plataforma:
            </p>
            <ul className="space-y-2 text-xs text-slate-600 list-disc list-inside pl-2">
              <li>
                Os autores declaram que a obra é original, de sua própria autoria ou coautoria legítima, e que não infringe
                direitos autorais de terceiros nem incorre em plágio acadêmico.
              </li>
              <li>
                Os direitos autorais morais permanecem com seus respectivos autores, que concedem à UEMG Carangola o direito não
                exclusivo de publicação digital e preservação no acervo permanente.
              </li>
              <li>
                Todos os trabalhos submetidos passam pelo crivo e aprovação da respectiva Coordenação de Curso antes da
                homologação final para o catálogo público.
              </li>
            </ul>
          </section>

          {/* Seção 4 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-[#0B3B60] flex items-center space-x-2 border-b border-slate-100 pb-2">
              <span className="text-[#0056B3]">4.</span>
              <span>Uso do Canal &quot;Fale com a Direção&quot; (Ouvidoria)</span>
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              O canal de ouvidoria deve ser utilizado em estrita boa-fé para o aprimoramento institucional:
            </p>
            <ul className="space-y-2 text-xs text-slate-600 list-disc list-inside pl-2">
              <li>
                É assegurado o direito ao <strong>anonimato integral</strong> ou à manifestação identificada com garantia
                inviolável de sigilo funcional.
              </li>
              <li>
                São expressamente vedadas manifestações de calúnia, injúria, difamação deliberada ou denúncias sabidamente
                falsas, sujeitando o infrator às sanções disciplinares, administrativas e penais cabíveis.
              </li>
              <li>
                <strong>Guarda do Protocolo e Token:</strong> O emitente é o único responsável pela guarda e preservação do seu
                Código de Protocolo e Token Secreto de 24 caracteres emitidos no ato do envio. Em razão da arquitetura Zero-Trust,
                o portal não possui mecanismos de &quot;recuperação de token&quot; sem comprovação de titularidade.
              </li>
            </ul>
          </section>

          {/* Seção 5 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-[#0B3B60] flex items-center space-x-2 border-b border-slate-100 pb-2">
              <span className="text-[#0056B3]">5.</span>
              <span>Segurança, Integridade e Vedações Técnicas</span>
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              É estritamente proibido aos usuários:
            </p>
            <ul className="space-y-2 text-xs text-slate-600 list-disc list-inside pl-2">
              <li>Realizar ataques de negação de serviço (DoS/DDoS) contra os serviços da aplicação ou bancos de dados;</li>
              <li>Tentar explorar vulnerabilidades de enumeração de protocolos de ouvidoria ou contornar as rotinas criptográficas;</li>
              <li>Utilizar robôs (scrapers) com taxas abusivas de requisições que comprometam os limites operacionais da infraestrutura;</li>
              <li>Inserir scripts maliciosos, códigos executáveis ou payloads nos formulários de submissão do portal.</li>
            </ul>
          </section>

          {/* Seção 6 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-[#0B3B60] flex items-center space-x-2 border-b border-slate-100 pb-2">
              <span className="text-[#0056B3]">6.</span>
              <span>Sustentação Tecnológica e Governança Acadêmica</span>
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              O Portal é desenvolvido e mantido pelo Colegiado de Sistemas de Informação da UEMG Carangola sob a filosofia de
              Arquitetura Autônoma de Custo Zero. A Universidade reserva-se o direito de atualizar funcionalidades, aplicar
              melhorias de segurança e revisar estes termos periodicamente para manter a conformidade com a legislação pública
              vigente.
            </p>
          </section>

          {/* Seção 7 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-[#0B3B60] flex items-center space-x-2 border-b border-slate-100 pb-2">
              <span className="text-[#0056B3]">7.</span>
              <span>Legislação Aplicável e Foro</span>
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              Estes Termos de Uso são regidos pelas leis da República Federativa do Brasil, em especial pela Lei de Acesso à
              Informação (Lei 12.527/2011), Marco Civil da Internet (Lei 12.965/2014) e Lei Geral de Proteção de Dados Pessoais
              (Lei 13.709/2018). Fica eleito o Foro da Comarca de Carangola, Estado de Minas Gerais, para dirimir quaisquer
              controvérsias oriundas da utilização desta plataforma.
            </p>
          </section>
        </div>

        {/* Rodapé Interno */}
        <div className="bg-slate-100 rounded-2xl p-6 border border-slate-200 text-xs text-slate-600 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-bold text-slate-800">UEMG Unidade Carangola — Gestão Institucional</p>
            <p>Última atualização dos termos: Outubro de 2026</p>
          </div>
          <Link
            href="/acessibilidade-e-privacidade"
            className="text-[#0056B3] hover:text-[#0B3B60] font-semibold underline underline-offset-2 transition-colors"
          >
            Conhecer a Política de Privacidade e Acessibilidade →
          </Link>
        </div>
      </div>
    </div>
  );
}
