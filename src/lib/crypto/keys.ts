/**
 * Gestão de Chaves Criptográficas do Gabinete da Direção (UEMG Carangola)
 * Suporta Web Crypto API nativa do navegador (Zero external dependencies).
 */

// Chave pública institucional (SPKI PEM) do Gabinete da Direção
export const GABINETE_PUBLIC_KEY_PEM = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAluorYPOiezwqY3rL8bMW
4VuaGJ9qP+u7ALx2UymrHnnmuh22wALrvgU/o/uTZYN0PjD9VoIZA+1auQp7xK96
zxtryU9JTPLO3Ib0ClAedrV7zXa1HeNE/qJOdD+lRVi1hwsiegW7Rr2cuMruooh0
MyaO0FlvJ8nniqLmc9NgpyHKAzXJQABmXHFq+h6gBFLP8wejHj2bXA11vCgSGIui
K1sIo2DDbcYYWs7Q1AU2gjg5MEskCWnyqoFQjSpSh3qOn5iYNZmzQ94zrZEt2B7R
jNdA3hi2giRPHTivAWiPTpP+bq+NJU4d42JUbA5+mUxG5seoMnNM7pf6NTHkLCP7
RwIDAQAB
-----END PUBLIC KEY-----`;

// Chave privada institucional (PKCS#8 PEM) do Gabinete da Direção (para decodificação estrita na RAM do Diretor)
export const GABINETE_PRIVATE_KEY_PEM = `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCW6itg86J7PCpj
esvxsxbhW5oYn2o/67sAvHZTKaseeea6HbbAAuu+BT+j+5Nlg3Q+MP1WghkD7Vq5
CnvEr3rPG2vJT0lM8s7chvQKUB52tXvNdrUd40T+ok50P6VFWLWHCyJ6BbtGvZy4
yu6iiHQzJo7QWW8nyeeKouZz02CnIcoDNclAAGZccWr6HqAEUs/zB6MePZtcDXW8
KBIYi6IrWwijYMNtxhhaztDUBTaCODkwSyQJafKqgVCNKlKHeo6fmJg1mbND3jOt
kS3YHtGM10DeGLaCJE8dOK8BaI9Ok/5ur40lTh3jYlRsDn6ZTEbmx6gyc0zul/o1
MeQsI/tHAgMBAAECggEALEOyBoVffoL2segGIrYTO3VpPNihSu9jEcO1dw4NPWqm
5Kcrf6U7rSgP8xKquIc2lLk8zV9qY+7+AbFT/Sw1OsMBufGx/8pmJ2PD97RpQwtX
LTwowoPzLDbCCTHT0YPD9sCq05yTwhuCeOc42F5qqsgf8neQ9VwwuEawjn+M5Wg9
8HKpsEvhctbFYXkfmTXExDYJIz7zWIFlnoctRmUoKPuALQ0xa7A7/9KGDEvTU5He
xAc0RUf8poDJ1c0ohu0zv4yNcQ4ol8zNX0Dl97/rJR5c4ouRaQ3e1DZpo0U496bD
nn5figHu6VugTt74jgt6KAQzf4Ee6iJUhOi7dZclrQKBgQDFzV5wKTPiKYJm6CMX
bNTaMZf6SMOPnNHxLhezrDpXIgmd6prpUDwrpAuh7GTYkZhFa+a+kOPB29p8Rru0
qMJ32+WrR3N2JfwdS9vGLDsDqKBN5ZnEETdj4CA5cd3EjM+MT++S5YtWlCLlOvj0
3yoTRxOW+M/c8OS0/P8PW9fCkwKBgQDDUTHHu7fRQJ1cq3nYNsmBTkD4NeA8/Wjj
vpArGjAjTRVJBUPU19hUjS1ydGc0pJ/k/F+mulSOcAllVlcX2/dHejN35ITyHlZc
uaRXjhYX6TBPZ1Hp6ohU6DSD127f+UXG++Cm8sIUmFkpd4Eqi4qF/Ma2P7/rIvrg
tRvcJ3KQ/QKBgCtmwI4DvGqniQFjdi+xpZKqxxoX1TExy68L2g+GftaXlVydGZiQ
DmPU/uhsokQSzkKNRngR+qeSwgH60zz0upbqHR7T8rW95+/VsUdudRR8b5AoDPFE
hc7YYrm4Dl0OOIwlDgBBda1tm6qIog+419abBeVeet2TzdsYmC6ajGEZAoGAN/13
mr0qRZcTRTR22k9iVmn7X+v52yH9xoOjSmfYctYvCt6ygjpZ7msGIzBRQZsLpxXd
yarSgH6HgwBMOS+6ZEgYpv7gSZP+x9gDz4GQvcwAKFMC/V5ZNJXYMA863oPTx+X+
kX03u7WsoaF7apnT3PMId8gwmRRO/MmOMf8w7XUCgYEAvbtH8nl/qX6DOBLw0r1M
V8TrSr+Cg/wgoaA8yv8IXpR8pocZwhi3IXpsvA1chl1q+aBYf6Jyigke6rsg17h+
NbjLmS3Vkecc6OdyHJMUhJLyp45Su1CzeFAghA6Nz7bmFNzJEXNokioTE17q586F
b7nhEwcIOhDn4GJmvBUg46U=
-----END PRIVATE KEY-----`;

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
let chavePrivadaEmCache: CryptoKey | null = null;

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
}

/**
 * Obtém ou importa a CryptoKey privada do Gabinete da Direção para decodificação na RAM
 */
export async function obterChavePrivadaGabinete(): Promise<CryptoKey> {
  if (chavePrivadaEmCache) {
    return chavePrivadaEmCache;
  }

  if (typeof window === 'undefined' || !window.crypto || !window.crypto.subtle) {
    throw new Error('Web Crypto API não disponível neste ambiente.');
  }

  const pemLimpo = GABINETE_PRIVATE_KEY_PEM
    .replace(/-----BEGIN PRIVATE KEY-----/, '')
    .replace(/-----END PRIVATE KEY-----/, '')
    .replace(/\s+/g, '');

  const binaryDer = base64ToArrayBuffer(pemLimpo);

  chavePrivadaEmCache = await window.crypto.subtle.importKey(
    'pkcs8',
    binaryDer,
    {
      name: 'RSA-OAEP',
      hash: 'SHA-256',
    },
    true,
    ['unwrapKey', 'decrypt']
  );

  return chavePrivadaEmCache;
}
