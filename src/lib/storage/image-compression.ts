/**
 * Pipeline de Compressão de Imagens Client-Side (Zero-Storage / Custo Zero)
 * Conformidade com AI_EXECUTION_GUIDE.md e PROJECT_DNA.md:
 * - Redimensionamento proporcional para máx. 1200px
 * - Conversão estrita para WebP com 80% de qualidade
 * - Processamento isolado em HTML5 Canvas no navegador (strip de metadados EXIF maliciosos)
 * - Retorno de métricas para transparência ao autor
 */

export interface ResultadoCompressao {
  dataUrlWebp: string;
  blobWebp: Blob;
  tamanhoOriginalBytes: number;
  tamanhoComprimidoBytes: number;
  larguraFinal: number;
  alturaFinal: number;
  percentualEconomia: number;
}

export async function comprimirImagemParaWebp(
  arquivo: File,
  dimensaoMaxima = 1200,
  qualidade = 0.8
): Promise<ResultadoCompressao> {
  return new Promise((resolve, reject) => {
    // Validação inicial do arquivo
    if (!arquivo.type.startsWith('image/')) {
      return reject(new Error('O arquivo selecionado não é uma imagem válida.'));
    }

    const leitor = new FileReader();
    leitor.onerror = () => reject(new Error('Falha ao ler arquivo de imagem local.'));

    leitor.onload = (evento) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Falha ao decodificar imagem no navegador.'));

      img.onload = () => {
        let { width, height } = img;

        // Cálculo de redimensionamento proporcional
        if (width > dimensaoMaxima || height > dimensaoMaxima) {
          if (width > height) {
            height = Math.round((height * dimensaoMaxima) / width);
            width = dimensaoMaxima;
          } else {
            width = Math.round((width * dimensaoMaxima) / height);
            height = dimensaoMaxima;
          }
        }

        // Criação de canvas para rasterização limpa (neutraliza SVG/scripts embutidos)
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return reject(new Error('Canvas 2D não suportado pelo navegador.'));
        }

        // Renderização com suavização de imagem
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Conversão para WebP
        const formatoSaida = 'image/webp';
        const dataUrlWebp = canvas.toDataURL(formatoSaida, qualidade);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              return reject(new Error('Falha ao gerar Blob WebP a partir do canvas.'));
            }

            const tamanhoOriginal = arquivo.size;
            const tamanhoComprimido = blob.size;
            const economia = Math.max(
              0,
              Math.round(((tamanhoOriginal - tamanhoComprimido) / tamanhoOriginal) * 100)
            );

            resolve({
              dataUrlWebp,
              blobWebp: blob,
              tamanhoOriginalBytes: tamanhoOriginal,
              tamanhoComprimidoBytes: tamanhoComprimido,
              larguraFinal: width,
              alturaFinal: height,
              percentualEconomia: economia,
            });
          },
          formatoSaida,
          qualidade
        );
      };

      img.src = evento.target?.result as string;
    };

    leitor.readAsDataURL(arquivo);
  });
}

export function formatarBytes(bytes: number, decimais = 1): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimais < 0 ? 0 : decimais;
  const tamanhos = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${tamanhos[i]}`;
}
