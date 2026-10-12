/**
 * Algoritmo Matemático de Divisão Secreta de Shamir (Shamir's Secret Sharing)
 * Executado estritamente sobre o Corpo Finito de Galois GF(2^8) / GF(256).
 *
 * Implementa o esquema de limiar 2-de-3 (Threshold k=2, N=3) conforme o Hard Box DNA #4:
 * Garante que qualquer combinação de 2 custodiantes recupera a chave mestre institucional,
 * enquanto 1 fragmento isolado possui segurança incondicional (0 bits de informação).
 */

import {
  CustodiantePapel,
  CustodianteInfo,
  FragmentoChaveShamir,
  ResultadoCerimoniaParticao,
  ResultadoRecomposicaoChave,
} from '@/types/cerimonia';

export const CUSTODIANTES_INSTITUCIONAIS: CustodianteInfo[] = [
  {
    papel: 'diretor_geral',
    tituloInstitucional: 'Diretor Geral da Unidade Acadêmica',
    titularAtual: 'Prof. Dr. Diretor Geral (Gestão Vigente)',
    indiceX: 1,
    descricao: 'Custodiante da gestão executiva e representação institucional máxima.',
  },
  {
    papel: 'secretaria_geral',
    tituloInstitucional: 'Secretaria Geral / Vice-Direção',
    titularAtual: 'Secretário(a) Geral e Registros Acadêmicos',
    indiceX: 2,
    descricao: 'Custodiante da guarda perene de atos administrativos e continuidade de mandato.',
  },
  {
    papel: 'presidencia_congregacao',
    tituloInstitucional: 'Presidência da Congregação da Unidade',
    titularAtual: 'Representante Eleito da Congregação',
    indiceX: 3,
    descricao: 'Custodiante colegiado deliberativo superior da UEMG Carangola.',
  },
];

// ============================================================================
// TABELAS E OPERAÇÕES EM GF(2^8) COM POLINÔMIO IRREDUTÍVEL 0x11D (x^8+x^4+x^3+x+1)
// ============================================================================

const EXP_TABLE = new Uint8Array(512);
const LOG_TABLE = new Uint8Array(256);

(function inicializarTabelasGalois() {
  let x = 1;
  for (let i = 0; i < 255; i++) {
    EXP_TABLE[i] = x;
    EXP_TABLE[i + 255] = x;
    LOG_TABLE[x] = i;
    // Multiplicação por 2 no GF(2^8)
    x = x << 1;
    if (x & 0x100) {
      x = x ^ 0x11d;
    }
  }
  EXP_TABLE[255] = EXP_TABLE[0];
  LOG_TABLE[0] = 0; // Log(0) indefinido, tratado por convenção
})();

function gfSoma(a: number, b: number): number {
  return a ^ b;
}

function gfMultiplica(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  const logA = LOG_TABLE[a];
  const logB = LOG_TABLE[b];
  return EXP_TABLE[logA + logB];
}

function gfDivide(a: number, b: number): number {
  if (b === 0) {
    throw new Error('Divisão por zero em GF(256) na interpolação de Lagrange.');
  }
  if (a === 0) return 0;
  const logA = LOG_TABLE[a];
  const logB = LOG_TABLE[b];
  return EXP_TABLE[(logA - logB + 255) % 255];
}

function bytesParaHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function hexParaBytes(hex: string): Uint8Array {
  const limpo = hex.trim().replace(/\s+/g, '');
  if (limpo.length % 2 !== 0) {
    throw new Error('Cadeia hexadecimal com comprimento ímpar inválido.');
  }
  const bytes = new Uint8Array(limpo.length / 2);
  for (let i = 0; i < limpo.length; i += 2) {
    bytes[i / 2] = parseInt(limpo.substring(i, i + 2), 16);
  }
  return bytes;
}

async function calcularSha256Hex(dados: Uint8Array): Promise<string> {
  if (typeof globalThis !== 'undefined' && globalThis.crypto?.subtle) {
    const hashBuffer = await globalThis.crypto.subtle.digest('SHA-256', dados as unknown as BufferSource);
    return bytesParaHex(new Uint8Array(hashBuffer));
  }
  throw new Error('Ambiente de execução sem suporte à Web Crypto API para cálculo de SHA-256.');
}

function obterBytesAleatoriosSeguros(tamanho: number): Uint8Array {
  const bytes = new Uint8Array(tamanho);
  if (typeof globalThis !== 'undefined' && globalThis.crypto?.getRandomValues) {
    globalThis.crypto.getRandomValues(bytes);
    return bytes;
  }
  throw new Error('Ambiente sem gerador de números pseudoaleatórios criptograficamente seguro (CSPRNG).');
}

/**
 * Divide uma chave mestre (string de qualquer tamanho) em 3 fragmentos matemáticos (k=2, N=3)
 */
export async function executarCerimoniaParticaoShamir(
  segredoTexto: string
): Promise<ResultadoCerimoniaParticao> {
  if (!segredoTexto || segredoTexto.trim().length === 0) {
    throw new Error('O segredo fornecido para a cerimônia não pode ser vazio.');
  }

  const encoder = new TextEncoder();
  const segredoBytes = encoder.encode(segredoTexto);
  const tamanho = segredoBytes.length;

  // Buffer para os 3 fragmentos (x = 1, 2, 3)
  const share1Bytes = new Uint8Array(tamanho);
  const share2Bytes = new Uint8Array(tamanho);
  const share3Bytes = new Uint8Array(tamanho);

  // Array de bytes aleatórios gerados estritamente via CSPRNG
  const coeficientesAleatorios = obterBytesAleatoriosSeguros(tamanho);

  for (let i = 0; i < tamanho; i++) {
    const s = segredoBytes[i];
    let a1 = coeficientesAleatorios[i];
    // Garante que o coeficiente a1 não seja zero (polinômio de grau estrito 1)
    if (a1 === 0) a1 = 1;

    // f(x) = s + a1 * x
    share1Bytes[i] = gfSoma(s, gfMultiplica(a1, 1)); // x = 1
    share2Bytes[i] = gfSoma(s, gfMultiplica(a1, 2)); // x = 2
    share3Bytes[i] = gfSoma(s, gfMultiplica(a1, 3)); // x = 3
  }

  const dataHora = new Date().toLocaleString('pt-BR');

  const fragmentos: FragmentoChaveShamir[] = [
    {
      indice: 1,
      papel: 'diretor_geral',
      tituloInstitucional: CUSTODIANTES_INSTITUCIONAIS[0].tituloInstitucional,
      shareHex: bytesParaHex(share1Bytes),
      comprovanteHash: await calcularSha256Hex(share1Bytes),
      geradoEm: dataHora,
    },
    {
      indice: 2,
      papel: 'secretaria_geral',
      tituloInstitucional: CUSTODIANTES_INSTITUCIONAIS[1].tituloInstitucional,
      shareHex: bytesParaHex(share2Bytes),
      comprovanteHash: await calcularSha256Hex(share2Bytes),
      geradoEm: dataHora,
    },
    {
      indice: 3,
      papel: 'presidencia_congregacao',
      tituloInstitucional: CUSTODIANTES_INSTITUCIONAIS[2].tituloInstitucional,
      shareHex: bytesParaHex(share3Bytes),
      comprovanteHash: await calcularSha256Hex(share3Bytes),
      geradoEm: dataHora,
    },
  ];

  const preview =
    segredoTexto.length <= 16
      ? segredoTexto
      : `${segredoTexto.substring(0, 8)}...${segredoTexto.substring(segredoTexto.length - 8)}`;

  return {
    chaveOriginalHexPreview: preview,
    quoromMinimo: 2,
    totalCustodiantes: 3,
    fragmentos,
    dataHoraCerimonia: dataHora,
  };
}

/**
 * Reconstrói a chave mestre a partir de pelo menos 2 fragmentos válidos através de interpolação de Lagrange em x=0
 */
export function recomporSegredoDeFragmentos(
  fragmentosEntrada: { indice: number; shareHex: string }[]
): ResultadoRecomposicaoChave {
  try {
    // 1. Validações preliminares
    if (!fragmentosEntrada || fragmentosEntrada.length < 2) {
      return {
        sucesso: false,
        mensagemErro: 'Quórum insuficiente: são necessários pelo menos 2 fragmentos para recomposição.',
        custodiantesPresentes: [],
      };
    }

    const f1 = fragmentosEntrada[0];
    const f2 = fragmentosEntrada[1];

    if (f1.indice === f2.indice) {
      return {
        sucesso: false,
        mensagemErro: 'Os fragmentos fornecidos são duplicados (mesmo custodiante). É necessário quórum distinto.',
        custodiantesPresentes: [],
      };
    }

    const x1 = f1.indice;
    const x2 = f2.indice;

    if (x1 < 1 || x1 > 3 || x2 < 1 || x2 > 3) {
      return {
        sucesso: false,
        mensagemErro: 'Índice de custodiante inválido (esperado 1, 2 ou 3).',
        custodiantesPresentes: [],
      };
    }

    const b1 = hexParaBytes(f1.shareHex);
    const b2 = hexParaBytes(f2.shareHex);

    if (b1.length !== b2.length) {
      return {
        sucesso: false,
        mensagemErro: 'Tamanhos de fragmento divergentes. Os fragmentos pertencem a cerimônias distintas.',
        custodiantesPresentes: [],
      };
    }

    const tamanho = b1.length;
    const segredoReconstruidoBytes = new Uint8Array(tamanho);

    // 2. Interpolação de Lagrange para k=2 em x=0:
    // L1(0) = (0 - x2) / (x1 - x2) = x2 / (x1 ^ x2)
    // L2(0) = (0 - x1) / (x2 - x1) = x1 / (x1 ^ x2)
    const denominador = gfSoma(x1, x2);
    const l1 = gfDivide(x2, denominador);
    const l2 = gfDivide(x1, denominador);

    for (let i = 0; i < tamanho; i++) {
      const y1 = b1[i];
      const y2 = b2[i];
      const parte1 = gfMultiplica(y1, l1);
      const parte2 = gfMultiplica(y2, l2);
      segredoReconstruidoBytes[i] = gfSoma(parte1, parte2);
    }

    const decoder = new TextDecoder('utf-8', { fatal: true });
    const textoReconstruido = decoder.decode(segredoReconstruidoBytes);

    const papeisMap: Record<number, CustodiantePapel> = {
      1: 'diretor_geral',
      2: 'secretaria_geral',
      3: 'presidencia_congregacao',
    };

    return {
      sucesso: true,
      chaveReconstruida: textoReconstruido,
      custodiantesPresentes: [papeisMap[x1], papeisMap[x2]],
    };
  } catch (err: any) {
    return {
      sucesso: false,
      mensagemErro: err?.message || 'Falha matemática ao decodificar fragmentos (integridade corrompida).',
      custodiantesPresentes: [],
    };
  }
}
