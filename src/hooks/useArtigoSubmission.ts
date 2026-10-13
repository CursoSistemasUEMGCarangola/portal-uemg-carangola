'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { SiglaCurso } from '@/types/editorial';
import { salvarArtigoSubmetido } from '@/lib/data/mock-articles';
import {
  comprimirImagemParaWebp,
  ResultadoCompressao,
} from '@/lib/storage/image-compression';
import {
  salvarRascunho,
  carregarRascunho,
  limparRascunho,
} from '@/lib/storage/draft-storage';
import { esquemasSubmissaoArtigo } from '@/lib/utils/validations';
import { useAuth } from '@/context/AuthContext';

export interface UseArtigoSubmissionReturn {
  // Campos do formulário
  titulo: string;
  setTitulo: (valor: string) => void;
  resumo: string;
  setResumo: (valor: string) => void;
  corpoMarkdown: string;
  setCorpoMarkdown: (valor: string) => void;
  cursoSigla: SiglaCurso;
  setCursoSigla: (sigla: SiglaCurso) => void;
  autorNome: string;
  setAutorNome: (valor: string) => void;
  autorMatricula: string;
  setAutorMatricula: (valor: string) => void;
  coautores: string;
  setCoautores: (valor: string) => void;
  linkExternoMidia: string;
  setLinkExternoMidia: (valor: string) => void;

  // Pipeline de imagem e compressão
  fileInputRef: React.RefObject<HTMLInputElement>;
  processandoImagem: boolean;
  resultadoCompressao: ResultadoCompressao | null;
  erroImagem: string | null;
  handleSelecionarArquivo: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleRemoverImagem: () => void;

  // Estados de controle e ciclo de vida
  errosValidacao: Record<string, string>;
  submetendo: boolean;
  rascunhoCarregado: boolean;
  abaPreview: 'editor' | 'preview';
  setAbaPreview: (aba: 'editor' | 'preview') => void;
  handleLimparRascunho: () => void;
  handleCancelar: () => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}

/**
 * Hook customizado para orquestrar o ciclo de vida da submissão de artigos.
 * Isola lógica de validação Zod, persistência de rascunhos voláteis em sessionStorage
 * e processamento de compressão WebP em canvas, desonerando o componente visual.
 */
export function useArtigoSubmission(): UseArtigoSubmissionReturn {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user, perfil } = useAuth();

  // Estados dos campos
  const [titulo, setTitulo] = useState('');
  const [resumo, setResumo] = useState('');
  const [corpoMarkdown, setCorpoMarkdown] = useState('');
  const [cursoSigla, setCursoSigla] = useState<SiglaCurso>('SIS');
  const [autorNome, setAutorNome] = useState('');
  const [autorMatricula, setAutorMatricula] = useState('');
  const [coautores, setCoautores] = useState('');
  const [linkExternoMidia, setLinkExternoMidia] = useState('');

  // Estados de imagem
  const [processandoImagem, setProcessandoImagem] = useState(false);
  const [resultadoCompressao, setResultadoCompressao] = useState<ResultadoCompressao | null>(null);
  const [erroImagem, setErroImagem] = useState<string | null>(null);

  // Estados de submissão e interface
  const [errosValidacao, setErrosValidacao] = useState<Record<string, string>>({});
  const [submetendo, setSubmetendo] = useState(false);
  const [rascunhoCarregado, setRascunhoCarregado] = useState(false);
  const [abaPreview, setAbaPreview] = useState<'editor' | 'preview'>('editor');

  // Recuperação de rascunho anterior da sessão ou dados do autor autenticado
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
      if (rascunho.linkExternoMidia) setLinkExternoMidia(rascunho.linkExternoMidia);
      setRascunhoCarregado(true);
    } else if (user) {
      const nome = perfil?.nome_completo || (user.user_metadata?.nome_completo as string) || '';
      const mat = perfil?.matricula || (user.user_metadata?.matricula as string) || '';
      const sigla = (user.user_metadata?.curso_sigla as SiglaCurso) || 'SIS';
      if (nome) setAutorNome(nome);
      if (mat) setAutorMatricula(mat);
      if (sigla) setCursoSigla(sigla);
    }
  }, [user, perfil]);

  // Salvamento automático contínuo
  useEffect(() => {
    salvarRascunho({
      titulo,
      resumo,
      corpoMarkdown,
      cursoSigla,
      autorNome,
      autorMatricula,
      coautores,
      linkExternoMidia,
    });
  }, [titulo, resumo, corpoMarkdown, cursoSigla, autorNome, autorMatricula, coautores, linkExternoMidia]);

  // Handler de seleção de imagem com compressão WebP client-side
  async function handleSelecionarArquivo(e: React.ChangeEvent<HTMLInputElement>) {
    const arquivo = e.target.files?.[0];
    if (!arquivo) return;

    setErroImagem(null);
    setProcessandoImagem(true);

    try {
      const res = await comprimirImagemParaWebp(arquivo, 1200, 0.8);
      setResultadoCompressao(res);
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

  function handleRemoverImagem() {
    setResultadoCompressao(null);
    setErroImagem(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  function handleLimparRascunho() {
    if (confirm('Tem certeza que deseja descartar este rascunho e limpar os campos?')) {
      limparRascunho();
      setTitulo('');
      setResumo('');
      setCorpoMarkdown('');
      setAutorNome('');
      setAutorMatricula('');
      setCoautores('');
      setLinkExternoMidia('');
      setResultadoCompressao(null);
      setRascunhoCarregado(false);
      setErrosValidacao({});
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }

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
        autorId: user?.id,
        autorEmail: user?.email,
        autorNome,
        autorMatricula,
        coautores: coautores || undefined,
        linkExternoMidia: linkExternoMidia || undefined,
        capaBase64Webp: resultadoCompressao!.dataUrlWebp,
        capaTamanhoBytes: resultadoCompressao!.tamanhoComprimidoBytes,
      });

      // Limpeza de rascunho pós-envio (Defesa em Computador Compartilhado)
      limparRascunho();

      // Redireciona para o painel do autor com feedback de sucesso
      router.push('/meus-artigos?status=sucesso');
    } catch {
      alert('Ocorreu um erro ao registrar a submissão. Tente novamente.');
      setSubmetendo(false);
    }
  }

  return {
    titulo,
    setTitulo,
    resumo,
    setResumo,
    corpoMarkdown,
    setCorpoMarkdown,
    cursoSigla,
    setCursoSigla,
    autorNome,
    setAutorNome,
    autorMatricula,
    setAutorMatricula,
    coautores,
    setCoautores,
    linkExternoMidia,
    setLinkExternoMidia,

    fileInputRef,
    processandoImagem,
    resultadoCompressao,
    erroImagem,
    handleSelecionarArquivo,
    handleRemoverImagem,

    errosValidacao,
    submetendo,
    rascunhoCarregado,
    abaPreview,
    setAbaPreview,
    handleLimparRascunho,
    handleCancelar: () => router.back(),
    handleSubmit,
  };
}
