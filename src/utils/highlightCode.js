import { createHighlighterCore } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";

const highlighter = createHighlighterCore({
  themes: [
    () => import("@shikijs/themes/vitesse-light"),
    () => import("@shikijs/themes/vitesse-dark"),
  ],
  langs: [
    () => import("@shikijs/langs/javascript"),
    () => import("@shikijs/langs/jsx"),
    () => import("@shikijs/langs/json"),
    () => import("@shikijs/langs/css"),
  ],
  engine: createJavaScriptRegexEngine(),
});

export async function highlightCode(source, language, theme) {
  const instance = await highlighter;
  return instance.codeToHtml(source, {
    lang: language,
    theme: theme === "dark" ? "vitesse-dark" : "vitesse-light",
  });
}
