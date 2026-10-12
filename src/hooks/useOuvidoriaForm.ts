'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TipoManifestacao } from '@/types/ouvidoria';
import { SiglaCurso } from '@/types/editorial';
import { registrarManifestacaoOuvidoria } from '@/lib/data/mock-ouvidoria';
import { esquemaManifestacaoOuvidoria } from '@/lib/utils/validations';

export interface TipoManifestacaoItem {
  id: TipoManifestacao;
  rotulo: string;
  desc: string;
}

export const TIPOS_MANIFESTACAO_DISPONIVEIS: TipoManifestacaoItem[] = [
  {
    id: 'solicitacao',
    rotulo: 'Solicitação',
    desc: 'Requerimentos acadêmicos, melhorias estruturais e pedidos institucionais',
  },
  {
    id: 'sugestao',
    rotulo: 'Sugestão',
    desc: 'Propostas de novas iniciativas, eventos ou métodos pedagógicos',
  },
  {
    id: 'elogio',
    rotulo: 'Elogio',
    desc: 'Reconhecimento a professores, setores, projetos ou servidores',
  },
  {
    id: 'denuncia',
    rotulo: 'Denúncia',
    desc: 'Irregularidades, assédio ou descumprimento de normas (sigilo absoluto garantido)',
  },
];

export interface UseOuvidoriaFormReturn {
  // Campos
  tipo: TipoManifestacao;
  setTipo: (tipo: TipoManifestacao) => void;
  cursoSigla: SiglaCurso | 'GERAL';
  setCursoSigla: (sigla: SiglaCurso | 'GERAL') => void;
  assunto: string;
  setAssunto: (valor: string) => void;
  mensagem: string;
  setMensagem: (valor: string) => void;
  isAnonimo: boolean;
  setIsAnonimo: (anonimo: boolean) => void;
  autorNome: string;
  setAutorNome: (valor: string) => void;
  autorMatricula: string;
  setAutorMatricula: (valor: string) => void;
  autorEmail: string;
  setAutorEmail: (valor: string) => void;

  // Processo e validação
  enviando: boolean;
  erros: Record<string, string>;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  tiposDisponiveis: TipoManifestacaoItem[];
}

/**
 * Hook customizado para orquestrar o envio de manifestações de ouvidoria.
 * Isola a validação com Zod, o acionamento do pipeline criptográfico Zero-Trust
 * (cifragem de envelope no cliente) e o gerenciamento de comprovantes efêmeros.
 */
export function useOuvidoriaForm(): UseOuvidoriaFormReturn {
  const router = useRouter();

  const [tipo, setTipo] = useState<TipoManifestacao>('solicitacao');
  const [cursoSigla, setCursoSigla] = useState<SiglaCurso | 'GERAL'>('GERAL');
  const [assunto, setAssunto] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [isAnonimo, setIsAnonimo] = useState(false);
  const [autorNome, setAutorNome] = useState('');
  const [autorMatricula, setAutorMatricula] = useState('');
  const [autorEmail, setAutorEmail] = useState('');

  const [enviando, setEnviando] = useState(false);
  const [erros, setErros] = useState<Record<string, string>>({});

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErros({});

    const dados = {
      tipo,
      cursoSigla,
      assunto: assunto.trim(),
      mensagem: mensagem.trim(),
      isAnonimo,
      autorNome: isAnonimo ? undefined : autorNome.trim(),
      autorMatricula: isAnonimo ? undefined : autorMatricula.trim(),
      autorEmail: isAnonimo ? undefined : autorEmail.trim(),
    };

    const validacao = esquemaManifestacaoOuvidoria.safeParse(dados);

    if (!validacao.success) {
      const novosErros: Record<string, string> = {};
      validacao.error.errors.forEach((err) => {
        if (err.path[0]) {
          novosErros[err.path[0].toString()] = err.message;
        }
      });
      setErros(novosErros);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setEnviando(true);

    try {
      // Executa o pipeline de cifragem de envelope e registro no cliente
      const resultado = await registrarManifestacaoOuvidoria({
        tipo,
        cursoSigla,
        assunto: dados.assunto,
        mensagem: dados.mensagem,
        isAnonimo,
        autorNome: dados.autorNome,
        autorMatricula: dados.autorMatricula,
        autorEmail: dados.autorEmail,
      });

      // Persiste o comprovante efêmero para visualização na tela de sucesso
      sessionStorage.setItem(
        'portal_uemg_comprovante_recente',
        JSON.stringify(resultado.comprovante)
      );

      // Redireciona com os parâmetros de consulta
      router.push(
        `/fale-com-a-direcao/sucesso?protocolo=${encodeURIComponent(
          resultado.protocolo.codigoProtocolo
        )}&token=${encodeURIComponent(resultado.tokenSecreto)}`
      );
    } catch {
      alert('Falha ao processar a criptografia de envelope. Tente novamente.');
      setEnviando(false);
    }
  }

  return {
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
    tiposDisponiveis: TIPOS_MANIFESTACAO_DISPONIVEIS,
  };
}
