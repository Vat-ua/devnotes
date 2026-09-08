# DevNotes

* DevNotes é um **production/content site** que combina uma landing tecnológica refinada, artigos editoriais e Labs interativos. Não é uma plataforma de cursos, documentação nem um projeto-demo. Articles e Labs podem ter finalidade educativa, mas a aplicação deve ser projetada e mantida como um site real de produção.

* Home prioriza descoberta, Articles priorizam leitura e Labs priorizam experimentação, mantendo a mesma linguagem visual.

* Stack: Vite, React, JavaScript, React Router e vanilla CSS. Evite dependências novas sem necessidade clara.

* Prefira uma arquitetura clara, coesa e fácil de manter. Não preserve estruturas existentes apenas para minimizar mudanças quando uma solução padrão tornar as responsabilidades mais claras e reduzir código de integração próprio.

* Preserve comportamentos esperados da Web, incluindo URLs navegáveis e recarregáveis, histórico Voltar/Avançar, scroll adequado entre navegações, restauração de posição quando aplicável, foco, estados de interação e tratamento consistente de carregamento e erros.

* Mantenha a organização simples: páginas em `src/pages`, componentes compartilhados em `src/components` e estilos em `src/styles`. Altere essa estrutura apenas quando houver uma necessidade concreta da aplicação.

* Em `Arquivos do exemplo`, inclua apenas arquivos que participam diretamente da demonstração e ajudam a explicar o conceito. Omita arquivos de integração quando eles apenas conectam o conteúdo ao shell e ao code explorer.

* Social cards de Articles e Labs são gerados automaticamente a partir das metadata por `pnpm generate:social`; não adicione `ogImage` manual nem edite `public/social`.

* Mantenha os estilos globais em `src/styles/index.css`, incluindo a `.prose` compartilhada pelos corpos MDX de Articles e Labs. Os mini-apps dos Labs mantêm estilos locais. Use Shiki para blocos de código; o highlighter dos Labs deve continuar lazy-loaded e limitado às linguagens usadas.

* `docs/` é uma pasta local de notas pessoais do usuário, ignorada pelo Git. Nunca a edite, mova ou remova, a menos que o usuário peça explicitamente.

* Todo conteúdo visível e todo UI devem estar em pt-BR, exceto os rótulos de marca aprovados: `DevNotes` e `Labs`.

* Use o cascade e a herança de forma intencional. Compartilhe estilos da mesma concepção; para componentes diferentes que usam o mesmo valor de design, prefira tokens a seletores agrupados artificialmente. Evite overrides desnecessários e não adote BEM ou novas styling-systems.

* Organize cada componente ou bloco junto de suas variantes e media queries, com bases mobile-first. A grade controla o posicionamento; os cartões controlam sua aparência.

## Criação de conteúdo

* Crie Articles em `content/articles/<slug>/` com `meta.js` e `index.mdx`.
* Crie Labs em `content/labs/<slug>/` com `meta.js`, `Demo.jsx`, `index.mdx` e, somente quando necessário, `code-files.js`.
* Use `title`, `description`, `topics` e `publishedAt` como metadata obrigatórios; Labs também exigem `demoInstruction`.
* Use `topics` como uma lista curta e não hierárquica de assuntos. A ordem não representa seção, prioridade nem categoria.
* O título vem de `meta.js`; não o repita como `<h1>` em `index.mdx`. O slug vem do nome da pasta.
* Não registre manualmente routes, registry entries, prerender paths, sitemap ou social metadata: a aplicação os descobre ou gera automaticamente.
* Mantenha components, styles e data específicos junto do respectivo conteúdo; use `src/components` apenas quando forem compartilhados.

## Quality bar

* Preserve a qualidade visual: hierarquia, tipografia, espaçamento e responsividade devem ser intencionais.

* Use HTML semântico, foco visível, rótulos claros e feedback para os estados relevantes de interação, carregamento, vazio, erro e sucesso.

* Valide dados estruturados nas fronteiras da aplicação, como metadata, registros de conteúdo, configurações e dados externos, sempre que valores inválidos puderem causar erros silenciosos ou inconsistências. Prefira validação centralizada, reutilizável e com mensagens de erro claras.

* Mudanças de arquitetura não devem degradar prerendering, hydration, navegação, URLs públicas, comportamento do histórico ou deploy existente. Evite substituir uma solução funcional por uma abstração mais complexa sem benefício concreto.

* Valide mudanças de UI nos temas claro e escuro, em mobile e desktop, além de lint e build de produção. Para mudanças de navegação ou routing, valide também navegação interna, acesso direto por URL, recarregamento e histórico Voltar/Avançar. Se alguma verificação não puder ser executada, informe a limitação.

## Manutenção destas instruções

* Revise a atualidade deste arquivo quando regras, decisões ou a arquitetura mudarem. Antes de atualizá-lo, explique ao usuário o que será alterado e por quê; mantenha apenas orientações importantes, atuais e sem contradições. Acordos explícitos da conversa têm prioridade.
