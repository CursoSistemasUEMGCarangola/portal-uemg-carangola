'use client';

import React, { useState, useEffect } from 'react';
import { ProtocoloInterno, DespachoDirecaoInput } from '@/types/ouvidoria';
import { descriptografarManifestacaoEnvelope } from '@/lib/crypto/envelope-encryption';
import {
  Building,
  Lock,
  Unlock,
  CheckCircle,
  X,
  Send,
  Scale,
  Award,
  AlertTriangle,
  Eye,
} from 'lucide-react';

interface GabineteDespachoModalProps {
  protocolo: ProtocoloInterno | null;
  aoFechar: () => void;
  aoConfirmar: (dados: DespachoDirecaoInput) => void;
}

export default function GabineteDespachoModal({
  protocolo,
  aoFechar,
  aoConfirmar,
}: GabineteDespachoModalProps) {
  const [acao, setAcao] = useState<
    'analise_assessoria' | 'analise_diretoria' | 'responder_privado' | 'homologar_mural'
  >('responder_privado');

  const [despachoOficial, setDespachoOficial] = useState('');
  const [numeroPortaria, setNumeroPortaria] = useState('');
  const [resumoSanitizado, setResumoSanitizado] = useState('');
  const [textoDescriptografado, setTextoDescriptografado] = useState<Record<string, any> | null>(null);
  const [descriptografando, setDescriptografando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    setDespachoOficial(protocolo?.despachoOficial || '');
    setNumeroPortaria(protocolo?.numeroPortaria || '');
    setResumoSanitizado(protocolo?.resumoSanitizadoMural || '');
    setErro(null);

    // Tenta descriptografar automaticamente na memória da sessão do Diretor
    if (protocolo) {
      setDescriptografando(true);
      descriptografarManifestacaoEnvelope(protocolo.envelopeCifrado)
        .then((dados) => {
          setTextoDescriptografado(dados);
          if (dados?.assunto && !protocolo.resumoSanitizadoMural) {
            setResumoSanitizado(`Manifestação referente a: ${dados.assunto}.`);
          }
        })
        .finally(() => setDescriptografando(false));
    }
  }, [protocolo]);

  // Listener para fechar acessivelmente via tecla Escape
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        aoFechar();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [aoFechar]);

  if (!protocolo) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!despachoOficial.trim() || despachoOficial.trim().length < 10) {
      setErro('Informe ao menos 10 caracteres de despacho oficial.');
      return;
    }

    if (acao === 'homologar_mural' && (!resumoSanitizado.trim() || resumoSanitizado.trim().length < 15)) {
      setErro('Para homologar no Mural Público da LAI, forneça um resumo higienizado com ao menos 15 caracteres sem dados sensíveis.');
      return;
    }

    aoConfirmar({
      protocoloId: protocolo!.id,
      acao,
      despachoOficial: despachoOficial.trim(),
      numeroPortaria: numeroPortaria.trim() || undefined,
      resumoSanitizadoMural: acao === 'homologar_mural' ? resumoSanitizado.trim() : undefined,
    });
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-despacho-titulo"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto"
    >
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 my-8">
        {/* Cabeçalho do Modal */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#0B3B60] text-white flex items-center justify-center shrink-0">
              <Building className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h3 id="modal-despacho-titulo" className="text-base sm:text-lg font-bold text-slate-900">
                Gabinete da Direção • Despacho Institucional
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Protocolo: <strong className="font-mono text-[#0B3B60]">{protocolo.codigoProtocolo}</strong> • Setor: {protocolo.cursoSigla}
              </p>
            </div>
          </div>

          <button
            onClick={aoFechar}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0056B3]"
            aria-label="Fechar modal"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-5">
          {/* Seção 1: Conteúdo Descriptografado Localmente */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Unlock className="w-4 h-4 text-emerald-600" aria-hidden="true" />
                Descriptografia Local (RAM do Navegador)
              </span>
              <span className="text-[10px] font-bold text-slate-400">
                {protocolo.isAnonimo ? 'Manifestação Anônima' : 'Solicitante Identificado'}
              </span>
            </div>

            {descriptografando ? (
              <div className="flex items-center gap-2 text-xs text-slate-500 py-2">
                <div className="w-3.5 h-3.5 border-2 border-[#0B3B60] border-t-transparent rounded-full animate-spin" />
                Decodificando envelope AES-GCM com chave RSA local...
              </div>
            ) : textoDescriptografado ? (
              <div className="space-y-2 text-xs text-slate-800">
                {textoDescriptografado.assunto && (
                  <div className="p-2.5 bg-blue-50/60 rounded-lg border border-blue-100">
                    <span className="text-[10px] font-bold text-blue-900 uppercase tracking-wider block">Assunto da Demanda</span>
                    <span className="text-sm font-bold text-slate-900 mt-0.5 block">{textoDescriptografado.assunto}</span>
                  </div>
                )}
                {textoDescriptografado.mensagem && (
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Teor da Manifestação</span>
                    <div className="bg-white p-3.5 rounded-lg border border-slate-200 font-sans text-slate-800 text-xs sm:text-sm leading-relaxed max-h-48 overflow-y-auto whitespace-pre-wrap shadow-2xs">
                      {textoDescriptografado.mensagem}
                    </div>
                  </div>
                )}
                {!protocolo.isAnonimo && (textoDescriptografado.autorNome || textoDescriptografado.autorMatricula || textoDescriptografado.autorEmail) && (
                  <div className="pt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-600 bg-white p-2 rounded-lg border border-slate-200">
                    {textoDescriptografado.autorNome && (
                      <span><strong>Autor:</strong> {textoDescriptografado.autorNome}</span>
                    )}
                    {textoDescriptografado.autorMatricula && (
                      <span><strong>Matrícula:</strong> {textoDescriptografado.autorMatricula}</span>
                    )}
                    {textoDescriptografado.autorEmail && (
                      <span><strong>E-mail:</strong> {textoDescriptografado.autorEmail}</span>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">
                Ciphertext protegido. A chave privada RSA da sessão realizou a conferência de integridade.
              </p>
            )}
          </div>

          {/* Seção 2: Escolha da Ação / Trâmite */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Ação Administrativa do Gabinete *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {[
                { id: 'responder_privado', rotulo: 'Responder Privadamente', desc: 'Disponível na consulta por dupla chave' },
                { id: 'homologar_mural', rotulo: 'Homologar no Mural Público', desc: 'Publicação desidentificada (LAI)' },
                { id: 'analise_assessoria', rotulo: 'Encaminhar à Assessoria', desc: 'Muda status para triagem setorial' },
                { id: 'analise_diretoria', rotulo: 'Em Análise pelo Diretor', desc: 'Aguarda pauta da Direção Geral' },
              ].map((opt) => (
                <label
                  key={opt.id}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    acao === opt.id
                      ? 'border-[#0B3B60] bg-blue-50/50 text-[#0B3B60] font-bold'
                      : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="acao-gabinete"
                    value={opt.id}
                    checked={acao === opt.id}
                    onChange={() => setAcao(opt.id as any)}
                    className="mr-2 text-[#0B3B60]"
                  />
                  <span>{opt.rotulo}</span>
                  <span className="block text-[10px] text-slate-400 font-normal mt-0.5">{opt.desc}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Seção 3: Despacho e Portaria */}
          <div className="space-y-3">
            <div>
              <label htmlFor="despachoOficial" className="block text-xs font-bold text-slate-700 mb-1">
                Despacho Oficial da Direção Geral *
              </label>
              <textarea
                id="despachoOficial"
                rows={3}
                required
                value={despachoOficial}
                onChange={(e) => {
                  setDespachoOficial(e.target.value);
                  setErro(null);
                }}
                placeholder="Ex: O Gabinete acolhe a demanda. Determina-se a abertura de processo de manutenção..."
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0056B3] outline-none"
              />
            </div>

            <div>
              <label htmlFor="numeroPortaria" className="block text-xs font-bold text-slate-700 mb-1">
                Ato Administrativo / Portaria Vinculada (Opcional)
              </label>
              <input
                id="numeroPortaria"
                type="text"
                value={numeroPortaria}
                onChange={(e) => setNumeroPortaria(e.target.value)}
                placeholder="Ex: Portaria GD nº 45/2026 ou Resolução 08/2026"
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0056B3] outline-none"
              />
            </div>
          </div>

          {/* Seção 4: Sanitização Mandatória se Homologar no Mural (DNA #3) */}
          {acao === 'homologar_mural' && (
            <div className="bg-amber-50/70 border border-amber-300 rounded-xl p-4 space-y-2 animate-fade-in">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-950">
                <Scale className="w-4 h-4 text-amber-700" aria-hidden="true" />
                Higienização Mandatória para o Mural Público (Lei 12.527/2011 — LAI)
              </div>
              <p className="text-[11px] text-amber-900 leading-snug">
                Edite o resumo abaixo para garantir a completa <strong>remoção de dados pessoais (PII)</strong>, nomes de terceiros ou termos confidenciais antes de gravar na tabela pública.
              </p>
              <textarea
                rows={3}
                required
                value={resumoSanitizado}
                onChange={(e) => setResumoSanitizado(e.target.value)}
                placeholder="Resumo objetivo e anônimo da demanda para o público..."
                className="w-full text-xs px-3 py-2 border border-amber-300 bg-white rounded-lg focus:ring-2 focus:ring-[#0056B3] outline-none"
              />
            </div>
          )}

          {erro && (
            <p className="text-xs text-red-600 font-semibold flex items-center gap-1">
              <AlertTriangle className="w-4 h-4" aria-hidden="true" />
              {erro}
            </p>
          )}

          {/* Botões do Rodapé */}
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
              className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-[#0B3B60] hover:bg-[#0056B3] shadow-md transition-all flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" aria-hidden="true" />
              Assinar & Registrar Despacho
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
