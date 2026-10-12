'use client';

import { useState, useEffect } from 'react';
import { Download, CheckCircle, Smartphone, Monitor, X, Share } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export function InstallPwaButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    // Verifica se já está rodando em modo aplicativo standalone
    if (
      typeof window !== 'undefined' &&
      (window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as unknown as { standalone?: boolean }).standalone === true)
    ) {
      setIsInstalled(true);
    }

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      setToastMessage('Portal instalado com sucesso em seu dispositivo!');
      setTimeout(() => setToastMessage(null), 4000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice.outcome === 'accepted') {
          setDeferredPrompt(null);
          setIsInstalled(true);
        }
      } catch (err) {
        console.error('Erro ao acionar prompt de instalação PWA:', err);
      }
    } else if (isInstalled) {
      setToastMessage('O Portal UEMG Carangola já está instalado em seu dispositivo!');
      setTimeout(() => setToastMessage(null), 4000);
    } else {
      // Caso o navegador não emita o evento automático (Safari iOS, Desktop sem evento prévio, etc.)
      setShowInstructions(true);
    }
  };

  return (
    <>
      <button
        type="button"
        id="btn-instalar-pwa"
        onClick={handleInstallClick}
        aria-label="Instalar aplicativo Portal UEMG Carangola no dispositivo"
        className="inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-lg bg-white text-[#0B3B60] font-bold text-sm shadow-md hover:bg-slate-100 transition-all hover:scale-[1.02] active:scale-[0.98] border border-white/40 cursor-pointer"
      >
        {isInstalled ? (
          <>
            <CheckCircle className="w-4 h-4 text-emerald-600" aria-hidden="true" />
            <span>Aplicativo Instalado</span>
          </>
        ) : (
          <>
            <Download className="w-4 h-4 text-[#0B3B60]" aria-hidden="true" />
            <span>Instalar Agora</span>
          </>
        )}
      </button>

      {/* Toast informativo rápido */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 bg-[#0B3B60] text-white px-4 py-3 rounded-xl shadow-xl border border-blue-400/30 flex items-center gap-3 animate-fade-in text-sm"
        >
          <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" aria-hidden="true" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Modal de Instruções de Instalação (para iOS, Safari ou navegadores manuais) */}
      {showInstructions && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-pwa-title"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setShowInstructions(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowInstructions(false)}
              aria-label="Fechar janela"
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0056B3] flex items-center justify-center">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h3 id="modal-pwa-title" className="text-base font-bold text-[#0B3B60]">
                  Como instalar no seu dispositivo
                </h3>
                <p className="text-xs text-slate-500">
                  Acesso rápido, offline e sem ocupar memória de loja
                </p>
              </div>
            </div>

            <div className="space-y-3.5 text-xs text-slate-700">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
                <Smartphone className="w-5 h-5 text-[#0056B3] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-900 mb-0.5">No iPhone ou iPad (Safari):</p>
                  <p className="leading-relaxed">
                    Toque no botão de <strong>Compartilhar</strong> (<Share className="w-3.5 h-3.5 inline mx-0.5" />) e selecione a opção <strong>&quot;Adicionar à Tela de Início&quot;</strong>.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
                <Smartphone className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-900 mb-0.5">No Android (Chrome / Edge / Samsung):</p>
                  <p className="leading-relaxed">
                    Toque no menu de três pontos (⋮) no canto superior e selecione <strong>&quot;Instalar aplicativo&quot;</strong> ou <strong>&quot;Adicionar à tela inicial&quot;</strong>.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
                <Monitor className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-900 mb-0.5">No Computador (Chrome / Edge):</p>
                  <p className="leading-relaxed">
                    Clique no ícone de <strong>instalação (+)</strong> na barra de endereços do navegador no canto superior direito.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setShowInstructions(false)}
                className="px-4 py-2 bg-[#0B3B60] hover:bg-[#0056B3] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
              >
                Entendi
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
