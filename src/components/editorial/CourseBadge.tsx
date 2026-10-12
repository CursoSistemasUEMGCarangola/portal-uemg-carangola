import React from 'react';
import { Curso, SiglaCurso } from '@/types/editorial';

interface CourseBadgeProps {
  curso: Curso | { sigla: SiglaCurso; nome: string };
  exibirNomeCompleto?: boolean;
  className?: string;
}

const ESTILOS_CURSOS: Record<SiglaCurso, string> = {
  BIO: 'bg-emerald-50 text-[#065F46] border-emerald-300',
  GEO: 'bg-amber-50 text-[#78350F] border-amber-300',
  HIS: 'bg-orange-50 text-[#9A3412] border-orange-300',
  LET: 'bg-purple-50 text-[#581C87] border-purple-300',
  MAT: 'bg-cyan-50 text-[#155E75] border-cyan-300',
  PED: 'bg-pink-50 text-[#831843] border-pink-300',
  SSO: 'bg-rose-50 text-[#881337] border-rose-300',
  SIS: 'bg-blue-50 text-[#1E40AF] border-blue-300',
};

export const CourseBadge: React.FC<CourseBadgeProps> = ({
  curso,
  exibirNomeCompleto = true,
  className = '',
}) => {
  const estilo = ESTILOS_CURSOS[curso.sigla] || 'bg-slate-50 text-slate-800 border-slate-300';

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold border tracking-wide ${estilo} ${className}`}
      aria-label={`Curso: ${curso.nome}`}
    >
      {curso.sigla}
      {exibirNomeCompleto && ` • ${curso.nome}`}
    </span>
  );
};
