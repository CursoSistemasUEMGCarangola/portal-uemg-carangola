'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Mail,
  ArrowRight,
  ShieldAlert,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  MailCheck,
  Send,
} from 'lucide-react';

export default function RecuperarSenhaPage() {
  const [emailOrIdentifier, setEmailOrIdentifier] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState(false);
  const [emailDestinoMascarado, setEmailDestinoMascarado] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);
    setLoading(true);

    try {
      const response = await fetch('/api/auth/recuperar-senha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailOrIdentifier: emailOrIdentifier.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErro(data.error || 'Não foi possível processar a solicitação.');
        setLoading(false);
        return;
      }

      setEmailDestinoMascarado(data.emailDestino || null);
      setSucesso(true);
    } catch (err) {
      console.error('Erro na recuperação de senha:', err);
      setErro('Ocorreu uma falha na comunicação com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Voltar ao Login */}
        <div className="mb-6 px-4 sm:px-0">
          <Link
            href="/login"
            className="inline-flex items-center text-xs font-bold text-slate-500 hover:text-[#0B3B60] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
            <span>Voltar para tela de Login</span>
          </Link>
        </div>

        {/* Cabeçalho */}
        <div className="text-center">
          <div className="mx-auto w-16 h-16 relative flex items-center justify-center mb-3">
            <Image
              src="/images/logo_uemg.png"
              alt="Logo UEMG"
              width={64}
              height={64}
              className="w-16 h-16 object-contain drop-shadow-sm"
              priority
            />
          </div>
          <h1 className="text-2xl font-extrabold text-[#0B3B60] tracking-tight">
            Recuperação de Acesso
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-600 max-w-sm mx-auto">
            Informe seu e-mail institucional ou matrícula para receber o link de redefinição de senha.
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 shadow-sm border border-slate-200 rounded-2xl sm:px-10">
          {sucesso ? (
            <div className="text-center py-4 space-y-4">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <MailCheck className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-[#0B3B60]">
                E-mail de Recuperação Enviado!
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                As instruções seguras para redefinição de senha foram encaminhadas para o seu{' '}
                <strong>e-mail secundário</strong> cadastrado:
              </p>

              {emailDestinoMascarado && (
                <div className="py-2.5 px-4 bg-slate-100 rounded-xl text-slate-800 font-mono text-sm inline-block border border-slate-200">
                  {emailDestinoMascarado}
                </div>
              )}

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-left text-[11px] text-amber-900 space-y-1.5">
                <p className="font-bold flex items-center gap-1.5 text-amber-950">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Atenção: Verifique a pasta de Spam / Lixo Eletrônico</span>
                </p>
                <p className="text-amber-800 leading-relaxed">
                  Como o envio é realizado por sistema automatizado, provedores como o <strong>Gmail</strong> podem direcionar esta primeira mensagem para a pasta de <strong>Spam</strong> ou aba <strong>Promoções</strong>.
                </p>
                <p className="text-amber-900 font-semibold bg-amber-100/60 p-1.5 rounded-lg border border-amber-200/60">
                  💡 Dica: Ao localizar a mensagem no Spam, clique em <strong>&quot;Não é spam&quot;</strong> para que os próximos e-mails cheguem diretamente à sua Caixa de Entrada.
                </p>
                <p className="text-slate-500 text-[10px] pt-1">
                  ⏱ O link de redefinição é válido por <strong>2 horas</strong>.
                </p>
              </div>

              <div className="pt-4 flex flex-col gap-2">
                <Link
                  href="/login"
                  className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl shadow-sm text-sm font-bold text-white bg-[#0B3B60] hover:bg-[#0056B3] transition-colors"
                >
                  <span>Retornar ao Login</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setSucesso(false);
                    setEmailOrIdentifier('');
                  }}
                  className="text-xs text-slate-500 hover:text-slate-700 underline font-medium pt-2 cursor-pointer"
                >
                  Tentar com outro identificador
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Alerta Institucional */}
              <div className="mb-6 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
                <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold">Envio via E-mail Alternativo</p>
                  <p className="text-amber-800 leading-relaxed text-[11px]">
                    Como os servidores da UEMG bloqueiam e-mails disparados por sistemas automatizados, o link de recuperação será enviado para o <strong>e-mail secundário (pessoal)</strong> associado à sua conta.
                  </p>
                </div>
              </div>

              {erro && (
                <div
                  role="alert"
                  className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2.5"
                >
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span>{erro}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label
                    htmlFor="rec-identifier"
                    className="block text-xs font-bold text-slate-700 mb-1"
                  >
                    E-mail Institucional ou Matrícula *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      id="rec-identifier"
                      type="text"
                      required
                      placeholder="usuario@uemg.br ou Matrícula"
                      value={emailOrIdentifier}
                      onChange={(e) => setEmailOrIdentifier(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0056B3] outline-none"
                    />
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    Utilize o mesmo e-mail institucional ou matrícula cadastrada.
                  </span>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-[#0B3B60] hover:bg-[#0056B3] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0B3B60] transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Localizando conta e disparando e-mail...
                      </span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Enviar Link de Recuperação</span>
                      </>
                    )}
                  </button>
                </div>
              </form>

              <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Lembrou sua senha?</span>
                <Link
                  href="/login"
                  className="font-bold text-[#0B3B60] hover:underline"
                >
                  Voltar ao Login
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
