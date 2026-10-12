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
    resumo: 'Estudo técnico sobre o desenvolvimento de plataformas digitais sustentáveis utilizando PWA, Web Crypto API e infraestrutura serverless gratuita em unidades universitárias fora da sede metropolitana.',
    corpoMarkdown: `## 1. Introdução

A descentralização do ensino superior público em Minas Gerais demanda soluções de tecnologia da informação alinhadas à realidade orçamentária de unidades acadêmicas no interior do estado. A criação de silos digitais e a dependência de contratos onerosos de infraestrutura em nuvem frequentemente inviabilizam projetos de extensão e canais de comunicação com a comunidade local.

Neste artigo, apresentamos a concepção de uma arquitetura baseada em **Zero-Trust**, **Progressive Web Apps (PWA)** e armazenamento otimizado, permitindo que a Unidade de Carangola opere plataformas digitais institucionais com custo financeiro nulo.

## 2. Princípios de Segurança e Custo Zero

A estratégia adotada fundamenta-se em três pilares essenciais:
1. **Computação no Cliente (Client-Side Offloading):** As rotinas pesadas de processamento — como compactação de fotografias em formato WebP, compilação de documentos oficiais em PDF e criptografia de mensagens — são transferidas integralmente para o navegador do usuário, poupando CPU e memória dos servidores.
2. **Criptografia de Envelope (DEK/KEK):** Manifestações dirigidas ao Gabinete da Direção são cifradas antes da transmissão com a chave pública do setor, assegurando que estudantes monitores que administram o banco de dados visualizem exclusivamente bytes ininteligíveis.
3. **Sustentação por Projeto de Extensão:** A governança do código e a manutenção periódica são incorporadas à grade curricular prática do curso de Sistemas de Informação, garantindo renovação semestral de colaboradores e combatendo a orfandade técnica.

## 3. Conclusão

A experiência comprova que o rigor metodológico da engenharia de software e a aplicação consciente de padrões abertos viabilizam a soberania digital em instituições públicas estaduais, unindo economia aos princípios da transparência pública e da LGPD.`,
    capaUrl: '/icons/icon-512.png',
    curso: CURSOS_LISTA[7], // SIN
    autorNome: 'Prof. Me. Lucas Ferreira Alvim',
    autorMatricula: 'SI-2024-DOC-01',
    autorRole: 'Docente',
    coautores: 'Gabriel Silva Ramos (Discente SI), Mariana Costa (Bolsista)',
    linkExternoMidia: 'https://github.com/uemg-carangola/portal-academico',
    tempoLeituraMinutos: 6,
    dataPublicacao: '08/10/2026',
    citacaoAbnt: 'ALVIM, L. F.; RAMOS, G. S.; COSTA, M. Arquitetura de Software Soberana e Custo Zero: Descentralização Tecnológica na UEMG Carangola. Portal Acadêmico UEMG Carangola, v. 1, n. 1, p. 1-8, out. 2026.',
    tags: ['Engenharia de Software', 'Zero-Trust', 'PWA', 'Governança Pública'],
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
