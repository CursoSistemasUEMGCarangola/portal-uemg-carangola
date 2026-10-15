'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  ProtocoloInterno,
  DespachoDirecaoInput,
  PayloadCifradoEnvelope,
  StatusProtocolo,
} from '@/types/ouvidoria';
import {
  obterProtocolosArmazenados,
  aplicarDespachoDirecao,
} from '@/lib/data/mock-ouvidoria';
import { createClient } from '@/lib/supabase/client';

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

  const carregarProtocolos = useCallback(async () => {
    // 1. Carrega dados de contingência local
    const locais = obterProtocolosArmazenados();

    // 2. Consulta dados reais do Supabase
    try {
      const supabase = createClient();
      const { data: rowsDb, error } = await supabase
        .from('protocolos_internos')
        .select('*, cursos(sigla, nome)')
        .order('criado_em', { ascending: false });

      if (!error && rowsDb && rowsDb.length > 0) {
        const mapeados: ProtocoloInterno[] = rowsDb.map((row: any) => {
          let parsed: any = {};
          try {
            parsed = JSON.parse(row.payload_cifrado);
          } catch {
            parsed = { ciphertext: row.payload_cifrado };
          }

          const envelopeCifrado: PayloadCifradoEnvelope = {
            ciphertextBase64: parsed.ciphertext || row.payload_cifrado,
            ivBase64: parsed.iv || '',
            wrappedDekBase64: row.wrapped_dek,
            algoritmoSimetrico: parsed.algoritmoSimetrico || 'AES-GCM-256',
            algoritmoAssimetrico: parsed.algoritmoAssimetrico || 'RSA-OAEP-4096',
          };

          const dataCriacao = row.criado_em
            ? new Date(row.criado_em).toLocaleDateString('pt-BR') +
              ' ' +
              new Date(row.criado_em).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
            : '';

          const dataAtualizacao = row.atualizado_em
            ? new Date(row.atualizado_em).toLocaleDateString('pt-BR') +
              ' ' +
              new Date(row.atualizado_em).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
            : '';

          return {
            id: row.id,
            codigoProtocolo: row.codigo_protocolo,
            tokenHash: row.token_hash,
            tipo: (parsed.tipo || 'solicitacao') as any,
            cursoSigla: (row.cursos?.sigla || parsed.cursoSigla || 'GERAL') as any,
            isAnonimo: row.is_anonimo,
            envelopeCifrado,
            status: row.status,
            despachoOficial: row.despacho_cifrado || undefined,
            numeroPortaria: row.numero_portaria || undefined,
            criadoEm: dataCriacao,
            atualizadoEm: dataAtualizacao,
          };
        });

        // Unifica priorizando o Supabase e mesclando locais não sincronizados
        const codigosDb = new Set(mapeados.map((m) => m.codigoProtocolo));
        const unificados = [...mapeados, ...locais.filter((l) => !codigosDb.has(l.codigoProtocolo))];
        setProtocolos(unificados);
        return;
      }
    } catch (err) {
      console.warn('Aviso: Falha ao carregar protocolos do Supabase, usando cache local:', err);
    }

    setProtocolos(locais);
  }, []);

  useEffect(() => {
    carregarProtocolos();
  }, [carregarProtocolos]);

  const handleConfirmarDespacho = useCallback(
    async (dados: DespachoDirecaoInput) => {
      // 1. Localiza o protocolo no estado
      const protocoloAlvo = protocolos.find(
        (p) => p.id === dados.protocoloId || p.codigoProtocolo === dados.protocoloId
      );

      const codigoProto = protocoloAlvo?.codigoProtocolo || dados.protocoloId;

      let novoStatus: StatusProtocolo = 'pendente';
      if (dados.acao === 'analise_assessoria') novoStatus = 'em_analise_assessoria';
      else if (dados.acao === 'analise_diretoria') novoStatus = 'em_analise_diretoria';
      else if (dados.acao === 'responder_privado') novoStatus = 'respondido_privado';
      else if (dados.acao === 'homologar_mural') novoStatus = 'homologado_publico';

      // 2. Persistência remota prioritária no Supabase
      try {
        const supabase = createClient();

        // Atualiza a tabela protocolos_internos
        const { error: errUpdate } = await supabase
          .from('protocolos_internos')
          .update({
            status: novoStatus,
            despacho_cifrado: dados.despachoOficial,
            numero_portaria: dados.numeroPortaria || null,
            atualizado_em: new Date().toISOString(),
          })
          .or(`id.eq.${dados.protocoloId},codigo_protocolo.eq.${codigoProto}`);

        if (errUpdate) {
          console.warn('Aviso: Update no Supabase retornou erro:', errUpdate.message);
        }

        // Se a ação for homologar para o mural público (Hard Box DNA #3)
        if (dados.acao === 'homologar_mural' && dados.resumoSanitizadoMural) {
          let cursoId: string | null = null;
          if (protocoloAlvo?.cursoSigla && protocoloAlvo.cursoSigla !== 'GERAL') {
            const { data: cursoRow } = await supabase
              .from('cursos')
              .select('id')
              .eq('sigla', protocoloAlvo.cursoSigla)
              .maybeSingle();
            if (cursoRow?.id) cursoId = cursoRow.id;
          }

          const { error: errMural } = await supabase.from('mural_publico').insert({
            protocolo_referencia: codigoProto,
            curso_id: cursoId,
            manifestacao_resumo: dados.resumoSanitizadoMural,
            resposta_oficial: dados.despachoOficial,
            numero_portaria: dados.numeroPortaria || null,
            status_homologacao: 'Homologado e Respondido',
            is_active: true,
            data_manifestacao: new Date().toISOString(),
          });

          if (errMural) {
            console.warn('Aviso: Inserção no mural_publico Supabase falhou:', errMural.message);
          }
        }
      } catch (err) {
        console.warn('Erro ao atualizar no Supabase:', err);
      }

      // 3. Persistência de contingência local (localStorage)
      aplicarDespachoDirecao(
        dados.protocoloId,
        dados.acao,
        dados.despachoOficial,
        dados.numeroPortaria,
        dados.resumoSanitizadoMural
      );

      // 4. Feedback visual e fechamento do modal garantido
      setMensagemSucesso(
        `Despacho assinado e registrado com sucesso para o protocolo ${codigoProto}!`
      );
      setProtocoloEmAcao(null);
      await carregarProtocolos();
      setTimeout(() => setMensagemSucesso(null), 6000);
    },
    [protocolos, carregarProtocolos]
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
