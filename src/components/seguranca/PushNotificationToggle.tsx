'use client';

import React, { useState, useEffect } from 'react';
import {
  Bell,
  BellOff,
  BellRing,
  ShieldAlert,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';
import {
  obterStatusWebPush,
  solicitarPermissaoWebPush,
  desativarWebPushLocal,
  isComputadorPublico,
  setModoComputadorPublico,
  StatusWebPush,
} from '@/lib/notifications/web-push-client';

export const PushNotificationToggle: React.FC = () => {
  const [status, setStatus] = useState<StatusWebPush>('padrao');
  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState<string | null>(null);
  const [modoPublico, setModoPublico] = useState(false);

  useEffect(() => {
    setStatus(obterStatusWebPush());
    setModoPublico(isComputadorPublico());
  }, []);

  async function handleTogglePush() {
    setCarregando(true);
    setMensagem(null);

    if (status === 'concedido') {
      desativarWebPushLocal();
      setStatus('padrao');
      setMensagem('Notificações desativadas para este dispositivo.');
      setCarregando(false);
      return;
    }

    const res = await solicitarPermissaoWebPush();
    setStatus(res.status);
    setMensagem(res.mensagem);
    setCarregando(false);
    setTimeout(() => setMensagem(null), 5000);
  }

  function handleToggleModoPublico() {
    const novoValor = !modoPublico;
    setModoPublico(novoValor);
    setModoComputadorPublico(novoValor);
    setStatus(obterStatusWebPush());
    if (novoValor) {
      setMensagem('Modo Terminal Público ativado: Push bloqueado e dados voláteis restritos à memória RAM.');
    } else {
      setMensagem('Modo Dispositivo Pessoal ativado.');
    }
    setTimeout(() => setMensagem(null), 5000);
  }

  if (status === 'nao_suportado') {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Botão de Toggle de Computador Público */}
      <button
        type="button"
        onClick={handleToggleModoPublico}
        title={modoPublico ? 'Terminal marcado como público/laboratório' : 'Dispositivo pessoal'}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
          modoPublico
            ? 'bg-amber-100 text-amber-900 border-amber-300'
            : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
        }`}
        aria-pressed={modoPublico}
      >
        {modoPublico ? (
          <>
            <ShieldAlert className="w-3.5 h-3.5 text-amber-700 shrink-0" aria-hidden="true" />
            <span>Terminal de Laboratório</span>
          </>
        ) : (
          <>
            <CheckCircle className="w-3.5 h-3.5 text-slate-500 shrink-0" aria-hidden="true" />
            <span>Dispositivo Pessoal</span>
          </>
        )}
      </button>

      {/* Botão de Notificação Push */}
      <button
        type="button"
        onClick={handleTogglePush}
        disabled={carregando || modoPublico}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
          modoPublico
            ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-60'
            : status === 'concedido'
            ? 'bg-emerald-100 text-emerald-900 border-emerald-300 hover:bg-emerald-200'
            : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
        }`}
        title={
          modoPublico
            ? 'Push desativado em terminais de laboratório (Hard Box DNA #7)'
            : status === 'concedido'
            ? 'Notificações ativas (clique para pausar)'
            : 'Ativar alertas Web Push institucionais'
        }
        aria-label="Controle de Notificações Web Push"
      >
        {status === 'concedido' && !modoPublico ? (
          <>
            <BellRing className="w-3.5 h-3.5 text-emerald-700 shrink-0" aria-hidden="true" />
            <span>Push Ativo</span>
          </>
        ) : (
          <>
            <Bell className="w-3.5 h-3.5 text-slate-500 shrink-0" aria-hidden="true" />
            <span>Ativar Alertas</span>
          </>
        )}
      </button>

      {/* Feedback contextual efêmero */}
      {mensagem && (
        <span className="text-[11px] font-medium text-slate-600 bg-white border border-slate-200 px-2.5 py-1 rounded-md shadow-2xs">
          {mensagem}
        </span>
      )}
    </div>
  );
};
