# Portal UEMG Carangola
## Publicações Acadêmicas & Canal Direto com a Direção

Plataforma institucional web da **Universidade do Estado de Minas Gerais (UEMG) — Unidade Acadêmica de Carangola**, unificando a disseminação da produção científica e cultural dos seus 8 cursos de graduação ao canal direto de diálogo participativo com a Direção Geral ("Fale com a Direção").

---

## 🌟 Pilares Estratégicos do Sistema

1. **Disseminação do Conhecimento:** Vitrine editorial indexada com destaque automatizado, páginas dedicadas por curso, busca em tempo real com debounce, citações no padrão ABNT e geração de PDFs oficiais na memória do navegador (**Regra Zero-Storage de PDFs**).
2. **Governança & Diálogo Participativo:** Canal direto de ouvidoria com opção anônima ou identificada, dupla chave de segurança (Protocolo + Token Secreto NanoID), Criptografia de Envelope no cliente (Zero-Trust) e mural público de resoluções homologadas.
3. **Sustentabilidade em Custo Zero:** Arquitetura 100% gratuita baseada em Next.js 14, Supabase (Free Tier) e PWA instalável, ancorada institucionalmente como Projeto de Extensão Contínuo do curso de **Sistemas de Informação**.
4. **Higiene em Terminais Compartilhados:** Proteção nativa contra vazamento de sessões em computadores públicos de laboratórios da UEMG via cabeçalho `Clear-Site-Data` e expurgo de dados voláteis em memória RAM.

---

## 📊 Status do Projeto

* **Versão Atual:** `2.2.0` (Fases 1 e 2 Concluídas & Homologadas)
* **Build de Produção:** ✅ Aprovado com 21 rotas estáticas (SSG) geradas com sucesso
* **Próxima Etapa:** **Fase 3** (Esteira Editorial Monocrática & Submissão Autoral)

---

## 🛠️ Stack Tecnológica Homologada

* **Runtime:** Node.js 20 LTS / Next.js 14+ (App Router)
* **Linguagem:** TypeScript 5+ (Strict Mode ativado)
* **Estilização:** Tailwind CSS v3.4 com tokens oficiais UEMG / Governo de Minas Gerais
* **Banco de Dados & Autenticação:** Supabase (PostgreSQL 15+, 100% Row Level Security)
* **Criptografia:** Web Crypto API nativa do navegador (AES-GCM 256 + RSA-OAEP 4096-bit)
* **PWA & Notificações:** Service Worker com cache seletivo e Web Push nativo via VAPID
* **Acessibilidade:** Padrão eMAG e WCAG 2.1 nível AA com contrastes auditados (4.5:1)

---

## 🚀 Como Executar Localmente

### Pré-requisitos
* Node.js v20+ ou v24+
* Gerenciador de pacotes `npm`

### 1. Clonar o repositório e instalar dependências
```bash
git clone https://github.com/niltonfjunior2/portal-uemg-carangola.git
cd portal-uemg-carangola
npm install
```

### 2. Configurar variáveis de ambiente
Copie o arquivo de exemplo e preencha com as credenciais do seu projeto Supabase:
```bash
cp .env.example .env.local
```

### 3. Executar o servidor de desenvolvimento
```bash
npm run dev
```
Acesse a aplicação em [http://localhost:3000](http://localhost:3000).

### 4. Compilar para produção (Build Check)
```bash
npm run build
npm run start
```

---

## 📁 Estrutura do Repositório

```text
portal-uemg-carangola/
├── .ai-context/                # Documentação governativa soberana da IA
│   ├── PROJECT_DNA.md          # Fonte soberana da verdade e restrições invioláveis
│   ├── PRODUCT_BACKLOG.md      # Épicos, User Stories e status de homologação
│   ├── IMPLEMENTATION_PLAN.md  # Cronograma de Sprints e marcos de refatoração
│   ├── AI_EXECUTION_GUIDE.md   # Manual de estilo e regras de segurança para IAs
│   ├── ROADMAP.md              # Linha do tempo de entregáveis
│   └── LESSONS_LEARNED.md      # Registro contínuo de decisões e lições técnicas
├── docs/
│   └── manuais/                # Manuais do Usuário com menus dinâmicos por perfil
│       ├── MANUAL_ESTUDANTE.md    # Manual do aluno (pesquisa, PDF, submissão)
│       ├── MANUAL_DOCENTE.md      # Manual do professor (extensão, separatas)
│       ├── MANUAL_COORDENADOR.md  # Manual do coordenador (esteira monocrática)
│       └── MANUAL_MONITOR.md      # Manual do monitor de SI (DevOps, Zero-Trust)
├── public/                     # Manifesto PWA, ícones e Service Worker
│   ├── manifest.json
│   ├── sw.js
│   └── icons/
├── src/
│   ├── app/                    # Rotas do Next.js App Router (Páginas e APIs)
│   │   ├── (public)/           # Rotas abertas: Home, /artigos, /cursos
│   │   ├── api/auth/logout/    # Endpoint com cabeçalho Clear-Site-Data
│   │   ├── globals.css         # Tokens de acessibilidade eMAG e UEMG
│   │   └── layout.tsx          # RootLayout institucional com PWA
│   ├── components/             # Componentes modulares
│   │   ├── ui/                 # Header, Footer, SkipLink
│   │   └── editorial/          # FeaturedArticle, ArticleCard, PdfDownloadButton
│   ├── lib/
│   │   ├── data/               # Sementes e mocks representativos dos 8 cursos
│   │   └── supabase/           # Clientes SSR para client e server
│   └── types/                  # Tipagem estrita TypeScript (editorial, RBAC)
└── supabase/
    └── migrations/             # Migrações SQL declarativas com 100% RLS
```

---

## 🏛️ Cursos Contemplados (UEMG Carangola)

1. **BIO:** Licenciatura em Ciências Biológicas
2. **GEO:** Licenciatura em Geografia
3. **HIS:** Licenciatura em História
4. **LET:** Licenciatura em Letras (Português/Inglês)
5. **MAT:** Licenciatura em Matemática
6. **PED:** Licenciatura em Pedagogia
7. **SSO:** Bacharelado em Serviço Social
8. **SIN:** Bacharelado em Sistemas de Informação

---

## 📜 Licença e Governança

Desenvolvido sob os princípios do software público, transparência ativa e proteção à privacidade (**LGPD — Lei 13.709/2018** e **LAI — Lei 12.527/2011**).  
Universidade do Estado de Minas Gerais — Unidade Carangola.
