# DevNotes

DevNotes é um pequeno site de tecnologia sobre ideias, notas práticas e laboratórios interativos para quem constrói produtos na web.

## Stack

- Vite
- React + React Router
- JavaScript
- Vanilla CSS

## Como executar

```bash
pnpm install
pnpm dev
```

Para gerar uma build de produção:

```bash
pnpm build
```

## Scripts

- `pnpm dev` — inicia o ambiente local
- `pnpm build` — gera a build de produção
- `pnpm preview` — visualiza a build
- `pnpm lint` — verifica o código com oxlint

## Conteúdo

Articles vivem em `content/articles/<slug>/index.mdx`. Cada arquivo exporta `meta` e pode misturar Markdown, blocos de código e componentes React.

Labs vivem em `content/labs/<slug>/`, com `meta.js`, `Lab.jsx`, `guide.mdx` opcional e `code-files.js` quando o Lab expõe seus arquivos no code explorer. O registry local encontra os dois formatos automaticamente; não é necessário editar uma lista central para publicar um novo conteúdo.
