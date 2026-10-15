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
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

interface GabineteDespachoModalProps {
  protocolo: ProtocoloInterno | null;
  aoFechar: () => void;
  aoConfirmar: (dados: DespachoDirecaoInput) => Promise<void> | void;
}

/**
 * Utilitário de Higienização e Anonimização Automática para o Mural Público (LAI & LGPD)
 * Suprime nomes próprios, matrículas, MASP, contatos telefônicos e e-mails pessoais.
 */
function gerarResumoAnonimizadoLAI(
  assunto?: string,
  mensagem?: string,
  autorNome?: string,
  cursoSigla?: string
): string {
  const tema = assunto?.trim() || 'Demanda Institucional';
  const setor =
    cursoSigla && cursoSigla !== 'GERAL'
      ? `do colegiado de ${cursoSigla}`
      : 'do campus de Carangola';

  // Suprime qualquer nome próprio ou dado pessoal
  let textoBase = (mensagem || '').trim();
  if (autorNome && autorNome !== 'Anônimo' && autorNome !== 'Manifestação Anônima') {
    const partesNome = autorNome.split(/\s+/).filter((p) => p.length > 2);
    partesNome.forEach((parte) => {
      const regex = new RegExp(`\\b${parte.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
      textoBase = textoBase.replace(regex, '[Manifestante]');
    });
  }

  // Suprime e-mails, números de telefone, matrículas/MASP
  textoBase = textoBase
    .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[e-mail suprimido]')
    .replace(/\(?\d{2}\)?\s?\d{4,5}-?\d{4}/g, '[telefone suprimido]')
    .replace(/\b\d{5,12}\b/g, '[matrícula suprimida]');

  return `Demanda de interesse acadêmico (${setor}) quanto ao tema "${tema}". Registrou-se solicitação de melhoria e providências administrativas institucionais sem menção a dados pessoais.`;
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
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    setDespachoOficial(protocolo?.despachoOficial || '');
    setNumeroPortaria(protocolo?.numeroPortaria || '');
    setResumoSanitizado(protocolo?.resumoSanitizadoMural || '');
    setErro(null);
    setSalvando(false);

    // Descriptografa automaticamente na memória da sessão do Diretor
    if (protocolo) {
      setDescriptografando(true);
      descriptografarManifestacaoEnvelope(protocolo.envelopeCifrado)
        .then((dados) => {
          setTextoDescriptografado(dados);

          // Se não houver resumo higienizado prévio, gera anonimização automática
          if (!protocolo.resumoSanitizadoMural) {
            const resumoAuto = gerarResumoAnonimizadoLAI(
              dados?.assunto,
              dados?.mensagem,
              dados?.autorNome,
              protocolo.cursoSigla
            );
            setResumoSanitizado(resumoAuto);
          }
        })
        .finally(() => setDescriptografando(false));
    }
  }, [protocolo]);

  // Se o Diretor alterar para homologar_mural e o campo estiver vazio, aplica anonimização automática
  useEffect(() => {
    if (acao === 'homologar_mural' && !resumoSanitizado) {
      const auto = gerarResumoAnonimizadoLAI(
        textoDescriptografado?.assunto,
        textoDescriptografado?.mensagem,
        textoDescriptografado?.autorNome,
        protocolo?.cursoSigla
      );
      setResumoSanitizado(auto);
    }
  }, [acao, resumoSanitizado, textoDescriptografado, protocolo]);

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);

    if (!despachoOficial.trim() || despachoOficial.trim().length < 10) {
      setErro('Informe ao menos 10 caracteres no texto do despacho oficial.');
      return;
    }

    if (
      acao === 'homologar_mural' &&
      (!resumoSanitizado.trim() || resumoSanitizado.trim().length < 15)
    ) {
      setErro(
        'Para homologar no Mural Público da LAI, forneça um resumo higienizado com ao menos 15 caracteres sem dados sensíveis.'
      );
      return;
    }

    setSalvando(true);
    try {
      await aoConfirmar({
        protocoloId: protocolo!.id,
        acao,
        despachoOficial: despachoOficial.trim(),
        numeroPortaria: numeroPortaria.trim() || undefined,
        resumoSanitizadoMural: acao === 'homologar_mural' ? resumoSanitizado.trim() : undefined,
      });
    } catch (err: any) {
      setErro(err?.message || 'Falha ao registrar despacho. Tente novamente.');
      setSalvando(false);
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-despacho-titulo"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
    >
      <div className="bg-white rounded-2xl max-w-2xl sm:max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Cabeçalho do Modal (Fixo) */}
        <div className="px-5 py-3.5 sm:px-6 sm:py-4 border-b border-slate-200 flex items-center justify-between shrink-0 bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#0B3B60] text-white flex items-center justify-center shrink-0 shadow-2xs">
              <Building className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h3 id="modal-despacho-titulo" className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                Gabinete da Direção • Despacho Institucional
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Protocolo: <strong className="font-mono text-[#0B3B60] font-bold">{protocolo.codigoProtocolo}</strong> • Setor: {protocolo.cursoSigla}
              </p>
            </div>
          </div>

          <button
            onClick={aoFechar}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-200 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0056B3]"
            aria-label="Fechar modal"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Formulário com Área de Rolagem Interna */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
          <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1 overscroll-contain">
            {/* Seção 1: Conteúdo Descriptografado Localmente */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 sm:p-4 space-y-2">
              <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Unlock className="w-4 h-4 text-emerald-600" aria-hidden="true" />
                  Descriptografia Local (RAM do Navegador)
                </span>
                <span className="text-[10px] font-bold text-slate-500 px-2 py-0.5 bg-white rounded border border-slate-200">
                  {protocolo.isAnonimo ? 'Manifestação Anônima' : 'Solicitante Identificado'}
                </span>
              </div>

              {descriptografando ? (
                <div className="flex items-center gap-2 text-xs text-slate-500 py-3">
                  <div className="w-3.5 h-3.5 border-2 border-[#0B3B60] border-t-transparent rounded-full animate-spin" />
                  Decodificando envelope AES-GCM com chave RSA local...
                </div>
              ) : textoDescriptografado ? (
                <div className="space-y-2 text-xs text-slate-800">
                  {textoDescriptografado.assunto && (
                    <div className="p-2.5 bg-blue-50/70 rounded-lg border border-blue-100">
                      <span className="text-[10px] font-bold text-[#0B3B60] uppercase tracking-wider block">Assunto da Demanda</span>
                      <span className="text-sm font-bold text-slate-900 mt-0.5 block">{textoDescriptografado.assunto}</span>
                    </div>
                  )}

                  {textoDescriptografado.mensagem && (
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Teor da Manifestação</span>
                      <div className="bg-white p-3.5 rounded-lg border border-slate-200 font-sans text-slate-800 text-xs sm:text-sm leading-relaxed max-h-40 overflow-y-auto whitespace-pre-wrap shadow-2xs">
                        {textoDescriptografado.mensagem}
                      </div>
                    </div>
                  )}

                  {!protocolo.isAnonimo && (textoDescriptografado.autorNome || textoDescriptografado.autorMatricula || textoDescriptografado.autorEmail) && (
                    <div className="pt-1 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200">
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
                <p className="text-xs text-slate-500 italic py-1">
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
                  {
                    id: 'responder_privado',
                    rotulo: 'Responder Privadamente',
                    desc: 'Disponível na consulta por dupla chave',
                  },
                  {
                    id: 'homologar_mural',
                    rotulo: 'Homologar no Mural Público',
                    desc: 'Publicação anônima desidentificada (LAI)',
                  },
                  {
                    id: 'analise_assessoria',
                    rotulo: 'Encaminhar à Assessoria',
                    desc: 'Muda status para triagem setorial',
                  },
                  {
                    id: 'analise_diretoria',
                    rotulo: 'Em Análise pelo Diretor',
                    desc: 'Aguarda pauta da Direção Geral',
                  },
                ].map((opt) => (
                  <label
                    key={opt.id}
                    className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                      acao === opt.id
                        ? 'border-[#0B3B60] bg-blue-50/60 text-[#0B3B60] font-bold shadow-2xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                    }`}
                  >
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="acao-gabinete"
                        value={opt.id}
                        checked={acao === opt.id}
                        onChange={() => setAcao(opt.id as any)}
                        className="mr-2 text-[#0B3B60]"
                      />
                      <span className="font-bold">{opt.rotulo}</span>
                    </div>
                    <span className="block text-[10px] text-slate-400 font-normal mt-0.5 ml-5">
                      {opt.desc}
                    </span>
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
                  placeholder="Ex: O Gabinete da Direção Geral acolhe a solicitação. Determina-se a abertura de processo de manutenção..."
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0056B3] outline-none leading-relaxed"
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

            {/* Seção 4: Sanitização e Anonimização Mandatória se Homologar no Mural (DNA #3) */}
            {acao === 'homologar_mural' && (
              <div className="bg-amber-50/80 border border-amber-300 rounded-xl p-3.5 sm:p-4 space-y-2.5 animate-fade-in shadow-2xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-950">
                    <Scale className="w-4 h-4 text-amber-700" aria-hidden="true" />
                    <span>Higienização e Anonimização para o Mural (LAI 12.527 / LGPD)</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const auto = gerarResumoAnonimizadoLAI(
                        textoDescriptografado?.assunto,
                        textoDescriptografado?.mensagem,
                        textoDescriptografado?.autorNome,
                        protocolo.cursoSigla
                      );
                      setResumoSanitizado(auto);
                    }}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-900 bg-amber-200/70 hover:bg-amber-200 px-2.5 py-1 rounded-md border border-amber-300 transition-colors shrink-0"
                    title="Regenerar anonimização automática com supressão de nomes e PII"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-800" aria-hidden="true" />
                    <span>Anonimizar Automaticamente</span>
                  </button>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span>Anonimização ativa: Qualquer menção ao nome do autor e dados de contato foram suprimidos do resumo público.</span>
                </div>

                <div>
                  <label htmlFor="resumoSanitizado" className="block text-[11px] font-semibold text-amber-950 mb-1">
                    Resumo Sanitizado para Publicação Aberta *
                  </label>
                  <textarea
                    id="resumoSanitizado"
                    rows={2}
                    required
                    value={resumoSanitizado}
                    onChange={(e) => setResumoSanitizado(e.target.value)}
                    placeholder="Resumo objetivo e anônimo da demanda para o público..."
                    className="w-full text-xs px-3 py-2 border border-amber-300 bg-white rounded-lg focus:ring-2 focus:ring-[#0056B3] outline-none"
                  />
                </div>
              </div>
            )}

            {erro && (
              <div role="alert" className="p-2.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 font-semibold flex items-center gap-1.5 animate-shake">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" aria-hidden="true" />
                <span>{erro}</span>
              </div>
            )}
          </div>

          {/* Rodapé do Modal (Fixo) */}
          <div className="px-5 py-3 sm:px-6 sm:py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0 gap-3">
            <div className="text-[11px] text-slate-500 font-medium hidden sm:block">
              Assinatura digital institucional do Gabinete
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={aoFechar}
                disabled={salvando}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={salvando}
                className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-[#0B3B60] hover:bg-[#0056B3] shadow-md hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {salvando ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Registrando Despacho...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Assinar & Registrar Despacho</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
