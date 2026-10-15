import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      protocoloId,
      acao,
      despachoOficial,
      numeroPortaria,
      resumoSanitizadoMural,
    } = body;

    if (!protocoloId || !acao || !despachoOficial) {
      return NextResponse.json(
        { error: 'Parâmetros incompletos para assinar o despacho.' },
        { status: 400 }
      );
    }

    let novoStatus: string;
    switch (acao) {
      case 'analise_assessoria':
        novoStatus = 'em_analise_assessoria';
        break;
      case 'analise_diretoria':
        novoStatus = 'em_analise_diretoria';
        break;
      case 'responder_privado':
        novoStatus = 'respondido_privado';
        break;
      case 'homologar_mural':
        novoStatus = 'homologado_publico';
        break;
      default:
        novoStatus = 'pendente';
    }

    const supabase = getSupabaseAdmin();

    // 1. Localiza o registro em protocolos_internos por UUID ou por codigo_protocolo
    const { data: protoExistente, error: errBusca } = await supabase
      .from('protocolos_internos')
      .select('id, codigo_protocolo, curso_id, criado_em, status')
      .or(`id.eq.${protocoloId},codigo_protocolo.eq.${protocoloId}`)
      .maybeSingle();

    if (errBusca) {
      console.warn('Erro ao buscar protocolo:', errBusca.message);
    }

    const codigoFinal = protoExistente?.codigo_protocolo || protocoloId;
    const cursoIdFinal = protoExistente?.curso_id || null;
    const dataCriacaoFinal = protoExistente?.criado_em || new Date().toISOString();

    // 2. Atualiza protocolos_internos
    if (protoExistente?.id) {
      const { error: errUpdate } = await supabase
        .from('protocolos_internos')
        .update({
          status: novoStatus,
          despacho_cifrado: despachoOficial,
          numero_portaria: numeroPortaria || null,
          atualizado_em: new Date().toISOString(),
        })
        .eq('id', protoExistente.id);

      if (errUpdate) {
        console.error('Erro ao atualizar protocolos_internos:', errUpdate);
        return NextResponse.json({ error: errUpdate.message }, { status: 500 });
      }
    } else {
      // Se não encontrou por ID direto, tenta por codigo_protocolo
      await supabase
        .from('protocolos_internos')
        .update({
          status: novoStatus,
          despacho_cifrado: despachoOficial,
          numero_portaria: numeroPortaria || null,
          atualizado_em: new Date().toISOString(),
        })
        .eq('codigo_protocolo', codigoFinal);
    }

    // 3. Gerenciamento do Mural Público (Hard Box DNA #3 - Tabela Desacoplada)
    if (acao === 'homologar_mural') {
      const resumoFinal =
        resumoSanitizadoMural ||
        `Manifestação de interesse institucional e acadêmico protocolada sob o registro ${codigoFinal} referente à Unidade de Carangola (dados pessoais preservados nos termos da LAI e LGPD).`;

      // Verifica se já existe publicação para este código de protocolo
      const { data: muralExistente } = await supabase
        .from('mural_publico')
        .select('id')
        .eq('protocolo_referencia', codigoFinal)
        .maybeSingle();

      if (muralExistente?.id) {
        const { error: errMuralUpdate } = await supabase
          .from('mural_publico')
          .update({
            curso_id: cursoIdFinal,
            manifestacao_resumo: resumoFinal,
            resposta_oficial: despachoOficial,
            numero_portaria: numeroPortaria || null,
            status_homologacao: 'Homologado e Respondido',
            is_active: true,
            publicado_em: new Date().toISOString(),
          })
          .eq('id', muralExistente.id);

        if (errMuralUpdate) {
          console.warn('Aviso: Erro ao atualizar mural_publico:', errMuralUpdate.message);
        }
      } else {
        const { error: errMuralInsert } = await supabase
          .from('mural_publico')
          .insert({
            protocolo_referencia: codigoFinal,
            curso_id: cursoIdFinal,
            manifestacao_resumo: resumoFinal,
            resposta_oficial: despachoOficial,
            numero_portaria: numeroPortaria || null,
            status_homologacao: 'Homologado e Respondido',
            is_active: true,
            data_manifestacao: dataCriacaoFinal,
            publicado_em: new Date().toISOString(),
          });

        if (errMuralInsert) {
          console.warn('Aviso: Erro ao inserir no mural_publico:', errMuralInsert.message);
        }
      }
    } else if (acao !== 'homologar_mural') {
      // Se o protocolo não está mais homologado publicamente, desativa do mural se houver
      await supabase
        .from('mural_publico')
        .update({ is_active: false })
        .eq('protocolo_referencia', codigoFinal);
    }

    return NextResponse.json({
      success: true,
      protocolo: codigoFinal,
      novoStatus,
    });
  } catch (err: any) {
    console.error('Erro na rota de despacho:', err);
    return NextResponse.json(
      { error: err?.message || 'Erro interno no servidor de despacho.' },
      { status: 500 }
    );
  }
}
