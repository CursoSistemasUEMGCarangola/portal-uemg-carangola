-- ==============================================================================
-- MIGRAÇÃO DAY 2: Inclusão do Curso de Graduação em Administração (ADM)
-- Projeto: Portal UEMG Carangola (Publicações Acadêmicas & Fale com a Direção)
-- Conformidade: Hard Box DNA & Governança Institucional
-- ==============================================================================

INSERT INTO public.cursos (nome, sigla, descricao)
VALUES (
    'Administração',
    'ADM',
    'Bacharelado em Administração — O curso forma profissionais para atuar como empreendedores administrando recursos financeiros, materiais e de pessoas. Oferece formação técnica e humana de profissionais em um contexto local e global e construção de métodos e instrumentos para uma administração sistemática e organizada.'
)
ON CONFLICT (sigla) DO UPDATE SET
    nome = EXCLUDED.nome,
    descricao = EXCLUDED.descricao;
