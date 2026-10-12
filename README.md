# Portal UEMG Carangola
## Publicações Acadêmicas & Canal Direto com a Direção

Plataforma institucional web da **Universidade do Estado de Minas Gerais (UEMG) — Unidade Acadêmica de Carangola**, unificando a disseminação da produção científica, cultural e pedagógica dos seus 8 cursos de graduação ao canal direto de diálogo participativo e governança com o Gabinete da Direção Geral ("Fale com a Direção").

---

## 🌟 Pilares Estratégicos do Sistema

1. **Disseminação do Conhecimento & Memória Científica:**
   * Vitrine editorial indexada com destaque automatizado, páginas dedicadas aos 8 cursos de graduação e leitor de artigos em Markdown.
   * Citação padronizada no formato ABNT com cópia em 1 clique.
   * Geração e download de separatas oficiais em PDF compiladas diretamente na memória RAM do navegador (**Regra Zero-Storage de PDFs**).
   * Esteira de submissão autoral com pipeline de compressão WebP no cliente (máx. 1200px, ~100 KB via OffscreenCanvas) e persistência de rascunhos voláteis.

2. **Governança Participativa & Ouvidoria Zero-Trust:**
   * Canal direto de manifestações públicas e anônimas ao Gabinete da Direção.
   * **Criptografia de Envelope Client-Side:** Chave de criptografia de dados (DEK AES-GCM 256) envelopada pela chave pública do Gabinete (KEK RSA-OAEP 4096-bit) antes de sair do navegador.
   * **Defesa Anti-Enumeração:** Acompanhamento condicionado à posse estrita da tupla *Protocolo Institucional + Token Secreto (NanoID de 24 caracteres)* com retardo artificial de 400ms contra timing attacks.
   * **Desacoplamento Físico:** Mensagens privadas residem em `protocolos_internos`; deliberações homologadas em texto claro residem isoladamente no `mural_publico`.

3. **Continuidade Institucional & Soberania Digital:**
   * **Partição Criptográfica de Shamir (2-de-3):** A chave mestre do acervo é fragmentada matematicamente entre Diretor Geral, Secretaria Geral/Vice-Direção e Congregação da Unidade, prevenindo orfandade técnica nas trocas de gestão.
   * **Operação em Custo Zero Absoluto:** Infraestrutura sustentável no Supabase Free Tier e Vercel, ancorada institucionalmente como Projeto de Extensão Contínuo do curso de **Sistemas de Informação**.
   * **Prevenção de Pausa por Inatividade:** Tabela transacional `keepalive` atualizada periodicamente via GitHub Actions, garantindo que o banco de dados nunca entre em dormência no plano gratuito.

4. **Higiene e Segurança em Terminais Compartilhados:**
   * Proteção nativa para alunos em computadores de laboratórios da universidade através do modo "Computador Público", cabeçalho `Clear-Site-Data` no logout e expurgo de credenciais da memória volátil.

---

## 📊 Status do Projeto & Métricas de Homologação

* **Versão Consolidada:** `3.0.0` (Go-Live & Homologação Integral)
* **Build de Produção (SSG):** ✅ **38 rotas estáticas compiladas com 100% de sucesso**
* **First Load JS:** Otimizado em 87.3 kB (chunks compartilhados)
* **Acessibilidade:** Auditada segundo as normas **WCAG 2.1 nível AA / AAA** e **eMAG** (contraste mínimo superior a 4.5:1, navegação por teclado e leitor de tela com Skip Links)
* **Segurança de Schema:** **100% Row Level Security (RLS)** ativo em todas as tabelas, RPC `consultar_protocolo_seguro` blindada com `SET search_path = public, pg_temp;` e políticas de escrita com validação estrita de dados

---

## 🏛️ Cursos Contemplados (UEMG Carangola)

O portal abriga e categoriza a produção científica dos 8 cursos de graduação da Unidade:

| Sigla | Curso de Graduação | Grau | Área do Conhecimento |
|:---:|:---|:---:|:---|
| **BIO** | Ciências Biológicas | Licenciatura | Ciências Biológicas & Biodiversidade |
| **GEO** | Geografia | Licenciatura | Ciências Humanas & Geociências |
| **HIS** | História | Licenciatura | Ciências Humanas & Memória Regional |
| **LET** | Letras (Português/Inglês) | Licenciatura | Linguística, Letras e Artes |
| **MAT** | Matemática | Licenciatura | Ciências Exatas e da Terra |
| **PED** | Pedagogia | Licenciatura | Ciências Humanas & Educação |
| **SSO** | Serviço Social | Bacharelado | Ciências Sociais Aplicadas & Políticas Públicas |
| **SIN** | Sistemas de Informação | Bacharelado | Ciências Exatas & Engenharia de Software |

---

## 🛠️ Stack Tecnológica Homologada

* **Framework:** [Next.js 14+](https://nextjs.org/) (App Router, Server Components e Client Boundaries estritos)
* **Linguagem:** [TypeScript 5+](https://www.typescriptlang.org/) (Strict Mode ativado, `noImplicitAny: true`)
* **Estilização:** [Tailwind CSS v3.4](https://tailwindcss.com/) com tokens institucionais da UEMG (`#002244`, `#0B3B60`, `#0056B3`) e Governo de Minas Gerais
* **Banco de Dados & Auth:** [Supabase](https://supabase.com/) (PostgreSQL 15+, Data API PostgREST, RLS em todas as tabelas)
* **Criptografia:** [Web Crypto API nativa](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API) (SubtleCrypto: AES-GCM 256, RSA-OAEP 4096, SHA-256) e algoritmo matemático de Shamir
* **PWA & Notificações:** Service Worker nativo com cache seletivo, manifesto e Web Push VAPID opcional
* **Ícones:** [Lucide React](https://lucide.dev/)
* **Geração de PDF:** Geração declarativa HTML5/CSS em RAM com impressão nativa do navegador
* **Validação:** [Zod v3](https://zod.dev/)

---

## 📁 Estrutura do Repositório

```text
portal-uemg-carangola/
├── docs/
│   └── manuais/                # Manuais de Operação e Governança por perfil
│       ├── MANUAL_ESTUDANTE.md    # Manual do aluno (busca, leitura, emissão de PDF e ouvidoria)
│       ├── MANUAL_DOCENTE.md      # Manual do professor (submissão, compressão WebP, citação ABNT)
│       ├── MANUAL_COORDENADOR.md  # Manual do coordenador (esteira monocrática do curso)
│       └── MANUAL_MONITOR.md      # Manual do monitor de SI (DevOps, RLS, Zero-Trust e cerimônia KEK)
├── public/
│   ├── favicon.ico             # Favicon legado de alta resolução
│   ├── manifest.json           # Manifesto PWA com badges institucionais
│   ├── sw.js                   # Service Worker para suporte offline e Web Push
│   ├── icons/                  # Ícones PWA (192px e 512px)
│   └── images/                 # Assets oficiais (Logotipo UEMG, fachada da unidade)
├── src/
│   ├── app/                    # Rotas do Next.js App Router
│   │   ├── (public)/           # Vitrine aberta: Home, /artigos, /cursos
│   │   ├── artigos/            # Catálogo geral e páginas individuais de artigos
│   │   ├── cursos/             # Catálogo de cursos e vitrines individuais por colegiado
│   │   ├── fale-com-a-direcao/ # Canal de ouvidoria, consulta por protocolo e confirmação
│   │   ├── mural-de-transparencia/ # Mural público de despachos e resoluções homologadas
│   │   ├── meus-artigos/       # Área autoral e esteira de submissão de novos artigos
│   │   ├── restrito/           # Painéis administrativos: fila do Gabinete, coordenações e chaves
│   │   ├── api/auth/logout/    # Endpoint com cabeçalho Clear-Site-Data para computadores públicos
│   │   ├── globals.css         # Variáveis e design system UEMG
│   │   ├── icon.jpg            # Favicon dinâmico nativo do App Router
│   │   ├── layout.tsx          # RootLayout com metadados SEO, PWA e acessibilidade
│   │   ├── page.tsx            # Landing Page com fachada arquitetônica e destaque
│   │   ├── robots.ts           # Diretivas de rastreamento com proteção de rotas restritas
│   │   └── sitemap.ts          # Sitemap dinâmico indexando 100% dos artigos e cursos
│   ├── components/             # Componentes modulares reutilizáveis
│   │   ├── editorial/          # FeaturedArticle, ArticleCard, ArticleFilters, SubmissionForm, PdfDownloadButton
│   │   ├── ouvidoria/          # OuvidoriaForm, ConsultaProtocoloForm, GabineteDespachoModal, MuralCatalog
│   │   ├── seguranca/          # CerimoniaChavesModal (Shamir SSS), PushNotificationToggle
│   │   └── ui/                 # Header institucional com logotipo ampliado, Footer e SkipLink
│   ├── lib/
│   │   ├── crypto/             # Envelope encryption (AES/RSA) e Shamir's Secret Sharing
│   │   ├── data/               # Carga acadêmica representativa dos 8 cursos e ouvidoria
│   │   ├── notifications/      # Cliente Web Push e registro de service worker
│   │   ├── storage/            # Compressão de imagens WebP e rascunhos de sessão
│   │   ├── supabase/           # Clientes Data API SSR para navegador e servidor
│   │   └── utils/              # Validações Zod e formatadores
│   └── types/                  # Tipagem estrita TypeScript (editorial, ouvidoria, cerimônia)
└── supabase/
    └── migrations/             # Migrações declarativas SQL com auditoria de segurança
        ├── 20261008000000_init_schema.sql                # Schema base com 100% RLS
        ├── 20261012000000_keepalive.sql                  # Tabela transacional para prevenção de pausa
        ├── 20261012000001_security_advisor_remediation.sql # Hardening do Supabase Security Advisor
        └── 20261012000002_drop_doi_column.sql            # Remoção da coluna DOI
```

---

## 🚀 Como Executar Localmente

### Pré-requisitos
* Node.js v20 LTS ou superior
* Gerenciador de pacotes `npm`

### 1. Clonar o repositório e instalar dependências
```bash
git clone https://github.com/niltonfjunior2/portal-uemg-carangola.git
cd portal-uemg-carangola
npm install
```

### 2. Configurar variáveis de ambiente
Copie o arquivo de exemplo e configure suas credenciais:
```bash
cp .env.example .env.local
```
Variáveis mínimas necessárias:
```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima-publica
```

### 3. Executar o servidor de desenvolvimento
```bash
npm run dev
```
Acesse a aplicação no navegador em [http://localhost:3000](http://localhost:3000).

### 4. Compilar para produção e auditar o build
```bash
npm run build
npm run start
```

---

## 📜 Licença e Governança Pública

Desenvolvido sob os princípios de software público, transparência ativa e proteção rigorosa à privacidade dos cidadãos e da comunidade acadêmica:
* **LGPD** — Lei Geral de Proteção de Dados Pessoais (Lei 13.709/2018)
* **LAI** — Lei de Acesso à Informação (Lei 12.527/2011)
* **Lei de Arquivos Públicos** (Lei 8.159/1991)
* **Marco Civil da Internet** (Lei 12.965/2014)

**Universidade do Estado de Minas Gerais (UEMG) — Unidade Acadêmica de Carangola**  
Praça dos Estudantes, 23 — Centro, Carangola - MG, CEP: 36800-000
