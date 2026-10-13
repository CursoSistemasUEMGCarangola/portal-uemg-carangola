/**
 * Cliente Autônomo de Notificações Web Push (VAPID)
 * Em conformidade com o Hard Box DNA #6 (Zero-Email) e #7 (Modo Computador Hostil/Compartilhado).
 */

const CHAVE_STORAGE_COMPUTADOR_PUBLICO = 'uemg_modo_computador_publico';
const CHAVE_STORAGE_PUSH_ATIVO = 'uemg_push_notification_ativa';

export type StatusWebPush =
  | 'nao_suportado'
  | 'bloqueado_terminal_publico'
  | 'concedido'
  | 'negado'
  | 'padrao';

export function isComputadorPublico(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem(CHAVE_STORAGE_COMPUTADOR_PUBLICO) === 'true';
  } catch {
    return false;
  }
}

export function setModoComputadorPublico(ativo: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    if (ativo) {
      localStorage.setItem(CHAVE_STORAGE_COMPUTADOR_PUBLICO, 'true');
      // Revoga push se ativo
      desativarWebPushLocal();
    } else {
      localStorage.removeItem(CHAVE_STORAGE_COMPUTADOR_PUBLICO);
    }
  } catch (e) {
    console.warn('Erro ao atualizar flag de computador público:', e);
  }
}

export function obterStatusWebPush(): StatusWebPush {
  if (typeof window === 'undefined') return 'nao_suportado';

  // Regra Inviolável #7: Terminal compartilhado nunca recebe push em disco
  if (isComputadorPublico()) {
    return 'bloqueado_terminal_publico';
  }

  if (!('serviceWorker' in navigator) || !('Notification' in window)) {
    return 'nao_suportado';
  }

  if (Notification.permission === 'granted') {
    return 'concedido';
  }
  if (Notification.permission === 'denied') {
    return 'negado';
  }
  return 'padrao';
}

export async function solicitarPermissaoWebPush(): Promise<{
  sucesso: boolean;
  status: StatusWebPush;
  mensagem: string;
}> {
  if (typeof window === 'undefined') {
    return {
      sucesso: false,
      status: 'nao_suportado',
      mensagem: 'Ambiente sem suporte a Web Push.',
    };
  }

  if (isComputadorPublico()) {
    return {
      sucesso: false,
      status: 'bloqueado_terminal_publico',
      mensagem:
        'Notificações bloqueadas: O terminal está marcado como computador público/compartilhado de laboratório para resguardo da privacidade (Hard Box DNA #7).',
    };
  }

  if (!('serviceWorker' in navigator) || !('Notification' in window)) {
    return {
      sucesso: false,
      status: 'nao_suportado',
      mensagem: 'Este navegador não suporta notificações Web Push nativas.',
    };
  }

  try {
    const permissao = await Notification.requestPermission();
    if (permissao === 'granted') {
      localStorage.setItem(CHAVE_STORAGE_PUSH_ATIVO, 'true');

      // Tenta simular disparo de boas-vindas via Service Worker
      if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'TEST_NOTIFICATION',
          title: 'UEMG Carangola',
          body: 'Notificações institucionais ativadas com sucesso neste dispositivo pessoal.',
        });
      }

      return {
        sucesso: true,
        status: 'concedido',
        mensagem: 'Notificações institucionais ativadas com sucesso!',
      };
    } else {
      localStorage.removeItem(CHAVE_STORAGE_PUSH_ATIVO);
      return {
        sucesso: false,
        status: 'negado',
        mensagem: 'Permissão para notificações não foi concedida pelo usuário.',
      };
    }
  } catch (err: any) {
    return {
      sucesso: false,
      status: 'negado',
      mensagem: err?.message || 'Erro ao registrar permissão no navegador.',
    };
  }
}

export function desativarWebPushLocal(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(CHAVE_STORAGE_PUSH_ATIVO);
  } catch {}
}
