# MANUAL DO USUÁRIO: MONITOR / ESTAGIÁRIO DE TI
## Portal UEMG Carangola — Sustentação, Engenharia de Software e Governança

> **Versão:** 3.0.0 (Go-Live Oficial & Implantação Institucional) | **Perfil:** Monitor / Bolsista de Sistemas de Informação  
> **Papel no Sistema:** Desenvolvedor de Sustentação / DevOps Acadêmico  

---

## 📑 MENU DINÂMICO DE NAVEGAÇÃO

* [1. Visão Geral do Perfil e Atribuições](#1-visão-geral-do-perfil-e-atribuições)
* [2. Arquitetura da Ouvidoria Zero-Trust & Desacoplamento Físico (DNA #3)](#2-arquitetura-da-ouvidoria-zero-trust--desacoplamento-físico-dna-3)
* [3. Cerimônia de Custódia Compartilhada (Shamir 2-de-3 em GF(2^8))](#3-cerimônia-de-custódia-compartilhada-shamir-2-de-3-em-gf28)
* [4. Notificações Nativas Web Push (VAPID) e Isolamento de Laboratório](#4-notificações-nativas-web-push-vapid-e-isolamento-de-laboratório)
* [5. O Painel do Gabinete da Direção (`/restrito/ouvidoria`)](#5-o-painel-do-gabinete-da-direção-restritoouvidoria)
* [6. Higienização no Navegador e Publicação no Mural (`/mural-de-transparencia`)](#6-higienização-no-navegador-e-publicação-no-mural-mural-de-transparencia)
* [7. Proteção Anti-Enumeração e Timing Attacks](#7-proteção-anti-enumeração-e-timing-attacks)
* [8. Comprovantes Portáteis em PDF na Memória RAM (Zero-Storage)](#8-comprovantes-portáteis-em-pdf-na-memória-ram-zero-storage)
* [9. Pipeline de Compressão WebP Client-Side (`image-compression.ts`)](#9-pipeline-de-compressão-webp-client-side-image-compressionts)
* [10. Políticas de Isolamento no Service Worker (`public/sw.js`)](#10-políticas-de-isolamento-no-service-worker-publicswjs)
* [11. Governança de Banco de Dados com Row Level Security (RLS)](#11-governança-de-banco-de-dados-com-row-level-security-rls)
* [12. Resultados e Metodologia da Auditoria Arquitetural II (Marco 2)](#12-resultados-e-metodologia-da-auditoria-arquitetural-ii-marco-2)
* [13. Procedimento de Build e Auditoria Contínua](#13-procedimento-de-build-e-auditoria-contínua)
* [14. Arquitetura Go-Live v3.0.0, SEO Soberano e Sustentação Acadêmica](#14-arquitetura-go-live-v300-seo-soberano-e-sustentação-acadêmica)

---

## 1. Visão Geral do Perfil e Atribuições
O Monitor de TI é um estudante do curso de **Sistemas de Informação da UEMG Carangola**, integrado ao Projeto de Extensão Contínuo. Suas funções incluem manutenção do código, auditoria de segurança, verificação do build e garantia de que o projeto permaneça rigorosamente em **Custo Zero** e sob o princípio **Zero-Trust**.

## 2. Arquitetura da Ouvidoria Zero-Trust & Desacoplamento Físico (DNA #3)
* **Rotas de Ouvidoria e Transparência:**
  - `/fale-com-a-direcao`: Envio seguro de manifestações com opção anônima.
  - `/fale-com-a-direcao/sucesso`: Entrega do protocolo e chave secreta, com download de comprovante oficial.
  - `/fale-com-a-direcao/consulta`: Consulta cega por dupla chave com resposta do Diretor.
  - `/restrito/ouvidoria`: Painel administrativo do Gabinete para decodificação em RAM e emissão de despachos.
  - `/mural-de-transparencia`: Mural público de manifestações sanitizadas e portarias.
* **Inviolabilidade do DNA #3:**
  - A tabela `mural_publico` é **fisicamente desacoplada** de `protocolos_internos`.
  - **Proibição expressa de Foreign Keys (FK):** Um ataque ou vazamento de leitura na tabela pública jamais consegue fazer JOIN ou referenciar a tabela cifrada interna.

## 3. Cerimônia de Custódia Compartilhada (Shamir 2-de-3 em GF(2^8))
* **Localização do Módulo:** [`src/lib/crypto/shamir-secret-sharing.ts`](file:///c:/Users/Nilton/Workspaces/AG_Workspace/portal-uemg-carangola/src/lib/crypto/shamir-secret-sharing.ts) e rota [`/restrito/cerimonia-chaves`](file:///c:/Users/Nilton/Workspaces/AG_Workspace/portal-uemg-carangola/src/app/restrito/cerimonia-chaves/page.tsx).
* **Teoria Matemática:**
  - Opera sobre o corpo finito de Galois $GF(2^8)$ com o polinômio irredutível $0x11D$ ($x^8+x^4+x^3+x+1$), com tabelas exponenciais e logarítmicas pré-computadas.
  - Polinômio aleatório de grau $k-1 = 1$ ($f(x) = S \oplus a_1 \cdot x$).
  - 3 custodiantes oficiais: Direção ($x=1$), Vice-Direção ($x=2$) e Secretaria Acadêmica ($x=3$).
  - **Reconstituição:** Interpolação de Lagrange em $x=0$ requer estritamente 2 fragmentos quaisquer:
    $$L_1(0) = \frac{x_2}{x_1 \oplus x_2}, \quad L_2(0) = \frac{x_1}{x_1 \oplus x_2}$$
  - **Segurança da Teoria da Informação:** 1 fragmento isolado não diminui a entropia da chave em 1 único bit.

## 4. Notificações Nativas Web Push (VAPID) e Isolamento de Laboratório
* **Localização:** [`src/lib/notifications/web-push-client.ts`](file:///c:/Users/Nilton/Workspaces/AG_Workspace/portal-uemg-carangola/src/lib/notifications/web-push-client.ts) e [`PushNotificationToggle.tsx`](file:///c:/Users/Nilton/Workspaces/AG_Workspace/portal-uemg-carangola/src/components/seguranca/PushNotificationToggle.tsx).
* **Hard Box DNA #7:** Quando a flag de "Computador Público" está ativa, a solicitação de permissão no navegador é bloqueada com retorno `bloqueado_terminal_publico` e credenciais voláteis são expurgadas ao fechar a aba.

## 5. O Painel do Gabinete da Direção (`/restrito/ouvidoria`)
* Exclusivo para o Diretor Geral e assessoria especial.
* Cards de métricas em tempo real: Total, Pendentes, Em Análise, Respondidos e Homologados.
* Filtros integrados por status de tramitação e curso de origem.
* Acionador de modal para emissão de despacho oficial e número de portaria.

## 6. Higienização no Navegador e Publicação no Mural (`/mural-de-transparencia`)
* Para homologação pública, a função `aplicarDespachoDirecao` com a ação `homologar_mural` exige o preenchimento de um **Resumo Sanitizado**.
* O texto sanitizado é higienizado no navegador, removendo dados identificáveis (PII) em estrita observância à Lei nº 12.527/2011 (LAI) e Lei nº 13.709/2018 (LGPD).

## 7. Proteção Anti-Enumeração e Timing Attacks
* **Protocolos Visuais:** Formatados como `#CAR-2026-XXXX`.
* **Chave Secreta:** Gerada via `crypto.getRandomValues` com **24 caracteres de alta entropia**.
* **Hash SHA-256:** O banco armazena apenas o hash `SHA-256(token_secreto)`.
* **Resposta Cega:** Qualquer tentativa de consulta com protocolo ou token incorreto retorna invariavelmente `404 Not Found` padronizado com tempo de resposta normalizado (`setTimeout 400ms`), impedindo scraping ou inferência estatística.

## 8. Comprovantes Portáteis em PDF na Memória RAM (Zero-Storage)
* **Regra Inviolável do DNA:** O sistema **nunca** armazena arquivos `.pdf` no Supabase Storage.
* O componente [`ReceiptDownloadButton.tsx`](file:///c:/Users/Nilton/Workspaces/AG_Workspace/portal-uemg-carangola/src/components/ouvidoria/ReceiptDownloadButton.tsx) gera o comprovante oficial na memória RAM e dispara a impressão nativa.

## 9. Pipeline de Compressão WebP Client-Side (`image-compression.ts`)
* A função `comprimirImagemParaWebp` utiliza a API do `HTMLCanvasElement` no navegador: redimensionamento máx. 1200px, WebP 80% qualidade, remoção de metadados EXIF e peso final ~100 KB.

## 10. Políticas de Isolamento no Service Worker (`public/sw.js`)
* Todas as rotas autenticadas, de gestão e de ouvidoria (`/restrito/*`, `/meus-artigos/*`, `/fale-com-a-direcao/sucesso`, `/fale-com-a-direcao/consulta`, `/api/*`) aplicam estritamente a política **Network-Only** (proibido cache em disco).
* Rotas públicas como `/mural-de-transparencia`, `/artigos` e `/cursos` aproveitam **Stale-While-Revalidate** para navegação offline fluida.

## 11. Governança de Banco de Dados com Row Level Security (RLS)
* A tabela `protocolos_internos` possui política de leitura pública estritamente desabilitada. Acesso de leitura direta é restrito à role `direcao` autenticada.
* A tabela `mural_publico` possui política pública de leitura (RLS ativa `SELECT true WHERE is_active = true`), sem vínculos estruturais com a tabela cifrada.

## 12. Resultados e Metodologia da Auditoria Arquitetural II (Marco 2)
* O laudo completo [`.ai-context/specs/AUDITORIA_ARQUITETURAL_II.md`](file:///c:/Users/Nilton/Workspaces/AG_Workspace/portal-uemg-carangola/.ai-context/specs/AUDITORIA_ARQUITETURAL_II.md) documenta:
  - Pentest simulado de enumeração atestando probabilidade $< 10^{-35}$ de adivinhação;
  - Refatoração DRY consolidada com [`OuvidoriaBadge.tsx`](file:///c:/Users/Nilton/Workspaces/AG_Workspace/portal-uemg-carangola/src/components/ouvidoria/OuvidoriaBadge.tsx);
  - Auditoria de acessibilidade WCAG 2.1 AA com contraste $\ge 4.5:1$ em todos os componentes.

## 13. Procedimento de Build e Auditoria Contínua
Para homologar qualquer modificação em desenvolvimento:
1. `npm run lint` — Deve retornar `No ESLint warnings or errors`.
2. `npm run build` — Deve compilar com sucesso todas as **37 rotas estáticas SSG e rotas dinâmicas**, incluindo sitemap e robots.

## 14. Arquitetura Go-Live v3.0.0, SEO Soberano e Sustentação Acadêmica
* **Sitemap Dinâmico (`src/app/sitemap.ts`):**
  - Mapeia automaticamente todas as páginas institucionais, páginas dos 8 cursos e artigos científicos publicados com prioridades balanceadas e frequência de atualização semântica.
* **Diretivas Robots (`src/app/robots.ts`):**
  - Permite a indexação de todo o acervo público e catálogo discente, enquanto proíbe expressamente crawlers nas rotas administrativas e de API (`/restrito/`, `/api/`, `/meus-artigos/`, `/fale-com-a-direcao/sucesso`), resguardando dados sensíveis e poupando banda da infraestrutura acadêmica.
* **Metadados Canônicos (`src/app/layout.tsx`):**
  - Define `metadataBase` (`https://carangola.uemg.br`), OpenGraph e Twitter Cards soberanos para visualização em redes sociais e indexação no Google Acadêmico.
* **Carga Inicial Homologada:**
  - Base inicial com artigos científicos representativos de 100% dos 8 cursos de graduação da UEMG Unidade Carangola (`mock-articles.ts`).
* **Sustentação pelos Bolsistas de SI:**
  - O portal não possui custos mensais de servidores e não expõe credenciais de banco. A manutenção se restringe a deploys estáticos no Vercel/Netlify/GitHub Pages com Supabase Free Tier, assegurando perpetuidade e autonomia ao campus.

