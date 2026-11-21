(() => {
  'use strict';

  /* ---------------- DATA ---------------- */
  /* Módulos do case (como no Behance):
     ['img', arquivo, w, h]            imagem na largura toda
     ['row', [arquivos], w, h]         imagens lado a lado (mesma proporção)
     ['video', vimeoId, w, h]          vídeo do Vimeo em loop, mudo
     ['compare', antes, depois, w, h]  slider de antes/depois */
  const A = (slug, f) => `assets/projects/${slug}/${f}`;
  const seq = (from, to, ext = 'webp') => Array.from({ length: to - from + 1 }, (_, i) => `${pad(from + i)}.${ext}`);
  const pad = n => String(n).padStart(2, '0');

  /* ---------------- IDIOMA (PT / EN) ----------------
     Ordem: ?lang=pt|en no link  >  escolha salva no seletor BR/US  >  idioma do navegador (pt* = PT, resto = EN) */
  const LANGS = ['pt', 'en'];
  function detectLang() {
    const q = new URLSearchParams(location.search).get('lang');
    if (LANGS.includes(q)) return q;
    try { const s = localStorage.getItem('lang'); if (LANGS.includes(s)) return s; } catch (e) {}
    const nav = (navigator.languages && navigator.languages[0]) || navigator.language || '';
    return /^pt/i.test(nav) ? 'pt' : 'en';
  }
  let LANG = detectLang();
  document.documentElement.lang = LANG === 'pt' ? 'pt-BR' : 'en';

  const T = {
    pt: {
      'nav.videos-motion': 'Vídeos & Motion', 'nav.projetos': 'Projetos', 'nav.sites-lps': 'Sites & LP’S',
      'hero.left': 'Vídeos / Motion /\nBranding /\nDesign / UX/UI /',
      'hero.right': 'Born in Brasil /\nCuritiba, PR',
      'rc.a1': 'DESIGNER', 'rc.a2': 'ACHO MUITO FODA FAZER MOTION', 'rc.a3': 'FAÇO TUDO OUVINDO MÚSICA', 'rc.a4': 'COMECEI EDITAR VÍDEOS COM 11 ANOS',
      'about.p1': 'Sou o Winycius, ou Vinse. Editor de vídeo e motion designer\nde Curitiba, e também mexo com branding, design e UX/UI.',
      'about.p1m': 'Sou o Winycius, ou Vinse.\nEditor de vídeo e motion designer de Curitiba,\ne também mexo com branding, design e UX/UI.',
      'about.p2': 'Comecei a editar com 11 anos e até hoje não soltei a timeline.\nEm algum momento isso virou trabalho: vídeo clipe, tipografias, social media, site e tudo que precisar.',
      'about.p2m': 'Comecei a editar com 11 anos e até\nhoje não soltei a timeline.\nEm algum momento isso virou trabalho:\nvídeo clipe, tipografias, social media,\nsite e tudo que precisar.',
      'about.photo': 'Winycius criança, fantasiado de Homem-Aranha, pendurado numa barra azul',
      'home.portfolio': '/ PORTFÓLIO',
      'count.one': 'projeto', 'count.many': 'projetos',
      'meta.cat': 'Categoria', 'meta.year': 'Ano', 'meta.client': 'Cliente', 'meta.published': 'Publicado no', 'meta.live': 'No ar',
      'back': 'Voltar para', 'next': '/ PRÓXIMO',
      'v.all': 'Todos', 'v.logo': 'Animações de logo', 'v.video': 'Vídeos', 'v.motion': 'Motion',
      'watch': 'Assistir', 'close': 'Fechar', 'filter': 'Filtrar',
      'ex.works': 'trabalhos', 'ex.label': 'Explorar portfólio',
      'full': 'Página completa', 'doc.home': 'V__NSE — Portfólio', 'sound': 'Som: BK — Caminhos', 'lang': 'Idioma',
      'menu': 'Abrir menu', 'menu.close': 'Fechar menu',
    },
    en: {
      'nav.videos-motion': 'Videos & Motion', 'nav.projetos': 'Projects', 'nav.sites-lps': 'Websites & LP’S',
      'hero.left': 'Videos / Motion /\nBranding /\nDesign / UX/UI /',
      'hero.right': 'Born in Brasil /\nCuritiba, PR',
      'rc.a1': 'DESIGNER', 'rc.a2': 'I THINK MOTION IS DOPE', 'rc.a3': 'I DO EVERYTHING WITH MUSIC ON', 'rc.a4': 'STARTED EDITING VIDEOS AT 11',
      'about.p1': 'I’m Winycius, or Vinse. Video editor and motion designer\nfrom Curitiba, and I also work with branding, design and UX/UI.',
      'about.p1m': 'I’m Winycius, or Vinse.\nVideo editor and motion designer from Curitiba,\nand I also work with branding, design and UX/UI.',
      'about.p2': 'I started editing at 11 and I still haven’t let go of the timeline.\nAt some point it turned into work: music videos, typography, social media, websites and whatever else comes up.',
      'about.p2m': 'I started editing at 11 and I still\nhaven’t let go of the timeline.\nAt some point it turned into work:\nmusic videos, typography, social media,\nwebsites and whatever else comes up.',
      'about.photo': 'Winycius as a kid, in a Spider-Man costume, hanging from a blue bar',
      'home.portfolio': '/ PORTFOLIO',
      'count.one': 'project', 'count.many': 'projects',
      'meta.cat': 'Category', 'meta.year': 'Year', 'meta.client': 'Client', 'meta.published': 'Published on', 'meta.live': 'Live',
      'back': 'Back to', 'next': '/ NEXT',
      'v.all': 'All', 'v.logo': 'Logo animations', 'v.video': 'Videos', 'v.motion': 'Motion',
      'watch': 'Watch', 'close': 'Close', 'filter': 'Filter',
      'ex.works': 'works', 'ex.label': 'Explore portfolio',
      'full': 'Full page', 'doc.home': 'V__NSE — Portfolio', 'sound': 'Sound: BK — Caminhos', 'lang': 'Language',
      'menu': 'Open menu', 'menu.close': 'Close menu',
    },
  };
  const t = k => (T[LANG][k] ?? T.pt[k] ?? k);
  // termos que vêm dos dados (categorias, títulos, abas) — só traduz no inglês
  const EN_TERMS = {
    'ID Visual': 'Visual identity', 'Vídeos': 'Videos', 'Site institucional': 'Institutional website',
    'Animação de logo': 'Logo animation', 'Animações de logo': 'Logo animations', 'Motion comercial': 'Motion',
    'Início': 'Home', 'Quem somos': 'About us', 'Serviços': 'Services', 'Pneus': 'Tires', 'Contato': 'Contact',
    '/ Todas as páginas': '/ All pages', '05 páginas': '05 pages', '04 páginas': '04 pages', 'Site': 'Website',
    'Batalha do desenho engraçado vs Huggy Wuggy': 'Funny drawing battle vs Huggy Wuggy',
    'Bateram no meu Porsche': 'Someone crashed into my Porsche', 'Chegou minha caixa misteriosa': 'My mystery box arrived',
    'Inventário vermelho': 'Red inventory', 'Essa partida foi um delírio': 'That match was insane',
    'Agendas abertas': 'Enrollment open', 'Diário de obra #04': 'Construction diary #04', 'Escola bilíngue': 'Bilingual school',
    'Investimento': 'Investment', 'Negócios de sucesso': 'Successful business', 'Benefícios': 'Benefits',
  };
  const tr = s => (LANG === 'en' && EN_TERMS[s]) || s;
  /* Diagramação do texto do About:
     - cada frase vira um bloco, pra nenhuma frase começar na mesma linha em que a anterior terminou (no celular);
     - a última palavra de cada linha nunca fica sozinha (espaço que não quebra antes dela). */
  const NB = ' ';
  function noOrphan(line) {
    // palavrinhas (até 2 letras: "e", "de", "of"...) nunca terminam uma linha
    let s = line.replace(/(^|[\s ])([A-Za-zÀ-ÿ]{1,2})\s(?=[A-Za-zÀ-ÿ0-9])/g, (_, p, w) => `${p}${w}${NB}`);
    // e a última palavra da frase nunca cai sozinha
    const m = s.match(/^(.*)\s(\S+)$/);
    return m && m[2].replace(/[.,;:!?]$/, '').length <= 14 ? `${m[1]}${NB}${m[2]}` : s;
  }
  // \n no texto = quebra fixa (vale no desktop); ponto final = frase nova (vira linha no celular)
  function proseHTML(text) {
    const parts = text.split(/(?<=[.!?])(\s+)(?=[A-ZÀ-Ú“"])/);
    let out = '';
    for (let i = 0; i < parts.length; i += 2) {
      const sep = parts[i - 1] || '';
      const hard = sep.includes('\n') || parts[i].startsWith('\n');
      const body = parts[i].replace(/^\n/, '').split('\n').map(noOrphan).join('\n');
      out += `${i ? ' ' : ''}<span class="s${hard ? ' brk' : ''}">${body}</span>`;
    }
    return out;
  }
  // aplica os textos fixos marcados no HTML: data-i18n (texto) e data-i18n-aria (aria-label)
  function applyI18n(root) {
    root.querySelectorAll('[data-i18n]').forEach(el => {
      const k = el.dataset.i18n;
      // texto do About tem uma diagramação pro desktop e outra pro celular
      if (k.startsWith('about.p')) el.innerHTML = `<span class="v-d">${proseHTML(t(k))}</span><span class="v-m">${proseHTML(t(`${k}m`))}</span>`;
      else el.textContent = t(k);
    });
    root.querySelectorAll('[data-i18n-aria]').forEach(el => { el.setAttribute('aria-label', t(el.dataset.i18nAria)); });
    root.querySelectorAll('[data-i18n-alt]').forEach(el => { el.alt = t(el.dataset.i18nAlt); });
  }

  const PROJECTS = [
    { slug: 'elorah', name: 'ELORAH', cat: 'ID Visual', year: 2026, art: 'art-sky', group: 'projetos',
      fields: 'Branding, Direção de arte, Design gráfico', behance: 'https://www.behance.net/gallery/257899119/ELORAH-Brand-Identity',
      cover: A('elorah', 'cover.webp'),
      modules: [['img', '01.webp', 1400, 788], ['img', '02.webp', 1400, 1050], ['row', ['03.webp', '04.webp'], 960, 1440],
        ['img', '05.webp', 1400, 1050], ['img', '06.webp', 1400, 788], ['img', '07.webp', 1400, 1050], ['img', '08.webp', 1400, 875],
        ['img', '09.webp', 1400, 1050], ['img', '10.webp', 1400, 788], ['row', ['11.webp', '12.webp'], 1200, 1500],
        ['img', '13.webp', 1400, 788], ['img', '14.webp', 1400, 1050], ['img', '15.webp', 1400, 904],
        ['row', ['16.webp', '17.webp'], 1200, 1500], ['row', ['18.webp', '19.webp'], 960, 1440],
        ['img', '20.webp', 1400, 788], ['img', '21.webp', 1400, 1050], ['img', '22.webp', 1400, 1050],
        ['img', '23.webp', 1400, 788], ['img', '24.webp', 1400, 788]] },
    { slug: 'skytech', name: 'Skytech', cat: 'ID Visual', year: 2025, art: 'art-sky', group: 'projetos',
      fields: 'Branding, Design gráfico, Publicidade', behance: 'https://www.behance.net/gallery/219931233/Skytech',
      cover: A('skytech', 'cover.webp'),
      modules: [['img', '01.webp', 1400, 788], ['video', '1187823400', 1400, 788],
        ...seq(2, 8).map(f => ['img', f, 1400, 788])] },
    { slug: 'ultracoffee', name: 'Ultracoffee', cat: 'Motion', year: 2024, art: 'art-coffee', group: 'videos-motion' },
    { slug: 'kaizen', name: 'Kaizen', cat: 'Social Media', year: 2025, art: 'art-kaizen', group: 'projetos',
      fields: 'Social media — Instituto Kaizen', behance: 'https://www.behance.net/gallery/231832315/Social-Media-Instituto-Kaizen',
      cover: A('kaizen', 'cover.webp'),
      modules: [['img', '01.webp', 1400, 788],
        ['row', seq(2, 6), 930, 1163], ['row', seq(7, 10), 930, 1163], ['row', seq(11, 15), 930, 1163],
        ['row', seq(16, 19), 930, 1163], ['row', seq(20, 23), 930, 1163], ['row', seq(24, 27, 'gif'), 930, 1163]] },
    { slug: 'kids', name: 'Kids Centro Educacional', cat: 'Vídeos', year: 2025, art: 'art-kids', group: 'videos-motion' },
    { slug: 'calceleve', name: 'Calceleve', cat: 'Branding', year: 2026, art: 'art-coffee', group: 'projetos',
      fields: 'Direção de arte, Design gráfico, Design de produto', behance: 'https://www.behance.net/gallery/253294779/Calceleve',
      cover: A('calceleve', 'cover.webp'),
      modules: [['img', '01.webp', 1400, 788], ['img', '02.webp', 1400, 788], ['row', ['03.webp', '04.webp'], 1, 1],
        ['video', '1212815940', 1400, 788], ['img', '05.webp', 1400, 788], ['img', '06.webp', 1400, 788], ['img', '07.webp', 1400, 788],
        ['row', ['08.webp', '09.webp'], 1, 1], ['row', ['10.webp', '11.webp'], 1, 1],
        ['img', '12.webp', 1400, 781], ['img', '13.webp', 1400, 788],
        ['video', '1213100655', 1400, 788], ['video', '1213125480', 1400, 292]] },
    { slug: 'helo-ribeiro', name: 'Helo Ribeiro', cat: 'ID Visual', year: 2026, art: 'art-sky', group: 'projetos',
      fields: 'Design de logotipo, Ilustração, Design gráfico', behance: 'https://www.behance.net/gallery/248750391/Helo-Ribeiro',
      cover: A('helo-ribeiro', 'cover.webp'),
      modules: [...seq(1, 3).map(f => ['img', f, 1400, 788]), ['compare', 'antes.jpg', 'depois.jpg', 1920, 612],
        ...seq(4, 8).map(f => ['img', f, 1400, 788]), ['row', ['09.webp', '10.webp'], 930, 1046],
        ['img', '11.webp', 1400, 788], ['img', '12.webp', 1400, 394]] },
  ];
  /* Sites & LP's — módulos extras:
     ['browser', print, w, h, url]   janela de navegador com a página rolando sozinha
     ['phones', printMobile, w, h]   dois celulares (topo + página rolando)
     ['full', print, w, h]           a página inteira, de cima a baixo */
  const SITES = [
    { slug: 'magili', name: 'Mágili', cat: 'Site institucional', year: 2025, art: 'art-site-a', group: 'sites-lps', site: true,
      fields: 'Site institucional — Mágili Car Service, Curitiba', cover: A('magili', 'cover.jpg'),
      modules: [
        ['pages', 'Mágili Car Service', [['Início', 'home.jpg', ' · Início'], ['Quem somos', 'quem-somos.jpg', ' · Quem somos'], ['Serviços', 'servicos.jpg', ' · Serviços'], ['Pneus', 'pneus.jpg', ' · Pneus'], ['Contato', 'contato.jpg', ' · Contato']]],
        ['compare-scroll', [['Início', 'wf-home.jpg', 'home.jpg'], ['Quem somos', 'wf-quem-somos.jpg', 'quem-somos.jpg'], ['Serviços', 'wf-servicos.jpg', 'servicos.jpg'], ['Pneus', 'wf-pneus.jpg', 'pneus.jpg']], 'Wireframe', 'Site'],
        ['board', '/ Todas as páginas', '05 páginas', [['Início', 'home-thumb.jpg'], ['Quem somos', 'quem-somos-thumb.jpg'], ['Serviços', 'servicos-thumb.jpg'], ['Pneus', 'pneus-thumb.jpg'], ['Contato', 'contato-thumb.jpg']]],
        ['board', '/ Wireframes', '04 páginas', [['Início', 'wf-home-thumb.jpg'], ['Quem somos', 'wf-quem-somos-thumb.jpg'], ['Serviços', 'wf-servicos-thumb.jpg'], ['Pneus', 'wf-pneus-thumb.jpg']]],
      ] },
    { slug: 'dr-cold', name: 'Dr. Cold', cat: 'Landing Page', year: 2026, art: 'art-site-b', group: 'sites-lps', site: true,
      fields: 'Landing page — Ar-condicionado, Curitiba', live: 'https://lp-drcold.pages.dev/',
      cover: A('dr-cold', 'hero.jpg'),
      modules: [['browser', 'desktop.jpg', 1440, 7161, 'lp-drcold.pages.dev'], ['phones', 'mobile.jpg', 600, 13962], ['full', 'desktop.jpg', 1440, 7161]] },
  ];
  /* Vídeos & Motion (YouTube + GIFs de logo, vindos do vinsefx.netlify.app)
     cat: 'logo' | 'video' | 'motion'   v: vertical (9:16) */
  const V = (id, client, title, cat, v = false) => ({ id, client, title, cat, v, thumb: `assets/videos/${id}.jpg` });
  const VIDEOS = [
    { id: 'logo-1', client: 'Animação de logo', title: '01', cat: 'logo', gif: 'assets/videos/logo-1.gif' },
    { id: 'logo-2', client: 'Animação de logo', title: '02', cat: 'logo', gif: 'assets/videos/logo-2.gif' },
    { id: 'logo-3', client: 'Animação de logo', title: '03', cat: 'logo', gif: 'assets/videos/logo-3.gif' },
    // Vídeos — ordem do portfólio antigo (por importância)
    V('SQSqR3CTlic', 'Gato Galáctico', 'Batalha do desenho engraçado vs Huggy Wuggy', 'video'),
    V('TYhvNSViO1M', 'Cesar Paleari', 'Bateram no meu Porsche', 'video'),
    V('nzRx1bfQu1g', 'Cesar Paleari', 'Chegou minha caixa misteriosa', 'video'),
    V('qzORlEjYSHk', 'Lugin', 'Inventário vermelho', 'video'),
    V('7SO_-eyzwX0', 'wini.', 'Essa partida foi um delírio', 'video'),
    V('gIX473_Vy7o', 'wini.', 'The Ketchup Song', 'video'),
    V('OwQ5slTthGc', 'Lider-Ar', 'Meta Ads', 'video', true),
    V('bI-5d0c8sO4', 'Kids', 'Agendas abertas', 'video', true),
    V('PgWyFwEiNRM', 'Kids', 'Diário de obra #04', 'video', true),
    V('pZX1T2LLeeA', 'Kids', 'Escola bilíngue', 'video', true),
    V('qeZO8g2KGcc', 'Ardrak', 'Investimento', 'video', true),
    V('mzJ1YFY2tkw', 'Ardrak', 'Negócios de sucesso', 'video', true),
    // Motion comercial
    V('ebCdJU1TWMw', 'NPW', "Dev's", 'motion'),
    V('cBxKKD6-mCM', 'Avysa', 'Motion', 'motion', true),
    V('gpX-AiVpsmQ', 'Ardrak', 'Benefícios', 'motion', true),
    V('CPMYaT6-Gks', 'Ultracoffee', 'Halloween', 'motion', true),
  ];
  const VCATS = [['all', 'v.all'], ['logo', 'v.logo'], ['video', 'v.video'], ['motion', 'v.motion']];
  const vid = id => VIDEOS.find(x => x.id === id);

  // Ultracoffee e Kids ganham os vídeos deles
  Object.assign(PROJECTS.find(p => p.slug === 'ultracoffee'), { cover: vid('CPMYaT6-Gks').thumb, fields: 'Motion — Halloween', modules: [['videos', ['CPMYaT6-Gks']]] });
  Object.assign(PROJECTS.find(p => p.slug === 'kids'), { cover: vid('pZX1T2LLeeA').thumb, fields: 'Vídeos institucionais — Kids Centro Educacional', modules: [['videos', ['bI-5d0c8sO4', 'PgWyFwEiNRM', 'pZX1T2LLeeA']]] });

  /* Textos dos cases (os mesmos do Behance), em PT e EN.
     [depois do módulo nº, texto] — o número conta os módulos do case a partir de 0.
     note: true = observação pequena no fim. */
  const ABOUT = { pt: '/ Sobre o projeto', en: '/ About the project' };
  const CASE_TEXTS = {
    elorah: [
      [0, { h: ABOUT,
        pt: ['A ELORAH é uma pequena loja que faz canecas personalizadas, presentes e pijamas infantis. Tudo é feito uma peça por vez, com o nome de alguém e outra pessoa esperando pra receber.',
          'O desafio era dar à loja um rosto tão acolhedor quanto os produtos, sem parecer genérico. A resposta veio de dois olhares, um azul e um verde. Deles vieram o nome, as cores, o lettering e um par de olhinhos que virou o personagem da marca. Eles reagem, piscam, se encantam e vivem em tudo o que a loja entrega.'],
        en: ['ELORAH is a small shop that makes personalized mugs, gifts and pajamas for kids. Everything is made one piece at a time, with someone’s name on it and someone else waiting to receive it.',
          'The challenge was to give the shop a face that felt as warm as the products, without looking generic. The answer came from two looks, one blue and one green. From them came the name, the colors, the lettering and a pair of little eyes that became the brand’s character. They react, they wink, they fall in love, and they live on everything the shop sends out.'] }],
      [3, { h: { pt: '/ Dois olhares', en: '/ Two looks' },
        pt: ['Toda marca começa com um olhar. Esta começou com dois.',
          'O olhar azul deu forma ao “Elo”, escrito à mão. O olhar verde deu postura ao “Rah”, desenhado letra por letra, firme e de pé. E por cima de tudo, um respingo de tinta: quatro gotas, como cores numa paleta de pintor de madeira. É o lado criativo da loja, o momento em que uma caneca, uma camiseta ou uma caixa em branco ganha cor e vira de alguém.',
          'Os olhinhos são o personagem da marca. Curioso, de canto, encantado, feliz, piscando, apaixonado, sonhando. Um vocabulário inteiro de sentimentos, desenhado com o mesmo traço da logo.'],
        en: ['Every brand starts with a look. This one started with two.',
          'The blue look shaped “Elo”, handwritten. The green look gave “Rah” its posture, drawn letter by letter, steady and upright. And above it all, a splash of paint: four drops, like colors on a wooden painter’s palette. It’s the creative side of the shop, the moment a blank mug, shirt or box gets color and becomes someone’s.',
          'The little eyes are the brand’s character. Curious, sideways, enchanted, happy, winking, in love, dreaming. A whole vocabulary of feelings, drawn with the same monoline as the logo.'] }],
      [9, { h: { pt: '/ Um sistema feito pra ser personalizado', en: '/ A system built to be personalized' },
        pt: ['Os olhares viraram cor. Olhar Azul e Olhar Verde lideram a paleta. Afeto, Sol e Pincel vêm do respingo de tinta. Creme e Tinta dão respiro e leitura.',
          'A Fredoka leva os títulos com as mesmas formas redondas e macias do lettering. A DM Sans cuida de tudo que precisa ser lido.',
          'A logo funciona colorida, em negativo sobre as cores principais e em uma cor só, para estampas e carimbos. O respingo de tinta funciona sozinho como símbolo e, junto com os olhinhos, forma o padrão de papel de seda, adesivos e fundos.'],
        en: ['The looks became color. Olhar Azul and Olhar Verde lead the palette. Afeto, Sol and Pincel come from the paint splash. Creme and Tinta give the system room to breathe and to be read.',
          'Fredoka carries the headlines with the same round, soft shapes as the lettering. DM Sans handles everything that needs to be read.',
          'The logo works in full color, in negative over the main colors and in a single color for prints and stamps. The paint splash stands alone as a symbol, and together with the eyes it forms a pattern for tissue paper, stickers and backgrounds.'] }],
    ],
    skytech: [
      [0, { h: ABOUT,
        pt: ['Skytech é uma empresa fictícia especializada em soluções de infraestrutura em nuvem, escalabilidade e performance para negócios em crescimento. O projeto foi desenvolvido com o objetivo de construir uma identidade visual sólida, moderna e alinhada ao universo tecnológico, traduzindo inovação, confiança e expansão.',
          'O conceito da marca parte da união entre tecnologia, escala e conectividade. O nome Skytech remete à ideia de nuvem, elevação e futuro, reforçando o posicionamento da empresa como uma solução de cloud infrastructure preparada para crescimento.'],
        en: ['Skytech is a fictional company specializing in cloud infrastructure, scalability and performance for growing businesses. The goal was to build a solid, modern visual identity rooted in the world of technology, one that conveys innovation, trust and expansion.',
          'The brand concept brings together technology, scale and connectivity. The name Skytech evokes the cloud, elevation and the future, reinforcing the company’s position as cloud infrastructure built for growth.'] }],
      [5, { h: { pt: '/ Paleta e tipografia', en: '/ Color and type' },
        pt: ['A paleta foi desenvolvida para transmitir segurança, modernidade e alta performance.',
          'A tipografia escolhida reforça o aspecto contemporâneo e tecnológico da marca, mantendo alta legibilidade em aplicações digitais e impressas.'],
        en: ['The palette was built to convey security, modernity and high performance.',
          'The typeface reinforces the brand’s contemporary, tech-driven feel while staying highly legible in both digital and print.'] }],
      [8, { note: true,
        pt: ['*Projeto fictício desenvolvido unicamente para fins de estudo e demonstração.'],
        en: ['*Fictional project, created for study and demonstration purposes only.'] }],
    ],
    kaizen: [
      [0, { h: { pt: '/ Sobre o cliente', en: '/ About the client' },
        pt: ['O Instituto Princípio Kaizen, sediado em Curitiba/PR, é uma organização de educação e desenvolvimento humano especializada em treinamentos voltados ao crescimento pessoal e profissional.',
          'Eles combinam ferramentas como Programação Neurolinguística (PNL) e inteligência emocional para promover transformações comportamentais e ajudar pessoas e equipes a potencializar suas capacidades.'],
        en: ['Instituto Princípio Kaizen, based in Curitiba, Brazil, is an education and human development organization specializing in training for personal and professional growth.',
          'They combine tools such as Neuro-Linguistic Programming (NLP) and emotional intelligence to drive behavioral change and help people and teams reach their full potential.'] }],
    ],
    calceleve: [
      [0, { h: ABOUT,
        pt: ['Durante minha atuação na MoOn.ag, fui responsável pelo desenvolvimento de materiais gráficos para a Calceleve, uma rede de calçados com foco em campanhas promocionais e comunicação no ponto de venda.',
          'Este projeto reúne uma seleção dos principais materiais produzidos para a marca, incluindo peças para redes sociais, campanhas sazonais, materiais impressos, embalagens e comunicação visual para lojas físicas.'],
        en: ['During my time at MoOn.ag, I was responsible for creating graphic materials for Calceleve, a Brazilian footwear retailer focused on promotional campaigns and in-store communication.',
          'This project showcases a curated selection of work developed for the brand, including social media content, seasonal campaigns, print materials, packaging and visual communication for physical stores.'] }],
      [3, { h: { pt: '/ Campanhas', en: '/ Campaigns' },
        pt: ['As campanhas foram criadas para acompanhar diferentes momentos do calendário comercial da marca, explorando novas composições, cores e elementos gráficos sem abrir mão da identidade visual construída para a Calceleve.'],
        en: ['The campaigns were created to support different moments throughout the brand’s commercial calendar, exploring a variety of visual concepts, color palettes and graphic elements while maintaining a consistent identity across every piece developed for Calceleve.'] }],
      [7, { h: { pt: '/ Embalagens', en: '/ Packaging' },
        pt: ['Além dos materiais promocionais, também fiz o desenvolvimento de embalagens para a marca. A proposta foi criar uma experiência que fosse além do produto, utilizando elementos gráficos e uma linguagem visual alinhada à identidade da Calceleve.',
          'O resultado é uma embalagem que reforça o reconhecimento da marca e transforma um momento simples, como abrir uma caixa, em mais um ponto de contato com o cliente.'],
        en: ['Alongside promotional materials, I also designed packaging for the brand. The objective was to extend Calceleve’s visual identity beyond its campaigns, creating packaging that reinforces brand recognition while delivering a consistent and memorable customer experience.'] }],
      [9, { h: { pt: '/ Redes sociais', en: '/ Social media' },
        pt: ['Os conteúdos para redes sociais foram construídos a partir de ensaios fotográficos da marca, com foco na edição e tratamento das imagens. A proposta foi desenvolver uma estética consistente, capaz de valorizar os produtos e transmitir a identidade da Calceleve de forma natural e reconhecível em cada publicação.'],
        en: ['The brand’s social media content was built around photographic campaigns, with a focus on photo editing and retouching. The goal was to create a consistent visual aesthetic that enhanced the products while conveying Calceleve’s identity in a natural and recognizable way across every publication.'] }],
    ],
    'helo-ribeiro': [
      [11, { note: true,
        pt: ['*Trabalho desenvolvido em parceria com a agência Conceito Prime.'],
        en: ['*Created in partnership with the Conceito Prime agency.'] }],
    ],
  };
  // encaixa os textos de trás pra frente, pra numeração dos módulos não mudar no meio
  Object.entries(CASE_TEXTS).forEach(([slug, list]) => {
    const p = PROJECTS.find(x => x.slug === slug);
    [...list].sort((a, b) => b[0] - a[0]).forEach(([after, x]) => p.modules.splice(after + 1, 0, ['text', x]));
  });

  const ALL = [...PROJECTS, ...SITES];

  // ordem = ordem do menu (vídeos em primeiro); título e label seguem o idioma
  const page = (key, num, list) => ({ key, num, list, get title() { return t(`nav.${key}`); }, get label() { return `/ ${this.title.toUpperCase()}`; } });
  const PAGES = {
    'videos-motion': page('videos-motion', 'N./02', () => ALL.filter(p => p.group === 'videos-motion')),
    'projetos':      page('projetos', 'N./03', () => PROJECTS.filter(p => p.group === 'projetos')),
    'sites-lps':     page('sites-lps', 'N./04', () => SITES),
  };

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* ---------------- SMOOTH SCROLL ---------------- */
  let lenis = null;
  function initLenis() {
    if (reduce || !window.Lenis) return;
    lenis = new Lenis({ duration: 1.15, easing: t => 1 - Math.pow(1 - t, 4), smoothWheel: true });
    const raf = t => { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
  }
  // volta pro topo de verdade: para qualquer rolagem suave em andamento e zera a posição
  const toTop = () => {
    if (lenis) { lenis.stop(); lenis.scrollTo(0, { immediate: true, force: true }); lenis.start(); }
    window.scrollTo(0, 0);
  };
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

  /* ---------------- CARDS ---------------- */
  function card(p, i) {
    const a = document.createElement('a');
    a.className = 'card reveal';
    a.href = `#/projeto/${p.slug}`;
    a.dataset.link = '';
    a.style.setProperty('--d', `${(i % 2) * 0.08}s`);
    a.innerHTML = `
      <div class="cover ${p.cover ? 'has-img' : p.art}">${p.cover ? `<img src="${p.cover}" alt="" loading="lazy">` : ''}${p.placeholder ? '<span class="placeholder-tag">[Imagem do projeto]</span>' : ''}</div>
      <div class="card-meta">
        <span class="card-name">${p.name} <span class="arrow" aria-hidden="true">→</span></span>
        <span class="card-cat">${tr(p.cat)} / ${p.year}</span>
      </div>`;
    return a;
  }
  const fillGrid = (grid, list) => list.forEach((p, i) => grid.appendChild(card(p, i)));

  /* ---------------- VIEWS ---------------- */
  const app = $('#app');

  function viewHome() {
    const f = $('#tpl-home').content.cloneNode(true);
    fillGrid($('[data-grid]', f), PROJECTS);
    return f;
  }

  function viewList(key) {
    const cfg = PAGES[key];
    const f = $('#tpl-list').content.cloneNode(true);
    $('[data-slot=label]', f).textContent = cfg.label;
    $('[data-slot=num]', f).textContent = cfg.num;
    $('[data-slot=title]', f).textContent = cfg.title;
    const list = cfg.list();
    $('[data-slot=count]', f).textContent = `${pad(list.length)} ${t(list.length === 1 ? 'count.one' : 'count.many')}`;
    fillGrid($('[data-grid]', f), list);
    return f;
  }

  /* ---------------- VÍDEOS ---------------- */
  function videoCard(x, i = 0) {
    const el = document.createElement(x.gif ? 'figure' : 'button');
    el.className = `vcard reveal${x.v ? ' is-v' : ''}${x.gif ? ' is-gif' : ''}`;
    el.style.setProperty('--d', `${(i % 4) * 0.06}s`);
    if (!x.gif) { el.type = 'button'; el.setAttribute('aria-label', `${t('watch')}: ${x.client} — ${tr(x.title)}`); el.addEventListener('click', () => openPlayer(x)); }
    el.innerHTML = `
      <span class="vthumb"><img src="${x.gif || x.thumb}" alt="" loading="lazy">${x.gif ? '' : '<span class="vplay" aria-hidden="true"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13l11-6.5z"/></svg></span>'}</span>
      <span class="vmeta"><b>${tr(x.client)}</b><span>${tr(x.title)}</span></span>`;
    return el;
  }

  function videoGroup(list, label) {
    const sec = document.createElement('div');
    sec.className = 'vgroup';
    const h = list.filter(x => !x.v), v = list.filter(x => x.v);
    sec.innerHTML = `<div class="label-row reveal"><span>/ ${label}</span><span>${pad(list.length)}</span></div>`;
    if (h.length === 1 && v.length) {
      // 1 horizontal + verticais numa fileira só, todos com a mesma altura (16:9 ÷ 9:16 ≈ 3.16)
      const g = document.createElement('div');
      g.className = 'vgrid mixed';
      g.style.setProperty('--n', v.length);
      [...h, ...v].forEach((x, i) => g.append(videoCard(x, i)));
      sec.append(g);
      return sec;
    }
    if (h.length) { const g = document.createElement('div'); g.className = `vgrid${h.some(x => x.gif) ? ' three' : ''}`; h.forEach((x, i) => g.append(videoCard(x, i))); sec.append(g); }
    if (v.length) { const g = document.createElement('div'); g.className = 'vgrid vert'; v.forEach((x, i) => g.append(videoCard(x, i))); sec.append(g); }
    return sec;
  }

  function viewVideos() {
    const f = $('#tpl-videos').content.cloneNode(true);
    $('[data-slot=label]', f).textContent = PAGES['videos-motion'].label;
    $('[data-slot=num]', f).textContent = PAGES['videos-motion'].num;
    const chips = $('[data-slot=chips]', f), groups = $('[data-slot=groups]', f);
    const render = cat => {
      groups.classList.add('swapping-groups');
      setTimeout(() => {
        groups.replaceChildren(...VCATS.slice(1).filter(([k]) => cat === 'all' || k === cat)
          .map(([k, label]) => videoGroup(VIDEOS.filter(x => x.cat === k), t(label))));
        groups.classList.remove('swapping-groups');
        observeReveals();
        if (lenis) lenis.resize();
      }, groups.children.length ? 280 : 0);
    };
    VCATS.forEach(([k, label], i) => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'chip'; b.textContent = t(label);
      b.setAttribute('aria-pressed', String(i === 0));
      b.addEventListener('click', () => {
        if (b.getAttribute('aria-pressed') === 'true') return;
        $$('.chip', chips).forEach(c => c.setAttribute('aria-pressed', String(c === b)));
        render(k);
      });
      chips.append(b);
    });
    render('all');
    return f;
  }

  // player por cima da página; a música de fundo abaixa enquanto o vídeo toca
  let playerEl = null;
  function openPlayer(x) {
    if (!playerEl) {
      playerEl = document.createElement('div');
      playerEl.className = 'player';
      playerEl.setAttribute('role', 'dialog');
      playerEl.setAttribute('aria-modal', 'true');
      playerEl.innerHTML = `<button class="player-close" type="button" data-i18n-aria="close" aria-label="${t('close')}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M5 5l14 14M19 5L5 19"/></svg></button><div class="player-box"></div><p class="player-cap"></p>`;
      document.body.append(playerEl);
      playerEl.addEventListener('click', e => { if (e.target === playerEl || e.target.closest('.player-close')) closePlayer(); });
      addEventListener('keydown', e => { if (e.key === 'Escape' && playerEl.classList.contains('open')) closePlayer(); });
    }
    $('.player-box', playerEl).className = `player-box${x.v ? ' is-v' : ''}`;
    $('.player-box', playerEl).innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${x.id}?autoplay=1&rel=0&modestbranding=1&playsinline=1" title="${x.client} — ${tr(x.title)}" allow="autoplay; encrypted-media; fullscreen; picture-in-picture" allowfullscreen frameborder="0"></iframe>`;
    $('.player-cap', playerEl).innerHTML = `<b>${tr(x.client)}</b> ${tr(x.title)}`;
    $('.player-close', playerEl).setAttribute('aria-label', t('close'));
    requestAnimationFrame(() => playerEl.classList.add('open'));
    document.documentElement.classList.add('no-scroll');
    if (lenis) lenis.stop();
    window.dispatchEvent(new CustomEvent('player', { detail: true }));
    setTimeout(() => $('.player-close', playerEl).focus(), 50);
  }
  function closePlayer() {
    playerEl.classList.remove('open');
    document.documentElement.classList.remove('no-scroll');
    if (lenis) lenis.start();
    window.dispatchEvent(new CustomEvent('player', { detail: false }));
    setTimeout(() => { if (!playerEl.classList.contains('open')) $('.player-box', playerEl).innerHTML = ''; }, 450);
  }

  function caseImg(slug, file, w, h) {
    const img = new Image();
    img.src = A(slug, file);
    img.alt = '';
    img.loading = 'lazy';
    img.decoding = 'async';
    img.width = w; img.height = h;
    const done = () => img.classList.add('loaded');
    if (img.complete) done(); else img.addEventListener('load', done, { once: true });
    return img;
  }

  function caseModule(slug, m) {
    const [type] = m;
    if (type === 'text') {
      // texto do case (vem do Behance): título opcional + parágrafos, no idioma da página
      const x = m[1], el = document.createElement('div');
      el.className = `mod-text reveal${x.note ? ' is-note' : ''}`;
      const h = x.h ? `<div class="label-row"><span>${x.h[LANG] || x.h.pt}</span></div>` : '';
      el.innerHTML = `<div class="mod-text-in">${h}<div class="mod-text-body">${(x[LANG] || x.pt).map(p => `<p>${noOrphan(p)}</p>`).join('')}</div></div>`;
      return el;
    }
    if (type === 'videos') {
      const g = document.createElement('div');
      g.className = 'mod-videos';
      const list = m[1].map(vid);
      const grid = document.createElement('div');
      grid.className = `vgrid${list.every(x => x.v) ? ' vert' : ''}`;
      list.forEach((x, i) => grid.append(videoCard(x, i)));
      g.append(grid);
      return g;
    }
    const special = { pages: pagesModule, 'compare-scroll': compareScrollModule, board: boardModule }[type];
    if (special) { const s = special(slug, m); s.classList.add('reveal'); return s; }
    const el = document.createElement('div');
    if (type === 'img') {
      el.className = 'mod';
      el.append(caseImg(slug, m[1], m[2], m[3]));
    } else if (type === 'row') {
      el.className = 'mod mod-row';
      el.style.setProperty('--cols', m[1].length);
      el.append(...m[1].map(f => caseImg(slug, f, m[2], m[3])));
    } else if (type === 'video') {
      el.className = 'mod mod-video';
      el.style.aspectRatio = `${m[2]} / ${m[3]}`;
      el.innerHTML = `<iframe src="https://player.vimeo.com/video/${m[1]}?background=1&autoplay=1&loop=1&muted=1&dnt=1" title="Vídeo" loading="lazy" allow="autoplay; fullscreen; picture-in-picture" frameborder="0"></iframe>`;
    } else if (type === 'compare') {
      el.className = 'mod mod-compare';
      el.style.aspectRatio = `${m[3]} / ${m[4]}`;
      el.style.setProperty('--pos', '50%');
      el.innerHTML = `
        <img src="${A(slug, m[2])}" alt="Depois" draggable="false">
        <div class="cmp-before"><img src="${A(slug, m[1])}" alt="Antes" draggable="false"></div>
        <span class="cmp-label l">Antes</span><span class="cmp-label r">Depois</span>
        <span class="cmp-handle" aria-hidden="true"><i></i></span>
        <input type="range" min="0" max="100" value="50" step="0.1" aria-label="Comparar antes e depois">`;
      const input = $('input', el);
      input.addEventListener('input', () => el.style.setProperty('--pos', `${input.value}%`));
    } else if (type === 'browser') {
      el.className = 'mod mod-browser';
      el.innerHTML = `
        <div class="bw-bar"><i></i><i></i><i></i><span class="bw-url">${m[4]}</span></div>
        <div class="bw-screen" data-autoscroll="70" data-lenis-prevent><img src="${A(slug, m[1])}" alt="Página completa do site" width="${m[2]}" height="${m[3]}" loading="lazy"></div>`;
    } else if (type === 'phones') {
      el.className = 'mod mod-phones';
      el.innerHTML = `
        <div class="phone"><div class="phone-screen"><img src="${A(slug, m[1])}" alt="Versão mobile — topo" loading="lazy"></div></div>
        <div class="phone"><div class="phone-screen" data-autoscroll="45" data-lenis-prevent><img src="${A(slug, m[1])}" alt="Versão mobile — página completa" loading="lazy"></div></div>`;
    } else if (type === 'full') {
      el.className = 'mod mod-full';
      el.innerHTML = `<span class="full-label">${t('full')}</span>`;
      el.append(caseImg(slug, m[1], m[2], m[3]));
    }
    el.classList.add('reveal');
    return el;
  }

  // abas estilo navegador; onPick(i) troca o conteúdo
  function tabsHTML(labels) {
    return `<div class="bw-tabs" role="tablist">${labels.map((l, i) => `<button class="bw-tab" role="tab" type="button" aria-selected="${i === 0}" data-i="${i}">${l}</button>`).join('')}</div>`;
  }
  function bindTabs(el, onPick) {
    $$('.bw-tab', el).forEach(tab => tab.addEventListener('click', () => {
      if (tab.getAttribute('aria-selected') === 'true') return;
      $$('.bw-tab', el).forEach(t => t.setAttribute('aria-selected', String(t === tab)));
      onPick(+tab.dataset.i);
    }));
  }
  // troca imagens com um fade curto e reinicia a rolagem no topo
  function swapImages(container, pairs, key) {
    container.classList.add('swapping');
    setTimeout(() => {
      pairs.forEach(([img, src, alt]) => { img.src = src; img.alt = alt; });
      container.querySelectorAll('[data-autoscroll]').forEach(s => { s.dataset.key = key; });
      const imgs = pairs.map(p => p[0]);
      Promise.all(imgs.map(i => i.complete ? 0 : new Promise(r => { i.onload = i.onerror = r; })))
        .then(() => container.classList.remove('swapping'));
    }, 300);
  }

  function pagesModule(slug, m) {
    const [, url, pages] = m;
    const el = document.createElement('div');
    el.className = 'mod mod-browser';
    el.innerHTML = `
      ${tabsHTML(pages.map(p => tr(p[0])))}
      <div class="bw-bar"><i></i><i></i><i></i><span class="bw-url">${url} · ${tr(pages[0][0])}</span></div>
      <div class="bw-screen" data-autoscroll="80" data-key="0" data-lenis-prevent><img src="${A(slug, pages[0][1])}" alt="${tr(pages[0][0])}" loading="lazy"></div>`;
    const screen = $('.bw-screen', el);
    bindTabs(el, i => {
      $('.bw-url', el).textContent = `${url} · ${tr(pages[i][0])}`;
      swapImages(screen, [[$('img', screen), A(slug, pages[i][1]), tr(pages[i][0])]], String(i));
    });
    return el;
  }

  let cmpCount = 0;
  function compareScrollModule(slug, m) {
    const [, pagesRaw, leftRaw, rightRaw] = m; // pages: [label, wireframe, site]
    const pages = pagesRaw.map(([l, a, b]) => [tr(l), a, b]), leftLabel = tr(leftRaw), rightLabel = tr(rightRaw);
    const g = `cmp${++cmpCount}`;
    const el = document.createElement('div');
    el.className = 'mod mod-browser mod-cmpscroll';
    el.innerHTML = `
      ${tabsHTML(pages.map(p => p[0]))}
      <div class="cs-view" style="--pos:50%">
        <div class="cs-layer cs-site" data-autoscroll="75" data-key="0" data-sync-lead="${g}" data-lenis-prevent><img src="${A(slug, pages[0][2])}" alt="${rightLabel}" loading="lazy"></div>
        <div class="cs-layer cs-wf" data-sync-follow="${g}" aria-hidden="true"><img src="${A(slug, pages[0][1])}" alt="" loading="lazy"></div>
        <span class="cs-line" aria-hidden="true"><i></i></span>
        <span class="cs-tag l">${leftLabel}</span><span class="cs-tag r">${rightLabel}</span>
      </div>`;
    const view = $('.cs-view', el);
    // a divisão segue o mouse (sem clicar); no toque, segue o dedo
    const setPos = x => { const r = view.getBoundingClientRect(); view.style.setProperty('--pos', `${Math.min(100, Math.max(0, ((x - r.left) / r.width) * 100))}%`); };
    view.addEventListener('pointermove', e => setPos(e.clientX));
    view.addEventListener('pointerleave', () => { view.style.transition = ''; });
    bindTabs(el, i => swapImages(view, [[$('.cs-site img', view), A(slug, pages[i][2]), rightLabel], [$('.cs-wf img', view), A(slug, pages[i][1]), '']], String(i)));
    return el;
  }
  function boardModule(slug, m) {
    const [, title, note, items] = m;
    const el = document.createElement('div');
    el.className = 'mod mod-board';
    el.innerHTML = `
      <div class="board-title"><span>${tr(title)}</span><span>${tr(note)}</span></div>
      <div class="board" style="--cols:${items.length}">${items.map(([label, f]) => `<figure><img src="${A(slug, f)}" alt="${tr(label)}" loading="lazy"><figcaption>${tr(label)}</figcaption></figure>`).join('')}</div>`;
    return el;
  }

  function viewProject(slug) {
    const i = ALL.findIndex(p => p.slug === slug);
    if (i < 0) return null;
    const p = ALL[i], next = ALL[(i + 1) % ALL.length];
    const f = $('#tpl-project').content.cloneNode(true);
    $('[data-slot=num]', f).textContent = `N./${pad(i + 1)}`;
    $('[data-slot=title]', f).textContent = p.name;
    $('[data-slot=cat]', f).textContent = tr(p.cat);
    $('[data-slot=year]', f).textContent = p.year;
    $('[data-slot=client]', f).textContent = p.placeholder ? '[Cliente]' : p.name;
    // seta de voltar para a lista de onde o projeto vem
    const back = $('[data-slot=back]', f), grp = p.group in PAGES ? p.group : 'projetos';
    back.href = `#/${grp}`;
    $('span', back).textContent = PAGES[grp].title;
    back.setAttribute('aria-label', `${t('back')} ${PAGES[grp].title}`);
    if (p.behance || p.live) {
      const link = $('[data-slot=behance]', f);
      link.href = p.behance || p.live;
      if (p.live) {
        const dt = $('[data-slot=behance-wrap] dt', f);
        dt.dataset.i18n = 'meta.live';
        link.textContent = `${new URL(p.live).host} ↗`;
      }
    } else $('[data-slot=behance-wrap]', f).remove();
    if (p.site) $('[data-slot=case]', f).classList.add('site-case');
    if (p.modules) {
      $('[data-slot=placeholder]', f).remove();
      $('[data-slot=case]', f).append(...p.modules.map(m => caseModule(p.slug, m)));
    } else $('[data-slot=case]', f).remove();
    $('[data-slot=cover]', f)?.classList.add(p.art);
    if (!p.modules) {
      $('[data-slot=desc]', f).textContent = '[Descrição do projeto — contexto, o que foi feito e como.]';
      $('[data-slot=g1]', f).classList.add(p.art);
      $('[data-slot=g2]', f).classList.add(next.art);
      ['cover', 'g1', 'g2'].forEach(s => $(`[data-slot=${s}]`, f).insertAdjacentHTML('beforeend', '<span class="placeholder-tag">[Imagem do projeto]</span>'));
    }
    $('[data-slot=nextnum]', f).textContent = `N./${pad(((i + 1) % ALL.length) + 1)}`;
    const nl = $('[data-slot=next]', f);
    nl.href = `#/projeto/${next.slug}`;
    nl.innerHTML = `<b>${next.name}</b><span>${tr(next.cat)} / ${next.year} →</span>`;
    return f;
  }

  /* ---------------- ROUTER ---------------- */
  let first = true;
  let busy = false;

  function parse() {
    const h = location.hash.replace(/^#\/?/, '');
    const [a, b] = h.split('/');
    if (!a) return { name: 'home' };
    if (a === 'projeto' && b) return { name: 'project', slug: b };
    if (PAGES[a]) return { name: 'list', key: a };
    if (a === 'about' || a === 'portfolio') return { name: 'home', anchor: a };
    return { name: 'home' };
  }

  function build(r) {
    if (r.name === 'list') return r.key === 'videos-motion' ? viewVideos() : viewList(r.key);
    if (r.name === 'project') return viewProject(r.slug) || viewHome();
    return viewHome();
  }

  function setActive(r) {
    $$('.nav-links a, #mnav a').forEach(a => a.classList.toggle('active',
      (r.name === 'list' && a.dataset.route === r.key) ||
      (r.name === 'project' && a.dataset.route === (ALL.find(p => p.slug === r.slug) || {}).group)));
  }

  function mount(r) {
    const frag = build(r);
    applyI18n(frag);
    app.replaceChildren(frag);
    setActive(r);
    document.title = r.name === 'home' ? t('doc.home')
      : r.name === 'list' ? `${PAGES[r.key].title} — V__NSE`
      : `${(ALL.find(p => p.slug === r.slug) || {}).name || 'Projeto'} — V__NSE`;
    const hero = $('.hero', app);
    if (hero) initHero(hero, first);
    observeReveals();
    if (lenis) lenis.resize();
  }

  async function route() {
    const r = parse();
    if (first) {
      mount(r);
      first = false;
      if (r.anchor) setTimeout(() => scrollToId(r.anchor), 300);
      return;
    }
    if (busy) return;
    busy = true;
    if (!reduce) {
      app.classList.add('leaving');
      await wait(420);
    }
    toTop();
    mount(r);
    toTop();
    requestAnimationFrame(toTop);
    app.classList.remove('leaving');
    if (!reduce) {
      app.classList.add('entering');
      app.offsetHeight; // reflow
      app.classList.remove('entering');
    }
    if (r.anchor) setTimeout(() => scrollToId(r.anchor), 200);
    busy = false;
  }

  function scrollToId(id) {
    const el = document.getElementById(id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 70;
    lenis ? lenis.scrollTo(y) : window.scrollTo({ top: y, behavior: 'smooth' });
  }

  const wait = ms => new Promise(r => setTimeout(r, ms));

  document.addEventListener('click', e => {
    const a = e.target.closest('a[data-link]');
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    const href = a.getAttribute('href');
    if (href === location.hash || (href === '#/' && !location.hash.replace(/^#\/?/, ''))) {
      e.preventDefault();
      lenis ? lenis.scrollTo(0) : window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
  window.addEventListener('hashchange', route);

  /* ---------------- REVEAL ---------------- */
  let io;
  function observeReveals() {
    if (io) io.disconnect();
    io = new IntersectionObserver(entries => {
      entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    $$('.reveal', app).forEach(el => io.observe(el));
  }

  /* ---------------- HERO: TYPE + COUNT ---------------- */
  const CARET_HOLD = 2500;
  const CHAR_MS = 34;

  function caret(el) {
    const c = document.createElement('i');
    c.className = 'caret typing';
    c.setAttribute('aria-hidden', 'true');
    el.appendChild(c);
    return c;
  }
  function dropCaret(c) {
    c.classList.remove('typing');
    setTimeout(() => { c.classList.add('gone'); setTimeout(() => c.remove(), 520); }, CARET_HOLD);
  }

  // Tudo roda num único loop baseado no relógio: se a aba travar, a animação só "alcança" o tempo.
  const tasks = [];
  let loopOn = false, T0 = 0;
  function loop(now) {
    const t = now - T0;
    let alive = false;
    for (const k of tasks) if (!k.done) { k.update(t); alive = alive || !k.done; }
    if (alive) requestAnimationFrame(loop); else loopOn = false;
  }
  function startLoop() {
    T0 = performance.now();
    if (!loopOn) { loopOn = true; requestAnimationFrame(loop); }
  }

  function typeEl(el, text, startMs) {
    el.textContent = '';
    const node = document.createTextNode('');
    el.appendChild(node);
    // horário de cada caractere, com um leve ritmo humano
    const times = [];
    let acc = startMs;
    for (let i = 0; i < text.length; i++) {
      const prev = text[i - 1];
      acc += CHAR_MS * (0.55 + Math.random() * 0.9) + (prev === '\n' ? 140 : prev === ' ' ? 18 : 0);
      times.push(acc);
    }
    let c = null, shown = -1;
    tasks.push({
      done: false,
      update(t) {
        if (t < startMs) return;
        if (!c) c = caret(el);
        let n = shown < 0 ? 0 : shown;
        while (n < text.length && times[n] <= t) n++;
        if (n !== shown) { node.data = text.slice(0, n); shown = n; }
        if (n >= text.length) { this.done = true; dropCaret(c); }
      },
    });
  }

  function countEl(el, to, prefix, startMs, durMs) {
    el.textContent = '';
    const node = document.createTextNode('');
    el.appendChild(node);
    const ease = x => (x >= 1 ? 1 : 1 - Math.pow(2, -10 * x));
    tasks.push({
      done: false,
      update(t) {
        if (t < startMs) return;
        const x = Math.min(1, (t - startMs) / durMs);
        node.data = prefix + Math.round(to * ease(x));
        if (x >= 1) this.done = true;
      },
    });
  }

  function initHero(hero, animate) {
    const types = $$('[data-type]', hero);
    const counts = $$('[data-count]', hero);

    if (!animate || reduce) {
      counts.forEach(el => { el.textContent = (el.dataset.prefix || '') + el.dataset.count; });
      requestAnimationFrame(() => hero.classList.add('ready'));
      return;
    }

    // guarda os textos e esvazia antes do primeiro frame
    const jobs = types.map(el => ({ el, text: el.textContent, at: parseFloat(el.dataset.type) }));
    jobs.forEach(j => { j.el.textContent = ''; });
    counts.forEach(el => { el.textContent = ''; });

    const imgs = $$('img', hero).map(img => img.complete ? Promise.resolve() : new Promise(r => { img.onload = img.onerror = r; }));
    const fonts = document.fonts ? document.fonts.ready : Promise.resolve();
    Promise.race([Promise.all([...imgs, fonts]), wait(2500)]).then(() => {
      hero.classList.add('ready');
      const base = 250;
      jobs.forEach(j => typeEl(j.el, j.text, base + j.at * 1000));
      counts.forEach(el => countEl(el, +el.dataset.count, el.dataset.prefix || '', base + parseFloat(el.dataset.at) * 1000, (parseFloat(el.dataset.dur) || 1.4) * 1000));
      startLoop();
    });
  }

  /* ---------------- NAV hide on scroll ---------------- */
  const nav = $('#nav');
  let lastY = 0;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    nav.classList.toggle('hide', y > 240 && y > lastY + 2);
    if (y < lastY - 2 || y < 240) nav.classList.remove('hide');
    lastY = y;
  }, { passive: true });

  /* ---------------- MUSIC (BK — Caminhos, ~ -40 dB) ----------------
     O celular (iOS principalmente) ignora audio.volume e toca no volume cheio,
     entao o volume passa por um ganho da Web Audio, que funciona em todo lugar. */
  const audio = $('#bgm');
  const btn = $('#sound');
  const TARGET = Math.pow(10, -40 / 20); // -40 dB = 0.01 — bem ambiente
  let wanted = true;       // o visitante nao desligou
  let fadeRaf = 0, ctx = null, gain = null;

  function initGain() {
    if (gain || !(window.AudioContext || window.webkitAudioContext)) return;
    try {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      gain = ctx.createGain();
      gain.gain.value = 0;
      ctx.createMediaElementSource(audio).connect(gain).connect(ctx.destination);
    } catch (e) { ctx = null; gain = null; }
  }
  const level = () => (gain ? gain.gain.value : audio.volume);
  function setLevel(v) {
    const x = Math.min(1, Math.max(0, v));
    if (gain) gain.gain.value = x; else audio.volume = x;
  }

  function fadeTo(v, ms = 1800) {
    cancelAnimationFrame(fadeRaf);
    const from = level(), t0 = performance.now();
    const f = now => {
      const t = Math.min(1, (now - t0) / ms);
      setLevel(from + (v - from) * t);
      if (t < 1) fadeRaf = requestAnimationFrame(f);
      else if (v === 0) audio.pause();
    };
    fadeRaf = requestAnimationFrame(f);
  }
  function play() {
    initGain();
    if (ctx && ctx.state === 'suspended') ctx.resume();
    setLevel(0);
    return audio.play().then(() => { btn.setAttribute('aria-pressed', 'true'); if (ducked) audio.pause(); else fadeTo(TARGET); });
  }
  function stop() { btn.setAttribute('aria-pressed', 'false'); fadeTo(0, 700); }
  // pra conferir/ajustar o volume pelo console: __bgm.level() e __bgm.set(0.02)
  window.__bgm = { level, set: setLevel, target: TARGET };

  // o botão aparece na hora; só some se o arquivo da música não existir
  btn.hidden = false;
  audio.addEventListener('error', () => { btn.hidden = true; });

  // navegadores bloqueiam autoplay com som: tenta já, senão começa no primeiro gesto
  play().catch(() => {
    const kick = e => {
      ['pointerdown', 'keydown', 'touchstart'].forEach(ev => removeEventListener(ev, kick, true));
      if (btn.contains(e.target)) return; // o próprio botão resolve
      if (wanted && audio.paused) play().catch(() => {});
    };
    ['pointerdown', 'keydown', 'touchstart'].forEach(ev => addEventListener(ev, kick, true));
  });

  btn.addEventListener('click', e => {
    e.stopPropagation();
    if (audio.paused || btn.getAttribute('aria-pressed') === 'false') { wanted = true; play().catch(() => {}); }
    else { wanted = false; stop(); }
  });

  // abaixa a música enquanto um vídeo toca no player e volta ao fechar
  let ducked = false;
  window.addEventListener('player', e => {
    ducked = e.detail;
    if (ducked) { if (!audio.paused) fadeTo(0, 500); }
    else if (wanted && btn.getAttribute('aria-pressed') === 'true') play().catch(() => {});
  });

  /* ---------------- EXPLORE (índice em tela cheia) ---------------- */
  const uniq = a => [...new Set(a)];
  const EXPLORE = [
    { key: 'videos-motion', tags: ['Vídeos', 'Motion', 'Animação de logo'], count: VIDEOS.length, previews: ['cBxKKD6-mCM', 'SQSqR3CTlic', 'pZX1T2LLeeA'].map(id => vid(id).thumb) },
    { key: 'projetos', tags: uniq(PAGES.projetos.list().map(p => p.cat)), count: PAGES.projetos.list().length, previews: PAGES.projetos.list().map(p => p.cover) },
    { key: 'sites-lps', tags: uniq(SITES.map(p => p.cat)), count: SITES.length, previews: SITES.map(p => p.cover) },
  ];
  let exploreEl = null, lastFocus = null;
  function buildExplore() {
    exploreEl = document.createElement('div');
    exploreEl.className = 'explore';
    exploreEl.setAttribute('role', 'dialog');
    exploreEl.setAttribute('aria-modal', 'true');
    exploreEl.setAttribute('aria-label', t('ex.label'));
    exploreEl.innerHTML = `
      <div class="ex-top">
        <span>/ EXPLORE</span>
        <span class="ex-mid">${LANG === 'en' ? 'Portfolio' : 'Portfólio'} — ${pad(EXPLORE.reduce((s, x) => s + x.count, 0))} ${t('ex.works')}</span>
        <button type="button" class="ex-close">${t('close')} <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19"/></svg></button>
      </div>
      <nav class="ex-list">${EXPLORE.map((x, i) => `
        <a class="ex-row" href="#/${x.key}" data-i="${i}" style="--i:${i}">
          <span class="ex-num">${pad(i + 1)}</span>
          <span class="ex-title"><span>${PAGES[x.key].title}</span></span>
          <span class="ex-tags">${x.tags.map(tr).join(' · ')}</span>
          <span class="ex-count">${pad(x.count)}</span>
          <span class="ex-arrow" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>
        </a>`).join('')}
      </nav>
      <div class="ex-bottom"><span>V<span>__</span>NSE</span><span>Curitiba, PR</span><span>N./02</span></div>
      <div class="ex-preview" aria-hidden="true">${EXPLORE.map((x, i) => x.previews.slice(0, 3).map((src, j) => `<img src="${src}" alt="" data-i="${i}" style="--j:${j}">`).join('')).join('')}</div>`;
    document.body.append(exploreEl);

    const preview = $('.ex-preview', exploreEl);
    let px = innerWidth / 2, py = innerHeight / 2, cx = px, cy = py, raf = 0;
    const follow = () => { cx += (px - cx) * 0.14; cy += (py - cy) * 0.14; preview.style.transform = `translate(${cx}px, ${cy}px)`; raf = requestAnimationFrame(follow); };
    exploreEl.addEventListener('pointermove', e => { px = e.clientX; py = e.clientY; if (!raf) raf = requestAnimationFrame(follow); });
    $$('.ex-row', exploreEl).forEach(row => {
      row.addEventListener('pointerenter', e => {
        if (!('hover' in exploreEl.dataset) && e.clientX) { px = cx = e.clientX; py = cy = e.clientY; }
        exploreEl.dataset.hover = row.dataset.i;
      });
      row.addEventListener('pointerleave', () => { delete exploreEl.dataset.hover; });
      row.addEventListener('click', e => { e.preventDefault(); const to = row.getAttribute('href'); closeExplore(); setTimeout(() => { location.hash = to; }, 380); });
    });
    $('.ex-close', exploreEl).addEventListener('click', closeExplore);
    addEventListener('keydown', e => { if (e.key === 'Escape' && exploreEl.classList.contains('open')) closeExplore(); });
  }
  function openExplore() {
    if (!exploreEl) buildExplore();
    lastFocus = document.activeElement;
    exploreEl.classList.remove('closing');
    requestAnimationFrame(() => exploreEl.classList.add('open'));
    document.documentElement.classList.add('no-scroll');
    if (lenis) lenis.stop();
    setTimeout(() => $('.ex-close', exploreEl).focus(), 60);
  }
  function closeExplore() {
    exploreEl.classList.add('closing');
    exploreEl.classList.remove('open');
    delete exploreEl.dataset.hover;
    document.documentElement.classList.remove('no-scroll');
    if (lenis) lenis.start();
    if (lastFocus) lastFocus.focus({ preventScroll: true });
  }
  document.addEventListener('click', e => {
    const t = e.target.closest('[data-explore]');
    if (!t) return;
    e.preventDefault();
    openExplore();
  });

  /* ---------------- MENU DO CELULAR ---------------- */
  const menuBtn = $('#menu-btn'), mnav = $('#mnav');
  let menuOpen = false;
  function setMenu(open) {
    if (open === menuOpen) return;
    menuOpen = open;
    document.documentElement.classList.toggle('menu-open', open);
    mnav.setAttribute('aria-hidden', String(!open));
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', t(open ? 'menu.close' : 'menu'));
    document.documentElement.classList.toggle('no-scroll', open);
    if (lenis) open ? lenis.stop() : lenis.start();
    if (open) nav.classList.remove('hide');
  }
  menuBtn.addEventListener('click', () => setMenu(!menuOpen));
  // tocar num link fecha o painel (a navegação segue normal)
  $$('a', mnav).forEach(a => a.addEventListener('click', () => setMenu(false)));
  addEventListener('keydown', e => { if (e.key === 'Escape' && menuOpen) setMenu(false); });
  matchMedia('(min-width: 701px)').addEventListener('change', e => { if (e.matches) setMenu(false); });

  /* ---------------- SELETOR BR / US ---------------- */
  function syncLangUI() {
    applyI18n(document.querySelector('#nav'));
    applyI18n(document.querySelector('#mnav'));
    applyI18n(document.querySelector('.footer'));
    menuBtn.setAttribute('aria-label', t(menuOpen ? 'menu.close' : 'menu'));
    $$('.lang-btn').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.lang === LANG)));
  }
  async function setLang(l) {
    if (l === LANG || !LANGS.includes(l)) return;
    LANG = l;
    document.documentElement.lang = l === 'pt' ? 'pt-BR' : 'en';
    try { localStorage.setItem('lang', l); } catch (e) {}
    // tira o ?lang= do link pra escolha manual valer daqui pra frente
    if (new URLSearchParams(location.search).has('lang')) history.replaceState(null, '', location.pathname + location.hash);
    if (exploreEl) { exploreEl.remove(); exploreEl = null; }
    syncLangUI();
    const y = window.scrollY;
    if (!reduce) { app.classList.add('leaving'); await wait(300); }
    mount(parse());
    window.scrollTo(0, y);
    if (lenis) lenis.scrollTo(y, { immediate: true, force: true });
    app.classList.remove('leaving');
  }
  $$('.lang-btn').forEach(b => b.addEventListener('click', () => setLang(b.dataset.lang)));

  function start() { syncLangUI(); initLenis(); route(); }

  /* ---------------- GO (sempre por último) ---------------- */
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
