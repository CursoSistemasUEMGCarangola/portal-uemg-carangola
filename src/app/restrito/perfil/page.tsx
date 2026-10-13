'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  User,
  Mail,
  Key,
  ShieldCheck,
  Lock,
  AlertCircle,
  CheckCircle2,
  Save,
  Eye,
  EyeOff,
  ArrowLeft,
  Building,
  GraduationCap,
  Info,
  BadgeCheck,
  RefreshCw,
} from 'lucide-react';

interface PerfilData {
  id: string;
  nomeCompleto: string;
  emailInstitucional: string;
  emailSecundario: string;
  matricula: string;
  role: 'direcao' | 'coordenador_curso' | 'autor';
  cursoSigla: string;
  cursoNome: string;
  status: string;
  solicitadoEm: string | null;
  aprovadoEm: string | null;
  atualizadoEm: string | null;
}

export default function PerfilUsuarioPage() {
  const { user, perfil: authPerfil, recarregarPerfil } = useAuth();

  const [perfil, setPerfil] = useState<PerfilData | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [mensagemSucesso, setMensagemSucesso] = useState<string | null>(null);
  const [mensagemErro, setMensagemErro] = useState<string | null>(null);

  // Campos do formulário
  const [nomeCompleto, setNomeCompleto] = useState('');
  const [emailSecundario, setEmailSecundario] = useState('');
  const [matricula, setMatricula] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);

  useEffect(() => {
    async function carregarDados() {
      try {
        setCarregando(true);
        setMensagemErro(null);

        const res = await fetch('/api/auth/perfil');
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || 'Erro ao carregar dados do usuário.');
        }

        const data = await res.json();
        if (data.perfil) {
          setPerfil(data.perfil);
          setNomeCompleto(data.perfil.nomeCompleto || '');
          setEmailSecundario(data.perfil.emailSecundario || '');
          setMatricula(data.perfil.matricula || '');
        }
      } catch (err: any) {
        console.error('Falha ao obter perfil:', err);
        setMensagemErro(err.message || 'Falha na comunicação com o servidor.');
      } finally {
        setCarregando(false);
      }
    }

    carregarDados();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensagemSucesso(null);
    setMensagemErro(null);

    // Validações locais
    if (!nomeCompleto.trim() || nomeCompleto.trim().length < 3) {
      setMensagemErro('O nome completo deve conter pelo menos 3 caracteres.');
      return;
    }

    if (!emailSecundario.trim()) {
      setMensagemErro('O e-mail alternativo é obrigatório para notificações e recuperação de acesso.');
      return;
    }

    if (emailSecundario.toLowerCase().endsWith('@uemg.br')) {
      setMensagemErro(
        'O e-mail alternativo não pode ser institucional (@uemg.br). Utilize uma conta externa (ex: Gmail, Outlook).'
      );
      return;
    }

    if (perfil?.emailInstitucional && emailSecundario.toLowerCase() === perfil.emailInstitucional.toLowerCase()) {
      setMensagemErro('O e-mail alternativo deve ser diferente do seu e-mail institucional.');
      return;
    }

    if (!matricula.trim() || matricula.trim().length < 2) {
      setMensagemErro('Informe sua matrícula institucional ou MASP.');
      return;
    }

    if (novaSenha) {
      if (novaSenha.length < 6) {
        setMensagemErro('A nova senha deve ter no mínimo 6 caracteres.');
        return;
      }
      if (novaSenha !== confirmarSenha) {
        setMensagemErro('A confirmação de senha não coincide com a nova senha digitada.');
        return;
      }
    }

    try {
      setSalvando(true);

      const res = await fetch('/api/auth/perfil', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nomeCompleto: nomeCompleto.trim(),
          emailSecundario: emailSecundario.trim(),
          matricula: matricula.trim(),
          novaSenha: novaSenha.trim() || undefined,
          confirmarSenha: confirmarSenha.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Falha ao salvar alterações.');
      }

      setMensagemSucesso('Dados cadastrais atualizados com sucesso no sistema!');
      setNovaSenha('');
      setConfirmarSenha('');

      // Atualiza o estado em memória
      if (perfil) {
        setPerfil({
          ...perfil,
          nomeCompleto: nomeCompleto.trim(),
          emailSecundario: emailSecundario.trim(),
          matricula: matricula.trim(),
        });
      }

      // Recarrega o contexto de autenticação para atualizar o header
      await recarregarPerfil();
    } catch (err: any) {
      console.error('Erro ao salvar perfil:', err);
      setMensagemErro(err.message || 'Erro ao processar atualização cadastral.');
    } finally {
      setSalvando(false);
    }
  };

  const role = perfil?.role || authPerfil?.role || (user?.user_metadata?.role as string) || 'autor';
  const isDirecao = role === 'direcao';
  const isCoordenador = role === 'coordenador_curso';

  const linkVoltar = isDirecao ? '/restrito' : isCoordenador ? '/restrito/publicacoes' : '/meus-artigos';
  const rotuloVoltar = isDirecao
    ? 'Voltar ao Painel Geral da Direção'
    : isCoordenador
    ? 'Voltar ao Painel da Coordenação'
    : 'Voltar a Meus Artigos';

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
      {/* Barra de Navegação Superior / Voltar */}
      <div className="flex items-center justify-between">
        <Link
          href={linkVoltar}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#0B3B60] hover:text-[#0056B3] bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{rotuloVoltar}</span>
        </Link>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-[#0B3B60] border border-blue-200">
          <BadgeCheck className="w-4 h-4 text-emerald-600" />
          <span>
            {isDirecao
              ? 'Gabinete da Direção Geral'
              : isCoordenador
              ? `Coordenação de Curso (${perfil?.cursoSigla || ''})`
              : 'Autor Acadêmico'}
          </span>
        </div>
      </div>

      {/* Cabeçalho Visual da Página */}
      <div className="bg-gradient-to-r from-[#0B3B60] via-[#082d4a] to-[#041a2e] text-white rounded-3xl p-6 sm:p-8 shadow-lg border border-blue-900/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs border border-white/20 text-xs font-bold uppercase tracking-wider text-blue-200 mb-3">
            <User className="w-4 h-4 text-cyan-300" />
            <span>Gestão Cadastral & Identidade Institucional</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
            Meus Dados Cadastrais
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
            Consulte e atualize seus dados cadastrais, e-mail de recuperação e credenciais de segurança.
            Por requisitos de integridade institucional, atributos que interferem em processos ou alçadas de moderação são protegidos.
          </p>
        </div>
      </div>

      {/* Alertas de Notificação */}
      {mensagemSucesso && (
        <div
          role="status"
          aria-live="polite"
          className="bg-emerald-50 border border-emerald-300 p-4 rounded-2xl flex items-center gap-3 text-emerald-900 shadow-xs animate-fade-in"
        >
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <p className="text-xs sm:text-sm font-semibold">{mensagemSucesso}</p>
        </div>
      )}

      {mensagemErro && (
        <div
          role="alert"
          aria-live="assertive"
          className="bg-red-50 border border-red-300 p-4 rounded-2xl flex items-center gap-3 text-red-900 shadow-xs animate-fade-in"
        >
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <p className="text-xs sm:text-sm font-semibold">{mensagemErro}</p>
        </div>
      )}

      {carregando ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-xs">
          <RefreshCw className="w-8 h-8 text-[#0B3B60] animate-spin mx-auto mb-3" />
          <p className="text-sm font-bold text-slate-700">Carregando dados cadastrais...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Seção 1: Dados Editáveis pelo Usuário */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <span className="text-xs font-bold text-[#0056B3] uppercase tracking-wider block mb-1">
                Informações Pessoais & Contato
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-[#0B3B60]">
                Dados Permitidos para Edição
              </h2>
              <p className="text-xs text-slate-500">
                Você pode manter seu nome completo, matrícula institucional e e-mail alternativo sempre atualizados.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nome Completo */}
              <div className="space-y-1.5 md:col-span-2">
                <label htmlFor="campo-nome" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Nome Completo
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    id="campo-nome"
                    value={nomeCompleto}
                    onChange={(e) => setNomeCompleto(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#0B3B60] focus:border-[#0B3B60] transition-all"
                    placeholder="Seu nome completo oficial"
                  />
                </div>
              </div>

              {/* E-mail Alternativo / Secundário */}
              <div className="space-y-1.5">
                <label htmlFor="campo-email-secundario" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  E-mail Alternativo (Pessoal / Notificações)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    id="campo-email-secundario"
                    value={emailSecundario}
                    onChange={(e) => setEmailSecundario(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#0B3B60] focus:border-[#0B3B60] transition-all"
                    placeholder="exemplo@gmail.com, @outlook.com"
                  />
                </div>
                <p className="text-[11px] text-amber-800 leading-tight">
                  ⚠️ <strong>Destino obrigatório:</strong> Os links de recuperação de acesso e notificações oficiais são enviados para este e-mail pessoal, contornando bloqueios do domínio institucional.
                </p>
              </div>

              {/* Matrícula ou MASP */}
              <div className="space-y-1.5">
                <label htmlFor="campo-matricula" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Matrícula Institucional / MASP
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    id="campo-matricula"
                    value={matricula}
                    onChange={(e) => setMatricula(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#0B3B60] focus:border-[#0B3B60] transition-all"
                    placeholder="Ex: 1234567 ou MASP 987654-3"
                  />
                </div>
              </div>
            </div>

            {/* Subseção: Alteração Opcional de Senha */}
            <div className="border-t border-slate-100 pt-6 mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[#0B3B60] flex items-center gap-2">
                    <Key className="w-4 h-4 text-[#0056B3]" />
                    <span>Alterar Senha de Acesso (Opcional)</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Preencha somente caso deseje definir uma nova senha para seu login.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                  className="text-xs font-semibold text-[#0056B3] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  {mostrarSenha ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>Ocultar Senhas</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5" />
                      <span>Visualizar Senhas</span>
                    </>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="campo-nova-senha" className="block text-xs font-semibold text-slate-700">
                    Nova Senha (Mínimo 6 caracteres)
                  </label>
                  <input
                    type={mostrarSenha ? 'text' : 'password'}
                    id="campo-nova-senha"
                    value={novaSenha}
                    onChange={(e) => setNovaSenha(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#0B3B60] focus:border-[#0B3B60] transition-all"
                    placeholder="Digite a nova senha..."
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="campo-confirmar-senha" className="block text-xs font-semibold text-slate-700">
                    Confirmar Nova Senha
                  </label>
                  <input
                    type={mostrarSenha ? 'text' : 'password'}
                    id="campo-confirmar-senha"
                    value={confirmarSenha}
                    onChange={(e) => setConfirmarSenha(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#0B3B60] focus:border-[#0B3B60] transition-all"
                    placeholder="Repita a nova senha..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Seção 2: Dados de Governança Institucional (Protegidos / Somente Leitura) */}
          <div className="bg-slate-50 rounded-3xl border-2 border-slate-200 p-6 sm:p-8 space-y-6">
            <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Integridade & Governança Institucional
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-slate-800 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-slate-500" />
                  <span>Dados Protegidos pelo Sistema</span>
                </h2>
              </div>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-slate-200 text-slate-700 border border-slate-300 w-fit">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-600" />
                <span>Inalteráveis pelo Usuário</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* E-mail Institucional */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase block">E-mail Institucional</span>
                <p className="text-sm font-bold text-[#0B3B60] truncate" title={perfil?.emailInstitucional}>
                  {perfil?.emailInstitucional || '—'}
                </p>
                <span className="text-[10px] text-slate-500 block">Identidade Oficial @uemg.br</span>
              </div>

              {/* Papel / Alçada */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase block">Papel / Alçada</span>
                <p className="text-sm font-bold text-slate-900">
                  {isDirecao
                    ? 'Direção Geral'
                    : isCoordenador
                    ? 'Coordenador de Curso'
                    : 'Autor Acadêmico'}
                </p>
                <span className="text-[10px] text-slate-500 block">Nível de Acesso no Sistema</span>
              </div>

              {/* Curso Vinculado */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase block">Colegiado / Curso</span>
                <p className="text-sm font-bold text-slate-900 truncate" title={perfil?.cursoNome}>
                  {perfil?.cursoNome || 'Geral da Unidade'}
                </p>
                <span className="text-[10px] text-slate-500 block">
                  {perfil?.cursoSigla ? `Sigla Oficial: ${perfil.cursoSigla}` : 'Gabinete Direção'}
                </span>
              </div>

              {/* Status de Homologação */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase block">Situação Cadastral</span>
                <div className="flex items-center gap-1.5 pt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-sm font-bold text-emerald-800 capitalize">
                    {perfil?.status === 'ativo' ? 'Homologado / Ativo' : perfil?.status || 'Ativo'}
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 block">Aprovado pelo Gabinete</span>
              </div>
            </div>

            {/* Caixa Informativa sobre Processos Institucionais */}
            <div className="bg-blue-50/70 border border-blue-200 p-4 rounded-2xl flex items-start gap-3 text-xs text-[#0B3B60] leading-relaxed">
              <Info className="w-5 h-5 text-[#0056B3] shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold">Por que estes campos não podem ser alterados?</strong>
                <p className="mt-1 text-slate-700">
                  Para assegurar a governança pública, a integridade da curadoria editorial e a conformidade com as portarias acadêmicas,
                  o e-mail institucional oficial, a alçada deliberativa e o colegiado vinculado são intransferíveis.
                  Qualquer mudança de curso ou cargo de coordenação requer homologação oficial pelo Gabinete da Direção Geral.
                </p>
              </div>
            </div>
          </div>

          {/* Botão de Salvar Alterações */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
            <Link
              href={linkVoltar}
              className="w-full sm:w-auto px-6 py-3 rounded-xl text-sm font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors text-center"
            >
              Cancelar
            </Link>

            <button
              type="submit"
              id="btn-salvar-perfil"
              disabled={salvando}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-sm font-bold text-white bg-[#0B3B60] hover:bg-[#0056B3] shadow-md hover:shadow-lg transition-all disabled:opacity-50 cursor-pointer"
            >
              {salvando ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Salvando Alterações...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Salvar Alterações Cadastrais</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
