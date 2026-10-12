'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { consultarProtocoloBlind } from '@/lib/data/mock-ouvidoria';
import { ResultadoConsultaProtocolo } from '@/types/ouvidoria';

export interface UseConsultaProtocoloReturn {
  codigoProtocolo: string;
  setCodigoProtocolo: (codigo: string) => void;
  tokenSecreto: string;
  setTokenSecreto: (token: string) => void;
  consultando: boolean;
  resultado: ResultadoConsultaProtocolo | null;
  executarConsulta: (codigo?: string, token?: string) => Promise<void>;
  handleSubmit: (e: React.FormEvent) => void;
  limparConsulta: () => void;
}

/**
 * Hook customizado para orquestração da Consulta Cega por Dupla Chave Institucional (Zero-Trust).
 * Desonera a camada visual e encapsula parsing de URL, sanitização e estados de requisição.
 */
export function useConsultaProtocolo(): UseConsultaProtocoloReturn {
  const searchParams = useSearchParams();
  const protocoloInicial = searchParams.get('protocolo') || '';
  const tokenInicial = searchParams.get('token') || '';

  const [codigoProtocolo, setCodigoProtocolo] = useState(protocoloInicial);
  const [tokenSecreto, setTokenSecreto] = useState(tokenInicial);
  const [consultando, setConsultando] = useState(false);
  const [resultado, setResultado] = useState<ResultadoConsultaProtocolo | null>(null);

  const executarConsulta = useCallback(
    async (codigoParam?: string, tokenParam?: string) => {
      const codigoAlvo = (codigoParam ?? codigoProtocolo).trim();
      const tokenAlvo = (tokenParam ?? tokenSecreto).trim();

      if (!codigoAlvo || !tokenAlvo) return;

      setConsultando(true);
      setResultado(null);

      try {
        const res = await consultarProtocoloBlind(codigoAlvo, tokenAlvo);
        setResultado(res);
      } catch (err) {
        console.error('Falha na consulta cega de protocolo:', err);
        setResultado({
          encontrado: false,
          mensagemErro: 'Ocorreu uma falha inesperada ao consultar o registro.',
        });
      } finally {
        setConsultando(false);
      }
    },
    [codigoProtocolo, tokenSecreto]
  );

  // Auto-consulta segura se os parâmetros vierem populados na URL (ex: redirecionamento de envio)
  useEffect(() => {
    if (protocoloInicial && tokenInicial) {
      executarConsulta(protocoloInicial, tokenInicial);
    }
  }, [protocoloInicial, tokenInicial, executarConsulta]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    executarConsulta();
  }

  function limparConsulta() {
    setCodigoProtocolo('');
    setTokenSecreto('');
    setResultado(null);
  }

  return {
    codigoProtocolo,
    setCodigoProtocolo,
    tokenSecreto,
    setTokenSecreto,
    consultando,
    resultado,
    executarConsulta,
    handleSubmit,
    limparConsulta,
  };
}
