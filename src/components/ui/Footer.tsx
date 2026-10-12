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
            <div className="inline-block px-3 py-1.5 rounded bg-[#0B3B60] text-xs text-slate-200 border border-slate-700">
              Padrão eMAG & WCAG 2.1 AA | LGPD Compliant
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Universidade do Estado de Minas Gerais. Todos os direitos reservados.</p>
          <p>Desenvolvido com foco em Privacidade, Acessibilidade e Transparência Pública.</p>
        </div>
      </div>
    </footer>
  );
};
