'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { ItemMuralPublico } from '@/types/ouvidoria';
import { obterItensMuralPublico } from '@/lib/data/mock-mural';

export interface UseMuralTransparenciaReturn {
  itens: ItemMuralPublico[];
  itensFiltrados: ItemMuralPublico[];
  busca: string;
  setBusca: (busca: string) => void;
  cursoSelecionado: string;
  setCursoSelecionado: (curso: string) => void;
  tipoSelecionado: string;
  setTipoSelecionado: (tipo: string) => void;
  limparFiltros: () => void;
}

/**
 * Hook customizado para o Mural de Transparência do Gabinete.
 * Encapsula sincronização reativa com dados higienizados e filtragem multicritério com memoização.
 */
export function useMuralTransparencia(
  itensIniciais: ItemMuralPublico[]
): UseMuralTransparenciaReturn {
  const [itens, setItens] = useState<ItemMuralPublico[]>(itensIniciais);
  const [busca, setBusca] = useState('');
  const [cursoSelecionado, setCursoSelecionado] = useState<string>('TODOS');
  const [tipoSelecionado, setTipoSelecionado] = useState<string>('TODOS');

  // Atualiza com dados persistidos no cliente (localStorage)
  useEffect(() => {
    setItens(obterItensMuralPublico());
  }, []);

  const limparFiltros = useCallback(() => {
    setBusca('');
    setCursoSelecionado('TODOS');
    setTipoSelecionado('TODOS');
  }, []);

  const itensFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    return itens.filter((item) => {
      // 1. Apenas ativos
      if (!item.isActive) return false;

      // 2. Busca textual
      if (termo) {
        const bateTexto =
          item.protocoloReferencia.toLowerCase().includes(termo) ||
          item.manifestacaoResumo.toLowerCase().includes(termo) ||
          item.respostaOficial.toLowerCase().includes(termo) ||
          (item.numeroPortaria && item.numeroPortaria.toLowerCase().includes(termo));
        if (!bateTexto) return false;
      }

      // 3. Filtro por curso
      if (cursoSelecionado !== 'TODOS' && item.cursoSigla !== cursoSelecionado) {
        return false;
      }

      // 4. Filtro por tipo
      if (tipoSelecionado !== 'TODOS' && item.tipo !== tipoSelecionado) {
        return false;
      }

      return true;
    });
  }, [itens, busca, cursoSelecionado, tipoSelecionado]);

  return {
    itens,
    itensFiltrados,
    busca,
    setBusca,
    cursoSelecionado,
    setCursoSelecionado,
    tipoSelecionado,
    setTipoSelecionado,
    limparFiltros,
  };
}
