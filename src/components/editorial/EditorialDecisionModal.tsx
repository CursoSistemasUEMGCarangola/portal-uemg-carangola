'use client';

import React, { useState, useEffect } from 'react';
import { Artigo } from '@/types/editorial';
import { AlertCircle, X, Send } from 'lucide-react';

interface EditorialDecisionModalProps {
  artigo: Artigo | null;
  acao: 'solicitar_ajustes' | 'rejeitar' | null;
  aoFechar: () => void;
  aoConfirmar: (artigoId: string, acao: 'solicitar_ajustes' | 'rejeitar', notas: string) => void;
}

export default function EditorialDecisionModal({
  artigo,
  acao,
  aoFechar,
  aoConfirmar,
}: EditorialDecisionModalProps) {
  const [notas, setNotas] = useState('');
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    setNotas('');
    setErro(null);
  }, [artigo, acao]);

  // Listener para fechamento acessível via tecla Escape (WCAG 2.1 AA)
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        aoFechar();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [aoFechar]);

  if (!artigo || !acao) return null;

  const isRejeicao = acao === 'rejeitar';
  const titulo = isRejeicao
    ? 'Rejeitar Submissão de Artigo'
    : 'Solicitar Correções / Ajustes ao Autor';

  const descricao = isRejeicao
    ? 'Forneça uma justificativa sucinta para o arquivamento deste artigo. O autor poderá consultar o motivo no painel.'
    : 'Aponte com clareza as correções metodológicas ou bibliográficas necessárias para que o autor revise e reenvie.';

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!notas.trim() || notas.trim().length < 10) {
      setErro('Por favor, informe ao menos 10 caracteres de orientações objetivas.');
      return;
    }
    aoConfirmar(artigo!.id, acao!, notas.trim());
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
    >
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
        <div className="flex items-start justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                isRejeicao ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
              }`}
            >
              <AlertCircle className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h3 id="modal-title" className="text-base font-bold text-slate-900">
                {titulo}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Artigo: {artigo.titulo.length > 45 ? `${artigo.titulo.substring(0, 45)}...` : artigo.titulo}
              </p>
            </div>
          </div>
          <button
            onClick={aoFechar}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0056B3]"
            aria-label="Fechar modal"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <p className="text-xs text-slate-600">{descricao}</p>

          <div>
            <label htmlFor="notas-despacho" className="block text-xs font-semibold text-slate-700 mb-1">
              Despacho Editorial da Coordenação *
            </label>
            <textarea
              id="notas-despacho"
              rows={4}
              required
              value={notas}
              onChange={(e) => {
                setNotas(e.target.value);
                setErro(null);
              }}
              placeholder={
                isRejeicao
                  ? 'Ex: O trabalho não atende ao escopo temático da revista do curso...'
                  : 'Ex: Favor ajustar a formatação das referências no item 4 e incluir o resumo em inglês...'
              }
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0056B3] outline-none"
            />
            {erro && <p className="text-xs text-red-600 mt-1 font-semibold">{erro}</p>}
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={aoFechar}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={`px-5 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 shadow-sm transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                isRejeicao
                  ? 'bg-red-700 hover:bg-red-800 focus-visible:outline-red-700'
                  : 'bg-amber-700 hover:bg-amber-800 focus-visible:outline-amber-700'
              }`}
            >
              <Send className="w-3.5 h-3.5" aria-hidden="true" />
              {isRejeicao ? 'Confirmar Rejeição' : 'Enviar Solicitação de Ajustes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
