'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Lock,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  Eye,
  EyeOff,
  KeyRound,
} from 'lucide-react';

function RedefinirSenhaForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';

  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);

    if (!token) {
      setErro('Token de recuperação ausente na URL. Solicite um novo link.');
      return;
    }

    if (novaSenha.length < 6) {
      setErro('A nova senha deve ter no mínimo 6 caracteres.');
      return;
    }

    if (novaSenha !== confirmarSenha) {
      setErro('A confirmação da senha não confere com a nova senha digitada.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/redefinir-senha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, novaSenha }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErro(data.error || 'Falha ao redefinir a senha.');
        setLoading(false);
        return;
      }

      setSucesso(true);
      setTimeout(() => {
        router.push('/login');
      }, 4000);
    } catch (err) {
      console.error('Erro na redefinição de senha:', err);
      setErro('Ocorreu uma falha na comunicação com o servidor.');
      setLoading(false);
    }
  };

  return (
    <div className="bg-white py-8 px-6 shadow-sm border border-slate-200 rounded-2xl sm:px-10">
      {sucesso ? (
        <div className="text-center py-6 space-y-4">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-[#0B3B60]">
            Senha Redefinida com Sucesso!
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
            Sua nova senha de acesso institucional foi atualizada com sucesso no sistema de autenticação da UEMG.
          </p>
          <p className="text-xs text-slate-400">
            Você será redirecionado para a tela de login em instantes...
          </p>
          <div className="pt-4">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#0B3B60] hover:bg-[#0056B3] text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
            >
              <span>Acessar Login Agora</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      ) : !token ? (
        <div className="text-center py-6 space-y-4">
          <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-800">
            Link Inválido ou Ausente
          </h2>
          <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
            O link de redefinição de senha acessado não contém um token válido ou foi corrompido.
          </p>
          <div className="pt-2">
            <Link
              href="/recuperar-senha"
              className="inline-flex items-center gap-2 px-5 py-2 bg-[#0B3B60] hover:bg-[#0056B3] text-white text-xs font-bold rounded-xl transition-colors"
            >
              <span>Solicitar Novo Link de Recuperação</span>
            </Link>
          </div>
        </div>
      ) : (
        <>
          {erro && (
            <div
              role="alert"
              className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2.5"
            >
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{erro}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nova Senha */}
            <div>
              <label
                htmlFor="nova-senha"
                className="block text-xs font-bold text-slate-700 mb-1"
              >
                Nova Senha de Acesso *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="nova-senha"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Mínimo de 6 caracteres"
                  value={novaSenha}
                  onChange={(e) => setNovaSenha(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0056B3] outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Ocultar senha' : 'Exibir senha'}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirmar Nova Senha */}
            <div>
              <label
                htmlFor="confirmar-senha"
                className="block text-xs font-bold text-slate-700 mb-1"
              >
                Confirmar Nova Senha *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  id="confirmar-senha"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Digite novamente a nova senha"
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0056B3] outline-none"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-[#0B3B60] hover:bg-[#0056B3] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0B3B60] transition-all disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Atualizando credenciais...
                  </span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Confirmar e Salvar Nova Senha</span>
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Deseja cancelar?</span>
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
  );
}

export default function RedefinirSenhaPage() {
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
            Criar Nova Senha
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-600 max-w-sm mx-auto">
            Digite sua nova credencial de acesso institucional UEMG.
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <Suspense
          fallback={
            <div className="bg-white py-12 px-6 shadow-sm border border-slate-200 rounded-2xl text-center text-xs text-slate-500">
              Carregando validação de segurança...
            </div>
          }
        >
          <RedefinirSenhaForm />
        </Suspense>
      </div>
    </div>
  );
}
