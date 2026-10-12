'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { CURSOS_LISTA, salvarArtigoSubmetido } from '@/lib/data/mock-articles';
import {
  comprimirImagemParaWebp,
  formatarBytes,
  ResultadoCompressao,
} from '@/lib/storage/image-compression';
import {
  salvarRascunho,
  carregarRascunho,
  limparRascunho,
} from '@/lib/storage/draft-storage';
import { esquemasSubmissaoArtigo } from '@/lib/utils/validations';
import { SiglaCurso } from '@/types/editorial';
import {
  UploadCloud,
  CheckCircle,
  AlertTriangle,
  FileText,
  Image as ImageIcon,
  Sparkles,
  RotateCcw,
  Send,
  Eye,
  Info,
} from 'lucide-react';

export default function SubmissionForm() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Estados dos campos do formulário
  const [titulo, setTitulo] = useState('');
  const [resumo, setResumo] = useState('');
  const [corpoMarkdown, setCorpoMarkdown] = useState('');
  const [cursoSigla, setCursoSigla] = useState<SiglaCurso>('SIN');
  const [autorNome, setAutorNome] = useState('');
  const [autorMatricula, setAutorMatricula] = useState('');
  const [coautores, setCoautores] = useState('');
  const [doi, setDoi] = useState('');
  const [linkExternoMidia, setLinkExternoMidia] = useState('');

  // Estados de imagem e compressão
  const [processandoImagem, setProcessandoImagem] = useState(false);
  const [resultadoCompressao, setResultadoCompressao] = useState<ResultadoCompressao | null>(null);
  const [erroImagem, setErroImagem] = useState<string | null>(null);

  // Estados de submissão e validação
  const [errosValidacao, setErrosValidacao] = useState<Record<string, string>>({});
  const [submetendo, setSubmetendo] = useState(false);
  const [rascunhoCarregado, setRascunhoCarregado] = useState(false);
  const [abaPreview, setAbaPreview] = useState<'editor' | 'preview'>('editor');

  // Carregar rascunho anterior da sessão (Modo Computador Compartilhado)
  useEffect(() => {
    const rascunho = carregarRascunho();
    if (rascunho) {
      if (rascunho.titulo) setTitulo(rascunho.titulo);
      if (rascunho.resumo) setResumo(rascunho.resumo);
      if (rascunho.corpoMarkdown) setCorpoMarkdown(rascunho.corpoMarkdown);
      if (rascunho.cursoSigla) setCursoSigla(rascunho.cursoSigla as SiglaCurso);
      if (rascunho.autorNome) setAutorNome(rascunho.autorNome);
      if (rascunho.autorMatricula) setAutorMatricula(rascunho.autorMatricula);
      if (rascunho.coautores) setCoautores(rascunho.coautores);
      if (rascunho.doi) setDoi(rascunho.doi);
      if (rascunho.linkExternoMidia) setLinkExternoMidia(rascunho.linkExternoMidia);
      setRascunhoCarregado(true);
    }
  }, []);

  // Salvar rascunho automaticamente a cada alteração
  useEffect(() => {
    salvarRascunho({
      titulo,
      resumo,
      corpoMarkdown,
      cursoSigla,
      autorNome,
      autorMatricula,
      coautores,
      doi,
      linkExternoMidia,
    });
  }, [titulo, resumo, corpoMarkdown, cursoSigla, autorNome, autorMatricula, coautores, doi, linkExternoMidia]);

  // Handler de seleção de imagem com pipeline de compressão no navegador
  async function handleSelecionarArquivo(e: React.ChangeEvent<HTMLInputElement>) {
    const arquivo = e.target.files?.[0];
    if (!arquivo) return;

    setErroImagem(null);
    setProcessandoImagem(true);

    try {
      const res = await comprimirImagemParaWebp(arquivo, 1200, 0.8);
      setResultadoCompressao(res);
      // Limpa erro de imagem se houver
      setErrosValidacao((prev) => {
        const novo = { ...prev };
        delete novo.capaBase64Webp;
        return novo;
      });
    } catch (err: any) {
      setErroImagem(err?.message || 'Falha ao processar e comprimir a imagem.');
      setResultadoCompressao(null);
    } finally {
      setProcessandoImagem(false);
    }
  }

  // Handler de descarte de rascunho
  function handleLimparRascunho() {
    if (confirm('Tem certeza que deseja descartar este rascunho e limpar os campos?')) {
      limparRascunho();
      setTitulo('');
      setResumo('');
      setCorpoMarkdown('');
      setAutorNome('');
      setAutorMatricula('');
      setCoautores('');
      setDoi('');
      setLinkExternoMidia('');
      setResultadoCompressao(null);
      setRascunhoCarregado(false);
      setErrosValidacao({});
    }
  }

  // Envio da submissão com validação
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrosValidacao({});

    const dados = {
      titulo,
      resumo,
      corpoMarkdown,
      cursoSigla,
      autorNome,
      autorMatricula,
      coautores: coautores || undefined,
      doi: doi || undefined,
      linkExternoMidia: linkExternoMidia || undefined,
      capaBase64Webp: resultadoCompressao?.dataUrlWebp || '',
    };

    const validacao = esquemasSubmissaoArtigo.safeParse(dados);

    if (!validacao.success) {
      const erros: Record<string, string> = {};
      validacao.error.errors.forEach((err) => {
        if (err.path[0]) {
          erros[err.path[0].toString()] = err.message;
        }
      });
      setErrosValidacao(erros);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setSubmetendo(true);

    try {
      salvarArtigoSubmetido({
        titulo,
        resumo,
        corpoMarkdown,
        cursoSigla,
        autorNome,
        autorMatricula,
        coautores: coautores || undefined,
        doi: doi || undefined,
        linkExternoMidia: linkExternoMidia || undefined,
        capaBase64Webp: resultadoCompressao!.dataUrlWebp,
        capaTamanhoBytes: resultadoCompressao!.tamanhoComprimidoBytes,
      });

      // Limpeza de rascunho pós-envio (Shared Computer Defense)
      limparRascunho();

      // Redireciona para o painel do autor
      router.push('/meus-artigos?status=sucesso');
    } catch (err) {
      alert('Ocorreu um erro ao registrar a submissão. Tente novamente.');
      setSubmetendo(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Alerta de rascunho restaurado */}
      {rascunhoCarregado && (
        <div className="bg-blue-50 border-l-4 border-blue-700 p-4 rounded-r-lg flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Info className="w-5 h-5 text-blue-700 shrink-0" />
            <p className="text-sm text-blue-900 font-medium">
              Rascunho recuperado automaticamente da sua sessão. Os dados são salvos enquanto você digita.
            </p>
          </div>
          <button
            type="button"
            onClick={handleLimparRascunho}
            className="text-xs text-red-600 hover:text-red-800 underline font-semibold flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Limpar Rascunho
          </button>
        </div>
      )}

      {/* Erros gerais */}
      {Object.keys(errosValidacao).length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-r-lg">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
            <h3 className="text-sm font-bold text-red-900">
              Existem pendências no formulário antes do envio:
            </h3>
          </div>
          <ul className="list-disc list-inside text-xs text-red-700 space-y-1">
            {Object.values(errosValidacao).map((msg, idx) => (
              <li key={idx}>{msg}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Bloco 1: Identificação do Autor e Curso */}
      <section className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-5">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-lg font-bold text-[#0B3B60] flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#0B3B60] text-white flex items-center justify-center text-xs">
              1
            </span>
            Autoria & Vínculo Departamental
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Dados utilizados pelo Coordenador para validação monocrática de matrícula e mérito.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="autorNome" className="block text-xs font-semibold text-slate-700 mb-1">
              Nome Completo do Autor Principal *
            </label>
            <input
              id="autorNome"
              type="text"
              required
              value={autorNome}
              onChange={(e) => setAutorNome(e.target.value)}
              placeholder="Ex: Carlos Eduardo de Oliveira"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0056B3] focus:border-transparent outline-none"
            />
            {errosValidacao.autorNome && (
              <span className="text-xs text-red-600">{errosValidacao.autorNome}</span>
            )}
          </div>

          <div>
            <label htmlFor="autorMatricula" className="block text-xs font-semibold text-slate-700 mb-1">
              Matrícula Institucional / MASP *
            </label>
            <input
              id="autorMatricula"
              type="text"
              required
              value={autorMatricula}
              onChange={(e) => setAutorMatricula(e.target.value)}
              placeholder="Ex: 2024-SIN-1029 ou MASP-123456"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0056B3] focus:border-transparent outline-none"
            />
            {errosValidacao.autorMatricula && (
              <span className="text-xs text-red-600">{errosValidacao.autorMatricula}</span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="cursoSigla" className="block text-xs font-semibold text-slate-700 mb-1">
              Curso de Submissão *
            </label>
            <select
              id="cursoSigla"
              value={cursoSigla}
              onChange={(e) => setCursoSigla(e.target.value as SiglaCurso)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-[#0056B3] outline-none"
            >
              {CURSOS_LISTA.map((c) => (
                <option key={c.sigla} value={c.sigla}>
                  {c.nome} ({c.sigla})
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-500 mt-1">
              O artigo será encaminhado diretamente para o Coordenador deste curso.
            </p>
          </div>

          <div>
            <label htmlFor="coautores" className="block text-xs font-semibold text-slate-700 mb-1">
              Coautores / Orientadores (Opcional)
            </label>
            <input
              id="coautores"
              type="text"
              value={coautores}
              onChange={(e) => setCoautores(e.target.value)}
              placeholder="Ex: Ana Lima (Discente), Prof. Me. Marcos (Orientador)"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0056B3] outline-none"
            />
          </div>
        </div>
      </section>

      {/* Bloco 2: Conteúdo Científico */}
      <section className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-5">
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#0B3B60] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#0B3B60] text-white flex items-center justify-center text-xs">
                2
              </span>
              Conteúdo do Artigo
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              O texto estruturado é armazenado como Markdown (~15 KB), viabilizando compilação PDF on-the-fly.
            </p>
          </div>
          <div className="flex bg-slate-100 rounded-lg p-1 text-xs">
            <button
              type="button"
              onClick={() => setAbaPreview('editor')}
              className={`px-3 py-1 rounded-md font-medium transition-all ${
                abaPreview === 'editor'
                  ? 'bg-white text-[#0B3B60] shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Editor
            </button>
            <button
              type="button"
              onClick={() => setAbaPreview('preview')}
              className={`px-3 py-1 rounded-md font-medium transition-all flex items-center gap-1 ${
                abaPreview === 'preview'
                  ? 'bg-white text-[#0B3B60] shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              Prévia
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="titulo" className="block text-xs font-semibold text-slate-700 mb-1">
            Título do Trabalho Acadêmico *
          </label>
          <input
            id="titulo"
            type="text"
            required
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Ex: Impacto das Tecnologias Abertas no Desenvolvimento Regional do Vale do Carangola"
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0056B3] outline-none"
          />
          {errosValidacao.titulo && (
            <span className="text-xs text-red-600">{errosValidacao.titulo}</span>
          )}
        </div>

        <div>
          <label htmlFor="resumo" className="block text-xs font-semibold text-slate-700 mb-1">
            Resumo / Abstract (20 a 1500 caracteres) *
          </label>
          <textarea
            id="resumo"
            rows={3}
            required
            value={resumo}
            onChange={(e) => setResumo(e.target.value)}
            placeholder="Breve síntese dos objetivos, metodologia e conclusões..."
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0056B3] outline-none"
          />
          <div className="flex justify-between text-[11px] text-slate-400 mt-1">
            <span>{resumo.length} caracteres digitados</span>
            {errosValidacao.resumo && (
              <span className="text-xs text-red-600 font-medium">{errosValidacao.resumo}</span>
            )}
          </div>
        </div>

        {abaPreview === 'editor' ? (
          <div>
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="corpoMarkdown" className="block text-xs font-semibold text-slate-700">
                Corpo do Artigo (Formato Markdown) *
              </label>
              <span className="text-[11px] text-slate-400">
                Suporta ## Títulos, **negrito**, listas e citações
              </span>
            </div>
            <textarea
              id="corpoMarkdown"
              rows={12}
              required
              value={corpoMarkdown}
              onChange={(e) => setCorpoMarkdown(e.target.value)}
              placeholder="## 1. Introdução&#10;&#10;Escreva o corpo do seu artigo aqui em formato Markdown..."
              className="w-full font-mono text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0056B3] outline-none leading-relaxed"
            />
            {errosValidacao.corpoMarkdown && (
              <span className="text-xs text-red-600">{errosValidacao.corpoMarkdown}</span>
            )}
          </div>
        ) : (
          <div className="p-4 border border-slate-200 rounded-lg bg-slate-50 min-h-[250px] prose prose-sm max-w-none">
            <h3 className="text-base font-bold text-slate-800 border-b pb-2 mb-3">Prévia do Artigo</h3>
            {corpoMarkdown ? (
              <div className="whitespace-pre-wrap text-xs text-slate-700 font-sans leading-relaxed">
                {corpoMarkdown}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">Nenhum conteúdo inserido ainda.</p>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div>
            <label htmlFor="doi" className="block text-xs font-semibold text-slate-700 mb-1">
              Identificador Digital DOI (Opcional)
            </label>
            <input
              id="doi"
              type="text"
              value={doi}
              onChange={(e) => setDoi(e.target.value)}
              placeholder="10.5281/zenodo.123456"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0056B3] outline-none"
            />
          </div>

          <div>
            <label htmlFor="linkExternoMidia" className="block text-xs font-semibold text-slate-700 mb-1">
              Link Externo Complementar / Repositório (Opcional)
            </label>
            <input
              id="linkExternoMidia"
              type="url"
              value={linkExternoMidia}
              onChange={(e) => setLinkExternoMidia(e.target.value)}
              placeholder="https://github.com/... ou https://zenodo.org/..."
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0056B3] outline-none"
            />
          </div>
        </div>
      </section>

      {/* Bloco 3: Pipeline Obrigatório de Capa WebP */}
      <section className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-5">
        <div className="border-b border-slate-100 pb-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#0B3B60] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#0B3B60] text-white flex items-center justify-center text-xs">
                3
              </span>
              Capa & Compressão Client-Side (Custo Zero)
            </h2>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
              <Sparkles className="w-3 h-3" />
              Pipeline WebP no Navegador
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            A imagem é redimensionada (máx. 1200px) e convertida para WebP 80% na CPU da sua máquina antes de subir.
            Consumo de storage no servidor: ~80 a 110 KB.
          </p>
        </div>

        {/* Zona de upload e arraste */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
            resultadoCompressao
              ? 'border-emerald-400 bg-emerald-50/30'
              : 'border-slate-300 hover:border-[#0056B3] bg-slate-50 hover:bg-slate-100/60'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleSelecionarArquivo}
            className="hidden"
          />

          <div className="flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-blue-100 text-[#0056B3] flex items-center justify-center mb-3">
              {processandoImagem ? (
                <div className="w-6 h-6 border-2 border-[#0056B3] border-t-transparent rounded-full animate-spin" />
              ) : resultadoCompressao ? (
                <CheckCircle className="w-6 h-6 text-emerald-600" />
              ) : (
                <UploadCloud className="w-6 h-6" />
              )}
            </div>

            <p className="text-sm font-semibold text-slate-700">
              {processandoImagem
                ? 'Processando e comprimindo via Canvas...'
                : resultadoCompressao
                ? 'Imagem comprimida com sucesso! Clique para trocar.'
                : 'Clique ou arraste a imagem de capa aqui'}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Formatos aceitos: JPG, PNG, WebP (Máx. 1 imagem por artigo)
            </p>
          </div>
        </div>

        {erroImagem && (
          <p className="text-xs text-red-600 font-medium flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            {erroImagem}
          </p>
        )}
        {errosValidacao.capaBase64Webp && (
          <p className="text-xs text-red-600 font-medium">
            {errosValidacao.capaBase64Webp}
          </p>
        )}

        {/* Card de métricas de compressão (Transparência Custo Zero) */}
        {resultadoCompressao && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-lg overflow-hidden border border-slate-300 bg-white shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={resultadoCompressao.dataUrlWebp}
                  alt="Prévia WebP gerada pelo Canvas"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-slate-600">Formato Final</p>
                <p className="text-sm font-bold text-emerald-700">WebP 80%</p>
                <p className="text-[10px] text-slate-400">
                  {resultadoCompressao.larguraFinal} x {resultadoCompressao.alturaFinal} px
                </p>
              </div>
            </div>

            <div>
              <p className="text-[11px] font-semibold text-slate-600">Tamanho Original</p>
              <p className="text-sm font-bold text-slate-700">
                {formatarBytes(resultadoCompressao.tamanhoOriginalBytes)}
              </p>
            </div>

            <div>
              <p className="text-[11px] font-semibold text-slate-600">Tamanho Otimizado</p>
              <p className="text-sm font-bold text-emerald-600">
                {formatarBytes(resultadoCompressao.tamanhoComprimidoBytes)}
              </p>
            </div>

            <div className="bg-emerald-100 border border-emerald-300 rounded-lg p-2.5 text-center">
              <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                Economia de Storage
              </p>
              <p className="text-lg font-black text-emerald-900">
                {resultadoCompressao.percentualEconomia}%
              </p>
            </div>
          </div>
        )}
      </section>

      {/* Botões de Ação */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          Cancelar
        </button>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleLimparRascunho}
            className="px-4 py-2.5 text-xs font-semibold text-slate-500 hover:text-red-700 transition-colors"
          >
            Descartar Rascunho
          </button>

          <button
            type="submit"
            disabled={submetendo || processandoImagem || !resultadoCompressao}
            className={`px-7 py-3 rounded-xl font-bold text-sm text-white flex items-center gap-2 shadow-md transition-all ${
              submetendo || processandoImagem || !resultadoCompressao
                ? 'bg-slate-400 cursor-not-allowed'
                : 'bg-[#0B3B60] hover:bg-[#0056B3] hover:shadow-lg'
            }`}
          >
            {submetendo ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Registrando Submissão...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Submeter Artigo para Avaliação
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
