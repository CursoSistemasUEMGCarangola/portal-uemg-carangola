'use client';

import React, { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

/**
 * Extrai recursivamente o texto plano de um nó ou árvore React.
 */
function extrairTextoDoReactNode(node: React.ReactNode): string {
  if (node === null || node === undefined || typeof node === 'boolean') {
    return '';
  }
  if (typeof node === 'string' || typeof node === 'number') {
    return String(node);
  }
  if (Array.isArray(node)) {
    return node.map(extrairTextoDoReactNode).join('');
  }
  if (React.isValidElement(node) && (node.props as { children?: React.ReactNode })?.children) {
    return extrairTextoDoReactNode((node.props as { children?: React.ReactNode }).children);
  }
  return '';
}

/**
 * Converte o texto de um cabeçalho em um identificador slug GFM compatível com âncoras.
 */
function gerarSlugId(children: React.ReactNode): string {
  const text = extrairTextoDoReactNode(children);
  return text
    .toLowerCase()
    .replace(/[^\w\s\u00C0-\u017F-]/g, '')
    .replace(/\s+/g, '-');
}

export function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  // Suporte a carregamento direto com âncora (#) na barra de endereços
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const rawHash = window.location.hash.slice(1);
      const decoded = decodeURIComponent(rawHash).toLowerCase().trim();
      const timer = setTimeout(() => {
        const el =
          document.getElementById(rawHash) ||
          document.getElementById(decoded) ||
          document.getElementById(decoded.replace(/-+/g, '-'));
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [content]);

  return (
    <div className={`markdown-content ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          h1: ({ children }) => {
            const id = gerarSlugId(children);
            return (
              <h1
                id={id}
                className="scroll-mt-28 text-2xl sm:text-3xl font-extrabold text-[#0B3B60] tracking-tight mt-10 mb-4 pb-2 border-b border-slate-200"
              >
                {children}
              </h1>
            );
          },
          h2: ({ children }) => {
            const id = gerarSlugId(children);
            return (
              <h2
                id={id}
                className="scroll-mt-28 text-xl sm:text-2xl font-bold text-[#0B3B60] tracking-tight mt-8 mb-4 pb-2 border-b border-slate-200"
              >
                {children}
              </h2>
            );
          },
          h3: ({ children }) => {
            const id = gerarSlugId(children);
            return (
              <h3
                id={id}
                className="scroll-mt-28 text-lg sm:text-xl font-bold text-slate-800 mt-6 mb-3"
              >
                {children}
              </h3>
            );
          },
          h4: ({ children }) => {
            const id = gerarSlugId(children);
            return (
              <h4
                id={id}
                className="scroll-mt-28 text-base sm:text-lg font-semibold text-slate-800 mt-4 mb-2"
              >
                {children}
              </h4>
            );
          },
          p: ({ children }) => (
            <p className="text-slate-800 text-base leading-relaxed mb-4 text-justify sm:text-left">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="my-4 space-y-2 list-disc list-outside pl-6 text-slate-800">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="my-4 space-y-2 list-decimal list-outside pl-6 text-slate-800">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="leading-relaxed pl-1 text-slate-800">
              {children}
            </li>
          ),
          strong: ({ children }) => (
            <strong className="font-bold text-slate-900">
              {children}
            </strong>
          ),
          em: ({ children }) => (
            <em className="italic text-slate-800">
              {children}
            </em>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-[#0056B3] pl-4 py-2 my-4 bg-blue-50/40 rounded-r-lg italic text-slate-700">
              {children}
            </blockquote>
          ),
          code: ({ children, className }) => {
            const isInline = !className;
            if (isInline) {
              return (
                <code className="bg-slate-100 text-[#0056B3] px-1.5 py-0.5 rounded font-mono text-xs sm:text-sm font-semibold border border-slate-200">
                  {children}
                </code>
              );
            }
            return (
              <code className="font-mono text-xs sm:text-sm">
                {children}
              </code>
            );
          },
          pre: ({ children }) => (
            <pre className="bg-slate-900 text-slate-100 p-4 rounded-xl overflow-x-auto my-6 text-xs sm:text-sm font-mono shadow-sm">
              {children}
            </pre>
          ),
          hr: () => (
            <hr className="my-8 border-t border-slate-200" />
          ),
          a: ({ href, children }) => {
            const isHash = href?.startsWith('#');
            if (isHash) {
              return (
                <a
                  href={href}
                  onClick={(e) => {
                    e.preventDefault();
                    const linkHref = href || '';
                    const rawHash = linkHref.slice(1);
                    const decoded = decodeURIComponent(rawHash).toLowerCase().trim();

                    // 1. Tenta correspondência exata
                    let el = document.getElementById(rawHash) || document.getElementById(decoded);

                    // 2. Tenta normalizar hifens múltiplos (-- para -)
                    if (!el) {
                      const singleHyphen = decoded.replace(/-+/g, '-');
                      el = document.getElementById(singleHyphen);
                    }

                    // 3. Fallback: busca por cabeçalho pelo texto
                    if (!el) {
                      const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
                      const cleanTarget = decoded.replace(/[^a-z0-9]/gi, '');
                      el = (headings.find((h) => {
                        const cleanH = (h.textContent || '').toLowerCase().replace(/[^a-z0-9]/gi, '');
                        return cleanH.includes(cleanTarget) || cleanTarget.includes(cleanH);
                      }) as HTMLElement) || null;
                    }

                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      if (typeof window !== 'undefined' && linkHref) {
                        window.history.pushState(null, '', linkHref);
                      }
                    }
                  }}
                  className="text-[#0056B3] hover:text-[#0B3B60] underline underline-offset-2 font-medium transition-colors cursor-pointer"
                >
                  {children}
                </a>
              );
            }

            return (
              <a
                href={href}
                target={href?.startsWith('http') ? '_blank' : undefined}
                rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="text-[#0056B3] hover:text-[#0B3B60] underline underline-offset-2 font-medium transition-colors"
              >
                {children}
              </a>
            );
          },
          table: ({ children }) => (
            <div className="overflow-x-auto my-6 border border-slate-200 rounded-lg">
              <table className="w-full border-collapse text-sm">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-slate-100 border-b border-slate-200 text-slate-800 font-semibold">
              {children}
            </thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-slate-200 bg-white">
              {children}
            </tbody>
          ),
          tr: ({ children }) => (
            <tr className="hover:bg-slate-50 transition-colors">
              {children}
            </tr>
          ),
          th: ({ children }) => (
            <th className="px-4 py-2.5 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-2.5 text-slate-800 text-sm">
              {children}
            </td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
