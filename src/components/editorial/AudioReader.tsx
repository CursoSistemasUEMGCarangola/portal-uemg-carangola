'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Pause, Play, RotateCcw } from 'lucide-react';

interface AudioReaderProps {
  titulo: string;
  resumo: string;
  conteudoMarkdown: string;
  className?: string;
}

/**
 * Remove marcações Markdown para uma leitura limpa e agradável via Web Speech API
 */
function limparTextoParaAudio(titulo: string, resumo: string, markdown: string): string {
  const textoLimpo = markdown
    // Remove fórmulas matemáticas LaTeX
    .replace(/\$\$([\s\S]*?)\$\$/g, '')
    .replace(/\$(.*?)\$/g, '')
    // Remove links [texto](url) mantendo apenas o texto
    .replace(/\[(.*?)\]\(.*?\)/g, '$1')
    // Remove cabeçalhos
    .replace(/^#+\s+/gm, '')
    // Remove marcadores de lista
    .replace(/^[\*\-\+]\s+/gm, '')
    .replace(/^\d+\.\s+/gm, '')
    // Remove negrito e itálico
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/__(.*?)__/g, '$1')
    .replace(/_(.*?)_/g, '$1')
    // Remove blocos de código
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`([^`]+)`/g, '$1')
    // Remove linhas horizontais
    .replace(/---/g, '')
    // Normaliza quebras de linha e espaços múltiplos
    .replace(/\n+/g, '. ')
    .replace(/\s+/g, ' ')
    .trim();

  return `${titulo}. Resumo do trabalho: ${resumo}. Conteúdo do artigo: ${textoLimpo}`;
}

export function AudioReader({
  titulo,
  resumo,
  conteudoMarkdown,
  className = '',
}: AudioReaderProps) {
  const [suportado, setSuportado] = useState(false);
  const [tocando, setTocando] = useState(false);
  const [pausado, setPausado] = useState(false);
  const [velocidade, setVelocidade] = useState<number>(1);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setSuportado(true);
    }

    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const iniciarLeitura = () => {
    if (!suportado) return;

    window.speechSynthesis.cancel();

    const textoCompleto = limparTextoParaAudio(titulo, resumo, conteudoMarkdown);
    const utterance = new SpeechSynthesisUtterance(textoCompleto);
    utterance.lang = 'pt-BR';
    utterance.rate = velocidade;

    // Tentar selecionar uma voz de qualidade em Português
    const vozes = window.speechSynthesis.getVoices();
    const vozPt =
      vozes.find((v) => v.lang.startsWith('pt-BR') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Maria') || v.name.includes('Francisca'))) ||
      vozes.find((v) => v.lang.startsWith('pt-BR')) ||
      vozes.find((v) => v.lang.startsWith('pt'));

    if (vozPt) {
      utterance.voice = vozPt;
    }

    utterance.onstart = () => {
      setTocando(true);
      setPausado(false);
    };

    utterance.onend = () => {
      setTocando(false);
      setPausado(false);
    };

    utterance.onerror = () => {
      setTocando(false);
      setPausado(false);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const pausarLeitura = () => {
    if (!suportado) return;
    if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
      window.speechSynthesis.pause();
      setPausado(true);
    }
  };

  const retomarLeitura = () => {
    if (!suportado) return;
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setPausado(false);
    } else {
      iniciarLeitura();
    }
  };

  const pararLeitura = () => {
    if (!suportado) return;
    window.speechSynthesis.cancel();
    setTocando(false);
    setPausado(false);
  };

  const alternarVelocidade = () => {
    const proxima = velocidade === 1 ? 1.25 : velocidade === 1.25 ? 1.5 : 1;
    setVelocidade(proxima);
    if (tocando) {
      // Reinicia com a nova velocidade
      pararLeitura();
      setTimeout(() => {
        const textoCompleto = limparTextoParaAudio(titulo, resumo, conteudoMarkdown);
        const utterance = new SpeechSynthesisUtterance(textoCompleto);
        utterance.lang = 'pt-BR';
        utterance.rate = proxima;
        utterance.onstart = () => setTocando(true);
        utterance.onend = () => setTocando(false);
        utterance.onerror = () => setTocando(false);
        utteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);
      }, 50);
    }
  };

  if (!suportado) return null;

  return (
    <div
      className={`inline-flex items-center gap-2 bg-slate-50 hover:bg-slate-100/90 border border-slate-200/90 rounded-lg p-1.5 transition-colors ${className}`}
      role="region"
      aria-label="Controles de acessibilidade: leitura em voz alta"
    >
      {!tocando && !pausado ? (
        <button
          type="button"
          onClick={iniciarLeitura}
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-md bg-[#0B3B60] hover:bg-[#003366] text-white text-xs font-semibold shadow-sm transition-colors focus-visible:outline-2 focus-visible:outline-[#0056B3]"
          aria-label="Ouvir artigo em voz alta"
        >
          <Volume2 className="w-4 h-4 text-amber-300" aria-hidden="true" />
          <span>Ouvir artigo</span>
        </button>
      ) : (
        <div className="flex items-center gap-1.5">
          {pausado ? (
            <button
              type="button"
              onClick={retomarLeitura}
              className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors"
              aria-label="Continuar leitura em voz alta"
            >
              <Play className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Continuar</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={pausarLeitura}
              className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold transition-colors"
              aria-label="Pausar leitura em voz alta"
            >
              <Pause className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Pausar</span>
            </button>
          )}

          <button
            type="button"
            onClick={pararLeitura}
            className="p-1.5 rounded text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors"
            title="Parar leitura"
            aria-label="Parar leitura em voz alta"
          >
            <VolumeX className="w-4 h-4" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={alternarVelocidade}
            className="px-2 py-1 rounded bg-slate-200/80 hover:bg-slate-300 text-slate-700 text-2xs font-bold font-mono transition-colors"
            title="Alterar velocidade de reprodução"
            aria-label={`Velocidade de leitura atual: ${velocidade}x. Clique para alterar`}
          >
            {velocidade}x
          </button>
        </div>
      )}
    </div>
  );
}
