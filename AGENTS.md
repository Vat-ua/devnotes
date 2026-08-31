# DevNotes

- DevNotes é um premium tech landing com Articles editoriais e Labs interativos; não é uma plataforma de curso ou documentação.
- Stack: Vite, React, JavaScript, React Router e vanilla CSS. Evite dependências novas sem necessidade clara.
- Mantenha a estrutura simples: páginas em `src/pages`, componentes compartilhados em `src/components` e estilos em `src/styles`.
- O conteúdo é local e file-based: Articles ficam em `content/articles/<slug>/index.mdx`; Labs em `content/labs/<slug>/` com `meta.js`, `Lab.jsx`, `guide.mdx` e `code-files.js` quando necessário. Um Lab deve ensinar por meio de um mini-app útil, explicação e código-fonte real no code explorer; o registry em `src/content/registry.js` encontra o conteúdo automaticamente.
- `docs/` é uma pasta local de notas pessoais do usuário, ignorada pelo Git. Nunca a edite, mova ou remova, a menos que o usuário peça explicitamente.
- Todo conteúdo visível e todo UI devem estar em pt-BR, exceto os rótulos de marca aprovados: `DevNotes`, `Articles` e `Labs`.
- Trabalhe mobile-first, use tokens de design, estados de foco visíveis, semântica HTML e suporte a tema claro/escuro.
- Home deve parecer uma landing page tecnológica refinada; Articles priorizam leitura; Labs priorizam experimentação. Todos compartilham a mesma linguagem visual.
