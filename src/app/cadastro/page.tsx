'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { CURSOS_LISTA } from '@/lib/data/mock-articles';
import {
  Lock,
  Mail,
  User,
  GraduationCap,
  BadgeAlert,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  BookOpen,
  MailCheck,
  ShieldAlert,
} from 'lucide-react';

export default function CadastroPage() {
  const router = useRouter();

  const [nomeCompleto, setNomeCompleto] = useState('');
  const [email, setEmail] = useState('');
  const [emailSecundario, setEmailSecundario] = useState('');
  const [matricula, setMatricula] = useState('');
  const [vinculo, setVinculo] = useState<'autor' | 'coordenador_curso'>('autor');
  const [cursoSigla, setCursoSigla] = useState('SIS');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);

    if (!emailSecundario || !emailSecundario.includes('@')) {
      setErro('O e-mail secundário (pessoal) é obrigatório para recuperação de acesso.');
      return;
    }

    if (emailSecundario.toLowerCase().endsWith('@uemg.br')) {
      setErro('O e-mail secundário deve ser de um provedor externo (ex: Gmail, Outlook, Yahoo) e não pode ser @uemg.br.');
      return;
    }

    if (senha.length < 6) {
      setErro('A senha deve conter no mínimo 6 caracteres.');
      return;
    }

    if (senha !== confirmarSenha) {
      setErro('A confirmação da senha não coincide com a senha digitada.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/cadastro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nomeCompleto: nomeCompleto.trim(),
          email: email.trim().toLowerCase(),
          emailSecundario: emailSecundario.trim().toLowerCase(),
          matricula: matricula.trim(),
          vinculo,
          cursoSigla,
          senha,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErro(data.error || 'Erro ao processar o cadastro.');
        setLoading(false);
        return;
      }

      setSucesso(true);
      setTimeout(() => {
        router.push('/login');
      }, 3500);
    } catch (err) {
      console.error('Erro na requisição de cadastro:', err);
      setErro('Ocorreu uma falha na comunicação com o servidor.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-xl">
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

        {/* Cabeçalho Institucional */}
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
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B3B60] tracking-tight">
            Cadastro de Acesso Acadêmico
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
            Habilitação institucional para Docentes Autores e Coordenações de Curso da UEMG Unidade Carangola.
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl px-4 sm:px-0">
        <div className="bg-white py-8 px-6 shadow-sm border border-slate-200 rounded-2xl sm:px-10">
          {sucesso ? (
            <div className="text-center py-8 space-y-4">
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto ${
                  vinculo === 'coordenador_curso'
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-emerald-100 text-emerald-600'
                }`}
              >
                {vinculo === 'coordenador_curso' ? (
                  <ShieldAlert className="w-8 h-8" />
                ) : (
                  <CheckCircle2 className="w-8 h-8" />
                )}
              </div>
              <h2 className="text-xl font-bold text-[#0B3B60]">
                {vinculo === 'coordenador_curso'
                  ? 'Solicitação de Coordenação Registrada!'
                  : 'Cadastro de Autor Concluído com Sucesso!'}
              </h2>
              <div className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed space-y-2">
                {vinculo === 'coordenador_curso' ? (
                  <>
                    <p>
                      Seus dados foram gravados com sucesso. Por requisitos de governança e segurança institucional, o perfil de <strong>Coordenador de Curso</strong> depende de <strong>homologação prévia pelo Gabinete da Direção Geral</strong>.
                    </p>
                    <div className="text-[11px] text-amber-900 bg-amber-50 p-3 rounded-xl border border-amber-200 text-left space-y-1">
                      <p className="font-bold flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>Aviso sobre a Notificação por E-mail</span>
                      </p>
                      <p className="text-amber-800 leading-relaxed">
                        A notificação de homologação será enviada para o seu e-mail alternativo. Como se trata de disparo via sistema externo, <strong>verifique a pasta de Spam / Lixo Eletrônico</strong> e clique em <strong>&quot;Não é spam&quot;</strong> para habilitar as comunicações na sua Caixa de Entrada.
                      </p>
                    </div>
                  </>
                ) : (
                  <p>
                    Seu perfil institucional foi criado e vinculado ao curso selecionado.
                    Você já pode acessar o sistema com seu e-mail institucional e senha.
                  </p>
                )}
              </div>
              <div className="pt-4">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#0B3B60] hover:bg-[#0056B3] text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
                >
                  <span>Ir para Tela de Login</span>
                  <ArrowRight className="w-4 h-4" />
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
                {/* Nome Completo */}
                <div>
                  <label htmlFor="cad-nome" className="block text-xs font-bold text-slate-700 mb-1">
                    Nome Completo *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      id="cad-nome"
                      type="text"
                      required
                      value={nomeCompleto}
                      onChange={(e) => setNomeCompleto(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0056B3] outline-none"
                    />
                  </div>
                </div>

                {/* Alerta Informativo Obrigatório: E-mail Secundário */}
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-3">
                  <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-bold text-amber-900">
                      Obrigatoriedade de E-mail Secundário para Recuperação de Senha
                    </p>
                    <p className="text-amber-800 leading-relaxed text-[11px]">
                      Os servidores institucionais da UEMG bloqueiam o recebimento de mensagens automáticas de scripts externos. 
                      Portanto, é <strong>obrigatório</strong> informar um e-mail alternativo pessoal (ex: <em>Gmail, Outlook, Hotmail</em>). 
                      O link de recuperação de acesso será enviado <strong>exclusivamente</strong> para este endereço secundário.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* E-mail Institucional */}
                  <div>
                    <label htmlFor="cad-email" className="block text-xs font-bold text-slate-700 mb-1">
                      E-mail Institucional *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        id="cad-email"
                        type="email"
                        required
                        placeholder="nome.sobrenome@uemg.br"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0056B3] outline-none"
                      />
                    </div>
                    <span className="text-[10px] text-slate-500 mt-1 block">
                      Usado para login no sistema (@uemg.br)
                    </span>
                  </div>

                  {/* E-mail Secundário (Recuperação de Acesso) */}
                  <div>
                    <label htmlFor="cad-email-secundario" className="block text-xs font-bold text-slate-700 mb-1">
                      E-mail Alternativo / Pessoal *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <MailCheck className="w-4 h-4 text-emerald-600" />
                      </div>
                      <input
                        id="cad-email-secundario"
                        type="email"
                        required
                        placeholder="ex: seu.email@gmail.com"
                        value={emailSecundario}
                        onChange={(e) => setEmailSecundario(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 text-sm border border-amber-300 bg-amber-50/20 rounded-xl focus:ring-2 focus:ring-[#0056B3] outline-none"
                      />
                    </div>
                    <span className="text-[10px] text-amber-700 font-medium mt-1 block">
                      Obrigatório: Gmail, Outlook ou outro não-UEMG
                    </span>
                  </div>
                </div>

                {/* Matrícula ou MASP */}
                <div>
                  <label htmlFor="cad-matricula" className="block text-xs font-bold text-slate-700 mb-1">
                    Matrícula / MASP *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <BadgeAlert className="w-4 h-4" />
                    </div>
                    <input
                      id="cad-matricula"
                      type="text"
                      required
                      placeholder="Ex: 1234567"
                      value={matricula}
                      onChange={(e) => setMatricula(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0056B3] outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Papel / Vínculo */}
                  <div>
                    <label htmlFor="cad-vinculo" className="block text-xs font-bold text-slate-700 mb-1">
                      Vínculo / Papel Institucional *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <select
                        id="cad-vinculo"
                        value={vinculo}
                        onChange={(e) => setVinculo(e.target.value as 'autor' | 'coordenador_curso')}
                        className="w-full pl-10 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0056B3] outline-none bg-white"
                      >
                        <option value="autor">Docente / Autor de Artigos</option>
                        <option value="coordenador_curso">Coordenador de Curso</option>
                      </select>
                    </div>
                  </div>

                  {/* Curso Oficial */}
                  <div>
                    <label htmlFor="cad-curso" className="block text-xs font-bold text-slate-700 mb-1">
                      Curso de Vinculação *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <GraduationCap className="w-4 h-4" />
                      </div>
                      <select
                        id="cad-curso"
                        value={cursoSigla}
                        onChange={(e) => setCursoSigla(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0056B3] outline-none bg-white"
                      >
                        {CURSOS_LISTA.map((c) => (
                          <option key={c.sigla} value={c.sigla}>
                            {c.sigla} — {c.nome}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Senha */}
                  <div>
                    <label htmlFor="cad-senha" className="block text-xs font-bold text-slate-700 mb-1">
                      Senha de Acesso *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        id="cad-senha"
                        type="password"
                        required
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0056B3] outline-none"
                      />
                    </div>
                  </div>

                  {/* Confirmar Senha */}
                  <div>
                    <label htmlFor="cad-confirma" className="block text-xs font-bold text-slate-700 mb-1">
                      Confirmar Senha *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        id="cad-confirma"
                        type="password"
                        required
                        value={confirmarSenha}
                        onChange={(e) => setConfirmarSenha(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0056B3] outline-none"
                      />
                    </div>
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
                        Registrando perfil acadêmico...
                      </span>
                    ) : (
                      <>
                        <span>Concluir Cadastro Acadêmico</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>

              <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Já possui acesso ativo?</span>
                <Link
                  href="/login"
                  className="font-bold text-[#0B3B60] hover:underline"
                >
                  Entrar no sistema
                </Link>
              </div>

              {/* Nota de Governança */}
              <div className="mt-6 p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2 text-[11px] text-slate-500 leading-relaxed">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  O perfil cadastrado concede acesso às funções do curso e publicação editorial com controle de acesso baseado em papéis (RBAC).
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
