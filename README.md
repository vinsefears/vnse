# V__NSE — Portfólio

Site pessoal do Winycius (V__NSE): vídeos, motion, branding, design e UX/UI.

Site estático, sem build. Tudo que vai pro ar está na pasta `site/`.

## Rodar no PC

```bash
node site/serve.js
```

Depois abra http://localhost:5173. O `serve.js` serve só para testar localmente; a hospedagem não usa ele.

## Publicação (Cloudflare Pages)

- Build command: *(vazio)*
- Build output directory: `site`

## Onde mexer

| O que | Onde |
| --- | --- |
| Projetos, vídeos e textos | `site/app.js` (topo do arquivo) |
| Traduções PT / EN | `site/app.js`, objeto `T` |
| Estilos | `site/styles.css` |
| Estrutura e templates | `site/index.html` |
| Rolagem automática das prévias | `site/autoscroll.js` |
| Imagens | `site/assets/` |
| Música de fundo | `site/audio/caminhos.mp3` |

O idioma é automático: navegador em português abre em PT, o resto abre em EN. O link `?lang=en` força o inglês.
