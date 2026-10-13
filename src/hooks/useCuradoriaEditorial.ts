'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Artigo, SiglaCurso } from '@/types/editorial';
import {
  obterArtigosConsolidados,
  aplicarDecisaoEditorial,
} from '@/lib/data/mock-articles';

export type FiltroAbaCuradoria = 'pendentes' | 'todos' | 'publicados';

export interface UseCuradoriaEditorialReturn {
  cursoSelecionado: SiglaCurso;
  setCursoSelecionado: (sigla: SiglaCurso) => void;
  artigosFiltrados: Artigo[];
  filtroAba: FiltroAbaCuradoria;
  setFiltroAba: (aba: FiltroAbaCuradoria) => void;
  busca: string;
  setBusca: (busca: string) => void;
  artigoEmAcao: Artigo | null;
  setArtigoEmAcao: (artigo: Artigo | null) => void;
  acaoModal: 'solicitar_ajustes' | 'rejeitar' | null;
  setAcaoModal: (acao: 'solicitar_ajustes' | 'rejeitar' | null) => void;
  mensagemSucesso: string | null;
  contadores: {
    pendentes: number;
    publicados: number;
    todos: number;
  };
  handleAprovar: (artigo: Artigo) => void;
  handleConfirmarModal: (
    artigoId: string,
    acao: 'solicitar_ajustes' | 'rejeitar',
    notas: string
  ) => void;
  recarregarArtigos: () => void;
}

/**
 * Hook orquestrador do Painel Departamental de Coordenação (Curadoria Editorial).
 * Isola gestão de estado, filtragem por departamento (RLS simulado) e decisões editoriais.
 */
export function useCuradoriaEditorial(): UseCuradoriaEditorialReturn {
  const [cursoSelecionado, setCursoSelecionado] = useState<SiglaCurso>('SIS');
  const [artigos, setArtigos] = useState<Artigo[]>([]);
  const [filtroAba, setFiltroAba] = useState<FiltroAbaCuradoria>('pendentes');
  const [busca, setBusca] = useState('');

  const [artigoEmAcao, setArtigoEmAcao] = useState<Artigo | null>(null);
  const [acaoModal, setAcaoModal] = useState<'solicitar_ajustes' | 'rejeitar' | null>(null);
  const [mensagemSucesso, setMensagemSucesso] = useState<string | null>(null);

  const recarregarArtigos = useCallback(() => {
    setArtigos(obterArtigosConsolidados());
  }, []);

  useEffect(() => {
    recarregarArtigos();
  }, [recarregarArtigos]);

  // Filtragem departamental: Coordenador enxerga apenas o seu departamento
  const artigosDoCurso = useMemo(() => {
    return artigos.filter((a) => a.curso.sigla === cursoSelecionado);
  }, [artigos, cursoSelecionado]);

  const contadores = useMemo(() => {
    return {
      pendentes: artigosDoCurso.filter(
        (a) => a.status === 'submetido' || a.status === 'em_revisao'
      ).length,
      publicados: artigosDoCurso.filter(
        (a) => a.status === 'publicado' || !a.status
      ).length,
      todos: artigosDoCurso.length,
    };
  }, [artigosDoCurso]);

  const artigosFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    return artigosDoCurso.filter((a) => {
      // 1. Busca textual
      if (termo) {
        const bateTexto =
          a.titulo.toLowerCase().includes(termo) ||
          a.autorNome.toLowerCase().includes(termo) ||
          (a.autorMatricula && a.autorMatricula.toLowerCase().includes(termo));
        if (!bateTexto) return false;
      }

      // 2. Filtro por aba
      if (filtroAba === 'pendentes') {
        return a.status === 'submetido' || a.status === 'em_revisao';
      }
      if (filtroAba === 'publicados') {
        return a.status === 'publicado' || !a.status;
      }
      return true; // 'todos'
    });
  }, [artigosDoCurso, busca, filtroAba]);

  // Ação 1-Clique: Aprovar e Publicar Imediatamente
  const handleAprovar = useCallback(
    (artigo: Artigo) => {
      if (confirm(`Confirma a aprovação e publicação imediata do artigo "${artigo.titulo}"?`)) {
        aplicarDecisaoEditorial({
          artigoId: artigo.id,
          acao: 'aprovar',
        });
        recarregarArtigos();
        setMensagemSucesso(`Artigo "${artigo.titulo}" aprovado e publicado com sucesso no Portal!`);
        setTimeout(() => setMensagemSucesso(null), 5000);
      }
    },
    [recarregarArtigos]
  );

  // Ação Modal: Confirmar Correções ou Rejeição
  const handleConfirmarModal = useCallback(
    (artigoId: string, acao: 'solicitar_ajustes' | 'rejeitar', notas: string) => {
      aplicarDecisaoEditorial({
        artigoId,
        acao,
        notas,
      });
      setArtigoEmAcao(null);
      setAcaoModal(null);
      recarregarArtigos();
      setMensagemSucesso(
        acao === 'solicitar_ajustes'
          ? 'Solicitação de correções enviada ao autor no painel in-app.'
          : 'Artigo arquivado/rejeitado com a devida justificativa.'
      );
      setTimeout(() => setMensagemSucesso(null), 5000);
    },
    [recarregarArtigos]
  );

  return {
    cursoSelecionado,
    setCursoSelecionado,
    artigosFiltrados,
    filtroAba,
    setFiltroAba,
    busca,
    setBusca,
    artigoEmAcao,
    setArtigoEmAcao,
    acaoModal,
    setAcaoModal,
    mensagemSucesso,
    contadores,
    handleAprovar,
    handleConfirmarModal,
    recarregarArtigos,
  };
}
