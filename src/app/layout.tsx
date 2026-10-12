import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Header } from '@/components/ui/Header';
import { Footer } from '@/components/ui/Footer';
import { SkipLink } from '@/components/ui/SkipLink';
import { AuthProvider } from '@/context/AuthContext';

export const metadata: Metadata = {
  metadataBase: new URL('https://carangola.uemg.br'),
  title: {
    default: 'Portal UEMG Carangola — Publicações Acadêmicas & Canal da Direção',
    template: '%s | UEMG Carangola',
  },
  description:
    'Portal oficial de divulgação científica, cultural e canal de governança participativa da Universidade do Estado de Minas Gerais — Unidade Carangola.',
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/images/logo_uemg_2.jpg' },
      { url: '/favicon.ico' },
    ],
    shortcut: '/images/logo_uemg_2.jpg',
    apple: '/images/logo_uemg_2.jpg',
  },
  openGraph: {
    title: 'Portal UEMG Carangola',
    description:
      'Publicações acadêmicas dos 8 cursos de graduação e canal direto de governança e ouvidoria com o Gabinete da Direção.',
    url: 'https://carangola.uemg.br',
    siteName: 'Universidade do Estado de Minas Gerais - Unidade Carangola',
    locale: 'pt_BR',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#0B3B60',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="h-full" suppressHydrationWarning>
      <body className="flex flex-col min-h-full" suppressHydrationWarning>
        <AuthProvider>
          {/* Acessibilidade: Atalho de salto para teclado e leitores de tela */}
          <SkipLink />

          {/* Cabeçalho Institucional */}
          <Header />

          {/* Conteúdo Principal da Aplicação */}
          <main id="conteudo-principal" className="flex-1 w-full" tabIndex={-1}>
            {children}
          </main>

          {/* Rodapé Institucional */}
          <Footer />
        </AuthProvider>

        {/* Registro do Service Worker para PWA */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(
                    function(reg) {
                      // Service Worker registrado com sucesso
                    },
                    function(err) {
                      // Falha silenciosa de registro
                    }
                  );
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
