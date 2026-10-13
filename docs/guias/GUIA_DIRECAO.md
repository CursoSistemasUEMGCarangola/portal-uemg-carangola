# GUIA DE USO: GABINETE DA DIREÇÃO GERAL
## Portal UEMG Carangola — Governança Institucional, Ouvidoria Soberana e Transparência

> **Versão:** 3.1.0 | **Perfil:** Diretor Geral / Vice-Direção / Assessoria do Gabinete  
> **Papel no Sistema:** `direcao` | **Alçada:** Decisão Máxima de Governança, Ouvidoria e Custódia Institucional  

---

## 📑 SUMÁRIO DO GUIA

* [1. Visão Geral do Perfil e Atribuições](#1-visão-geral-do-perfil-e-atribuições)
* [2. O Painel do Gabinete da Direção (`/restrito/ouvidoria`)](#2-o-painel-do-gabinete-da-direção-restritoouvidoria)
* [3. Decodificação de Envelopes Criptográficos e Sigilo Constitucional](#3-decodificação-de-envelopes-criptográficos-e-sigilo-constitucional)
* [4. Despacho Oficial e Tramitação de Manifestações](#4-despacho-oficial-e-tramitação-de-manifestações)
* [5. Sanitização de Dados e Homologação no Mural Público (`/mural-de-transparencia`)](#5-sanitização-de-dados-e-homologação-no-mural-público-mural-de-transparencia)
* [6. Homologação Direta de Coordenadores de Curso](#6-homologação-direta-de-coordenadores-de-curso)
* [7. Cerimônia de Custódia Compartilhada de Chaves (Shamir 2-de-3 em GF(2^8))](#7-cerimônia-de-custódia-compartilhada-de-chaves-shamir-2-de-3-em-gf28)
* [8. Segurança em Terminais de Laboratório e Higiene de Sessão](#8-segurança-em-terminais-de-laboratório-e-higiene-de-sessão)
* [9. Salvaguarda Contra Vazamentos e Modelo Custo Zero](#9-salvaguarda-contra-vazamentos-e-modelo-custo-zero)

---

## 1. Visão Geral do Perfil e Atribuições
O Diretor Geral da UEMG Unidade Carangola exerce a autoridade máxima de governança participativa, ouvidoria e homologação institucional. O portal foi concebido para conferir ao Gabinete um canal soberano, direto e desburocratizado de diálogo com a comunidade acadêmica e a sociedade civil, superando a invisibilidade da gestão e protegendo integralmente o sigilo constitucional de manifestantes.

## 2. O Painel do Gabinete da Direção (`/restrito/ouvidoria`)
Acessível a partir de `/restrito` pelo perfil `direcao`:
* **Métricas em Tempo Real:** Total de manifestações recebidas, solicitações pendentes de análise, demandas em tramitação, respostas emitidas e despachos homologados no mural.
* **Filtros Ágeis:** Filtragem instantânea por tipo de manifestação (*Elogio, Sugestão, Solicitação, Denúncia*) e por curso/setor de referência.
* **Fila de Trabalho:** Listagem priorizada das manifestações com exibição do protocolo `#CAR-2026-XXXX`, data de entrada e prazo de resposta.

## 3. Decodificação de Envelopes Criptográficos e Sigilo Constitucional
* **Zero-Trust Client-Side:** Toda manifestação enviada como privada ou anônima chega ao banco de dados cifrada no navegador do cidadão por criptografia de envelope (AES-GCM-256 envelopada com a chave pública RSA-OAEP-4096 do Gabinete).
* **Decodificação em Memória Volátil (RAM):** Ao abrir o detalhe de uma manifestação no painel, a chave privada da Direção realiza a descriptografia diretamente na memória do navegador do Diretor. O texto em claro **nunca** reside no banco de dados e jamais é visível para administradores de TI ou bolsistas.

## 4. Despacho Oficial e Tramitação de Manifestações
Ao analisar uma manifestação, o Gabinete pode:
1. **Definir Status:** Alterar a tramitação para *Em Análise*, *Respondido* ou *Homologado*.
2. **Redigir Despacho Oficial:** Inserir a resposta institucional que será visualizada exclusivamente pelo manifestante na tela de consulta por dupla chave (`/fale-com-a-direcao/consulta`).
3. **Vincular Portarias ou Atos:** Registrar números de portarias, ordens de serviço ou providências administrativas tomadas pela Direção.

## 5. Sanitização de Dados e Homologação no Mural Público (`/mural-de-transparencia`)
Para dar publicidade a resoluções de interesse coletivo sem violar a intimidade dos envolvidos:
* **Desacoplamento Físico de Banco:** As tabelas `protocolos_internos` e `mural_publico` são segregadas e não possuem chaves estrangeiras relacionais (Hard Box DNA #3).
* **Higienização no Navegador:** Antes de homologar uma publicação para o Mural Público, o Diretor preenche o **Resumo Sanitizado**. O navegador suprime qualquer dado pessoal identificável (PII), nomes próprios de alunos e docentes ou referências sensíveis, garantindo estrita conformidade com a Lei de Acesso à Informação (Lei 12.527/2011) e LGPD (Lei 13.709/2018).

## 6. Homologação Direta de Coordenadores de Curso
No painel do Gabinete (`/restrito`):
* **Fila de Solicitações:** Professores que solicitam cadastro como Coordenadores de Curso ficam retidos em fila de aprovação da Direção Geral.
* **Homologação em 1 Clique:** O Diretor confere o MASP/matrícula e clica em **Homologar Acesso**.
* **Notificação Automática:** O sistema despacha automaticamente uma notificação oficial institucional via Brevo para o e-mail alternativo seguro do docente, liberando suas credenciais de curadoria departamental.

## 7. Cerimônia de Custódia Compartilhada de Chaves (Shamir 2-de-3 em GF(2^8))
Em atendimento à regra de continuidade administrativa (Hard Box DNA #4):
* **Princípio Matemático:** A chave mestra que custodia o acervo histórico de documentos não pode ser perdida em transições de mandato quadrienais. Por isso, é fragmentada matematicamente pelo algoritmo *Shamir's Secret Sharing* em 3 partes sobre o corpo finito $GF(2^8)$.
* **Quórum 2-de-3:** São necessários quaisquer 2 custodiantes para recompor o acervo:
  1. *Fragmento 1:* Diretor Geral da Unidade.
  2. *Fragmento 2:* Vice-Diretor / Secretaria Geral.
  3. *Fragmento 3:* Representação da Congregação da Unidade.
* **Painel da Cerimônia:** Acessível em `/restrito/cerimonia-chaves` para conferência de quórum e geração solene de novos fragmentos.

## 8. Segurança em Terminais de Laboratório e Higiene de Sessão
* **Alerta de Ambiente Compartilhado:** Ao acessar o painel administrativo em computadores de laboratório da universidade, ative sempre o modo **Terminal de Laboratório**.
* **Expurgo de Sessão:** O logout institucional emite o cabeçalho W3C `Clear-Site-Data: "cache", "cookies", "storage"`, eliminando chaves de sessão e histórico temporário do navegador.

## 9. Salvaguarda Contra Vazamentos e Modelo Custo Zero
* O sistema opera com custo zero permanente, sem necessidade de servidores dedicados ou contratos de nuvem onerosos, ancorado como extensão prática do curso de Sistemas de Informação.
* A separação criptográfica assegura que nem os alunos administradores da infraestrutura conseguem ter acesso aos textos confidenciais encaminhados ao Diretor Geral.
