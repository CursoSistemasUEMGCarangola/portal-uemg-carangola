'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ItemMuralPublico, TipoManifestacao } from '@/types/ouvidoria';
import { CURSOS_LISTA } from '@/lib/data/mock-articles';
import { obterItensMuralPublico } from '@/lib/data/mock-mural';
import { MuralCard } from '@/components/ouvidoria/MuralCard';
import {
  Search,
  Filter,
  Scale,
  Building,
  CheckCircle2,
  MessageSquare,
  ShieldAlert,
  ArrowRight,
  Inbox,
} from 'lucide-react';

interface MuralCatalogProps {
  itensIniciais: ItemMuralPublico[];
}

export function MuralCatalog({ itensIniciais }: MuralCatalogProps) {
  const [itens, setItens] = useState<ItemMuralPublico[]>(itensIniciais);
  const [busca, setBusca] = useState('');
  const [cursoSelecionado, setCursoSelecionado] = useState<string>('TODOS');
  const [tipoSelecionado, setTipoSelecionado] = useState<string>('TODOS');

  // Atualiza com dados persistidos no cliente (localStorage)
  useEffect(() => {
    setItens(obterItensMuralPublico());
  }, []);

  const itensFiltrados = itens.filter((item) => {
    // Apenas ativos
    if (!item.isActive) return false;

    // Filtro de busca textual
    const termo = busca.toLowerCase();
    const bateTexto =
      !busca ||
      item.protocoloReferencia.toLowerCase().includes(termo) ||
      item.manifestacaoResumo.toLowerCase().includes(termo) ||
      item.respostaOficial.toLowerCase().includes(termo) ||
      (item.numeroPortaria && item.numeroPortaria.toLowerCase().includes(termo));

    if (!bateTexto) return false;

    // Filtro por curso
    if (cursoSelecionado !== 'TODOS') {
      if (item.cursoSigla !== cursoSelecionado) return false;
    }

    // Filtro por tipo
    if (tipoSelecionado !== 'TODOS') {
      if (item.tipo !== tipoSelecionado) return false;
    }

    return true;
  });

  return (
    <div className="space-y-8">
      {/* Controles de Busca e Filtro */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
        {/* Barra de Busca */}
        <div className="relative">
          <Search
            className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2"
            aria-hidden="true"
          />
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por protocolo (#CAR-2026-...), tema, palavra-chave ou portaria oficial..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-3 text-sm text-slate-800 focus:bg-white focus:border-[#0B3B60] focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all placeholder:text-slate-400"
            aria-label="Buscar no Mural de Transparência"
          />
        </div>

        {/* Linha de Filtros */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-2 border-t border-slate-100">
          {/* Filtro por Tipo */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1">
              Tipo:
            </span>
            {[
              { id: 'TODOS', rotulo: 'Todos' },
              { id: 'solicitacao', rotulo: 'Solicitações' },
              { id: 'sugestao', rotulo: 'Sugestões' },
              { id: 'elogio', rotulo: 'Elogios' },
              { id: 'denuncia', rotulo: 'Denúncias' },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTipoSelecionado(t.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  tipoSelecionado === t.id
                    ? 'bg-[#0B3B60] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {t.rotulo}
              </button>
            ))}
          </div>

          {/* Filtro por Curso */}
          <div className="flex items-center gap-2">
            <label
              htmlFor="filtro-curso-mural"
              className="text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap"
            >
              Unidade / Curso:
            </label>
            <select
              id="filtro-curso-mural"
              value={cursoSelecionado}
              onChange={(e) => setCursoSelecionado(e.target.value)}
              className="bg-slate-50 border border-slate-300 text-slate-800 text-xs rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-[#0B3B60] focus:outline-none"
            >
              <option value="TODOS">Todos os Colegiados</option>
              <option value="GERAL">Administração Geral</option>
              {CURSOS_LISTA.map((c) => (
                <option key={c.sigla} value={c.sigla}>
                  {c.sigla} - {c.nome}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Contador de Resultados */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>
          Exibindo <strong>{itensFiltrados.length}</strong> de <strong>{itens.length}</strong> manifestações homologadas
        </span>
        <span>Atualização contínua com higienização estrita</span>
      </div>

      {/* Grid de Itens */}
      {itensFiltrados.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
          <Inbox className="w-12 h-12 text-slate-300 mx-auto" aria-hidden="true" />
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-800">
              Nenhuma manifestação encontrada
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Não encontramos deliberações com os critérios ou termos pesquisados no momento.
            </p>
          </div>
          {(busca || cursoSelecionado !== 'TODOS' || tipoSelecionado !== 'TODOS') && (
            <button
              type="button"
              onClick={() => {
                setBusca('');
                setCursoSelecionado('TODOS');
                setTipoSelecionado('TODOS');
              }}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors"
            >
              Limpar todos os filtros
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {itensFiltrados.map((item) => (
            <MuralCard key={item.id} item={item} />
          ))}
        </div>
      )}

      {/* Banner de Consulta Privada e Novo Envio */}
      <div className="bg-gradient-to-r from-blue-50 to-slate-100 rounded-2xl border border-blue-200/80 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left">
          <h3 className="text-lg font-bold text-[#0B3B60]">
            Possui um protocolo em andamento?
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
            Acompanhe o andamento completo da sua manifestação utilizando a chave secreta fornecida no comprovante digital emitido.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Link
            href="/fale-com-a-direcao/consulta"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#0B3B60] hover:bg-[#0056B3] shadow-xs transition-colors"
          >
            <span>Consultar Protocolo</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
          <Link
            href="/fale-com-a-direcao"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-[#0B3B60] bg-white hover:bg-slate-50 border border-slate-300 transition-colors"
          >
            <MessageSquare className="w-4 h-4 text-[#0056B3]" aria-hidden="true" />
            <span>Nova Manifestação</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
