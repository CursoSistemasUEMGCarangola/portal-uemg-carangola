import React from 'react';
import Link from 'next/link';
import OuvidoriaForm from '@/components/ouvidoria/OuvidoriaForm';
import {
  MessageSquare,
  Search,
  ShieldCheck,
  Lock,
  EyeOff,
  Scale,
  Building,
} from 'lucide-react';

export const metadata = {
  title: 'Fale com a Direção | Portal UEMG Carangola',
  description:
    'Canal autônomo e seguro de ouvidoria com o Gabinete da Direção Geral da UEMG Carangola. Criptografia de ponta a ponta e sigilo garantido.',
};

export default function FaleComADirecaoPage() {
  return (
    <div className="min-h-screen bg-[#F7F9FC] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Cabeçalho do Canal Institucional */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#0B3B60] text-white mb-2">
              <Building className="w-3.5 h-3.5 text-cyan-300" aria-hidden="true" />
              Gabinete da Direção Geral • Ouvidoria Cidadã e Segura
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B3B60] tracking-tight">
              Fale com a Direção
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Canal direto, seguro e auditável com o Gabinete. Criptografia de ponta a ponta e opção de anonimato.
            </p>
          </div>

          <Link
            href="/fale-com-a-direcao/consulta"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-slate-300 hover:border-[#0056B3] text-[#0B3B60] hover:text-[#0056B3] font-bold text-xs sm:text-sm shadow-sm transition-all shrink-0"
          >
            <Search className="w-4 h-4" aria-hidden="true" />
            Consultar Andamento de Protocolo
          </Link>
        </div>

        {/* Pilares de Segurança & Custo Zero */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-start gap-3">
            <Lock className="w-5 h-5 text-[#0056B3] shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <h2 className="text-xs font-bold text-slate-900">Zero-Trust Criptográfico</h2>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Mensagens cifradas no navegador (AES-GCM 256 + RSA-OAEP). Nem operadores do banco podem ler denúncias.
              </p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-start gap-3">
            <EyeOff className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <h2 className="text-xs font-bold text-slate-900">Sigilo & Anonimato</h2>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Envio 100% anônimo disponível sem registro de IP ou dados identificadores pessoais.
              </p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-start gap-3">
            <Scale className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <h2 className="text-xs font-bold text-slate-900">Conformidade Pública</h2>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Em estrito atendimento à Lei de Acesso à Informação (LAI) e Lei Geral de Proteção de Dados (LGPD).
              </p>
            </div>
          </div>
        </div>

        {/* Formulário Interativo */}
        <OuvidoriaForm />
      </div>
    </div>
  );
}
