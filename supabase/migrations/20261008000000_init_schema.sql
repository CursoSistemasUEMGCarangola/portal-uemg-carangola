-- ==============================================================================
-- MIGRAÇÃO INICIAL: Schema Relacional e Políticas de RLS
-- Projeto: Portal UEMG Carangola (Publicações Acadêmicas & Fale com a Direção)
-- Princípio Arquitetural: Client-Side Zero-Trust & Governança por Papéis (RBAC)
-- ==============================================================================

-- 1. EXTENSÕES OBRIGATÓRIAS
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. TABELA: cursos
CREATE TABLE IF NOT EXISTS public.cursos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(150) NOT NULL,
    sigla VARCHAR(20) NOT NULL UNIQUE,
    descricao TEXT,
    criado_em TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 3. TABELA: perfis_usuarios (Vinculada ao auth.users do Supabase)
CREATE TABLE IF NOT EXISTS public.perfis_usuarios (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    nome_completo VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('direcao', 'coordenador_curso', 'autor')),
    curso_id UUID REFERENCES public.cursos(id) ON DELETE SET NULL,
    matricula VARCHAR(50),
    criado_em TIMESTAMPTZ DEFAULT now() NOT NULL,
    atualizado_em TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 4. TABELA: artigos
CREATE TABLE IF NOT EXISTS public.artigos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(255) NOT NULL UNIQUE,
    titulo VARCHAR(255) NOT NULL,
    resumo TEXT NOT NULL,
    corpo_markdown TEXT NOT NULL,
    capa_url VARCHAR(500) NOT NULL,
    curso_id UUID NOT NULL REFERENCES public.cursos(id) ON DELETE RESTRICT,
    autor_id UUID NOT NULL REFERENCES public.perfis_usuarios(id) ON DELETE CASCADE,
    coautores TEXT,
    link_externo_midia VARCHAR(500),
    tempo_leitura_minutos INT DEFAULT 5 NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'rascunho' CHECK (status IN ('rascunho', 'submetido', 'em_revisao', 'publicado', 'rejeitado')),
    notas_revisao TEXT,
    criado_em TIMESTAMPTZ DEFAULT now() NOT NULL,
    publicado_em TIMESTAMPTZ,
    atualizado_em TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 5. TABELA: protocolos_internos (Ouvidoria Zero-Trust - Apenas Ciphertext)
CREATE TABLE IF NOT EXISTS public.protocolos_internos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    codigo_protocolo VARCHAR(30) NOT NULL UNIQUE,
    token_hash VARCHAR(64) NOT NULL, -- SHA-256 do token secreto de consulta
    curso_id UUID REFERENCES public.cursos(id) ON DELETE SET NULL,
    is_anonimo BOOLEAN DEFAULT false NOT NULL,
    payload_cifrado TEXT NOT NULL, -- Ciphertext gerado no navegador (AES-GCM)
    wrapped_dek TEXT NOT NULL, -- DEK envelopada com RSA-OAEP da Direção
    status VARCHAR(50) NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'em_analise_assessoria', 'em_analise_diretoria', 'respondido_privado', 'homologado_publico')),
    despacho_cifrado TEXT,
    numero_portaria VARCHAR(50),
    criado_em TIMESTAMPTZ DEFAULT now() NOT NULL,
    atualizado_em TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 6. TABELA: mural_publico (Desacoplada - Somente Conteúdo Sanitizado Homologado)
CREATE TABLE IF NOT EXISTS public.mural_publico (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    protocolo_referencia VARCHAR(30) NOT NULL,
    curso_id UUID REFERENCES public.cursos(id) ON DELETE SET NULL,
    manifestacao_resumo TEXT NOT NULL,
    resposta_oficial TEXT NOT NULL,
    numero_portaria VARCHAR(50),
    status_homologacao VARCHAR(50) NOT NULL DEFAULT 'Homologado e Respondido',
    is_active BOOLEAN DEFAULT true NOT NULL,
    data_manifestacao TIMESTAMPTZ NOT NULL,
    publicado_em TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 7. TABELA: chaves_gabinete (Metadados Criptográficos e Envelopes da KEK)
CREATE TABLE IF NOT EXISTS public.chaves_gabinete (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID REFERENCES public.perfis_usuarios(id) ON DELETE CASCADE,
    papel_operador VARCHAR(50) NOT NULL CHECK (papel_operador IN ('diretor', 'assessor', 'custodia_institucional')),
    chave_publica_spki TEXT NOT NULL,
    wrapped_kek TEXT NOT NULL,
    versao INT DEFAULT 1 NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL,
    criado_em TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- ==============================================================================
-- SEED DOS 9 CURSOS OFICIAIS DA UEMG CARANGOLA (ORDEM ALFABÉTICA)
-- ==============================================================================
INSERT INTO public.cursos (nome, sigla, descricao) VALUES
('Administração', 'ADM', 'Bacharelado em Administração — O curso forma profissionais para atuar como empreendedores administrando recursos financeiros, materiais e de pessoas. Oferece formação técnica e humana de profissionais em um contexto local e global e construção de métodos e instrumentos para uma administração sistemática e organizada.'),
('Ciências Biológicas', 'BIO', 'Licenciatura em Ciências Biológicas — O curso forma professores com aptidão para desenvolver ações educativas em espaços escolares e não escolares, preparados para a análise da origem, evolução, estrutura, funcionamento e relação dos seres vivos; também podendo realizar pesquisas, principalmente nas áreas da Zoologia, Botânica, Genética e Ecologia.'),
('Geografia', 'GEO', 'Licenciatura em Geografia — O curso prepara profissional para atuar na docência, com conhecimentos voltados para a relação entre elementos naturais (solo, clima, relevo e vegetação) e sociais (cultura, história e geopolítica), sua localização e impactos. Permite também o desenvolvimento de habilidades que priorizam a formação de cidadãos críticos, conhecedores da dinâmica do espaço e paisagens que os cercam em diversas escalas e temporalidades.'),
('História', 'HIS', 'Licenciatura em História — O curso oferece ao aluno formação com clara ênfase na prática do ensino de História, mas concilia a educação superior e a prática pedagógica ao desenvolvimento de habilidades para execução de projetos de pesquisas em temáticas regionais. A utilização dos ricos acervos documentais da região do sul de Minas e da cidade de Campanha possibilita uma formação diferencial dos nossos alunos numa perspectiva articulada e dialética entre ensino e pesquisa.'),
('Letras (Português/Inglês)', 'LET', 'Licenciatura em Letras — O curso forma profissional para atuar no ensino da língua inglesa e portuguesa e suas literaturas; na elaboração, revisão e correção de textos em editoras e órgãos da imprensa; criação de versões de um idioma para o outro de textos técnicos e literários; atuar em conferências e simpósios, efetuando interpretações simultâneas ou consecutivas.'),
('Matemática', 'MAT', 'Licenciatura em Matemática — O curso tem como objetivo proporcionar uma sólida formação matemática para atuação em ensino fundamental e médio, bem como preparar profissionais críticos e criativos, possibilitando reflexões sobre o papel do professor no processo de ensino-aprendizagem, com foco em suas limitações e potencialidades.'),
('Pedagogia', 'PED', 'Licenciatura em Pedagogia — O curso forma profissionais para atuar com a educação escolar na educação infantil e nos anos iniciais do ensino fundamental, em escolas públicas e privadas. Com base teórico-prática voltada para a compreensão do fenômeno educacional na contemporaneidade.'),
('Serviço Social', 'SSO', 'Bacharelado em Serviço Social — O curso forma profissional para atuar na elaboração, execução e avaliação de planos, programas e projetos na área social, contribuindo para a viabilização da participação dos usuários nas decisões institucionais, planejando, organizando e administrando benefícios e serviços, bem como a realização de pesquisas que subsidiem formulação de políticas e ações profissionais.'),
('Sistemas de Informação', 'SIS', 'Bacharelado em Sistemas de Informação — O curso tem por objetivo a formação de profissionais capacitados para atuar na busca de soluções nas diferentes áreas de aplicação, com uma visão dinâmica da complexidade organizacional, voltados para a atualização tecnológica e as demandas do mercado, podendo atuar também na inovação, planejamento, gerenciamento da infraestrutura, coordenação, desenvolvimento e evolução dos recursos e sistemas de informação.')
ON CONFLICT (sigla) DO NOTHING;

-- ==============================================================================
-- POLÍTICAS DE SEGURANÇA POR LINHA (ROW LEVEL SECURITY - RLS)
-- ==============================================================================

-- Habilitação obrigatória de RLS em 100% das tabelas
ALTER TABLE public.cursos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.perfis_usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artigos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.protocolos_internos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mural_publico ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chaves_gabinete ENABLE ROW LEVEL SECURITY;

-- 1. Políticas: cursos (Leitura pública, escrita administrativa)
CREATE POLICY "Leitura publica dos cursos"
ON public.cursos FOR SELECT
TO public
USING (true);

-- 2. Políticas: perfis_usuarios
CREATE POLICY "Leitura de perfil proprio"
ON public.perfis_usuarios FOR SELECT
TO authenticated
USING (id = auth.uid());

CREATE POLICY "Atualizacao de perfil proprio"
ON public.perfis_usuarios FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

CREATE POLICY "Insercao no cadastro"
ON public.perfis_usuarios FOR INSERT
TO authenticated
WITH CHECK (id = auth.uid());

-- 3. Políticas: artigos
-- Leitura pública de artigos com status publicado
CREATE POLICY "Leitura publica de artigos publicados"
ON public.artigos FOR SELECT
TO public
USING (status = 'publicado');

-- Autores enxergam seus próprios rascunhos e submissões
CREATE POLICY "Autores gerenciam seus proprios artigos"
ON public.artigos FOR ALL
TO authenticated
USING (autor_id = auth.uid())
WITH CHECK (autor_id = auth.uid());

-- Coordenadores de curso enxergam e moderam artigos do seu respectivo curso
CREATE POLICY "Coordenadores moderam artigos do seu curso"
ON public.artigos FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.perfis_usuarios p
        WHERE p.id = auth.uid()
        AND p.role = 'coordenador_curso'
        AND p.curso_id = artigos.curso_id
    )
);

-- Direção possui visualização institucional de artigos
CREATE POLICY "Direcao visualiza todos os artigos"
ON public.artigos FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.perfis_usuarios p
        WHERE p.id = auth.uid()
        AND p.role = 'direcao'
    )
);

-- 4. Políticas: protocolos_internos (Zero-Trust Ouvidoria)
-- Inserção pública permitida para envio de manifestações anônimas/identificadas com validação estrita
CREATE POLICY "Envio publico de manifestacao cifrada"
ON public.protocolos_internos FOR INSERT
TO public
WITH CHECK (
    status = 'pendente'
    AND despacho_cifrado IS NULL
    AND numero_portaria IS NULL
    AND codigo_protocolo IS NOT NULL
    AND token_hash IS NOT NULL
    AND payload_cifrado IS NOT NULL
    AND wrapped_dek IS NOT NULL
);

-- Leitura estritamente restrita ao Gabinete da Direção autenticado
CREATE POLICY "Leitura restrita a Direcao Geral"
ON public.protocolos_internos FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.perfis_usuarios p
        WHERE p.id = auth.uid()
        AND p.role = 'direcao'
    )
);

-- Função de Segurança RPC para consulta individual via Protocolo + Token Hash
CREATE OR REPLACE FUNCTION public.consultar_protocolo_seguro(
    p_codigo VARCHAR,
    p_token_hash VARCHAR
)
RETURNS TABLE (
    codigo_protocolo VARCHAR,
    curso_sigla VARCHAR,
    status VARCHAR,
    despacho_cifrado TEXT,
    numero_portaria VARCHAR,
    criado_em TIMESTAMPTZ,
    atualizado_em TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    -- Defesa em profundidade: não processa se parâmetros forem nulos ou vazios
    IF p_codigo IS NULL OR trim(p_codigo) = '' OR p_token_hash IS NULL OR trim(p_token_hash) = '' THEN
        RETURN;
    END IF;

    RETURN QUERY
    SELECT 
        pi.codigo_protocolo,
        c.sigla,
        pi.status,
        pi.despacho_cifrado,
        pi.numero_portaria,
        pi.criado_em,
        pi.atualizado_em
    FROM public.protocolos_internos pi
    LEFT JOIN public.cursos c ON c.id = pi.curso_id
    WHERE pi.codigo_protocolo = p_codigo
      AND pi.token_hash = p_token_hash;
END;
$$;

-- 5. Políticas: mural_publico
-- Leitura pública de despachos ativos homologados
CREATE POLICY "Leitura publica do mural homologado"
ON public.mural_publico FOR SELECT
TO public
USING (status_homologacao = 'Homologado e Respondido' AND is_active = true);

-- Apenas a Direção pode criar, editar ou desativar registros no mural
CREATE POLICY "Direcao gerencia o mural publico"
ON public.mural_publico FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.perfis_usuarios p
        WHERE p.id = auth.uid()
        AND p.role = 'direcao'
    )
);

-- 6. Políticas: chaves_gabinete
-- Apenas usuários autenticados da Direção acessam os envelopes criptográficos
CREATE POLICY "Acesso a chaves do gabinete pela direcao"
ON public.chaves_gabinete FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.perfis_usuarios p
        WHERE p.id = auth.uid()
        AND p.role = 'direcao'
    )
);

-- ==============================================================================
-- 7. CONFORMIDADE: SUPABASE SCHEMA SECURITY UPDATE (DATA API GRANTS)
-- ==============================================================================
-- Permissões explícitas no schema public para acesso via Data API / PostgREST,
-- sendo o acesso a linhas estritamente governado pelas políticas de RLS acima.

-- Tabela: cursos
GRANT SELECT ON public.cursos TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cursos TO authenticated;
GRANT ALL ON public.cursos TO service_role;

-- Tabela: perfis_usuarios
GRANT SELECT ON public.perfis_usuarios TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.perfis_usuarios TO authenticated;
GRANT ALL ON public.perfis_usuarios TO service_role;

-- Tabela: artigos
GRANT SELECT ON public.artigos TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.artigos TO authenticated;
GRANT ALL ON public.artigos TO service_role;

-- Tabela: protocolos_internos
GRANT INSERT ON public.protocolos_internos TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.protocolos_internos TO authenticated;
GRANT ALL ON public.protocolos_internos TO service_role;

-- Tabela: mural_publico
GRANT SELECT ON public.mural_publico TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.mural_publico TO authenticated;
GRANT ALL ON public.mural_publico TO service_role;

-- Tabela: chaves_gabinete
GRANT SELECT ON public.chaves_gabinete TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.chaves_gabinete TO authenticated;
GRANT ALL ON public.chaves_gabinete TO service_role;

-- Função RPC: consultar_protocolo_seguro
GRANT EXECUTE ON FUNCTION public.consultar_protocolo_seguro(VARCHAR, VARCHAR) TO anon;
GRANT EXECUTE ON FUNCTION public.consultar_protocolo_seguro(VARCHAR, VARCHAR) TO authenticated;
GRANT EXECUTE ON FUNCTION public.consultar_protocolo_seguro(VARCHAR, VARCHAR) TO service_role;

