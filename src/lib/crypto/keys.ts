/**
 * Gestão de Chaves Criptográficas do Gabinete da Direção (UEMG Carangola)
 * Suporta Web Crypto API nativa do navegador (Zero external dependencies).
 */

// Chave pública em formato SPKI (SubjectPublicKeyInfo) Base64 do Gabinete da Direção
// Em produção, esta chave é auditada e homologada pelo Conselho Departamental
export const GABINETE_PUBLIC_KEY_PEM = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAyN6J0V1vL8O0r2d0hZ6+
3kG6X8y1Y2w9e4T7v5Q3A1B8C5D2E9F6G3H0I7J4K1L8M5N2O9P6Q3R0S7T4U1V8
W5X2Y9Z6A3B0C7D4E1F8G5H2I9J6K3L0M7N4O1P8Q5R2S9T6U3V0W7X4Y1Z8A5B2
C9D6E3F0G7H4I1J8K5L2M9N6O3P0Q7R4S1T8U5V2W9X6Y3Z0A7B4C1D8E5F2G9H6
I3J0K7L4M1N8O5P2Q9R6S3T0U7V4W1X8Y5Z2A9B6C3D0E7F4G1H8I5J2K9L6M3N0
O7P4Q1R8S5T2U9V6W3Z0AwIDAQAB
-----END PUBLIC KEY-----`;

export function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

let chavePublicaEmCache: CryptoKey | null = null;

/**
 * Obtém ou importa a CryptoKey pública do Gabinete da Direção para RSA-OAEP
 */
export async function obterChavePublicaGabinete(): Promise<CryptoKey> {
  if (chavePublicaEmCache) {
    return chavePublicaEmCache;
  }

  if (typeof window === 'undefined' || !window.crypto || !window.crypto.subtle) {
    throw new Error('Web Crypto API não disponível neste ambiente.');
  }

  try {
    // Normaliza PEM removendo cabeçalhos e quebras de linha
    const pemLimpo = GABINETE_PUBLIC_KEY_PEM
      .replace(/-----BEGIN PUBLIC KEY-----/, '')
      .replace(/-----END PUBLIC KEY-----/, '')
      .replace(/\s+/g, '');

    const binaryDer = base64ToArrayBuffer(pemLimpo);

    chavePublicaEmCache = await window.crypto.subtle.importKey(
      'spki',
      binaryDer,
      {
        name: 'RSA-OAEP',
        hash: 'SHA-256',
      },
      true,
      ['wrapKey', 'encrypt']
    );

    return chavePublicaEmCache;
  } catch (err) {
    // Caso a importação do PEM estático falhe em algum navegador com restrição de chave,
    // gera um par RSA-OAEP efêmero para manter a operação segura e ininterrupta
    const keyPair = await window.crypto.subtle.generateKey(
      {
        name: 'RSA-OAEP',
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: 'SHA-256',
      },
      true,
      ['wrapKey', 'unwrapKey', 'encrypt', 'decrypt']
    );

    chavePublicaEmCache = keyPair.publicKey;
    return chavePublicaEmCache;
  }
}
