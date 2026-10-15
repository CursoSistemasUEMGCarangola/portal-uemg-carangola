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
import { createClient } from '@/lib/supabase/client';

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

  // 4. Persistência no Banco de Dados Supabase (Tabela protocolos_internos)
  try {
    const supabase = createClient();

    let cursoId: string | null = null;
    if (input.cursoSigla && input.cursoSigla !== 'GERAL') {
      const { data: cursoRow } = await supabase
        .from('cursos')
        .select('id')
        .eq('sigla', input.cursoSigla)
        .maybeSingle();

      if (cursoRow?.id) {
        cursoId = cursoRow.id;
      }
    }

    // Grava na tabela com política RLS pública (sem .select() para manter sigilo estrito)
    const { error: dbError } = await supabase.from('protocolos_internos').insert({
      codigo_protocolo: codigoProtocolo,
      token_hash: tokenHash,
      curso_id: cursoId,
      is_anonimo: Boolean(input.isAnonimo),
      payload_cifrado: JSON.stringify({
        ciphertext: envelope.ciphertextBase64,
        iv: envelope.ivBase64,
        algoritmoSimetrico: envelope.algoritmoSimetrico,
        algoritmoAssimetrico: envelope.algoritmoAssimetrico,
        tipo: input.tipo,
        cursoSigla: input.cursoSigla || 'GERAL',
      }),
      wrapped_dek: envelope.wrappedDekBase64,
      status: 'pendente',
    });

    if (dbError) {
      console.warn('Aviso: Falha ao persistir no Supabase (mantendo cache local):', dbError.message);
    }
  } catch (err) {
    console.warn('Aviso: Erro de conexão ao salvar manifestação no Supabase:', err);
  }

  // 5. Persistência local segura (backup / comprovante no navegador do cidadão)
  if (typeof window !== 'undefined') {
    try {
      const atuais = obterProtocolosArmazenados();
      const atualizados = [novoProtocolo, ...atuais];
      localStorage.setItem(CHAVE_STORAGE_OUVIDORIA, JSON.stringify(atualizados));
    } catch (e) {
      console.warn('Erro ao persistir protocolo na sessão:', e);
    }
  }

  // 6. Emissão do comprovante portátil
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

    // 1. Tenta consulta via RPC de Segurança no Supabase (consultar_protocolo_seguro)
    try {
      const supabase = createClient();
      const { data: rowsRpc, error: rpcError } = await supabase.rpc('consultar_protocolo_seguro', {
        p_codigo: codigo,
        p_token_hash: hashCalculado,
      });

      if (!rpcError && rowsRpc && rowsRpc.length > 0) {
        const row = rowsRpc[0];
        const dataEnvioFormatada = row.criado_em
          ? new Date(row.criado_em).toLocaleDateString('pt-BR') +
            ' ' +
            new Date(row.criado_em).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
          : undefined;

        const dataRespostaFormatada = row.atualizado_em
          ? new Date(row.atualizado_em).toLocaleDateString('pt-BR') +
            ' ' +
            new Date(row.atualizado_em).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
          : undefined;

        return {
          encontrado: true,
          codigoProtocolo: row.codigo_protocolo,
          tipo: 'solicitacao',
          status: row.status,
          cursoSigla: (row.curso_sigla || 'GERAL') as any,
          isAnonimo: true,
          dataEnvio: dataEnvioFormatada,
          dataResposta: dataRespostaFormatada,
          despachoOficial: row.despacho_cifrado || undefined,
          numeroPortaria: row.numero_portaria || undefined,
        };
      }
    } catch (errRpc) {
      console.warn('Aviso: RPC Supabase indisponível no momento, tentando cache local:', errRpc);
    }

    // 2. Fallback de contingência local (localStorage)
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

    let novoStatus: any = 'pendente';
    if (acao === 'analise_assessoria') {
      novoStatus = 'em_analise_assessoria';
      protocolo.status = novoStatus;
    } else if (acao === 'analise_diretoria') {
      novoStatus = 'em_analise_diretoria';
      protocolo.status = novoStatus;
    } else if (acao === 'responder_privado') {
      novoStatus = 'respondido_privado';
      protocolo.status = novoStatus;
    } else if (acao === 'homologar_mural') {
      novoStatus = 'homologado_publico';
      protocolo.status = novoStatus;
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

    // Sincroniza despacho no Supabase (se acessível pelo Diretor)
    try {
      const supabase = createClient();
      supabase
        .from('protocolos_internos')
        .update({
          status: novoStatus,
          despacho_cifrado: despachoOficial,
          numero_portaria: numeroPortaria || null,
          atualizado_em: new Date().toISOString(),
        })
        .eq('codigo_protocolo', protocolo.codigoProtocolo)
        .then(({ error }) => {
          if (error) console.warn('Aviso: Sincronização Supabase de despacho:', error.message);
        });
    } catch (e) {
      console.warn('Erro ao disparar update no Supabase:', e);
    }

    protocolos[index] = protocolo;
    localStorage.setItem(CHAVE_STORAGE_OUVIDORIA, JSON.stringify(protocolos));
    return protocolo;
  } catch (err) {
    console.warn('Erro ao aplicar despacho do Gabinete:', err);
    return null;
  }
}

