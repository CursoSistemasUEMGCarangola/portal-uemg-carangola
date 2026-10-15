import { Artigo, Curso, DecisaoEditorialInput, SiglaCurso, StatusArtigo, SubmissaoArtigoInput } from '@/types/editorial';

export const CURSOS_LISTA: Curso[] = [
  {
    id: 'c1',
    nome: 'Administração',
    sigla: 'ADM',
    grau: 'Bacharelado',
    descricao: 'Bacharelado em Administração — O curso forma profissionais para atuar como empreendedores administrando recursos financeiros, materiais e de pessoas. Oferece formação técnica e humana de profissionais em um contexto local e global e construção de métodos e instrumentos para uma administração sistemática e organizada.',
    corFaixa: 'Azul Índigo',
    corBadge: 'bg-indigo-50 text-indigo-950 border-indigo-300 hover:border-indigo-400 hover:bg-indigo-100/80',
  },
  {
    id: 'c2',
    nome: 'Ciências Biológicas',
    sigla: 'BIO',
    grau: 'Licenciatura',
    descricao: 'Licenciatura em Ciências Biológicas — O curso forma professores com aptidão para desenvolver ações educativas em espaços escolares e não escolares, preparados para a análise da origem, evolução, estrutura, funcionamento e relação dos seres vivos; também podendo realizar pesquisas, principalmente nas áreas da Zoologia, Botânica, Genética e Ecologia.',
    corFaixa: 'Verde Esmeralda',
    corBadge: 'bg-emerald-50 text-emerald-900 border-emerald-300 hover:border-emerald-400 hover:bg-emerald-100/80',
  },
  {
    id: 'c3',
    nome: 'Geografia',
    sigla: 'GEO',
    grau: 'Licenciatura',
    descricao: 'Licenciatura em Geografia — O curso prepara profissional para atuar na docência, com conhecimentos voltados para a relação entre elementos naturais (solo, clima, relevo e vegetação) e sociais (cultura, história e geopolítica), sua localização e impactos. Permite também o desenvolvimento de habilidades que priorizam a formação de cidadãos críticos, conhecedores da dinâmica do espaço e paisagens que os cercam em diversas escalas e temporalidades.',
    corFaixa: 'Âmbar Terrestre',
    corBadge: 'bg-amber-50 text-amber-950 border-amber-300 hover:border-amber-400 hover:bg-amber-100/80',
  },
  {
    id: 'c4',
    nome: 'História',
    sigla: 'HIS',
    grau: 'Licenciatura',
    descricao: 'Licenciatura em História — O curso oferece ao aluno formação com clara ênfase na prática do ensino de História, mas concilia a educação superior e a prática pedagógica ao desenvolvimento de habilidades para execução de projetos de pesquisas em temáticas regionais. A utilização dos ricos acervos documentais da região do sul de Minas e da cidade de Campanha possibilita uma formação diferencial dos nossos alunos numa perspectiva articulada e dialética entre ensino e pesquisa.',
    corFaixa: 'Roxo Imperial',
    corBadge: 'bg-purple-50 text-purple-950 border-purple-300 hover:border-purple-400 hover:bg-purple-100/80',
  },
  {
    id: 'c5',
    nome: 'Letras (Português/Inglês)',
    sigla: 'LET',
    grau: 'Licenciatura',
    descricao: 'Licenciatura em Letras — O curso forma profissional para atuar no ensino da língua inglesa e portuguesa e suas literaturas; na elaboração, revisão e correção de textos em editoras e órgãos da imprensa; criação de versões de um idioma para o outro de textos técnicos e literários; atuar em conferências e simpósios, efetuando interpretações simultâneas ou consecutivas.',
    corFaixa: 'Lilás Ametista',
    corBadge: 'bg-violet-50 text-violet-950 border-violet-300 hover:border-violet-400 hover:bg-violet-100/80',
  },
  {
    id: 'c6',
    nome: 'Matemática',
    sigla: 'MAT',
    grau: 'Licenciatura',
    descricao: 'Licenciatura em Matemática — O curso tem como objetivo proporcionar uma sólida formação matemática para atuação em ensino fundamental e médio, bem como preparar profissionais críticos e criativos, possibilitando reflexões sobre o papel do professor no processo de ensino-aprendizagem, com foco em suas limitações e potencialidades.',
    corFaixa: 'Azul Turquesa',
    corBadge: 'bg-cyan-50 text-cyan-950 border-cyan-300 hover:border-cyan-400 hover:bg-cyan-100/80',
  },
  {
    id: 'c7',
    nome: 'Pedagogia',
    sigla: 'PED',
    grau: 'Licenciatura',
    descricao: 'Licenciatura em Pedagogia — O curso forma profissionais para atuar com a educação escolar na educação infantil e nos anos iniciais do ensino fundamental, em escolas públicas e privadas. Com base teórico-prática voltada para a compreensão do fenômeno educacional na contemporaneidade.',
    corFaixa: 'Azul Celeste',
    corBadge: 'bg-sky-50 text-sky-950 border-sky-300 hover:border-sky-400 hover:bg-sky-100/80',
  },
  {
    id: 'c8',
    nome: 'Serviço Social',
    sigla: 'SSO',
    grau: 'Bacharelado',
    descricao: 'Bacharelado em Serviço Social — O curso forma profissional para atuar na elaboração, execução e avaliação de planos, programas e projetos na área social, contribuindo para a viabilização da participação dos usuários nas decisões institucionais, planejando, organizando e administrando benefícios e serviços, bem como a realização de pesquisas que subsidiem formulação de políticas e ações profissionais.',
    corFaixa: 'Verde Petróleo',
    corBadge: 'bg-teal-50 text-teal-950 border-teal-300 hover:border-teal-400 hover:bg-teal-100/80',
  },
  {
    id: 'c9',
    nome: 'Sistemas de Informação',
    sigla: 'SIS',
    grau: 'Bacharelado',
    descricao: 'Bacharelado em Sistemas de Informação — O curso tem por objetivo a formação de profissionais capacitados para atuar na busca de soluções nas diferentes áreas de aplicação, com uma visão dinâmica da complexidade organizacional, voltados para a atualização tecnológica e as demandas do mercado, podendo atuar também na inovação, planejamento, gerenciamento da infraestrutura, coordenação, desenvolvimento e evolução dos recursos e sistemas de informação.',
    corFaixa: 'Azul Cobalto',
    corBadge: 'bg-blue-50 text-[#0B3B60] border-blue-300 hover:border-[#0056B3] hover:bg-blue-100/80',
  },
];

export const ARTIGOS_MOCK: Artigo[] = [
  {
    id: 'art-1',
    slug: 'arquitetura-autonoma-custo-zero-governanca-publica',
    titulo: 'Arquitetura de Software Autônoma e Custo Zero: Descentralização Tecnológica na UEMG Carangola',
    resumo: 'Relato técnico e metodológico sobre a concepção e implementação do Portal UEMG Carangola. Descreve a engenharia de uma plataforma pública sustentável que unifica a divulgação científica dos 9 cursos e a ouvidoria institucional com Custo Zero, Criptografia de Envelope Client-Side, partição de chaves Shamir (2-de-3) e operação perpétua no Free Tier do Supabase.',
    corpoMarkdown: `## Resumo Técnico

Este artigo documenta a concepção, os fundamentos arquiteturais e as decisões de engenharia de software empregadas na construção do **Portal UEMG Carangola**, plataforma pública unificada concebida para atender à Universidade do Estado de Minas Gerais (UEMG) em sua Unidade Acadêmica de Carangola, localizada na Zona da Mata Mineira. O projeto responde a um duplo desafio comum às autarquias estaduais descentralizadas: a fragmentação da produção intelectual multicampi e a ausência de canais institucionais seguros e acessíveis para o diálogo entre a comunidade acadêmica e o Gabinete da Direção Geral. Em um cenário de fortes restrições orçamentárias públicas, onde a contratação de infraestrutura em nuvem de grande porte é inviabilizada por entraves licitatórios, foi formulada e executada uma **Arquitetura Autônoma em Custo Zero Absoluto**. 

O sistema integra em uma única base de código a divulgação científica de nove cursos de graduação e um canal de ouvidoria blindado por Criptografia de Envelope no cliente (*Client-Side Zero-Trust*), distribuição de segredos mestres via algoritmo de Shamir (*2-de-3 Secret Sharing*), políticas estritas de segurança em nível de linha (*Row Level Security — RLS*) no PostgreSQL e mitigação ativa contra pausas de inatividade no plano gratuito do Supabase.

---

## 1. Introdução e Contextualização do Problema Institucional

A interiorização do ensino superior público em Minas Gerais, consolidada pela expansão da UEMG, transformou a dinâmica socioeconômica de microrregiões históricas como a bacia do Rio Carangola. Contudo, a descentralização física frequentemente enfrenta a chamada *assimetria da visibilidade digital*: enquanto os campi sediados na capital concentram recursos tecnológicos e canais corporativos unificados, as unidades do interior tendem a conviver com repositórios isolados, publicações dispersas em redes sociais não oficiais e canais de governança dependentes de caixas de e-mail genéricas ou formulários desprovidos de garantias criptográficas.

Em Carangola, nove cursos de graduação — Administração, Ciências Biológicas, Geografia, História, Letras, Matemática, Pedagogia, Serviço Social e Sistemas de Informação — geram continuadamente artigos de extensão, ensaios teóricos, monografias e relatórios de campo. Paralelamente, o Gabinete da Direção Geral necessitava de um mecanismo autônomo para o programa "Fale com a Direção", assegurando que denúncias, críticas, sugestões e elogios pudessem tramitar com garantia de sigilo ou anonimato inviolável, conforme preconizado pela Lei de Acesso à Informação (LAI — Lei 12.527/2011) e pela Lei Geral de Proteção de Dados (LGPD — Lei 13.709/2018).

O desafio central imposto à equipe de desenvolvimento do curso de Sistemas de Informação consistiu em: **como construir uma infraestrutura perene, de alta fidelidade visual e rigor criptográfico, sem dispor de orçamento financeiro para servidores dedicados, bancos de dados pagos ou serviços corporativos de e-mail?**

---

## 2. A Filosofia do Custo Zero e o Offloading Computacional no Cliente

A resposta a essa restrição orçamentária foi materializada através da filosofia de **Custo Zero e Autonomia Tecnológica (Zero-Budget Autonomous Architecture)**. Em vez de depender de instâncias virtuais ativas 24 horas por dia consumindo cotas financeiras, a arquitetura do Portal UEMG Carangola transfere a intensidade do processamento computacional para a CPU e memória RAM do navegador do usuário (*Client-Side Offloading*).

Essa decisão manifesta-se em três soluções de engenharia primordiais:

1. **Pipeline de Compressão Gráfica WebP Client-Side:** O upload direto de fotografias em alta resolução esgotaria o limite de 1 GB de armazenamento de arquivos oferecido pelo plano gratuito do Supabase Storage. Para contornar esse teto, implementou-se um pipeline no navegador baseado em \`OffscreenCanvas\` que redimensiona imagens para uma largura máxima de 1200 pixels e as converte em WebP com taxa de compressão de 80%. O resultado reduz arquivos de 8 MB para uma faixa entre 80 KB e 110 KB antes de qualquer tráfego de rede, viabilizando o suporte a milhares de artigos sem custos de storage.
2. **A Regra Inviolável de Zero-Storage para Arquivos PDF:** No modelo editorial tradicional, cada artigo publicado gera um arquivo PDF binário armazenado permanentemente no servidor. No Portal UEMG Carangola, vigora a regra estrita de **Zero-Storage de PDFs**: nenhum arquivo binário \`.pdf\` é gravado no banco de dados. Os documentos oficiais são compilados sob demanda no navegador do leitor a partir do texto estruturado em Markdown e metadados institucionais, utilizando estilos CSS tipográficos de alta precisão calibrados para impressão A4 na memória volátil.
3. **Arquitetura de Mensageria Híbrida & Soberania da Ouvidoria:** Servidores corporativos de correio eletrônico (\`@uemg.br\`) possuem diretivas severas que descartam envios automáticos externos. A arquitetura respondeu com um modelo híbrido: a **Ouvidoria é 100% Zero-Email**, soberana e confidencial, operando exclusivamente via interface in-app, Web Push (VAPID) e comprovantes criptográficos portáteis em PDF. Paralelamente, para fluxos críticos de autenticação (recuperação de senhas e homologação de coordenadores), utiliza-se a API REST do Brevo (v3) no plano gratuito (300 envios/dia), despachando links temporários para e-mails pessoais secundários para contornar bloqueios corporativos de rede sem incorrer em custos.
4. **Acessibilidade Sonora Nativa Client-Side:** Em conformidade estrita com o eMAG e a norma internacional WCAG 2.1 AA, implementou-se audiodescrição in-app via \`SpeechSynthesis\` (Web Speech API) nativa do navegador. O sintetizador processa o texto estruturado diretamente no dispositivo do leitor, permitindo audição de artigos com controle de velocidade e pausa, sem consumo de dados móveis e sem custos com APIs proprietárias de Text-to-Speech.

---

## 3. Arquitetura de Segurança Zero-Trust para Ouvidoria Universitária

A modelagem de ameaças para o canal "Fale com a Direção" apresentou um dilema ético e técnico de primeira grandeza: a sustentação técnica e o gerenciamento diário do banco de dados PostgreSQL do projeto são operados por discentes e monitores do curso de Sistemas de Informação. Como garantir que um estudante que possui acesso administrativo ao painel do Supabase não consiga ler denúncias sensíveis, relatos de assédio ou manifestações sigilosas destinadas exclusivamente ao Diretor Geral?

A solução adotada foi a implantação de uma arquitetura **Zero-Trust com Criptografia de Envelope (Envelope Encryption)**:

* **No navegador do cidadão:** Ao redigir uma manifestação, o cliente gera aleatoriamente no navegador, via \`SubtleCrypto\` nativo, uma chave simétrica de uso único (DEK — *Data Encryption Key*) de 256 bits com algoritmo AES-GCM. O corpo da mensagem é cifrado com a DEK.
* **Envelopamento da Chave:** Em seguida, a DEK é cifrada assimetricamente com algoritmo RSA-OAEP de 4096 bits utilizando a chave pública institucional do Gabinete da Direção (KEK — *Key Encryption Key*).
* **Armazenamento Cego:** O banco de dados PostgreSQL na nuvem recebe e persiste unicamente o payload cifrado (*ciphertext*), o vetor de inicialização (IV) e a chave envelopada (*wrapped_dek*). Monitores, invasores ou terceiros que inspecionem as tabelas visualizam apenas sequências aleatórias de bytes Base64 indecifráveis.

Adicionalmente, concebeu-se uma defesa rigorosa contra ataques de enumeração (*Anti-Enumeration Defense*). Protocolos visuais sequenciais (no padrão \`#CAR-2026-XXXX\`) não são chaves de autorização de API. A consulta a manifestações exige obrigatoriamente a tupla composta pelo Código do Protocolo e um Token Secreto de 24 caracteres gerado via biblioteca NanoID com entropia criptográfica. Tentativas incorretas acionam uma rotina com retardo artificial constante de 400 milissegundos para neutralizar ataques de temporização (*timing attacks*).

A segregação física é mantida entre as tabelas: denúncias privadas residem em \`protocolos_internos\` (onde o acesso via \`SELECT\` direto é estritamente proibido ao público), enquanto deliberações homologadas em texto claro residem de forma totalmente desacoplada na tabela \`mural_publico\`.

---

## 4. Continuidade Institucional via Partição Criptográfica de Shamir (SSS)

Projetos de software desenvolvidos no setor público frequentemente sucumbem à transitoriedade dos mandatos gestores. Em universidades públicas, a perda da chave privada de um gestor que encerra seu período administrativo ou a retenção indevida de credenciais poderia selar para sempre o acervo histórico de documentos e manifestações.

Para resolver essa vulnerabilidade humana, implementou-se a **Partição Criptográfica de Shamir (*Shamir's Secret Sharing*)** com quórum $(k, n) = (2, 3)$:

* Durante a formalização de uma gestão, a chave privada mestra (KEK) é dividida matematicamente em três fragmentos desconexos sobre o corpo de Galois $GF(2^8)$ com polinômio redutor $x^8 + x^4 + x^3 + x + 1$ e CSPRNG estrito (\`crypto.getRandomValues\`).
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

Mais do que um portal web, a plataforma consolida-se como um laboratório vivo de autonomia digital e tecnologia pública, onde a teoria de algoritmos, a segurança da informação e a ética pública convergem para fortalecer a cidadania universitária e a memória acadêmica da UEMG na Zona da Mata Mineira.
`,
    capaUrl: '/icons/icon-512.png',
    curso: CURSOS_LISTA.find((c) => c.sigla === 'SIS') || CURSOS_LISTA[0],
    autorNome: 'Prof. Me. Nilton Freitas Junior',
    autorMatricula: 'SIS-UEMG-DOC-01',
    autorRole: 'Docente / Coordenador',
    coautores: 'Colegiado de Sistemas de Informação (UEMG Carangola)',
    linkExternoMidia: 'https://github.com/niltonfjunior2/portal-uemg-carangola',
    tempoLeituraMinutos: 9,
    dataPublicacao: '12/10/2026',
    citacaoAbnt: 'FREITAS JUNIOR, N. Arquitetura de Software Autônoma e Custo Zero: Descentralização Tecnológica na UEMG Carangola. Portal Acadêmico UEMG Carangola, out. 2026.',
    tags: ['Engenharia de Software', 'Zero-Trust', 'PWA', 'Governança Pública', 'Autonomia Digital'],
    status: 'publicado',
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
  const curso = CURSOS_LISTA.find((c) => c.sigla === input.cursoSigla) || CURSOS_LISTA.find((c) => c.sigla === 'SIS') || CURSOS_LISTA[0];
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
    autorId: input.autorId,
    autorEmail: input.autorEmail,
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
