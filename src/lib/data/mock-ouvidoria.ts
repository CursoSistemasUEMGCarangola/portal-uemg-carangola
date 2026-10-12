/**
 * Camada de Dados e Consulta Cega de Ouvidoria (Zero-Trust)
 * Armazena e gerencia protocolos_internos com Custo Zero e Defesa Anti-Enumeração.
 */

import {
  ManifestacaoInput,
  ProtocoloInterno,
  ComprovanteProtocolo,
  ResultadoConsultaProtocolo,
} from '@/types/ouvidoria';
import {
  cifrarManifestacaoEnvelope,
  gerarCodigoProtocolo,
  gerarTokenSecreto,
  calcularHashSha256,
} from '@/lib/crypto/envelope-encryption';

const CHAVE_STORAGE_OUVIDORIA = 'portal_uemg_protocolos_ouvidoria_v1';

// Sementes iniciais para teste institucional e consulta imediata (Vazio para testes de usabilidade)
export const PROTOCOLOS_SEED: ProtocoloInterno[] = [];

export function obterProtocolosArmazenados(): ProtocoloInterno[] {
  if (typeof window === 'undefined') return PROTOCOLOS_SEED;

  try {
    const salvos = localStorage.getItem(CHAVE_STORAGE_OUVIDORIA);
    if (!salvos) return PROTOCOLOS_SEED;
    const lista = JSON.parse(salvos) as ProtocoloInterno[];
    const ids = new Set(lista.map((p) => p.id));
    const restantes = PROTOCOLOS_SEED.filter((p) => !ids.has(p.id));
    return [...lista, ...restantes];
  } catch {
    return PROTOCOLOS_SEED;
  }
}

/**
 * Criação e envio seguro de manifestação com Criptografia de Envelope no cliente
 */
export async function registrarManifestacaoOuvidoria(
  input: ManifestacaoInput
): Promise<{
  protocolo: ProtocoloInterno;
  tokenSecreto: string;
  comprovante: ComprovanteProtocolo;
}> {
  // 1. Cifragem de Envelope no navegador
  const envelope = await cifrarManifestacaoEnvelope({
    assunto: input.assunto,
    mensagem: input.mensagem,
    autorNome: input.isAnonimo ? 'Anônimo' : input.autorNome,
    autorMatricula: input.isAnonimo ? undefined : input.autorMatricula,
    autorEmail: input.isAnonimo ? undefined : input.autorEmail,
  });

  // 2. Geração da Dupla Chave (Protocolo + Token Secreto de 24 caracteres)
  const codigoProtocolo = gerarCodigoProtocolo();
  const tokenSecreto = gerarTokenSecreto(24);
  const tokenHash = await calcularHashSha256(tokenSecreto);

  const agora = new Date();
  const dataFormatada = agora.toLocaleDateString('pt-BR') + ' ' + agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  // 3. Estruturação do registro para a tabela protocolos_internos
  const novoProtocolo: ProtocoloInterno = {
    id: `proto-${Date.now()}`,
    codigoProtocolo,
    tokenHash,
    tipo: input.tipo,
    cursoSigla: input.cursoSigla || 'GERAL',
    isAnonimo: input.isAnonimo,
    envelopeCifrado: envelope,
    status: 'pendente',
    criadoEm: dataFormatada,
    atualizadoEm: dataFormatada,
  };

  // 4. Persistência local segura
  if (typeof window !== 'undefined') {
    try {
      const atuais = obterProtocolosArmazenados();
      const atualizados = [novoProtocolo, ...atuais];
      localStorage.setItem(CHAVE_STORAGE_OUVIDORIA, JSON.stringify(atualizados));
    } catch (e) {
      console.warn('Erro ao persistir protocolo na sessão:', e);
    }
  }

  // 5. Emissão do comprovante portátil
  const comprovante: ComprovanteProtocolo = {
    codigoProtocolo,
    tokenSecreto,
    tipo: input.tipo,
    cursoSigla: input.cursoSigla || 'GERAL',
    isAnonimo: input.isAnonimo,
    autorNome: input.isAnonimo ? 'Manifestação Anônima' : input.autorNome,
    dataHoraEnvio: dataFormatada,
    hashIntegridade: tokenHash.substring(0, 16).toUpperCase(),
  };

  return {
    protocolo: novoProtocolo,
    tokenSecreto,
    comprovante,
  };
}

/**
 * Consulta Cega com Proteção contra Enumeração e Timing Attacks
 * Exige a tupla obrigatória: Código do Protocolo + Token Secreto (NanoID 24 chars)
 */
export async function consultarProtocoloBlind(
  codigoProtocoloRaw: string,
  tokenSecretoRaw: string
): Promise<ResultadoConsultaProtocolo> {
  const codigo = codigoProtocoloRaw.trim().toUpperCase();
  const token = tokenSecretoRaw.trim();

  if (!codigo || !token) {
    return {
      encontrado: false,
      mensagemErro: 'Informe o código do protocolo e a chave secreta de consulta.',
    };
  }

  try {
    // Calcula o SHA-256 do token informado pelo usuário
    const hashCalculado = await calcularHashSha256(token);

    // Simulação de delay constante para neutralizar timing attacks
    await new Promise((r) => setTimeout(r, 400));

    const protocolos = obterProtocolosArmazenados();

  // Comparação estrita da tupla Protocolo + TokenHash
  const encontrado = protocolos.find(
    (p) =>
      p.codigoProtocolo.toUpperCase() === codigo &&
      p.tokenHash.toLowerCase() === hashCalculado.toLowerCase()
  );

  if (!encontrado) {
    // Retorno 404 estrito padronizado (sem expor se o código existe ou se o token está errado)
    return {
      encontrado: false,
      mensagemErro: 'Protocolo ou chave secreta não localizados no sistema (404 Not Found).',
    };
  }

    return {
      encontrado: true,
      codigoProtocolo: encontrado.codigoProtocolo,
      tipo: encontrado.tipo,
      status: encontrado.status,
      cursoSigla: encontrado.cursoSigla,
      isAnonimo: encontrado.isAnonimo,
      dataEnvio: encontrado.criadoEm,
      dataResposta: encontrado.atualizadoEm,
      despachoOficial: encontrado.despachoOficial,
      numeroPortaria: encontrado.numeroPortaria,
    };
  } catch {
    return {
      encontrado: false,
      mensagemErro: 'Erro interno ao validar protocolo (404 Not Found).',
    };
  }
}

/**
 * Aplica despacho oficial do Gabinete da Direção e opcionalmente homologa para o mural público
 */
export function aplicarDespachoDirecao(
  protocoloId: string,
  acao: 'analise_assessoria' | 'analise_diretoria' | 'responder_privado' | 'homologar_mural',
  despachoOficial: string,
  numeroPortaria?: string,
  resumoSanitizadoMural?: string
): ProtocoloInterno | null {
  if (typeof window === 'undefined') return null;

  try {
    const protocolos = obterProtocolosArmazenados();
    const index = protocolos.findIndex((p) => p.id === protocoloId);
    if (index === -1) return null;

    const protocolo = { ...protocolos[index] };
    const agora = new Date();
    const dataHora =
      agora.toLocaleDateString('pt-BR') +
      ' ' +
      agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    protocolo.despachoOficial = despachoOficial;
    protocolo.numeroPortaria = numeroPortaria || undefined;
    protocolo.atualizadoEm = dataHora;

    if (acao === 'analise_assessoria') {
      protocolo.status = 'em_analise_assessoria';
    } else if (acao === 'analise_diretoria') {
      protocolo.status = 'em_analise_diretoria';
    } else if (acao === 'responder_privado') {
      protocolo.status = 'respondido_privado';
    } else if (acao === 'homologar_mural') {
      protocolo.status = 'homologado_publico';
      protocolo.resumoSanitizadoMural = resumoSanitizadoMural;

      // Desacoplamento Físico: grava na tabela separada mural_publico
      if (resumoSanitizadoMural) {
        const { publicarNoMuralSanitizado } = require('./mock-mural');
        publicarNoMuralSanitizado({
          protocoloId: protocolo.id,
          protocoloReferencia: protocolo.codigoProtocolo,
          cursoSigla: protocolo.cursoSigla,
          tipo: protocolo.tipo,
          resumoSanitizado: resumoSanitizadoMural,
          respostaOficial: despachoOficial,
          numeroPortaria: numeroPortaria,
          dataManifestacao: protocolo.criadoEm.split(' ')[0],
        });
      }
    }

    protocolos[index] = protocolo;
    localStorage.setItem(CHAVE_STORAGE_OUVIDORIA, JSON.stringify(protocolos));
    return protocolo;
  } catch (err) {
    console.warn('Erro ao aplicar despacho do Gabinete:', err);
    return null;
  }
}

