import React from 'react';

/**
 * Componente SkipLink para conformidade com eMAG e WCAG 2.1 AA.
 * Permite que usuários de leitores de tela ou teclado saltem diretamente para o conteúdo principal.
 */
export const SkipLink: React.FC = () => {
  return (
    <a href="#conteudo-principal" className="skip-link">
      Pular para o conteúdo principal
    </a>
  );
};
