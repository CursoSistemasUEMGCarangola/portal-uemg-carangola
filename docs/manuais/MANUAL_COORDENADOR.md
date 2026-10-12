# MANUAL DO USUÁRIO: COORDENADOR DE CURSO
## Portal UEMG Carangola — Gestão Editorial Setorial e Governança

> **Versão:** 3.0.0 (Go-Live Oficial & Operação Soberana) | **Perfil:** Coordenador de Curso / Chefe de Departamento  
> **Papel no Sistema:** `coordenador_curso` | **Alçada:** Monocrática em 1 clique | **Conformidade:** RLS & Custo Zero

---

## 📑 MENU DINÂMICO DE NAVEGAÇÃO

* [1. Visão Geral do Perfil](#1-visão-geral-do-perfil)
* [2. A Vitrine Departamental dos 8 Cursos (`/cursos/:sigla`)](#2-a-vitrine-departamental-dos-8-cursos-cursossigla)
* [3. Hub Administrativo Unificado (`/restrito`)](#3-hub-administrativo-unificado-restrito)
* [4. Painel Editorial da Coordenação (`/restrito/publicacoes`)](#4-painel-editorial-da-coordenação-restritopublicacoes)
* [5. Notificações Web Push e Modo Computador Compartilhado](#5-notificações-web-push-e-modo-computador-compartilhado)
* [6. Conferência Ágil de Autoria e Matrícula](#6-conferência-ágil-de-autoria-e-matrícula)
* [7. As Três Ações da Esteira Monocrática em 1 Clique](#7-as-três-ações-da-esteira-monocrática-em-1-clique)
* [8. Destaque Automático de Publicações Homologadas](#8-destaque-automático-de-publicações-homologadas)
* [9. Acompanhamento no Mural de Transparência (`/mural-de-transparencia`)](#9-acompanhamento-no-mural-de-transparência-mural-de-transparencia)
* [10. Cerimônia de Chaves e Continuidade Administrativa (`/restrito/cerimonia-chaves`)](#10-cerimônia-de-chaves-e-continuidade-administrativa-restritocerimonia-chaves)
* [11. Procedimentos Operacionais no Go-Live](#11-procedimentos-operacionais-no-go-live)

---

## 1. Visão Geral do Perfil
O Coordenador de Curso ou Chefe de Departamento é a autoridade máxima de curadoria acadêmica sobre os textos submetidos por discentes e docentes do seu curso na UEMG Carangola. A avaliação é **monocrática**, sem necessidade de reuniões burocráticas ou despachos do Gabinete da Direção.

## 2. A Vitrine Departamental dos 8 Cursos (`/cursos/:sigla`)
* Cada um dos 8 cursos de Carangola (*Ciências Biológicas, Geografia, História, Letras, Matemática, Pedagogia, Serviço Social e Sistemas de Informação*) possui uma página exclusiva, indexável por buscadores (`sitemap.xml`) e atualizada em tempo real.
* Os textos aprovados por você alimentam diretamente a contagem de produções científicas e o catálogo público do respectivo curso.

## 3. Hub Administrativo Unificado (`/restrito`)
* O portal conta com um hub de entrada administrativo em `/restrito` que direciona claramente os perfis institucionais entre o **Painel de Coordenação de Cursos**, o **Painel do Gabinete da Direção Geral** e a **Cerimônia de Custódia de Chaves**.

## 4. Painel Editorial da Coordenação (`/restrito/publicacoes`)
* **Acesso:** No menu superior, clique em **Coordenação** ou acesse via `/restrito/publicacoes`.
* **Isolamento por RLS:** O sistema exibe unicamente a fila de artigos vinculados ao seu departamento (*BIO, GEO, HIS, LET, MAT, PED, SSO, SIN*).
* **Filtros por Abas:**
  - *Fila de Decisão:* Artigos recém-submetidos ou que receberam nova versão após ajustes.
  - *Homologados:* Artigos publicados e em exibição no portal aberto.
  - *Todos:* Histórico completo departamental.

## 5. Notificações Web Push e Modo Computador Compartilhado
* **Alertas no Navegador:** Ative o botão **Ativar Alertas** no topo do painel para receber notificações em tempo real sempre que um aluno ou docente submeter um novo artigo para o seu curso.
* **Segurança em Laboratórios (Hard Box DNA #7):** Ao moderar em computadores compartilhados da universidade, clique no botão para alternar para **Terminal de Laboratório**. O sistema bloqueia notificações em disco e garante que nenhuma sessão permaneça no terminal.

## 6. Conferência Ágil de Autoria e Matrícula
* Cada card de submissão apresenta os dados essenciais para verificação instantânea:
  - **Autor Principal:** Nome completo informado.
  - **Matrícula Institucional / MASP:** Identificador acadêmico para conferência contra a listagem da sua coordenação.
  - **Coautores e Orientadores:** Vínculos adicionais declarados.
  - **Resumo e Acesso ao Texto:** Link para visualização do conteúdo estruturado e formatação em Markdown.

## 7. As Três Ações da Esteira Monocrática em 1 Clique
Em apenas 1 clique, o coordenador decide o destino de cada trabalho:
1. **Aprovar e Publicar (1 Clique):** Transforma o status imediatamente para `publicado`.
2. **Solicitar Ajustes:** Abre o modal de despacho editorial para apontar de forma sucinta e objetiva correções necessárias.
3. **Rejeitar:** Abre o modal para justificativa sucinta de recusa com base nas diretrizes editoriais do curso.

## 8. Destaque Automático de Publicações Homologadas
* A publicação mais recente aprovada na unidade é automaticamente alçada ao topo da página inicial do portal (`/`) com card visual imersivo e selo do curso de origem.

## 9. Acompanhamento no Mural de Transparência (`/mural-de-transparencia`)
* Coordenações podem acompanhar demandas públicas deliberadas pela Direção Geral referentes ao seu colegiado no **Mural de Transparência Institucional**.

## 10. Cerimônia de Chaves e Continuidade Administrativa (`/restrito/cerimonia-chaves`)
* Como membros natos da Congregação da Unidade, as coordenações participam institucionalmente do quórum de custódia e fiscalização das chaves do acervo (Shamir 2-de-3), assegurando que trocas de mandato quadrienais ocorram com preservação integral da memória histórica da UEMG Carangola.

## 11. Procedimentos Operacionais no Go-Live
* Com a entrada em produção sob o subdomínio oficial `carangola.uemg.br`, todas as 8 coordenações dispõem de acesso imediato para validar os primeiros artigos discentes e docentes, sem intermediários técnicos.
