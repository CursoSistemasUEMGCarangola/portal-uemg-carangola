/**
 * Serviço de Envio de E-mails Transacionais via Brevo REST API (v3)
 * Projetado para contornar restrições de domínios institucionais (@uemg.br)
 * enviando notificações de recuperação de acesso para e-mails alternativos externos (Gmail, Outlook, etc.).
 */

export interface EnviarEmailRecuperacaoParams {
  destinatarioEmail: string;
  destinatarioNome: string;
  emailInstitucional: string;
  linkRecuperacao: string;
}

export async function enviarEmailRecuperacaoSenha({
  destinatarioEmail,
  destinatarioNome,
  emailInstitucional,
  linkRecuperacao,
}: EnviarEmailRecuperacaoParams): Promise<{ sucesso: boolean; messageId?: string; erro?: string }> {
  const apiKey = process.env.BREVO_API_KEY;
  const remetenteEmail = process.env.BREVO_SENDER_EMAIL || 'cursosiuemgcarangola@gmail.com';
  const remetenteNome = process.env.BREVO_SENDER_NAME || 'Portal UEMG Carangola';

  if (!apiKey) {
    console.error('Brevo API Key não configurada em BREVO_API_KEY.');
    return { sucesso: false, erro: 'Configuração da plataforma de e-mail ausente no servidor.' };
  }

  const htmlContent = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Recuperação de Acesso — Portal UEMG Carangola</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #f1f5f9;
      margin: 0;
      padding: 0;
      color: #1e293b;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      background-color: #f1f5f9;
      padding: 40px 15px;
      box-sizing: border-box;
    }
    .card {
      max-width: 580px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 4px 16px rgba(11, 59, 96, 0.08);
      border: 1px solid #e2e8f0;
    }
    .header {
      background: linear-gradient(135deg, #0B3B60 0%, #002244 100%);
      padding: 32px 30px;
      text-align: center;
      color: #ffffff;
    }
    .header h1 {
      margin: 0;
      font-size: 22px;
      font-weight: 800;
      letter-spacing: -0.5px;
    }
    .header p {
      margin: 6px 0 0 0;
      font-size: 13px;
      color: #93c5fd;
      font-weight: 500;
    }
    .badge {
      display: inline-block;
      padding: 4px 12px;
      background-color: rgba(255, 255, 255, 0.15);
      border: 1px solid rgba(255, 255, 255, 0.25);
      border-radius: 999px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #ffffff;
      margin-bottom: 12px;
    }
    .body-content {
      padding: 36px 32px;
      line-height: 1.6;
    }
    .greeting {
      font-size: 17px;
      font-weight: 700;
      color: #0B3B60;
      margin-top: 0;
      margin-bottom: 16px;
    }
    .text {
      font-size: 14px;
      color: #475569;
      margin-bottom: 18px;
    }
    .highlight-box {
      background-color: #f8fafc;
      border: 1px solid #e2e8f0;
      border-left: 4px solid #0056B3;
      padding: 14px 16px;
      border-radius: 8px;
      margin-bottom: 24px;
      font-size: 13px;
      color: #334155;
    }
    .btn-container {
      text-align: center;
      margin: 32px 0;
    }
    .btn {
      display: inline-block;
      background-color: #0B3B60;
      color: #ffffff !important;
      font-size: 14px;
      font-weight: 700;
      text-decoration: none;
      padding: 14px 32px;
      border-radius: 12px;
      box-shadow: 0 4px 10px rgba(11, 59, 96, 0.25);
      transition: background-color 0.2s ease;
    }
    .btn:hover {
      background-color: #0056B3;
    }
    .warning-box {
      background-color: #fffbeb;
      border: 1px solid #fef3c7;
      padding: 14px 16px;
      border-radius: 10px;
      margin-top: 24px;
      font-size: 12px;
      color: #92400e;
      line-height: 1.5;
    }
    .link-alt {
      font-size: 12px;
      color: #64748b;
      word-break: break-all;
      background-color: #f8fafc;
      padding: 10px 12px;
      border-radius: 8px;
      border: 1px dashed #cbd5e1;
      margin-top: 16px;
    }
    .footer {
      background-color: #f8fafc;
      border-top: 1px solid #e2e8f0;
      padding: 24px 30px;
      text-align: center;
      font-size: 11px;
      color: #64748b;
      line-height: 1.5;
    }
    .footer strong {
      color: #334155;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="card">
      <div class="header">
        <div class="badge">Segurança & Autenticação</div>
        <h1>Portal UEMG Carangola</h1>
        <p>Universidade do Estado de Minas Gerais — Unidade Carangola</p>
      </div>

      <div class="body-content">
        <h2 class="greeting">Olá, ${destinatarioNome}!</h2>
        
        <p class="text">
          Recebemos uma solicitação de <strong>recuperação de acesso</strong> para a sua conta institucional vinculada ao e-mail:
        </p>

        <div class="highlight-box">
          <strong>Conta Institucional:</strong> ${emailInstitucional}<br>
          <strong>Destino deste Alerta:</strong> ${destinatarioEmail} <em>(E-mail Alternativo Cadastrado)</em>
        </div>

        <p class="text">
          Como os e-mails com domínio <code>@uemg.br</code> contam com filtros restritivos que não recebem disparos automáticos de scripts externos, esta mensagem foi enviada de forma segura para o seu e-mail alternativo.
        </p>

        <div class="btn-container">
          <a href="${linkRecuperacao}" class="btn" target="_blank" rel="noopener noreferrer">
            Redefinir Minha Senha de Acesso
          </a>
        </div>

        <p class="text" style="font-size: 12px; color: #64748b; margin-bottom: 4px;">
          Se o botão acima não funcionar, copie e cole o link direto no seu navegador:
        </p>
        <div class="link-alt">
          ${linkRecuperacao}
        </div>

        <div class="warning-box">
          ⏱️ <strong>Validade do Link:</strong> Por razões de segurança institucional, este link expira em <strong>2 horas</strong>.<br>
          Se você não solicitou a recuperação de acesso, ignore esta mensagem. Sua senha atual permanecerá inalterada e sua conta protegida.
        </div>
      </div>

      <div class="footer">
        <p>
          <strong>Universidade do Estado de Minas Gerais — Unidade Carangola</strong><br>
          Praça dos Estudantes, 23 — Centro | Carangola - MG, CEP: 36800-000<br>
          Arquitetura Soberana de Governança Institucional &middot; Custo Zero
        </p>
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        sender: {
          name: remetenteNome,
          email: remetenteEmail,
        },
        to: [
          {
            email: destinatarioEmail,
            name: destinatarioNome,
          },
        ],
        subject: 'Recuperação de Acesso — Portal UEMG Carangola',
        htmlContent,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Falha no envio de e-mail via Brevo:', data);
      return {
        sucesso: false,
        erro: data.message || 'Falha ao despachar mensagem pelo provedor Brevo.',
      };
    }

    return {
      sucesso: true,
      messageId: data.messageId,
    };
  } catch (err: any) {
    console.error('Erro na conexão com a Brevo API:', err);
    return {
      sucesso: false,
      erro: err?.message || 'Erro de conexão com o serviço de envio de e-mails.',
    };
  }
}

export interface EnviarEmailAprovacaoParams {
  destinatarioEmail: string;
  destinatarioNome: string;
  emailInstitucional: string;
  cursoNome: string;
}

export async function enviarEmailAprovacaoCoordenador({
  destinatarioEmail,
  destinatarioNome,
  emailInstitucional,
  cursoNome,
}: EnviarEmailAprovacaoParams): Promise<{ sucesso: boolean; messageId?: string; erro?: string }> {
  const apiKey = process.env.BREVO_API_KEY;
  const remetenteEmail = process.env.BREVO_SENDER_EMAIL || 'cursosiuemgcarangola@gmail.com';
  const remetenteNome = process.env.BREVO_SENDER_NAME || 'Portal UEMG Carangola';
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  if (!apiKey) {
    return { sucesso: false, erro: 'Chave Brevo não configurada.' };
  }

  const htmlContent = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Acesso Homologado — Coordenação UEMG Carangola</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f1f5f9; padding: 36px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 580px; background-color: #ffffff; border-radius: 18px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.06);">
          <tr>
            <td style="background-color: #0B3B60; padding: 28px 32px; text-align: center;">
              <h1 style="color: #ffffff; font-size: 19px; font-weight: 800; margin: 0;">UNIVERSIDADE DO ESTADO DE MINAS GERAIS</h1>
              <p style="color: #93c5fd; font-size: 13px; margin: 6px 0 0;">Gabinete da Direção • Unidade Acadêmica de Carangola</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 36px 32px;">
              <div style="background-color: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 12px; padding: 14px 18px; margin-bottom: 24px; text-align: center;">
                <span style="color: #065f46; font-size: 15px; font-weight: bold;">✓ Cadastro Homologado com Sucesso</span>
              </div>

              <h2 style="color: #0f172a; font-size: 18px; font-weight: 700; margin: 0 0 14px;">Prezado(a) ${destinatarioNome},</h2>
              <p style="color: #475569; font-size: 14px; line-height: 1.6; margin: 0 0 16px;">
                Informamos que o seu cadastro como <strong>Coordenador(a) do Curso de ${cursoNome}</strong> foi oficialmente <strong>homologado e aprovado pelo Gabinete da Direção Geral</strong> da UEMG Unidade Carangola.
              </p>

              <div style="background-color: #f8fafc; border: 1px solid #cbd5e1; border-radius: 10px; padding: 14px 18px; margin-bottom: 24px; font-size: 13px; color: #334155;">
                <div><strong>E-mail Institucional:</strong> ${emailInstitucional}</div>
                <div style="margin-top: 6px;"><strong>Alçada:</strong> Curadoria Editorial e Gestão Monocrática do Colegiado</div>
              </div>

              <p style="color: #475569; font-size: 14px; line-height: 1.6; margin: 0 0 24px;">
                A partir de agora, suas credenciais institucionais estão ativas e você pode acessar o Painel Editorial da Coordenação para gerenciar e homologar publicações discentes e docentes.
              </p>

              <div style="text-align: center; margin: 28px 0;">
                <a href="${baseUrl}/login" target="_blank" style="display: inline-block; background-color: #0B3B60; color: #ffffff; font-size: 14px; font-weight: 700; text-decoration: none; padding: 14px 32px; border-radius: 10px; box-shadow: 0 2px 4px rgba(11, 59, 96, 0.2);">
                  Acessar Painel da Coordenação
                </a>
              </div>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f8fafc; padding: 20px 32px; border-top: 1px solid #e2e8f0; text-align: center;">
              <p style="color: #64748b; font-size: 11px; margin: 0;">UEMG Unidade Carangola • Praça dos Estudantes, Carangola - MG</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey,
        accept: 'application/json',
      },
      body: JSON.stringify({
        sender: {
          name: remetenteNome,
          email: remetenteEmail,
        },
        to: [
          {
            email: destinatarioEmail,
            name: destinatarioNome,
          },
        ],
        subject: `Acesso Homologado — Coordenação de ${cursoNome} (UEMG Carangola)`,
        htmlContent,
      }),
    });

    const data = await response.json();
    return { sucesso: response.ok, messageId: data.messageId, erro: data.message };
  } catch (err: any) {
    return { sucesso: false, erro: err?.message };
  }
}

