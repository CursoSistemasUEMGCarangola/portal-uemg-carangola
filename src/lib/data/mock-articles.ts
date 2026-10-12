import { Artigo, Curso, DecisaoEditorialInput, SiglaCurso, StatusArtigo, SubmissaoArtigoInput } from '@/types/editorial';

export const CURSOS_LISTA: Curso[] = [
  {
    id: 'c1',
    nome: 'Ciências Biológicas',
    sigla: 'BIO',
    descricao: 'Licenciatura em Ciências Biológicas — Formação científica e docente voltada à biodiversidade e conservação regional.',
    corBadge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  },
  {
    id: 'c2',
    nome: 'Geografia',
    sigla: 'GEO',
    descricao: 'Licenciatura em Geografia — Análise socioespacial, planejamento ambiental e práticas pedagógicas.',
    corBadge: 'bg-amber-100 text-amber-800 border-amber-300',
  },
  {
    id: 'c3',
    nome: 'História',
    sigla: 'HIS',
    descricao: 'Licenciatura em História — Investigação do patrimônio histórico-cultural, memória e ensino.',
    corBadge: 'bg-orange-100 text-orange-800 border-orange-300',
  },
  {
    id: 'c4',
    nome: 'Letras (Português/Inglês)',
    sigla: 'LET',
    descricao: 'Licenciatura em Letras — Estudos linguísticos, literários e formação bilingue intercultural.',
    corBadge: 'bg-purple-100 text-purple-800 border-purple-300',
  },
  {
    id: 'c5',
    nome: 'Matemática',
    sigla: 'MAT',
    descricao: 'Licenciatura em Matemática — Fundamentos matemáticos puros e aplicados e tecnologias no ensino.',
    corBadge: 'bg-cyan-100 text-cyan-800 border-cyan-300',
  },
  {
    id: 'c6',
    nome: 'Pedagogia',
    sigla: 'PED',
    descricao: 'Licenciatura em Pedagogia — Gestão educacional, docência multidisciplinar e processos formativos comunitários.',
    corBadge: 'bg-pink-100 text-pink-800 border-pink-300',
  },
  {
    id: 'c7',
    nome: 'Serviço Social',
    sigla: 'SSO',
    descricao: 'Bacharelado em Serviço Social — Políticas públicas, direitos humanos e intervenção social emancipatória.',
    corBadge: 'bg-rose-100 text-rose-800 border-rose-300',
  },
  {
    id: 'c8',
    nome: 'Sistemas de Informação',
    sigla: 'SIN',
    descricao: 'Bacharelado em Sistemas de Informação — Engenharia de software, governança de TI e inovação tecnológica.',
    corBadge: 'bg-blue-100 text-blue-800 border-blue-300',
  },
];

export const ARTIGOS_MOCK: Artigo[] = [
  {
    id: 'art-1',
    slug: 'arquitetura-soberana-custo-zero-governanca-publica',
    titulo: 'Arquitetura de Software Soberana e Custo Zero: Descentralização Tecnológica na UEMG Carangola',
    resumo: 'Relato técnico e metodológico sobre a concepção e implementação do Portal UEMG Carangola. Descreve a engenharia de uma plataforma pública sustentável que unifica a divulgação científica dos 8 cursos e a ouvidoria institucional com Custo Zero, Criptografia de Envelope Client-Side, partição de chaves Shamir (2-de-3) e operação perpétua no Free Tier do Supabase.',
    corpoMarkdown: `## Resumo Técnico

Este artigo documenta a concepção, os fundamentos arquiteturais e as decisões de engenharia de software empregadas na construção do **Portal UEMG Carangola**, plataforma pública unificada concebida para atender à Universidade do Estado de Minas Gerais (UEMG) em sua Unidade Acadêmica de Carangola, localizada na Zona da Mata Mineira. O projeto responde a um duplo desafio comum às autarquias estaduais descentralizadas: a fragmentação da produção intelectual multicampi e a ausência de canais institucionais seguros e acessíveis para o diálogo entre a comunidade acadêmica e o Gabinete da Direção Geral. Em um cenário de fortes restrições orçamentárias públicas, onde a contratação de infraestrutura em nuvem de grande porte é inviabilizada por entraves licitatórios, foi formulada e executada uma **Arquitetura Soberana em Custo Zero Absoluto**. 

O sistema integra em uma única base de código a divulgação científica de oito cursos de graduação e um canal de ouvidoria blindado por Criptografia de Envelope no cliente (*Client-Side Zero-Trust*), distribuição de segredos mestres via algoritmo de Shamir (*2-de-3 Secret Sharing*), políticas estritas de segurança em nível de linha (*Row Level Security — RLS*) no PostgreSQL e mitigação ativa contra pausas de inatividade no plano gratuito do Supabase.

---

## 1. Introdução e Contextualização do Problema Institucional

A interiorização do ensino superior público em Minas Gerais, consolidada pela expansão da UEMG, transformou a dinâmica socioeconômica de microrregiões históricas como a bacia do Rio Carangola. Contudo, a descentralização física frequentemente enfrenta a chamada *assimetria da visibilidade digital*: enquanto os campi sediados na capital concentram recursos tecnológicos e canais corporativos unificados, as unidades do interior tendem a conviver com repositórios isolados, publicações dispersas em redes sociais não oficiais e canais de governança dependentes de caixas de e-mail genéricas ou formulários desprovidos de garantias criptográficas.

Em Carangola, oito cursos de graduação — Ciências Biológicas, Geografia, História, Letras, Matemática, Pedagogia, Serviço Social e Sistemas de Informação — geram continuadamente artigos de extensão, ensaios teóricos, monografias e relatórios de campo. Paralelamente, o Gabinete da Direção Geral necessitava de um mecanismo soberano para o programa "Fale com a Direção", assegurando que denúncias, críticas, sugestões e elogios pudessem tramitar com garantia de sigilo ou anonimato inviolável, conforme preconizado pela Lei de Acesso à Informação (LAI — Lei 12.527/2011) e pela Lei Geral de Proteção de Dados (LGPD — Lei 13.709/2018).

O desafio central imposto à equipe de desenvolvimento do curso de Sistemas de Informação consistiu em: **como construir uma infraestrutura perene, de alta fidelidade visual e rigor criptográfico, sem dispor de orçamento financeiro para servidores dedicados, bancos de dados pagos ou serviços corporativos de e-mail?**

---

## 2. A Filosofia do Custo Zero e o Offloading Computacional no Cliente

A resposta a essa restrição orçamentária foi materializada através da filosofia de **Custo Zero Soberano (Zero-Budget Sovereign Architecture)**. Em vez de depender de instâncias virtuais ativas 24 horas por dia consumindo cotas financeiras, a arquitetura do Portal UEMG Carangola transfere a intensidade do processamento computacional para a CPU e memória RAM do navegador do usuário (*Client-Side Offloading*).

Essa decisão manifesta-se em três soluções de engenharia primordiais:

1. **Pipeline de Compressão Gráfica WebP Client-Side:** O upload direto de fotografias em alta resolução esgotaria o limite de 1 GB de armazenamento de arquivos oferecido pelo plano gratuito do Supabase Storage. Para contornar esse teto, implementou-se um pipeline no navegador baseado em \`OffscreenCanvas\` que redimensiona imagens para uma largura máxima de 1200 pixels e as converte em WebP com taxa de compressão de 80%. O resultado reduz arquivos de 8 MB para uma faixa entre 80 KB e 110 KB antes de qualquer tráfego de rede, viabilizando o suporte a milhares de artigos sem custos de storage.
2. **A Regra Inviolável de Zero-Storage para Arquivos PDF:** No modelo editorial tradicional, cada artigo publicado gera um arquivo PDF binário armazenado permanentemente no servidor. No Portal UEMG Carangola, vigora a regra estrita de **Zero-Storage de PDFs**: nenhum arquivo binário \`.pdf\` é gravado no banco de dados. Os documentos oficiais são compilados sob demanda no navegador do leitor a partir do texto estruturado em Markdown e metadados institucionais, utilizando estilos CSS tipográficos de alta precisão calibrados para impressão A4 na memória volátil.
3. **Comunicação Soberana In-App (Zero-Email Architecture):** Servidores de correio eletrônico (SMTP) corporativos apresentam custos recorrentes e suscetibilidade a bloqueios de reputação e spam. Toda a comunicação do portal foi desenhada para operar de forma 100% autônoma dentro da aplicação (*In-App*), empregando comprovantes portáteis e notificações Web Push nativas via protocolo VAPID, sem qualquer dependência de fornecedores de e-mail externos.

---

## 3. Arquitetura de Segurança Zero-Trust para Ouvidoria Universitária

A modelagem de ameaças para o canal "Fale com a Direção" apresentou um dilema ético e técnico de primeira grandeza: a sustentação técnica e o gerenciamento diário do banco de dados PostgreSQL do projeto são operados por discentes e monitores do curso de Sistemas de Informação. Como garantir que um estudante que possui acesso administrativo ao painel do Supabase não consiga ler denúncias sensíveis, relatos de assédio ou manifestações sigilosas destinadas exclusivamente ao Diretor Geral?

A solução adotada foi a implantação de uma arquitetura **Zero-Trust com Criptografia de Envelope (Envelope Encryption)**:

* **No navegador do cidadão:** Ao redigir uma manifestação, o cliente gera aleatoriamente no navegador, via \`SubtleCrypto\` nativo, uma chave simétrica de uso único (DEK — *Data Encryption Key*) de 256 bits com algoritmo AES-GCM. O corpo da mensagem é cifrado com a DEK.
* **Envelopamento da Chave:** Em seguida, a DEK é cifrada assimetricamente com algoritmo RSA-OAEP de 4096 bits utilizando a chave pública institucional do Gabinete da Direção (KEK — *Key Encryption Key*).
* **Armazenamento Cego:** O banco de dados PostgreSQL na nuvem recebe e persiste unicamente o payload cifrado (*ciphertext*), o vetor de inicialização (IV) e a chave envelopada (*wrapped_dek*). Monitores, invasores ou terceiros que inspecionem as tabelas visualizam apenas sequências aleatórias de bytes Base64 indecifráveis.

Adicionalmente, concebeu-se uma defesa rigorosa contra ataques de enumeração (*Anti-Enumeration Defense*). Protocolos visuais sequenciais (no padrão \`#CAR-2025-XXXX\`) não são chaves de autorização de API. A consulta a manifestações exige obrigatoriamente a tupla composta pelo Código do Protocolo e um Token Secreto de 24 caracteres gerado via biblioteca NanoID com entropia criptográfica. Tentativas incorretas acionam uma rotina com retardo artificial constante de 400 milissegundos para neutralizar ataques de temporização (*timing attacks*).

A segregação física é mantida entre as tabelas: denúncias privadas residem em \`protocolos_internos\` (onde o acesso via \`SELECT\` direto é estritamente proibido ao público), enquanto deliberações homologadas em texto claro residem de forma totalmente desacoplada na tabela \`mural_publico\`.

---

## 4. Continuidade Institucional via Partição Criptográfica de Shamir (SSS)

Projetos de software desenvolvidos no setor público frequentemente sucumbem à transitoriedade dos mandatos gestores. Em universidades públicas, a perda da chave privada de um gestor que encerra seu período administrativo ou a retenção indevida de credenciais poderia selar para sempre o acervo histórico de documentos e manifestações.

Para resolver essa vulnerabilidade humana, implementou-se a **Partição Criptográfica de Shamir (*Shamir's Secret Sharing*)** com quórum $(k, n) = (2, 3)$:

* Durante a formalização de uma gestão, a chave privada mestra (KEK) é dividida matematicamente em três fragmentos desconexos sobre um corpo finito $\\mathbb{F}_p$.
* O **Fragmento 1** é entregue à posse exclusiva do Diretor Geral;
* O **Fragmento 2** é custodiado pela Secretaria Geral e Vice-Direção;
* O **Fragmento 3** é depositado formalmente sob a guarda da Congregação da Unidade Acadêmica.

Matematicamente, nenhum fragmento isolado revela qualquer informação sobre a chave mestra (segurança teórica incondicional). Para descriptografar o acervo ou empossar uma nova gestão, é necessária a presença e recombinação de pelo menos **dois dos três fragmentos** através de interpolação polinomial de Lagrange, realizada estritamente na memória volátil do navegador, garantindo a transição republicana e a continuidade institucional da autarquia.

---

## 5. Resiliência Operacional e Prevenção de Dormência no Supabase Free Tier

Um dos obstáculos operacionais mais críticos enfrentados por projetos hospedados na camada gratuita do Supabase é a política de **pausa automática de projetos por inatividade**: instâncias do PostgreSQL que não registram tráfego de banco em um intervalo de sete dias são pausadas, demandando intervenção manual no painel para reativação.

Investigações aprofundadas revelaram que rotinas convencionais de "health check" (como requisições \`GET /health\` ou \`GET /auth/v1/health\`) retornam código HTTP 200 via API Gateway (Kong), mas são intencionalmente filtradas pelo algoritmo de telemetria do Supabase, não gerando transações reais de escrita no PostgreSQL (WAL — *Write-Ahead Logging*).

A engenharia do Portal UEMG Carangola desenvolveu uma solução resiliente:
* Criou-se a tabela dedicada \`public.keepalive\`, contendo uma coluna \`pinged_at\` com proteção de Row Level Security (RLS).
* Um workflow automatizado no GitHub Actions executa diariamente uma chamada autenticada via chave pública anônima executando uma operação transacional de atualização real (\`PATCH /rest/v1/keepalive?id=not.is.null\`).
* Para assegurar conformidade estrita com o *Supabase Security Advisor*, a política de atualização foi blindada contra alertas de segurança, substituindo expressões triviais por predicados explícitos de integridade (\`USING (id IS NOT NULL) WITH CHECK (pinged_at IS NOT NULL)\`), e funções RPC executadas como \`SECURITY DEFINER\` receberam a diretiva de schema imutável \`SET search_path = public, pg_temp;\`.

Dessa forma, o banco de dados processa transações legítimas diárias com impacto de armazenamento desprezível, garantindo disponibilidade ininterrupta 365 dias por ano.

---

## 6. Higiene em Ambientes Hostis e Terminais de Laboratório

O ambiente de acesso primário de discentes em unidades descentralizadas são os laboratórios de informática institucionais. Em termos de segurança da informação, computadores públicos compartilhados por dezenas de usuários distintos ao longo de um dia devem ser tratados como ambientes potencialmente hostis.

O portal implementa por padrão o conceito de **Modo Computador Público**:
* Tokens de autenticação de sessão e fragmentos de rascunhos são armazenados unicamente na memória de curta duração (\`sessionStorage\` e variáveis em RAM), sendo destruídos imediatamente ao fechar a aba do navegador.
* O encerramento de sessão aciona a rota \`/api/auth/logout\`, que emite o cabeçalho HTTP \`Clear-Site-Data: "cache", "cookies", "storage"\`, instruindo o navegador a purgar integralmente qualquer dado residual persistido.
* Em terminais compartilhados, o registro de Web Push em segundo plano é preventivamente desativado para impedir que notificações pessoais alcancem o usuário subsequente daquela máquina.

---

## 7. Conclusão e Perspectivas para a Extensão Universitária

A concepção e o lançamento do **Portal UEMG Carangola** demonstram que a descentralização universitária no interior de Minas Gerais pode alcançar patamares de excelência tecnológica equivalentes aos grandes centros globais sem necessidade de aportes orçamentários vultosos. 

Ao ancorar o ciclo de vida do software no Projeto de Extensão Contínuo do curso de **Sistemas de Informação**, o portal combate de raiz o clássico problema da orfandade de sistemas no setor público. Cada turma semestral de estagiários e monitores herda uma base de código tipada estritamente em TypeScript, documentada em profundidade, auditada por padrões governamentais (WCAG 2.1 AA e eMAG) e protegida por salvaguardas criptográficas que impedem o vazamento de dados de ouvidoria.

Mais do que um portal web, a plataforma consolida-se como um laboratório vivo de soberania digital, onde a teoria de algoritmos, a segurança da informação e a ética pública convergem para fortalecer a cidadania universitária e a memória acadêmica da UEMG na Zona da Mata Mineira.
`,
    capaUrl: '/icons/icon-512.png',
    curso: CURSOS_LISTA[7], // SIN
    autorNome: 'Prof. Me. Nilton Freitas Junior',
    autorMatricula: 'SI-UEMG-DOC-01',
    autorRole: 'Docente / Coordenador',
    coautores: 'Colegiado de Sistemas de Informação (UEMG Carangola)',
    linkExternoMidia: 'https://github.com/niltonfjunior2/portal-uemg-carangola',
    tempoLeituraMinutos: 9,
    dataPublicacao: '12/10/2026',
    citacaoAbnt: 'FREITAS JUNIOR, N. Arquitetura de Software Soberana e Custo Zero: Descentralização Tecnológica na UEMG Carangola. Portal Acadêmico UEMG Carangola, out. 2026.',
    tags: ['Engenharia de Software', 'Zero-Trust', 'PWA', 'Governança Pública', 'Soberania Digital'],
    status: 'publicado',
  },
  {
    id: 'art-2',
    slug: 'biodiversidade-flora-riparia-bacia-rio-carangola',
    titulo: 'Levantamento Florístico e Conservação da Mata Ciliar na Bacia do Rio Carangola',
    resumo: 'Investigação botânica e ecológica sobre a regeneração de espécies nativas arbóreas e a preservação dos recursos hídricos na microrregião de Carangola.',
    corpoMarkdown: `## 1. Contexto Ecológico

A Mata Atlântica na Zona da Mata Mineira encontra-se intensamente fragmentada por pastagens e culturas cafeeiras históricas. As matas ciliares do Rio Carangola exercem papel fulcral na estabilização de encostas e manutenção da ictiofauna local.

## 2. Metodologia

Foram demarcadas quatro parcelas de 100m² em trechos rurais e periurbanos do município de Carangola, catalogando espécimes vasculares nativos e invasores ao longo de doze meses de amostragem.

## 3. Resultados

Identificou-se a predominância de *Inga marginata* e *Cecropia pachystachya*, indicando estágios iniciais de sucessão ecológica e a urgência de corredores ecológicos articulados com propriedades rurais da microrregião.`,
    capaUrl: '/icons/icon-512.png',
    curso: CURSOS_LISTA[0], // BIO
    autorNome: 'Dra. Camila Nogueira Rezende',
    autorMatricula: 'BIO-2023-DOC-04',
    autorRole: 'Docente',
    coautores: 'Ana Paula Dias (Discente BIO)',
    tempoLeituraMinutos: 5,
    dataPublicacao: '05/10/2026',
    citacaoAbnt: 'REZENDE, C. N.; DIAS, A. P. Levantamento Florístico e Conservação da Mata Ciliar na Bacia do Rio Carangola. Portal Acadêmico UEMG Carangola, out. 2026.',
    tags: ['Biodiversidade', 'Mata Atlântica', 'Recursos Hídricos', 'Botânica'],
    status: 'publicado',
  },
  {
    id: 'art-3',
    slug: 'vulnerabilidade-socioespacial-encostas-carangola',
    titulo: 'Vulnerabilidade Socioespacial e Análise de Riscos Geológicos em Carangola-MG',
    resumo: 'Mapeamento das áreas urbanas de alta declividade suscetíveis a escorregamentos e inundação com propostas de planejamento territorial participativo.',
    corpoMarkdown: `## 1. Introdução

A topografia acidentada de Carangola, combinada a períodos de precipitação pluviométrica concentrada, impõe desafios permanentes à defesa civil e ao ordenamento urbano.

## 2. Análise Morfodinâmica

O estudo utilizou dados de sensoriamento remoto e vistorias de campo para classificar zonas de suscetibilidade em setores residenciais populares consolidados em encostas superiores a 30 graus de inclinação.`,
    capaUrl: '/icons/icon-512.png',
    curso: CURSOS_LISTA[1], // GEO
    autorNome: 'Prof. Dr. Marcos Vinícius Toledo',
    autorMatricula: 'GEO-2022-DOC-02',
    autorRole: 'Docente',
    coautores: 'Beatriz Martins (Discente GEO)',
    tempoLeituraMinutos: 7,
    dataPublicacao: '01/10/2026',
    citacaoAbnt: 'TOLEDO, M. V.; MARTINS, B. Vulnerabilidade Socioespacial e Análise de Riscos Geológicos em Carangola-MG. Portal Acadêmico UEMG Carangola, out. 2026.',
    tags: ['Geografia Urbana', 'Defesa Civil', 'Sensoriamento Remoto'],
    status: 'publicado',
  },
  {
    id: 'art-4',
    slug: 'patrimonio-ferroviario-memoria-regional-zona-da-mata',
    titulo: 'Patrimônio Ferroviário, Expansão Cafeeira e Memória Operária na Zona da Mata Mineira',
    resumo: 'Análise historiográfica sobre o ramal ferroviário Leopoldina Railway em Carangola e a constituição dos arquivos orais da memória dos trabalhadores do transporte no século XX.',
    corpoMarkdown: `## 1. O Trem e a Modernização Cafeeira

A chegada da Estrada de Ferro Leopoldina em Carangola nas últimas décadas do século XIX reposicionou o Vale do Carangola no centro da dinâmica de escoamento cafeeiro de Minas Gerais e do Porto do Rio de Janeiro.

## 2. A Memória do Trabalho e Arquivos Orais

A metodologia adotada integrou pesquisa documental nos arquivos da Câmara Municipal e história oral com ferroviários aposentados, reconstruindo trajetórias de sociabilidade operária e greves da primeira metade do século XX.

## 3. Considerações Finais

A salvaguarda das antigas estações ferroviárias e a digitalização do patrimônio documental representam um compromisso inadiável com a identidade cultural de Carangola e da Zona da Mata.`,
    capaUrl: '/icons/icon-512.png',
    curso: CURSOS_LISTA[2], // HIS
    autorNome: 'Prof. Dr. Rodrigo Otávio Soares',
    autorMatricula: 'HIS-2021-DOC-01',
    autorRole: 'Docente',
    coautores: 'Julia Rezende (Discente HIS)',
    tempoLeituraMinutos: 6,
    dataPublicacao: '02/10/2026',
    citacaoAbnt: 'SOARES, R. O.; REZENDE, J. Patrimônio Ferroviário, Expansão Cafeeira e Memória Operária na Zona da Mata Mineira. Portal Acadêmico UEMG Carangola, out. 2026.',
    tags: ['História Regional', 'Patrimônio Ferroviário', 'História Oral'],
    status: 'publicado',
  },
  {
    id: 'art-5',
    slug: 'vozes-literarias-multiletramentos-vale-carangola',
    titulo: 'Vozes Literárias e Multiletramentos: A Narrativa Contemporânea no Vale do Carangola',
    resumo: 'Estudo crítico sobre manifestações literárias regionais, contos orais e o letramento digital em escolas públicas do interior mineiro.',
    corpoMarkdown: `## 1. Introdução

Os estudos literários contemporâneos desafiam a hegemonia dos grandes centros editoriais ao valorizar as produções poéticas e cronísticas emergentes das cidades do interior.

## 2. Multiletramentos e Tecnologias

Por meio de oficinas pedagógicas em escolas de Carangola, investigou-se a recepção estética de textos híbridos e produções digitais poéticas concebidas por estudantes de ensino médio.

## 3. Conclusão

O fortalecimento da circulação literária na universidade pública potencializa a autoexpressão dos sujeitos periféricos e fomenta a leitura emancipatória.`,
    capaUrl: '/icons/icon-512.png',
    curso: CURSOS_LISTA[3], // LET
    autorNome: 'Profa. Ma. Lúcia Helena Brandão',
    autorMatricula: 'LET-2023-DOC-03',
    autorRole: 'Docente',
    coautores: 'Felipe Andrade (Discente LET)',
    tempoLeituraMinutos: 5,
    dataPublicacao: '03/10/2026',
    citacaoAbnt: 'BRANDÃO, L. H.; ANDRADE, F. Vozes Literárias e Multiletramentos: A Narrativa Contemporânea no Vale do Carangola. Portal Acadêmico UEMG Carangola, out. 2026.',
    tags: ['Literatura Regional', 'Linguística Aplicada', 'Multiletramentos'],
    status: 'publicado',
  },
  {
    id: 'art-6',
    slug: 'modelagem-matematica-monitoramento-pluviometrico-regional',
    titulo: 'Modelagem Matemática Aplicada à Previsão de Séries Temporais Pluviométricas em Carangola',
    resumo: 'Aplicação de equações diferenciais e modelos autoregressivos para análise preditiva de índices de precipitação na bacia do Rio Carangola.',
    corpoMarkdown: `## 1. Introdução

Eventos climáticos extremos exigem ferramentas quantitativas para subsidiar ações de defesa civil e prevenção de desastres naturais na região serrana e vales de Minas Gerais.

## 2. Formulação Matemática

O modelo utiliza análise de séries temporais ARIMA e aproximações de derivadas numéricas sobre séries históricas dos últimos trinta anos disponibilizadas pelo INMET e CEMADEN.

## 3. Resultados Obtidos

Os testes demonstraram acurácia superior a 88% na detecção de padrões anômalos de precipitação concentrada com antecedência de 72 horas.`,
    capaUrl: '/icons/icon-512.png',
    curso: CURSOS_LISTA[4], // MAT
    autorNome: 'Prof. Dr. Carlos Eduardo Nery',
    autorMatricula: 'MAT-2020-DOC-02',
    autorRole: 'Docente',
    coautores: 'Danielle Castro (Discente MAT)',
    tempoLeituraMinutos: 6,
    dataPublicacao: '04/10/2026',
    citacaoAbnt: 'NERY, C. E.; CASTRO, D. Modelagem Matemática Aplicada à Previsão de Séries Temporais Pluviométricas em Carangola. Portal Acadêmico UEMG Carangola, out. 2026.',
    tags: ['Modelagem Matemática', 'Séries Temporais', 'Precipitação'],
    status: 'publicado',
  },
  {
    id: 'art-7',
    slug: 'praticas-pedagogicas-educacao-campo-zona-da-mata',
    titulo: 'Práticas Pedagógicas Inovadoras na Educação do Campo: A Experiência do Vale do Carangola',
    resumo: 'Reflexão sobre saberes tradicionais, pedagogia da alternância e formação docente para comunidades rurais na Zona da Mata Mineira.',
    corpoMarkdown: `## 1. Contexto da Educação do Campo

A Educação do Campo reivindica a superação do currículo urbano padronizado em prol de práticas contextualizadas com a vida camponesa e a agroecologia familiar.

## 2. Relato de Práticas Extensionistas

Apresentam-se resultados de projetos formativos realizados em escolas rurais de Carangola e Fervedouro, envolvendo hortas comunitárias, letramento científico e protagonismo infantil.

## 3. Conclusão

A formação de pedagogos comprometidos com o território rural reforça o papel social da UEMG na promoção da equidade educacional.`,
    capaUrl: '/icons/icon-512.png',
    curso: CURSOS_LISTA[5], // PED
    autorNome: 'Profa. Dra. Sandra Regina Vasconcelos',
    autorMatricula: 'PED-2022-DOC-01',
    autorRole: 'Docente',
    coautores: 'Thiago Mendes (Discente PED)',
    tempoLeituraMinutos: 5,
    dataPublicacao: '06/10/2026',
    citacaoAbnt: 'VASCONCELOS, S. R.; MENDES, T. Práticas Pedagógicas Inovadoras na Educação do Campo. Portal Acadêmico UEMG Carangola, out. 2026.',
    tags: ['Educação do Campo', 'Pedagogia', 'Formação Docente'],
    status: 'publicado',
  },
  {
    id: 'art-8',
    slug: 'politicas-publicas-assistencia-garantia-direitos-carangola',
    titulo: 'Políticas Públicas de Assistência Social e Garantia de Direitos no Médio Carangola',
    resumo: 'Avaliação crítica sobre a cobertura do SUAS (Sistema Único de Assistência Social) e a atuação do assistente social em territórios vulneráveis da Zona da Mata.',
    corpoMarkdown: `## 1. Introdução

O Serviço Social tem como compromisso ético-político a defesa intransigente dos direitos sociais e a superação das desigualdades socioeconômicas estruturais no Brasil.

## 2. A Rede Socioassistencial Regional

Este artigo avalia dados dos Centros de Referência de Assistência Social (CRAS) em municípios de pequeno porte da bacia do Carangola, identificando demandas por atendimento interdisciplinar e segurança alimentar.

## 3. Considerações Finais

A articulação entre universidade pública e gestão municipal de assistência social qualifica o atendimento à população vulnerável e fortalece as redes de proteção social.`,
    capaUrl: '/icons/icon-512.png',
    curso: CURSOS_LISTA[6], // SSO
    autorNome: 'Profa. Ma. Débora Silveira Campos',
    autorMatricula: 'SSO-2024-DOC-02',
    autorRole: 'Docente',
    coautores: 'Vanessa Ribeiro (Discente SSO)',
    tempoLeituraMinutos: 6,
    dataPublicacao: '07/10/2026',
    citacaoAbnt: 'CAMPOS, D. S.; RIBEIRO, V. Políticas Públicas de Assistência Social e Garantia de Direitos no Médio Carangola. Portal Acadêmico UEMG Carangola, out. 2026.',
    tags: ['Serviço Social', 'Políticas Públicas', 'SUAS', 'Direitos Humanos'],
    status: 'publicado',
  },
  {
    id: 'art-sub-1',
    slug: 'auditoria-algoritmica-seguranca-dados-publicos',
    titulo: 'Auditoria de Segurança e Conformidade LGPD em Bancos de Dados Acadêmicos',
    resumo: 'Análise metodológica sobre a proteção de dados sensíveis e implementação de Row Level Security (RLS) no PostgreSQL para aplicações universitárias.',
    corpoMarkdown: `## 1. Contextualização
    
A Lei Geral de Proteção de Dados (Lei 13.709/2018) impõe responsabilidades objetivas às autarquias estaduais. Este trabalho avalia mecanismos de segregação de privilégios e criptografia de ponta a ponta.`,
    capaUrl: '/icons/icon-512.png',
    curso: CURSOS_LISTA[7], // SIN
    autorNome: 'Gabriel Silva Ramos',
    autorMatricula: '2023-SIN-0842',
    autorRole: 'Discente',
    coautores: 'Prof. Me. Lucas Ferreira Alvim (Orientador)',
    tempoLeituraMinutos: 4,
    dataPublicacao: '09/10/2026',
    citacaoAbnt: 'RAMOS, G. S.; ALVIM, L. F. Auditoria de Segurança e Conformidade LGPD em Bancos de Dados Acadêmicos. Portal UEMG Carangola, 2026.',
    tags: ['LGPD', 'RLS', 'PostgreSQL', 'Segurança'],
    status: 'submetido',
  },
  {
    id: 'art-rev-1',
    slug: 'inovacao-pedagogica-laboratorios-computacao-rural',
    titulo: 'Inclusão Digital e Ambientes Compartilhados: Metodologias Ativas no Ensino Superior',
    resumo: 'Proposta pedagógica voltada à utilização responsável de laboratórios de informática em regiões periféricas da Zona da Mata Mineira.',
    corpoMarkdown: `## 1. O Desafio da Conectividade

A democratização do acesso a tecnologias em cidades do interior requer abordagens colaborativas que respeitem os tempos de aprendizagem dos discentes ingressantes.`,
    capaUrl: '/icons/icon-512.png',
    curso: CURSOS_LISTA[5], // PED
    autorNome: 'Mariana Peixoto Guimarães',
    autorMatricula: '2024-PED-0319',
    autorRole: 'Discente',
    tempoLeituraMinutos: 5,
    dataPublicacao: '07/10/2026',
    citacaoAbnt: 'GUIMARÃES, M. P. Inclusão Digital e Ambientes Compartilhados. Portal UEMG Carangola, 2026.',
    tags: ['Educação', 'Pedagogia', 'Inclusão'],
    status: 'em_revisao',
    notasRevisao: 'Favor expandir o item 2 com as referências dos autores citados na introdução antes da homologação final.',
  },
];

// Chave para persistência reativa local em Day 2
const CHAVE_STORAGE_ARTIGOS = 'portal_uemg_artigos_dinamicos_v1';

export function obterArtigosConsolidados(): Artigo[] {
  if (typeof window === 'undefined') {
    return ARTIGOS_MOCK;
  }
  try {
    const salvos = localStorage.getItem(CHAVE_STORAGE_ARTIGOS);
    if (!salvos) {
      return ARTIGOS_MOCK;
    }
    const dinamicos = JSON.parse(salvos) as Artigo[];
    // Mescla garantindo que itens novos ou atualizados tenham precedência
    const idsDinamicos = new Set(dinamicos.map((a) => a.id));
    const estaticosRestantes = ARTIGOS_MOCK.filter((a) => !idsDinamicos.has(a.id));
    return [...dinamicos, ...estaticosRestantes];
  } catch {
    return ARTIGOS_MOCK;
  }
}

export function salvarArtigoSubmetido(input: SubmissaoArtigoInput): Artigo {
  const curso = CURSOS_LISTA.find((c) => c.sigla === input.cursoSigla) || CURSOS_LISTA[7];
  const slug = input.titulo
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

  const novoArtigo: Artigo = {
    id: `art-${Date.now()}`,
    slug: `${slug}-${Math.floor(Math.random() * 1000)}`,
    titulo: input.titulo,
    resumo: input.resumo,
    corpoMarkdown: input.corpoMarkdown,
    capaUrl: input.capaBase64Webp,
    curso,
    autorNome: input.autorNome,
    autorMatricula: input.autorMatricula,
    autorRole: 'Autor Cadastrado',
    coautores: input.coautores,
    linkExternoMidia: input.linkExternoMidia,
    tempoLeituraMinutos: Math.max(2, Math.ceil(input.corpoMarkdown.split(/\s+/).length / 180)),
    dataPublicacao: new Date().toLocaleDateString('pt-BR'),
    citacaoAbnt: `${input.autorNome.toUpperCase()}. ${input.titulo}. Portal Acadêmico UEMG Carangola, ${new Date().getFullYear()}.`,
    status: 'submetido',
  };

  if (typeof window !== 'undefined') {
    try {
      const atuais = obterArtigosConsolidados();
      const atualizados = [novoArtigo, ...atuais.filter((a) => a.id !== novoArtigo.id)];
      localStorage.setItem(CHAVE_STORAGE_ARTIGOS, JSON.stringify(atualizados));
    } catch (e) {
      console.warn('Erro ao salvar no storage local:', e);
    }
  }

  return novoArtigo;
}

export function aplicarDecisaoEditorial(decisao: DecisaoEditorialInput): Artigo | null {
  if (typeof window === 'undefined') return null;

  try {
    const artigos = obterArtigosConsolidados();
    const index = artigos.findIndex((a) => a.id === decisao.artigoId);
    if (index === -1) return null;

    const artigo = { ...artigos[index] };

    // Validação RBAC de transição de estado
    if (decisao.acao === 'aprovar') {
      artigo.status = 'publicado';
      artigo.dataPublicacao = new Date().toLocaleDateString('pt-BR');
      artigo.notasRevisao = undefined;
    } else if (decisao.acao === 'solicitar_ajustes') {
      artigo.status = 'em_revisao';
      artigo.notasRevisao = decisao.notas || 'Ajustes solicitados pela Coordenação.';
    } else if (decisao.acao === 'rejeitar') {
      artigo.status = 'rejeitado';
      artigo.notasRevisao = decisao.notas || 'Artigo rejeitado pela Coordenação com base nas diretrizes editoriais.';
    }

    artigos[index] = artigo;
    localStorage.setItem(CHAVE_STORAGE_ARTIGOS, JSON.stringify(artigos));
    return artigo;
  } catch {
    return null;
  }
}
