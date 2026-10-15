'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { ItemMuralPublico, TipoManifestacao } from '@/types/ouvidoria';
import { obterItensMuralPublico } from '@/lib/data/mock-mural';
import { createClient } from '@/lib/supabase/client';

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
  carregarMural: () => Promise<void>;
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

  const carregarMural = useCallback(async () => {
    // 1. Carrega dados de contingência local primeiro
    const locais = obterItensMuralPublico();
    const mapa = new Map<string, ItemMuralPublico>();

    for (const item of locais) {
      if (item.protocoloReferencia) mapa.set(item.protocoloReferencia, item);
      else mapa.set(item.id, item);
    }

    // 2. Consulta tabela pública desacoplada mural_publico no Supabase (RLS SELECT liberado)
    try {
      const supabase = createClient();
      const { data: rowsDb, error } = await supabase
        .from('mural_publico')
        .select('*, cursos(sigla, nome)')
        .eq('is_active', true)
        .order('publicado_em', { ascending: false });

      if (!error && rowsDb && rowsDb.length > 0) {
        for (const row of rowsDb) {
          const itemRemoto: ItemMuralPublico = {
            id: row.id,
            protocoloReferencia: row.protocolo_referencia,
            cursoSigla: (row.cursos?.sigla || 'GERAL') as any,
            tipo: 'solicitacao' as TipoManifestacao,
            manifestacaoResumo: row.manifestacao_resumo,
            respostaOficial: row.resposta_oficial,
            numeroPortaria: row.numero_portaria || undefined,
            statusHomologacao: 'Homologado e Respondido',
            isActive: row.is_active,
            dataManifestacao: row.data_manifestacao
              ? new Date(row.data_manifestacao).toLocaleDateString('pt-BR')
              : '',
            publicadoEm: row.publicado_em
              ? new Date(row.publicado_em).toLocaleDateString('pt-BR')
              : '',
          };
          mapa.set(row.protocolo_referencia, itemRemoto);
        }
      }
    } catch (errSupabase) {
      console.warn('Aviso: Falha ao carregar mural do Supabase, operando com cache:', errSupabase);
    }

    if (mapa.size > 0) {
      setItens(Array.from(mapa.values()));
    }
  }, []);

  useEffect(() => {
    carregarMural();
  }, [carregarMural]);

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
    carregarMural,
  };
}
