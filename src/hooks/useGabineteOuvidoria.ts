'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { ProtocoloInterno, DespachoDirecaoInput } from '@/types/ouvidoria';
import {
  obterProtocolosArmazenados,
  aplicarDespachoDirecao,
} from '@/lib/data/mock-ouvidoria';

export type FiltroStatusGabinete =
  | 'todos'
  | 'pendentes'
  | 'em_analise'
  | 'respondidos'
  | 'homologados';

export interface UseGabineteOuvidoriaReturn {
  protocolos: ProtocoloInterno[];
  protocolosFiltrados: ProtocoloInterno[];
  busca: string;
  setBusca: (busca: string) => void;
  filtroStatus: FiltroStatusGabinete;
  setFiltroStatus: (filtro: FiltroStatusGabinete) => void;
  filtroCurso: string;
  setFiltroCurso: (curso: string) => void;
  protocoloEmAcao: ProtocoloInterno | null;
  setProtocoloEmAcao: (proto: ProtocoloInterno | null) => void;
  mensagemSucesso: string | null;
  metricas: {
    total: number;
    pendentes: number;
    emAnalise: number;
    respondidos: number;
    homologados: number;
  };
  handleConfirmarDespacho: (dados: DespachoDirecaoInput) => void;
  carregarProtocolos: () => void;
}

/**
 * Hook orquestrador do Painel do Gabinete da Direção Geral (Ouvidoria Segura).
 * Isola gestão de estado, filtragem multicritério e aplicação de despachos oficiais.
 */
export function useGabineteOuvidoria(): UseGabineteOuvidoriaReturn {
  const [protocolos, setProtocolos] = useState<ProtocoloInterno[]>([]);
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState<FiltroStatusGabinete>('todos');
  const [filtroCurso, setFiltroCurso] = useState<string>('TODOS');
  const [protocoloEmAcao, setProtocoloEmAcao] = useState<ProtocoloInterno | null>(null);
  const [mensagemSucesso, setMensagemSucesso] = useState<string | null>(null);

  const carregarProtocolos = useCallback(() => {
    setProtocolos(obterProtocolosArmazenados());
  }, []);

  useEffect(() => {
    carregarProtocolos();
  }, [carregarProtocolos]);

  const handleConfirmarDespacho = useCallback(
    (dados: DespachoDirecaoInput) => {
      const atualizado = aplicarDespachoDirecao(
        dados.protocoloId,
        dados.acao,
        dados.despachoOficial,
        dados.numeroPortaria,
        dados.resumoSanitizadoMural
      );

      if (atualizado) {
        setMensagemSucesso(
          `Despacho aplicado com sucesso para o protocolo ${atualizado.codigoProtocolo}! Status: ${atualizado.status}`
        );
        setProtocoloEmAcao(null);
        carregarProtocolos();
        setTimeout(() => setMensagemSucesso(null), 6000);
      }
    },
    [carregarProtocolos]
  );

  const metricas = useMemo(() => {
    return {
      total: protocolos.length,
      pendentes: protocolos.filter((p) => p.status === 'pendente').length,
      emAnalise: protocolos.filter(
        (p) => p.status === 'em_analise_assessoria' || p.status === 'em_analise_diretoria'
      ).length,
      respondidos: protocolos.filter((p) => p.status === 'respondido_privado').length,
      homologados: protocolos.filter((p) => p.status === 'homologado_publico').length,
    };
  }, [protocolos]);

  const protocolosFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    return protocolos.filter((p) => {
      // 1. Filtro textual
      if (termo) {
        const bateu =
          p.codigoProtocolo.toLowerCase().includes(termo) ||
          p.tipo.toLowerCase().includes(termo) ||
          (p.despachoOficial && p.despachoOficial.toLowerCase().includes(termo)) ||
          (p.numeroPortaria && p.numeroPortaria.toLowerCase().includes(termo));
        if (!bateu) return false;
      }

      // 2. Filtro de curso
      if (filtroCurso !== 'TODOS' && p.cursoSigla !== filtroCurso) {
        return false;
      }

      // 3. Filtro por aba de status
      if (filtroStatus === 'pendentes') return p.status === 'pendente';
      if (filtroStatus === 'em_analise') {
        return p.status === 'em_analise_assessoria' || p.status === 'em_analise_diretoria';
      }
      if (filtroStatus === 'respondidos') return p.status === 'respondido_privado';
      if (filtroStatus === 'homologados') return p.status === 'homologado_publico';

      return true;
    });
  }, [protocolos, busca, filtroCurso, filtroStatus]);

  return {
    protocolos,
    protocolosFiltrados,
    busca,
    setBusca,
    filtroStatus,
    setFiltroStatus,
    filtroCurso,
    setFiltroCurso,
    protocoloEmAcao,
    setProtocoloEmAcao,
    mensagemSucesso,
    metricas,
    handleConfirmarDespacho,
    carregarProtocolos,
  };
}
