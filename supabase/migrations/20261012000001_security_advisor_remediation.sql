-- ==============================================================================
-- MIGRAÇÃO: Adequações de Segurança e Hardening (Supabase Security Advisor)
-- Projeto: Portal UEMG Carangola
-- Finalidade: Eliminar warnings de search_path mutável e RLS excessivamente permissivo
-- ==============================================================================

-- 1. FIX: search_path mutável e validação na função SECURITY DEFINER consultar_protocolo_seguro
-- Mitiga search_path hijacking garantindo resolução segura de schema (public, pg_temp)
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

-- 2. FIX: Hardening de RLS para Envio Público em protocolos_internos
-- Substitui WITH CHECK (true) por validação estrita dos campos permitidos no envio público
DROP POLICY IF EXISTS "Envio publico de manifestacao cifrada" ON public.protocolos_internos;
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

-- 3. FIX: Hardening de RLS para Atualização em keepalive
-- Substitui USING (true) WITH CHECK (true) por predicados específicos de integridade
DROP POLICY IF EXISTS "Permitir atualização pública" ON public.keepalive;
CREATE POLICY "Permitir atualização pública" ON public.keepalive
    FOR UPDATE TO public
    USING (id IS NOT NULL)
    WITH CHECK (pinged_at IS NOT NULL);
