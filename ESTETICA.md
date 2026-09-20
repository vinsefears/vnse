# Estética V__NSE — guia pra novos sites

Extraído do portfólio (vnse.pages.dev). Serve como base pra qualquer site novo
que precise ter a mesma cara: fundo escuro, tipografia larga, rótulos técnicos,
muito espaço e movimento discreto.

## Cores

| Uso | Cor |
| --- | --- |
| Fundo | `#0e0e0e` |
| Fundo alternativo (cards, painéis) | `#151515` / `#161616` |
| Barra do topo | `#1b1b1b` |
| Fios e divisórias | `#2a2a2a` (no preto puro, `#1f1f1f`) |
| Texto principal | `#f2f2f0` |
| Texto secundário | `#9d9d99` |
| Texto terciário (rótulos apagados) | `#6b6b68` |
| Seleção de texto | fundo `#e9e1cf`, texto `#111` |
| Rodapé (bloco claro) | fundo `#f4f3ef`, texto `#161616` |

Sem cor de destaque. A cor entra só pelas imagens dos trabalhos.

## Tipografia

- **Uma família só: Archivo** (variável, eixo de largura). `font-family:"Archivo",system-ui,sans-serif`
- **Títulos:** peso 800, largura 118 (`font-variation-settings:"wdth" 118`), entrelinha 1.02, letter-spacing −0.01em.
- **Corpo:** peso 400, largura 100, 15px, entrelinha 1.55, cor secundária, medida máxima de 56 caracteres.
- **Rótulos e metadados:** 11.5px, CAIXA ALTA, letter-spacing 0.02em.
- **Nome de item:** 14px, peso 700, CAIXA ALTA.
- **Fonte condensada** (`Barlow Semi Condensed`) só para o "recibo" da hero.

Escala fluida dos títulos grandes: `clamp(34px, 7.5vw, 100px)`.

## Layout

- Conteúdo com largura máxima de **1120px**, margem lateral `clamp(16px,4vw,48px)`.
- **Linha de rótulo** abrindo cada seção: à esquerda `/ NOME DA SEÇÃO`, à direita a numeração `N./01`, `N./02`. É a assinatura visual do site.
- Grades de 2 colunas pros cards, 3 pros itens verticais.
- Respiro entre seções: `clamp(40px,6vw,72px)`.
- Cantos: 8px nos cards, 10 a 12px nos blocos maiores. Nada muito arredondado.

## Movimento

- **Curva padrão:** `cubic-bezier(.22,.8,.22,1)`. Entrada rápida, chegada macia.
- **Curva de vai e volta:** `cubic-bezier(.65,0,.35,1)`.
- **Entrada ao rolar:** opacidade 0 → 1 e 22px subindo, ~1s, com atraso de 0.08s entre itens vizinhos.
- **Troca de página:** a página sai com opacidade 0, 10px pra cima e leve desfoque, ~0.42s; a nova entra subindo 14px.
- **Telas cheias** (menu, índice): revelam com `clip-path:inset(0 0 100% 0)` → `inset(0)` em 0.7 a 0.9s, e os títulos sobem de dentro da máscara, um atrás do outro.
- **Hover:** sublinhado que cresce da esquerda, seta que desliza, imagem que escala de leve (1.04) e escurece.
- **Rolagem suave** na página toda (Lenis).
- Sempre respeitar `prefers-reduced-motion`.

## Detalhes de acabamento

- Sem botão de chamada, sem frase de efeito. O trabalho fala.
- Números sempre com dois dígitos: `01`, `02`, `05 páginas`.
- Filtro e link acessório são texto em caixa alta com linha embaixo, nunca botão com fundo.
- Texto nunca deixa palavra sozinha no fim da linha; frase nova começa em linha nova no celular.
- Menu vira painel de tela cheia no celular, com as seções numeradas e grandes.
- Idioma automático PT/EN pelo navegador, com seletor BR / US discreto.

## Prompt pra reaproveitar

> Faça o site com a estética do meu portfólio: fundo `#0e0e0e`, texto `#f2f2f0`,
> secundário `#9d9d99`, fios `#2a2a2a`, sem cor de destaque. Tipografia só Archivo:
> títulos peso 800 com largura 118 e entrelinha 1.02, corpo 15px com entrelinha 1.55
> e no máximo 56 caracteres por linha, rótulos 11.5px em caixa alta.
> Conteúdo com 1120px de largura máxima e margem `clamp(16px,4vw,48px)`.
> Cada seção abre com uma linha de rótulo: `/ NOME` à esquerda e `N./01` à direita.
> Animações com `cubic-bezier(.22,.8,.22,1)`: itens entram subindo 22px ao rolar,
> troca de página com fade e leve desfoque, telas cheias revelando por máscara.
> Hover com sublinhado crescendo da esquerda e imagem escalando 1.04.
> Sem CTA, sem frase motivacional, sem gradiente de enfeite. Cantos de 8 a 12px.
> Respeitar `prefers-reduced-motion` e funcionar bem no celular.
