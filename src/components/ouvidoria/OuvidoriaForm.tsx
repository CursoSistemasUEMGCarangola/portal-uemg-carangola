'use client';

import React from 'react';
import { CURSOS_LISTA } from '@/lib/data/mock-articles';
import { useOuvidoriaForm } from '@/hooks/useOuvidoriaForm';
import Link from 'next/link';
import {
  ShieldCheck,
  Lock,
  EyeOff,
  UserCheck,
  Send,
  AlertTriangle,
  Info,
  CheckCircle,
  HelpCircle,
  BookOpen,
} from 'lucide-react';

export default function OuvidoriaForm() {
  const {
    tipo,
    setTipo,
    cursoSigla,
    setCursoSigla,
    assunto,
    setAssunto,
    mensagem,
    setMensagem,
    isAnonimo,
    setIsAnonimo,
    autorNome,
    setAutorNome,
    autorMatricula,
    setAutorMatricula,
    autorEmail,
    setAutorEmail,
    enviando,
    erros,
    handleSubmit,
    tiposDisponiveis,
  } = useOuvidoriaForm();

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Alerta de Criptografia de Envelope (Zero-Trust) */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 sm:p-5 flex items-start gap-3.5 shadow-sm">
        <div className="w-10 h-10 rounded-full bg-[#0B3B60] text-white flex items-center justify-center shrink-0">
          <Lock className="w-5 h-5" aria-hidden="true" />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-[#0B3B60]">
              Criptografia de Envelope Client-Side Ativa
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
              AES-GCM 256 + RSA-OAEP 4096
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Sua mensagem é cifrada no seu próprio navegador antes de ser enviada ao servidor.
            Mesmo estudantes monitores que administram o banco de dados visualizam apenas dados ilegíveis. Apenas a chave privada do Gabinete da Direção pode descriptografar sua manifestação.
          </p>
          <div className="pt-2">
            <Link
              href="/guias/estudante#9-canal-fale-com-a-direcao-ouvidoria-soberana-zero-trust"
              target="_blank"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0056B3] hover:text-[#0B3B60] hover:underline"
            >
              <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Consultar Guia de Uso da Ouvidoria</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Erros gerais */}
      {Object.keys(erros).length > 0 && (
        <div role="alert" className="bg-red-50 border-l-4 border-red-600 p-4 rounded-r-lg">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" aria-hidden="true" />
            <h4 className="text-sm font-bold text-red-900">Revise os campos obrigatórios:</h4>
          </div>
          <ul className="list-disc list-inside text-xs text-red-700 space-y-1">
            {Object.values(erros).map((msg, i) => (
              <li key={i}>{msg}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Bloco 1: Tipo da Manifestação */}
      <section className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-base sm:text-lg font-bold text-[#0B3B60] flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#0B3B60] text-white flex items-center justify-center text-xs">
              1
            </span>
            Natureza da Manifestação
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Selecione a categoria que melhor representa o seu contato com o Gabinete da Direção.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {tiposDisponiveis.map((t) => (
            <label
              key={t.id}
              className={`flex items-start gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                tipo === t.id
                  ? 'border-[#0B3B60] bg-blue-50/40 text-[#0B3B60]'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <input
                type="radio"
                name="tipo-manifestacao"
                value={t.id}
                checked={tipo === t.id}
                onChange={() => setTipo(t.id)}
                className="mt-1 text-[#0B3B60] focus:ring-[#0056B3]"
              />
              <div>
                <span className="block text-sm font-bold text-slate-900">{t.rotulo}</span>
                <span className="block text-xs text-slate-500 leading-snug mt-0.5">{t.desc}</span>
              </div>
            </label>
          ))}
        </div>

        {/* Setor/Curso */}
        <div className="pt-2">
          <label htmlFor="cursoSigla" className="block text-xs font-semibold text-slate-700 mb-1">
            Curso ou Setor de Referência (Opcional)
          </label>
          <select
            id="cursoSigla"
            value={cursoSigla}
            onChange={(e) => setCursoSigla(e.target.value as any)}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-[#0056B3] outline-none"
          >
            <option value="GERAL">Geral — Direção e Assuntos Administrativos Amplos</option>
            {CURSOS_LISTA.map((c) => (
              <option key={c.sigla} value={c.sigla}>
                {c.nome} ({c.sigla})
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* Bloco 2: Identificação ou Anonimato */}
      <section className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#0B3B60] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#0B3B60] text-white flex items-center justify-center text-xs">
                2
              </span>
              Identificação & Sigilo
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Você pode se identificar institucionalmente ou optar pelo anonimato total.
            </p>
          </div>

          {/* Toggle Anônimo com destaque em cor quente */}
          <div className="flex items-center gap-3 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-orange-300 px-3.5 py-2 rounded-xl shadow-xs shrink-0">
            <div className="flex items-center gap-1.5">
              <EyeOff className="w-4 h-4 text-orange-600 shrink-0" aria-hidden="true" />
              <span className="text-xs font-bold text-orange-950">
                Manifestação Anônima:
              </span>
            </div>
            <button
              type="button"
              role="switch"
              id="toggle-manifestacao-anonima"
              aria-label="Alternar manifestação anônima"
              aria-checked={isAnonimo}
              onClick={() => setIsAnonimo(!isAnonimo)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-1 ${
                isAnonimo ? 'bg-orange-600' : 'bg-slate-300 hover:bg-slate-400'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  isAnonimo ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
            <span
              className={`text-[11px] font-extrabold uppercase px-2 py-0.5 rounded-full transition-colors ${
                isAnonimo
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'bg-orange-200/70 text-orange-900 border border-orange-300'
              }`}
            >
              {isAnonimo ? 'Ativado' : 'Desativado'}
            </span>
          </div>
        </div>

        {isAnonimo ? (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 space-y-1">
            <p className="font-bold flex items-center gap-1.5 text-amber-950">
              <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" aria-hidden="true" />
              Modo Anônimo Ativado
            </p>
            <p className="text-slate-700">
              Nenhum dado pessoal (nome, matrícula ou e-mail) será gravado. O único meio de consultar a resposta da Direção é mediante o <strong>Código do Protocolo</strong> e a <strong>Chave Secreta</strong> emitidos na próxima tela.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
            <div>
              <label htmlFor="autorNome" className="block text-xs font-semibold text-slate-700 mb-1">
                Nome Completo *
              </label>
              <input
                id="autorNome"
                type="text"
                required={!isAnonimo}
                value={autorNome}
                onChange={(e) => setAutorNome(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0056B3] outline-none"
              />
              {erros.autorNome && <span className="text-xs text-red-600">{erros.autorNome}</span>}
            </div>

            <div>
              <label htmlFor="autorMatricula" className="block text-xs font-semibold text-slate-700 mb-1">
                Matrícula / MASP (Opcional)
              </label>
              <input
                id="autorMatricula"
                type="text"
                value={autorMatricula}
                onChange={(e) => setAutorMatricula(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0056B3] outline-none"
              />
            </div>

            <div>
              <label htmlFor="autorEmail" className="block text-xs font-semibold text-slate-700 mb-1">
                E-mail para Contato (Opcional)
              </label>
              <input
                id="autorEmail"
                type="email"
                value={autorEmail}
                onChange={(e) => setAutorEmail(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0056B3] outline-none"
              />
            </div>
          </div>
        )}
      </section>

      {/* Bloco 3: Conteúdo da Manifestação */}
      <section className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-base sm:text-lg font-bold text-[#0B3B60] flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#0B3B60] text-white flex items-center justify-center text-xs">
              3
            </span>
            Mensagem ao Gabinete
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Descreva detalhadamente a situação, solicitação ou proposta.
          </p>
        </div>

        <div>
          <label htmlFor="assunto" className="block text-xs font-semibold text-slate-700 mb-1">
            Assunto Sintético *
          </label>
          <input
            id="assunto"
            type="text"
            required
            value={assunto}
            onChange={(e) => setAssunto(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0056B3] outline-none"
          />
          {erros.assunto && <span className="text-xs text-red-600">{erros.assunto}</span>}
        </div>

        <div>
          <label htmlFor="mensagem" className="block text-xs font-semibold text-slate-700 mb-1">
            Corpo Detalhado da Manifestação *
          </label>
          <textarea
            id="mensagem"
            rows={7}
            required
            value={mensagem}
            onChange={(e) => setMensagem(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0056B3] outline-none leading-relaxed"
          />
          <div className="flex justify-between text-[11px] text-slate-400 mt-1">
            <span>{mensagem.length} caracteres digitados</span>
            {erros.mensagem && <span className="text-xs text-red-600 font-medium">{erros.mensagem}</span>}
          </div>
        </div>
      </section>

      {/* Envio */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <p className="text-xs text-slate-500 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" aria-hidden="true" />
          Conforme Lei 12.527/2011 (LAI) e Lei 13.709/2018 (LGPD).
        </p>

        <button
          type="submit"
          disabled={enviando}
          className={`w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all ${
            enviando ? 'bg-slate-400 cursor-not-allowed' : 'bg-[#0B3B60] hover:bg-[#0056B3]'
          }`}
        >
          {enviando ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Cifrando com Envelope Crypto...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" aria-hidden="true" />
              Cifrar & Enviar com Protocolo Seguro
            </>
          )}
        </button>
      </div>
    </form>
  );
}
