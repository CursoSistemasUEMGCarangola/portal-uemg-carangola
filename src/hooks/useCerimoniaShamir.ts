'use client';

import { useState } from 'react';
import {
  executarCerimoniaParticaoShamir,
  recomporSegredoDeFragmentos,
} from '@/lib/crypto/shamir-secret-sharing';
import {
  FragmentoChaveShamir,
  ResultadoCerimoniaParticao,
  ResultadoRecomposicaoChave,
} from '@/types/cerimonia';

export interface UseCerimoniaShamirReturn {
  // Controle de Abas
  abaAtiva: 'particao' | 'recomposicao';
  setAbaAtiva: (aba: 'particao' | 'recomposicao') => void;

  // Estados de Partição
  segredoInput: string;
  setSegredoInput: (valor: string) => void;
  resultadoParticao: ResultadoCerimoniaParticao | null;
  copiadoIndice: number | null;
  erroParticao: string | null;
  handleGerarSegredoAleatorio: () => void;
  handleExecutarParticao: () => Promise<void>;
  handleCopiarFragmento: (fragmento: FragmentoChaveShamir) => void;
  handleCarregarFragmentosPredefinidosParaTeste: (resultado: ResultadoCerimoniaParticao) => void;

  // Estados de Recomposição
  custodianteA: number;
  setCustodianteA: (indice: number) => void;
  shareHexA: string;
  setShareHexA: (hex: string) => void;
  custodianteB: number;
  setCustodianteB: (indice: number) => void;
  shareHexB: string;
  setShareHexB: (hex: string) => void;
  resultadoRecomposicao: ResultadoRecomposicaoChave | null;
  handleExecutarRecomposicao: () => void;
}

/**
 * Hook customizado para gerenciar a Cerimônia de Chaves de Shamir (k=2, N=3).
 * Isola a orquestração de estados de partição e recomposição matemática sobre GF(256),
 * desonerando o componente visual CerimoniaChavesModal.
 */
export function useCerimoniaShamir(): UseCerimoniaShamirReturn {
  const [abaAtiva, setAbaAtiva] = useState<'particao' | 'recomposicao'>('particao');

  // Estados de Partição
  const [segredoInput, setSegredoInput] = useState('');
  const [resultadoParticao, setResultadoParticao] = useState<ResultadoCerimoniaParticao | null>(null);
  const [copiadoIndice, setCopiadoIndice] = useState<number | null>(null);
  const [erroParticao, setErroParticao] = useState<string | null>(null);

  // Estados de Recomposição
  const [custodianteA, setCustodianteA] = useState<number>(1);
  const [shareHexA, setShareHexA] = useState('');
  const [custodianteB, setCustodianteB] = useState<number>(2);
  const [shareHexB, setShareHexB] = useState('');
  const [resultadoRecomposicao, setResultadoRecomposicao] = useState<ResultadoRecomposicaoChave | null>(null);

  function handleGerarSegredoAleatorio() {
    const array = new Uint8Array(24);
    if (typeof globalThis !== 'undefined' && globalThis.crypto?.getRandomValues) {
      globalThis.crypto.getRandomValues(array);
    }
    const hex = Array.from(array)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
    setSegredoInput(`UEMG-CARANGOLA-MASTER-KEK-2026-${hex.substring(0, 24)}`);
  }

  async function handleExecutarParticao() {
    setErroParticao(null);
    try {
      if (!segredoInput.trim()) {
        setErroParticao('Informe a chave mestre ou gere um segredo institucional.');
        return;
      }
      const resultado = await executarCerimoniaParticaoShamir(segredoInput.trim());
      setResultadoParticao(resultado);
    } catch (e: any) {
      setErroParticao(e?.message || 'Erro ao processar cerimônia matemática.');
    }
  }

  function handleCopiarFragmento(fragmento: FragmentoChaveShamir) {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(fragmento.shareHex);
      setCopiadoIndice(fragmento.indice);
      setTimeout(() => setCopiadoIndice(null), 3000);
    }
  }

  function handleCarregarFragmentosPredefinidosParaTeste(resultado: ResultadoCerimoniaParticao) {
    setCustodianteA(1);
    setShareHexA(resultado.fragmentos[0].shareHex);
    setCustodianteB(3);
    setShareHexB(resultado.fragmentos[2].shareHex);
    setAbaAtiva('recomposicao');
  }

  function handleExecutarRecomposicao() {
    setResultadoRecomposicao(null);
    const res = recomporSegredoDeFragmentos([
      { indice: custodianteA, shareHex: shareHexA },
      { indice: custodianteB, shareHex: shareHexB },
    ]);
    setResultadoRecomposicao(res);
  }

  return {
    abaAtiva,
    setAbaAtiva,

    segredoInput,
    setSegredoInput,
    resultadoParticao,
    copiadoIndice,
    erroParticao,
    handleGerarSegredoAleatorio,
    handleExecutarParticao,
    handleCopiarFragmento,
    handleCarregarFragmentosPredefinidosParaTeste,

    custodianteA,
    setCustodianteA,
    shareHexA,
    setShareHexA,
    custodianteB,
    setCustodianteB,
    shareHexB,
    setShareHexB,
    resultadoRecomposicao,
    handleExecutarRecomposicao,
  };
}
