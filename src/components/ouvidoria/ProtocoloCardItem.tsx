import React from 'react';
import { ProtocoloInterno } from '@/types/ouvidoria';
import { SiglaCurso } from '@/types/editorial';
import { CourseBadge } from '@/components/editorial/CourseBadge';
import {
  OuvidoriaTipoBadge,
  OuvidoriaStatusBadge,
} from '@/components/ouvidoria/OuvidoriaBadge';
import {
  Building,
  Lock,
  User,
  Award,
  Eye,
} from 'lucide-react';

interface ProtocoloCardItemProps {
  proto: ProtocoloInterno;
  aoDespachar: (proto: ProtocoloInterno) => void;
}

export function ProtocoloCardItem({ proto, aoDespachar }: ProtocoloCardItemProps) {
  return (
    <article
      aria-label={`Protocolo institucional ${proto.codigoProtocolo}`}
      className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:border-slate-300 transition-all space-y-4"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-sm font-black text-[#0B3B60] bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
            {proto.codigoProtocolo}
          </span>

          <OuvidoriaTipoBadge tipo={proto.tipo} />

          {proto.cursoSigla !== 'GERAL' ? (
            <CourseBadge
              curso={{
                sigla: proto.cursoSigla as SiglaCurso,
                nome: `Curso de ${proto.cursoSigla}`,
              }}
            />
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
              <Building className="w-3 h-3 text-slate-500" aria-hidden="true" />
              Administração Geral
            </span>
          )}

          <OuvidoriaStatusBadge status={proto.status} />
        </div>

        <div className="text-xs text-slate-500 font-medium flex items-center gap-2">
          <span>Criado em: {proto.criadoEm}</span>
          {proto.isAnonimo ? (
            <span className="inline-flex items-center gap-1 text-slate-600 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
              <Lock className="w-3 h-3 text-slate-500" aria-hidden="true" />
              Manifestação Anônima
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-blue-700 bg-blue-50 px-2 py-0.5 rounded text-[11px]">
              <User className="w-3 h-3 text-blue-500" aria-hidden="true" />
              Manifestação Identificada
            </span>
          )}
        </div>
      </div>

      {/* Resumo do Conteúdo Cifrado e Despacho Existente */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-1">
          <span className="font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-[#0B3B60]" aria-hidden="true" />
            Envelope Criptográfico
          </span>
          <p className="font-mono text-[11px] text-slate-500 truncate">
            Ciphertext: {proto.envelopeCifrado.ciphertextBase64.substring(0, 36)}...
          </p>
          <span className="text-[10px] text-slate-400 block">
            Padrão: AES-GCM-256 (DEK cifrada com chave pública RSA-OAEP-4096)
          </span>
        </div>

        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-1">
          <span className="font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-emerald-700" aria-hidden="true" />
            Despacho Oficial / Portaria
          </span>
          {proto.despachoOficial ? (
            <p className="text-slate-800 line-clamp-2">
              {proto.despachoOficial}
            </p>
          ) : (
            <p className="text-slate-400 italic">
              Ainda sem despacho registrado pelo Gabinete.
            </p>
          )}
          {proto.numeroPortaria && (
            <span className="text-[10px] font-bold text-emerald-800 block">
              {proto.numeroPortaria}
            </span>
          )}
        </div>
      </div>

      {/* Ações */}
      <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={() => aoDespachar(proto)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#0B3B60] hover:bg-[#0056B3] shadow-xs transition-colors"
        >
          <Eye className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Descriptografar &amp; Despachar</span>
        </button>
      </div>
    </article>
  );
}
