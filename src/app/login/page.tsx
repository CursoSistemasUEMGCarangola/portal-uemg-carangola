'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Eye,
  EyeOff,
  UserPlus,
  ArrowLeft,
} from 'lucide-react';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/restrito';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);
    setLoading(true);

    try {
      // 1. Autentica via endpoint de servidor para gravar os cookies HTTP oficiais
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.error?.includes('Invalid login credentials')) {
          setErro('E-mail institucional ou senha incorretos.');
        } else if (data.error?.includes('Email not confirmed')) {
          setErro('E-mail institucional ainda não confirmado.');
        } else {
          setErro(data.error || 'Falha na autenticação.');
        }
        setLoading(false);
        return;
      }

      // 2. Sincroniza sessão no cliente para contexto instantâneo
      try {
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
      } catch {
        // Silencioso se o cookie do servidor já assumir a sessão
      }

      // 3. Redirecionamento baseado no perfil (Role-Based Redirection)
      const explicitRedirect = searchParams.get('redirectTo');
      let destino = explicitRedirect;
      if (!destino || destino === '/restrito') {
        if (data.role === 'coordenador_curso') {
          destino = '/restrito/publicacoes';
        } else if (data.role === 'autor') {
          destino = '/meus-artigos';
        } else {
          destino = '/restrito';
        }
      }

      window.location.href = destino;
    } catch (err) {
      console.error('Erro no login:', err);
      setErro('Ocorreu um erro ao conectar com o servidor.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Voltar ao Portal */}
        <div className="mb-6 px-4 sm:px-0">
          <Link
            href="/"
            className="inline-flex items-center text-xs font-bold text-slate-500 hover:text-[#0B3B60] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
            <span>Voltar ao Portal Principal</span>
          </Link>
        </div>

        {/* Identidade Visual UEMG */}
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
            Acesso Restrito Institucional
          </h1>
          <p className="mt-1 text-xs text-slate-600">
            Gabinete da Direção • Coordenações de Curso • Docentes Autores
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 shadow-sm border border-slate-200 rounded-2xl sm:px-10">
          {erro && (
            <div
              role="alert"
              className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2.5"
            >
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{erro}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label htmlFor="login-email" className="block text-xs font-bold text-slate-700 mb-1">
                E-mail Institucional *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="login-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0056B3] outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="login-password" className="block text-xs font-bold text-slate-700">
                  Senha de Acesso *
                </label>
                <Link
                  href="/recuperar-senha"
                  className="text-xs text-[#0056B3] hover:text-[#0B3B60] hover:underline font-semibold"
                >
                  Esqueceu a senha?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0056B3] outline-none transition-all"
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

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-[#0B3B60] hover:bg-[#0056B3] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0B3B60] transition-all disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Autenticando...
                  </span>
                ) : (
                  <>
                    <span>Entrar no Sistema</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Divisor */}
          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500 mb-3">
              É professor, pesquisador ou coordenador e ainda não possui conta?
            </p>
            <Link
              href="/cadastro"
              className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl border border-slate-300 text-xs font-bold text-[#0B3B60] bg-white hover:bg-slate-50 transition-colors shadow-2xs"
            >
              <UserPlus className="w-4 h-4 text-[#0056B3]" />
              <span>Solicitar Cadastro Acadêmico</span>
            </Link>
          </div>

          {/* Aviso Institucional & Segurança */}
          <div className="mt-6 p-3 rounded-xl bg-blue-50/70 border border-blue-100 flex items-start gap-2 text-[11px] text-slate-600 leading-relaxed">
            <ShieldCheck className="w-4 h-4 text-[#0056B3] shrink-0 mt-0.5" />
            <span>
              Acesso protegido por autenticação criptográfica e controle de acesso baseado em papéis (RBAC).
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-sm text-slate-500">Carregando formulário de autenticação...</div>}>
      <LoginFormContent />
    </Suspense>
  );
}
