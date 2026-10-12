-- ==============================================================================
-- MIGRAÇÃO: Remoção da Coluna DOI na Tabela artigos
-- Projeto: Portal UEMG Carangola
-- Finalidade: Eliminar atributo DOI para conformidade com o modelo de publicação
-- ==============================================================================

ALTER TABLE public.artigos DROP COLUMN IF EXISTS doi;
