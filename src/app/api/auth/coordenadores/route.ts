import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { enviarEmailAprovacaoCoordenador } from '@/lib/email/brevo';
import { CURSOS_LISTA } from '@/lib/data/mock-articles';

export const dynamic = 'force-dynamic';

const CURSO_NOME_MAPA: Record<string, string> = {
  BIO: 'Ciências Biológicas',
  GEO: 'Geografia',
  HIS: 'História',
  LET: 'Letras (Português/Inglês)',
  MAT: 'Matemática',
  PED: 'Pedagogia',
  SSO: 'Serviço Social',
  SIS: 'Sistemas de Informação',
  ADM: 'Administração',
};

// GET: Lista coordenadores e status de homologação (Exclusivo Gabinete da Direção)
export async function GET() {
  try {
    const supabaseUserClient = createServerSupabaseClient();
    const {
      data: { user },
    } = await supabaseUserClient.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 });
    }

    const role = user.user_metadata?.role;
    if (role !== 'direcao') {
      return NextResponse.json(
        { error: 'Acesso restrito ao Gabinete da Direção Geral.' },
        { status: 403 }
      );
    }

    const supabaseAdmin = getSupabaseAdmin();
    const { data: usersData, error: listError } = await supabaseAdmin.auth.admin.listUsers();

    if (listError) {
      return NextResponse.json({ error: listError.message }, { status: 500 });
    }

    const coordenadores = (usersData.users || [])
      .filter(
        (u) =>
          u.user_metadata?.role === 'coordenador_curso' ||
          u.user_metadata?.status === 'mandato_encerrado'
      )
      .map((u) => {
        const meta = u.user_metadata || {};
        const sigla = (meta.curso_sigla || 'SIS').toUpperCase();
        return {
          id: u.id,
          nomeCompleto: meta.nome_completo || 'Não informado',
          emailInstitucional: u.email || '',
          emailSecundario: meta.email_secundario || '',
          matricula: meta.matricula || '',
          cursoSigla: sigla,
          cursoNome: CURSO_NOME_MAPA[sigla] || sigla,
          status: meta.status || 'ativo',
          solicitadoEm: meta.solicitado_em || u.created_at,
          aprovadoEm: meta.homologado_em || meta.aprovado_em || null,
          substituidoPorNome: meta.substituido_por_nome || null,
          mandatoEncerradoEm: meta.mandato_encerrado_em || null,
        };
      })
      .sort((a, b) => new Date(b.solicitadoEm).getTime() - new Date(a.solicitadoEm).getTime());

    return NextResponse.json({ coordenadores }, { status: 200 });
  } catch (error: any) {
    console.error('Erro ao listar coordenadores:', error);
    return NextResponse.json(
      { error: error?.message || 'Erro ao processar solicitação.' },
      { status: 500 }
    );
  }
}

// POST: Homologar ou Rejeitar acesso de Coordenador de Curso (com Transição de Mandato)
export async function POST(request: Request) {
  try {
    const supabaseUserClient = createServerSupabaseClient();
    const {
      data: { user: callerUser },
    } = await supabaseUserClient.auth.getUser();

    if (!callerUser) {
      return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 });
    }

    if (callerUser.user_metadata?.role !== 'direcao') {
      return NextResponse.json(
        { error: 'Apenas a Direção Geral pode homologar acessos.' },
        { status: 403 }
      );
    }

    const { userId, acao } = await request.json();

    if (!userId || !['aprovar', 'rejeitar', 'reenviar_email'].includes(acao)) {
      return NextResponse.json(
        { error: 'Parâmetros inválidos (userId e acao: aprovar | rejeitar | reenviar_email obrigatórios).' },
        { status: 400 }
      );
    }

    const supabaseAdmin = getSupabaseAdmin();
    const { data: targetData, error: getUserError } = await supabaseAdmin.auth.admin.getUserById(userId);

    if (getUserError || !targetData.user) {
      return NextResponse.json({ error: 'Usuário não localizado.' }, { status: 404 });
    }

    const targetUser = targetData.user;
    const currentMeta = targetUser.user_metadata || {};
    const emailSecundario = currentMeta.email_secundario;

    if (!emailSecundario) {
      return NextResponse.json(
        { error: 'O coordenador selecionado não possui um e-mail alternativo/pessoal registrado.' },
        { status: 400 }
      );
    }

    // Ação: Reenviar Notificação por e-mail
    if (acao === 'reenviar_email') {
      const sigla = (currentMeta.curso_sigla || 'SIS').toUpperCase();
      const cursoNome = CURSO_NOME_MAPA[sigla] || sigla;

      const envioRes = await enviarEmailAprovacaoCoordenador({
        destinatarioEmail: emailSecundario,
        destinatarioNome: currentMeta.nome_completo || 'Coordenador',
        emailInstitucional: targetUser.email || '',
        cursoNome,
      });

      if (!envioRes.sucesso) {
        return NextResponse.json(
          { error: `Falha ao reenviar e-mail via Brevo: ${envioRes.erro}` },
          { status: 502 }
        );
      }

      return NextResponse.json(
        {
          message: `Notificação reenviada com sucesso para o e-mail alternativo: ${emailSecundario}.`,
          emailDestino: emailSecundario,
          messageId: envioRes.messageId,
        },
        { status: 200 }
      );
    }

    // Ação: Aprovar ou Rejeitar
    const sigla = (currentMeta.curso_sigla || 'SIS').toUpperCase();
    const cursoNome = CURSO_NOME_MAPA[sigla] || sigla;
    let nomesSubstituidos: string[] = [];

    if (acao === 'aprovar') {
      // 1. Localiza titulares ativos anteriores do mesmo colegiado para realizar a transição
      const { data: allUsers } = await supabaseAdmin.auth.admin.listUsers();
      const coordenadoresAnteriores = (allUsers?.users || []).filter(
        (u) =>
          u.id !== userId &&
          u.user_metadata?.status === 'ativo' &&
          u.user_metadata?.role === 'coordenador_curso' &&
          (u.user_metadata?.curso_sigla || '').toUpperCase() === sigla
      );

      // 2. Encerra o mandato de cada coordenador anterior e converte seu perfil para autor/docente
      for (const anterior of coordenadoresAnteriores) {
        const nomeAnt = anterior.user_metadata?.nome_completo || anterior.email || 'Titular anterior';
        nomesSubstituidos.push(nomeAnt);

        await supabaseAdmin.auth.admin.updateUserById(anterior.id, {
          user_metadata: {
            ...anterior.user_metadata,
            role: 'autor',
            status: 'mandato_encerrado',
            mandato_encerrado_em: new Date().toISOString(),
            substituido_por: targetUser.email,
            substituido_por_nome: currentMeta.nome_completo || 'Novo Coordenador',
          },
        });

        // Sincroniza tabela pública perfis_usuarios
        await supabaseAdmin
          .from('perfis_usuarios')
          .update({ role: 'autor' })
          .eq('id', anterior.id);
      }

      // 3. Ativa o novo coordenador como titular exclusivo
      const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
        user_metadata: {
          ...currentMeta,
          role: 'coordenador_curso',
          status: 'ativo',
          homologado_em: new Date().toISOString(),
          homologado_por: callerUser.email,
        },
      });

      if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 500 });
      }

      // Sincroniza tabela pública perfis_usuarios
      await supabaseAdmin
        .from('perfis_usuarios')
        .update({ role: 'coordenador_curso' })
        .eq('id', userId);

      // 4. Dispara e-mail de notificação de homologação via Brevo
      const envioRes = await enviarEmailAprovacaoCoordenador({
        destinatarioEmail: emailSecundario,
        destinatarioNome: currentMeta.nome_completo || 'Coordenador',
        emailInstitucional: targetUser.email || '',
        cursoNome,
      });

      let avisoEnvio = envioRes.sucesso
        ? ` E-mail de confirmação enviado para: ${emailSecundario}.`
        : ` (Atenção: Acesso ativado, falha temporária no Brevo: ${envioRes.erro})`;

      let mensagemFinal = `Acesso de Coordenador homologado com sucesso!${avisoEnvio}`;
      if (nomesSubstituidos.length > 0) {
        mensagemFinal = `Transição de mandato concluída com sucesso! O mandato de ${nomesSubstituidos.join(', ')} foi encerrado (convertido para Docente/Autor) e o colegiado de ${cursoNome} agora está sob titularidade de ${currentMeta.nome_completo}.${avisoEnvio}`;
      }

      return NextResponse.json(
        {
          message: mensagemFinal,
          status: 'ativo',
          emailDestino: emailSecundario,
          substituidos: nomesSubstituidos,
        },
        { status: 200 }
      );
    } else {
      // Rejeitar solicitação
      const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
        user_metadata: {
          ...currentMeta,
          status: 'rejeitado',
          homologado_em: new Date().toISOString(),
          homologado_por: callerUser.email,
        },
      });

      if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 500 });
      }

      return NextResponse.json(
        {
          message: `Solicitação de acesso para a coordenação de ${cursoNome} indeferida pela Direção Geral.`,
          status: 'rejeitado',
          emailDestino: emailSecundario,
        },
        { status: 200 }
      );
    }
  } catch (error: any) {
    console.error('Erro ao homologar coordenador:', error);
    return NextResponse.json(
      { error: error?.message || 'Erro ao homologar cadastro.' },
      { status: 500 }
    );
  }
}
