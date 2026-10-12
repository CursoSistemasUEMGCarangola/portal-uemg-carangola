-- ==============================================================================
-- MIGRAÇÃO: Tabela Keepalive (Prevenção de Pausa por Inatividade no Free Tier)
-- Projeto: Portal UEMG Carangola
-- Finalidade: Permitir ping transacional via GitHub Actions (PATCH /rest/v1/keepalive)
-- ==============================================================================

-- 1. Cria a tabela keepalive
CREATE TABLE IF NOT EXISTS public.keepalive (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    pinged_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Habilita Row Level Security (RLS)
ALTER TABLE public.keepalive ENABLE ROW LEVEL SECURITY;

-- 3. Políticas de RLS
DROP POLICY IF EXISTS "Permitir leitura pública" ON public.keepalive;
CREATE POLICY "Permitir leitura pública" ON public.keepalive
    FOR SELECT TO public
    USING (true);

DROP POLICY IF EXISTS "Permitir atualização pública" ON public.keepalive;
CREATE POLICY "Permitir atualização pública" ON public.keepalive
    FOR UPDATE TO public
    USING (id IS NOT NULL)
    WITH CHECK (pinged_at IS NOT NULL);

-- 4. Registro sentinela inicial (garante que existe registro para UPDATE)
INSERT INTO public.keepalive (pinged_at)
SELECT now()
WHERE NOT EXISTS (SELECT 1 FROM public.keepalive);

-- 5. Concessões de Schema (Supabase Data API Grants)
GRANT SELECT, UPDATE ON public.keepalive TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.keepalive TO authenticated;
GRANT ALL ON public.keepalive TO service_role;
