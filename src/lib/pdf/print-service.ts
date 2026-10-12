import { Artigo } from '@/types/editorial';
import { ComprovanteProtocolo } from '@/types/ouvidoria';

/**
 * Sanitiza strings para prevenir injeção de HTML/XSS (Princípio Zero-Trust)
 */
export function escapeHtml(str: string | undefined | null): string {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Converte Markdown acadêmico para HTML limpo calibrado para folhas A4
 */
export function converterMarkdownParaHtmlImpressao(markdown: string): string {
  if (!markdown) return '';

  return markdown
    // Remove códigos e fórmulas LaTeX não suportadas na impressão simples
    .replace(/\$\$([\s\S]*?)\$\$/g, '')
    .replace(/\$(.*?)\$/g, '$1')
    // Escapa tags HTML originais para evitar injeções
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    // Títulos
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    // Negrito e Itálico
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Listas com marcadores
    .replace(/^\* (.*$)/gim, '<li>$1</li>')
    .replace(/(<li>[\s\S]*?<\/li>)/gi, '<ul>$1</ul>')
    // Parágrafos
    .replace(/\n\n/g, '<p></p>')
    .replace(/\n/g, '<br>');
}

/**
 * Executa a impressão no navegador de forma moderna via iframe invisível (evita bloqueadores de pop-up),
 * com fallback transparente para window.open caso necessário.
 */
export function executarImpressaoHtml(htmlCompleto: string): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(false);
      return;
    }

    try {
      // 1. Tenta método moderno via iframe isolado (sem disparo de bloqueador de pop-ups)
      const iframe = document.createElement('iframe');
      iframe.style.position = 'fixed';
      iframe.style.right = '0';
      iframe.style.bottom = '0';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = '0';
      iframe.setAttribute('aria-hidden', 'true');
      iframe.setAttribute('tabindex', '-1');

      document.body.appendChild(iframe);

      const doc = iframe.contentWindow?.document;
      if (!doc) {
        throw new Error('Falha ao instanciar contexto de impressão no iframe');
      }

      doc.open();
      doc.write(htmlCompleto);
      doc.close();

      iframe.contentWindow?.focus();
      setTimeout(() => {
        try {
          iframe.contentWindow?.print();
          // Remove o iframe após a conclusão para higiene de memória
          setTimeout(() => {
            if (document.body.contains(iframe)) {
              document.body.removeChild(iframe);
            }
          }, 1000);
          resolve(true);
        } catch {
          fallbackJanela(htmlCompleto, resolve);
        }
      }, 350);
    } catch {
      fallbackJanela(htmlCompleto, resolve);
    }
  });
}

function fallbackJanela(htmlCompleto: string, resolve: (ok: boolean) => void) {
  try {
    const janela = window.open('', '_blank');
    if (!janela) {
      alert('Por favor, permita pop-ups para gerar a versão para impressão ou salvamento em PDF.');
      resolve(false);
      return;
    }

    janela.document.open();
    janela.document.write(htmlCompleto);
    janela.document.close();
    janela.focus();
    setTimeout(() => {
      janela.print();
      resolve(true);
    }, 400);
  } catch {
    alert('Erro ao processar impressão no navegador.');
    resolve(false);
  }
}

/**
 * Monta o template oficial A4 para publicação acadêmica de artigo
 */
export function gerarHtmlArtigo(artigo: Artigo): string {
  const tituloEscapado = escapeHtml(artigo.titulo);
  const autorEscapado = escapeHtml(artigo.autorNome);
  const coautoresEscapado = escapeHtml(artigo.coautores);
  const cursoNomeEscapado = escapeHtml(artigo.curso.nome);
  const cursoSiglaEscapado = escapeHtml(artigo.curso.sigla);
  const citacaoEscapada = escapeHtml(artigo.citacaoAbnt);
  const resumoEscapado = escapeHtml(artigo.resumo);
  const corpoHtml = converterMarkdownParaHtmlImpressao(artigo.corpoMarkdown);

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <title>${tituloEscapado} — UEMG Carangola</title>
  <style>
    @page { size: A4 portrait; margin: 20mm 15mm 20mm 15mm; }
    body {
      font-family: 'Segoe UI', Arial, sans-serif;
      color: #1a202c;
      line-height: 1.6;
      padding: 0;
      margin: 0;
    }
    .header {
      border-bottom: 2px solid #0B3B60;
      padding-bottom: 12px;
      margin-bottom: 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .header-title {
      font-size: 14px;
      font-weight: bold;
      color: #0B3B60;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .header-sub {
      font-size: 11px;
      color: #4a5568;
    }
    .badge {
      display: inline-block;
      background-color: #E6EFF7;
      color: #0B3B60;
      font-weight: bold;
      font-size: 11px;
      padding: 4px 8px;
      border-radius: 4px;
      margin-bottom: 12px;
      text-transform: uppercase;
    }
    h1 {
      font-size: 20px;
      color: #0B3B60;
      line-height: 1.3;
      margin: 0 0 16px 0;
    }
    .meta {
      font-size: 12px;
      color: #4a5568;
      margin-bottom: 20px;
      border-left: 3px solid #0056B3;
      padding-left: 10px;
    }
    .resumo-box {
      background-color: #f7fafc;
      border: 1px solid #e2e8f0;
      padding: 12px 16px;
      border-radius: 6px;
      margin-bottom: 24px;
      font-size: 13px;
      font-style: italic;
    }
    .content {
      font-size: 13px;
      text-align: justify;
      line-height: 1.6;
    }
    .content h2 {
      font-size: 15px;
      color: #0B3B60;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 4px;
      margin-top: 20px;
      margin-bottom: 8px;
    }
    .content h3 {
      font-size: 14px;
      color: #1a202c;
      margin-top: 16px;
      margin-bottom: 6px;
    }
    .content ul {
      margin: 8px 0;
      padding-left: 20px;
    }
    .content li {
      margin-bottom: 4px;
    }
    .footer {
      margin-top: 30px;
      border-top: 1px solid #cbd5e0;
      padding-top: 12px;
      font-size: 10px;
      color: #718096;
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="header-title">Universidade do Estado de Minas Gerais</div>
      <div class="header-sub">Unidade Acadêmica de Carangola — Portal de Publicações</div>
    </div>
    <div style="text-align: right; font-size: 10px; color: #718096;">
      Publicado em: ${artigo.dataPublicacao}
    </div>
  </div>

  <div class="badge">${cursoNomeEscapado} (${cursoSiglaEscapado})</div>
  <h1>${tituloEscapado}</h1>

  <div class="meta">
    <strong>Autor Principal:</strong> ${autorEscapado}<br>
    ${coautoresEscapado ? `<strong>Coautores:</strong> ${coautoresEscapado}<br>` : ''}
    <strong>Citação ABNT:</strong> ${citacaoEscapada}
  </div>

  <div class="resumo-box">
    <strong>Resumo:</strong> ${resumoEscapado}
  </div>

  <div class="content">
    ${corpoHtml}
  </div>

  <div class="footer">
    Documento emitido eletronicamente pelo Portal de Publicações da UEMG Carangola. Registro científico perene e de livre acesso.
  </div>
</body>
</html>`;
}

/**
 * Monta o template oficial A4 para comprovante de ouvidoria
 */
export function gerarHtmlComprovante(comprovante: ComprovanteProtocolo): string {
  const codigoEscapado = escapeHtml(comprovante.codigoProtocolo);
  const dataHoraEscapada = escapeHtml(comprovante.dataHoraEnvio);
  const tokenEscapado = escapeHtml(comprovante.tokenSecreto);
  const tipoEscapado = escapeHtml(comprovante.tipo.toUpperCase());
  const solicitanteEscapado = escapeHtml(comprovante.autorNome || 'Manifestação Anônima');
  const cursoSiglaEscapado = escapeHtml(comprovante.cursoSigla);
  const hashEscapado = escapeHtml(comprovante.hashIntegridade);

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <title>Comprovante Oficial de Ouvidoria — UEMG Carangola</title>
  <style>
    @page { size: A4 portrait; margin: 15mm; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #1e293b;
      line-height: 1.5;
      margin: 0;
      padding: 20px;
    }
    .topo-gov {
      border-bottom: 2px solid #002244;
      padding-bottom: 12px;
      margin-bottom: 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .topo-titulos h1 {
      color: #0B3B60;
      font-size: 18px;
      margin: 0;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .topo-titulos p {
      color: #64748b;
      font-size: 11px;
      margin: 2px 0 0 0;
      font-weight: 600;
    }
    .caixa-protocolo {
      background-color: #f8fafc;
      border: 2px solid #0B3B60;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
      text-align: center;
    }
    .rotulo-protocolo {
      font-size: 11px;
      text-transform: uppercase;
      color: #64748b;
      font-weight: 700;
      letter-spacing: 1px;
    }
    .numero-protocolo {
      font-size: 26px;
      font-weight: 900;
      color: #0B3B60;
      margin: 6px 0;
      font-family: monospace;
    }
    .caixa-token {
      background-color: #f0fdf4;
      border: 1px dashed #16a34a;
      border-radius: 6px;
      padding: 12px;
      margin: 15px 0;
      text-align: center;
    }
    .token-valor {
      font-family: monospace;
      font-size: 16px;
      font-weight: 700;
      color: #15803d;
      letter-spacing: 1px;
    }
    .tabela-dados {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
      font-size: 12px;
    }
    .tabela-dados th, .tabela-dados td {
      padding: 10px 12px;
      text-align: left;
      border-bottom: 1px solid #e2e8f0;
    }
    .tabela-dados th {
      background-color: #f1f5f9;
      color: #334155;
      width: 35%;
      font-weight: 700;
    }
    .alerta-seguranca {
      background-color: #fffbeb;
      border-left: 4px solid #f59e0b;
      padding: 12px;
      font-size: 11px;
      color: #92400e;
      margin-top: 24px;
      border-radius: 0 6px 6px 0;
    }
    .rodape {
      margin-top: 40px;
      border-top: 1px solid #cbd5e1;
      padding-top: 12px;
      font-size: 10px;
      color: #94a3b8;
      text-align: center;
    }
    @media print {
      body { padding: 0; }
    }
  </style>
</head>
<body>
  <div class="topo-gov">
    <div class="topo-titulos">
      <h1>Universidade do Estado de Minas Gerais</h1>
      <p>Unidade Acadêmica de Carangola • Gabinete da Direção Geral</p>
      <p>Canal de Ouvidoria & Governança Participativa (Fale com a Direção)</p>
    </div>
    <div style="font-size: 11px; font-weight: bold; color: #002244;">
      GOVERNO DE MINAS GERAIS
    </div>
  </div>

  <div class="caixa-protocolo">
    <div class="rotulo-protocolo">Código Oficial de Registro</div>
    <div class="numero-protocolo">${codigoEscapado}</div>
    <div style="font-size: 11px; color: #64748b;">
      Protocolado em: <strong>${dataHoraEscapada}</strong>
    </div>
  </div>

  <div class="caixa-token">
    <div style="font-size: 11px; font-weight: bold; color: #166534; text-transform: uppercase;">
      Chave Secreta de Consulta (Guarda Obrigatória)
    </div>
    <div class="token-valor">${tokenEscapado}</div>
    <div style="font-size: 10px; color: #15803d; margin-top: 4px;">
      Necessária junto ao protocolo para consultar a resposta privada da Direção Geral
    </div>
  </div>

  <table class="tabela-dados">
    <tr>
      <th>Tipo de Manifestação:</th>
      <td>${tipoEscapado}</td>
    </tr>
    <tr>
      <th>Identificação do Solicitante:</th>
      <td>${solicitanteEscapado}</td>
    </tr>
    <tr>
      <th>Curso / Setor de Encaminhamento:</th>
      <td>${cursoSiglaEscapado}</td>
    </tr>
    <tr>
      <th>Criptografia Utilizada:</th>
      <td>Criptografia de Envelope (AES-GCM-256 + RSA-OAEP-4096)</td>
    </tr>
    <tr>
      <th>Hash de Integridade:</th>
      <td><code style="font-family: monospace;">${hashEscapado}</code></td>
    </tr>
  </table>

  <div class="alerta-seguranca">
    <strong>IMPORTANTE — POLÍTICA ZERO-TRUST:</strong>
    Sua manifestação foi criptografada no seu navegador antes do envio. O Gabinete da Direção é o único detentor da chave privada para leitura. Guarde este comprovante em local seguro. Caso acesse de um computador público, encerre a sessão imediatamente.
  </div>

  <div class="rodape">
    Documento gerado eletronicamente no cliente conforme Lei 12.527/2011 (LAI) e Lei 13.709/2018 (LGPD).<br/>
    Portal UEMG Carangola — Praça dos Estudantes, Carangola - MG.
  </div>
</body>
</html>`;
}
