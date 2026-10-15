-- ==============================================================================
-- MIGRAÇÃO DAY 2: Atualização das Apresentações Oficiais dos Cursos (Estrutura Departamental)
-- Projeto: Portal UEMG Carangola (Publicações Acadêmicas & Fale com a Direção)
-- Conformidade: Hard Box DNA & Governança Institucional
-- ==============================================================================

UPDATE public.cursos SET
    descricao = 'Licenciatura em Ciências Biológicas — O curso forma professores com aptidão para desenvolver ações educativas em espaços escolares e não escolares, preparados para a análise da origem, evolução, estrutura, funcionamento e relação dos seres vivos; também podendo realizar pesquisas, principalmente nas áreas da Zoologia, Botânica, Genética e Ecologia.'
WHERE sigla = 'BIO';

UPDATE public.cursos SET
    descricao = 'Licenciatura em Geografia — O curso prepara profissional para atuar na docência, com conhecimentos voltados para a relação entre elementos naturais (solo, clima, relevo e vegetação) e sociais (cultura, história e geopolítica), sua localização e impactos. Permite também o desenvolvimento de habilidades que priorizam a formação de cidadãos críticos, conhecedores da dinâmica do espaço e paisagens que os cercam em diversas escalas e temporalidades.'
WHERE sigla = 'GEO';

UPDATE public.cursos SET
    descricao = 'Licenciatura em História — O curso oferece ao aluno formação com clara ênfase na prática do ensino de História, mas concilia a educação superior e a prática pedagógica ao desenvolvimento de habilidades para execução de projetos de pesquisas em temáticas regionais. A utilização dos ricos acervos documentais da região do sul de Minas e da cidade de Campanha possibilita uma formação diferencial dos nossos alunos numa perspectiva articulada e dialética entre ensino e pesquisa.'
WHERE sigla = 'HIS';

UPDATE public.cursos SET
    descricao = 'Licenciatura em Letras — O curso forma profissional para atuar no ensino da língua inglesa e portuguesa e suas literaturas; na elaboração, revisão e correção de textos em editoras e órgãos da imprensa; criação de versões de um idioma para o outro de textos técnicos e literários; atuar em conferências e simpósios, efetuando interpretações simultâneas ou consecutivas.'
WHERE sigla = 'LET';

UPDATE public.cursos SET
    descricao = 'Licenciatura em Matemática — O curso tem como objetivo proporcionar uma sólida formação matemática para atuação em ensino fundamental e médio, bem como preparar profissionais críticos e criativos, possibilitando reflexões sobre o papel do professor no processo de ensino-aprendizagem, com foco em suas limitações e potencialidades.'
WHERE sigla = 'MAT';

UPDATE public.cursos SET
    descricao = 'Licenciatura em Pedagogia — O curso forma profissionais para atuar com a educação escolar na educação infantil e nos anos iniciais do ensino fundamental, em escolas públicas e privadas. Com base teórico-prática voltada para a compreensão do fenômeno educacional na contemporaneidade.'
WHERE sigla = 'PED';

UPDATE public.cursos SET
    descricao = 'Bacharelado em Serviço Social — O curso forma profissional para atuar na elaboração, execução e avaliação de planos, programas e projetos na área social, contribuindo para a viabilização da participação dos usuários nas decisões institucionais, planejando, organizando e administrando benefícios e serviços, bem como a realização de pesquisas que subsidiem formulação de políticas e ações profissionais.'
WHERE sigla = 'SSO';

UPDATE public.cursos SET
    descricao = 'Bacharelado em Sistemas de Informação — O curso tem por objetivo a formação de profissionais capacitados para atuar na busca de soluções nas diferentes áreas de aplicação, com uma visão dinâmica da complexidade organizacional, voltados para a atualização tecnológica e as demandas do mercado, podendo atuar também na inovação, planejamento, gerenciamento da infraestrutura, coordenação, desenvolvimento e evolução dos recursos e sistemas de informação.'
WHERE sigla = 'SIS' OR sigla = 'SIN';
