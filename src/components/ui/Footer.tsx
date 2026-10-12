import React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#002244] text-slate-300 mt-auto border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Informações Institucionais */}
          <div>
            <h2 className="text-white text-base font-bold mb-3 tracking-wide">
              UEMG — Unidade Carangola
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              Universidade do Estado de Minas Gerais. Promovendo o desenvolvimento
              científico, cultural e social na Zona da Mata Mineira.
            </p>
            <div className="text-xs text-slate-400 space-y-1">
              <p>Praça dos Estudantes, 23 — Centro</p>
              <p>Carangola - MG, CEP: 36800-000</p>
            </div>
          </div>

          {/* Links e Transparência */}
          <div>
            <h2 className="text-white text-base font-bold mb-3 tracking-wide">
              Transparência & Governança
            </h2>
            <ul className="text-sm space-y-2 text-slate-400">
              <li>
                <Link href="/fale-com-a-direcao#mural" className="hover:text-white transition-colors">
                  Mural de Decisões Homologadas
                </Link>
              </li>
              <li>
                <Link href="/fale-com-a-direcao/consulta" className="hover:text-white transition-colors">
                  Acompanhar Protocolo de Ouvidoria
                </Link>
              </li>
              <li>
                <Link href="/termos-de-uso" className="hover:text-white transition-colors">
                  Termos de Uso do Portal
                </Link>
              </li>
              <li>
                <Link href="/acessibilidade-e-privacidade" className="hover:text-white transition-colors">
                  Acessibilidade &amp; Privacidade (LGPD)
                </Link>
              </li>
              <li>
                <a
                  href="https://www.uemg.br"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Site Oficial da UEMG ↗
                </a>
              </li>
              <li>
                <a
                  href="https://www.transparencia.mg.gov.br"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Portal da Transparência MG ↗
                </a>
              </li>
            </ul>
          </div>

          {/* Conformidade e Sustentação Técnica */}
          <div>
            <h2 className="text-white text-base font-bold mb-3 tracking-wide">
              Sustentação Tecnológica
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Projeto mantido pelo Curso de <strong>Sistemas de Informação</strong> da
              UEMG Carangola sob arquitetura soberana de custo zero.
            </p>
            <Link
              href="/acessibilidade-e-privacidade"
              className="group inline-flex items-center space-x-1.5 px-3 py-1.5 rounded bg-[#0B3B60] hover:bg-[#003366] text-xs font-semibold text-slate-200 hover:text-white border border-slate-700 hover:border-slate-500 transition-all shadow-sm focus-visible:outline-2 focus-visible:outline-[#0056B3]"
              title="Acessar documentação detalhada sobre Acessibilidade eMAG / WCAG 2.1 AA e Política de Privacidade LGPD"
            >
              <span>Padrão eMAG &amp; WCAG 2.1 AA | LGPD Compliant</span>
              <span className="text-amber-300 group-hover:translate-x-0.5 transition-transform" aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4">
          <p suppressHydrationWarning>© {new Date().getFullYear()} Universidade do Estado de Minas Gerais. Todos os direitos reservados.</p>
          <div className="flex items-center space-x-4">
            <Link href="/termos-de-uso" className="hover:text-slate-300 transition-colors underline-offset-2 hover:underline">
              Termos de Uso
            </Link>
            <span aria-hidden="true">•</span>
            <Link href="/acessibilidade-e-privacidade" className="hover:text-slate-300 transition-colors underline-offset-2 hover:underline">
              Acessibilidade &amp; Privacidade
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
