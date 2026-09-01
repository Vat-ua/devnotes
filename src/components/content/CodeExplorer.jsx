import { useEffect, useState } from "react";
import { Check, Code2, Copy } from "lucide-react";

export default function CodeExplorer({ files }) {
  const [activeFile, setActiveFile] = useState(files[0]?.name);
  const [highlightedCode, setHighlightedCode] = useState("");
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme ?? "light");
  const [copied, setCopied] = useState(false);
  const file = files.find((item) => item.name === activeFile);

  useEffect(() => {
    const observer = new MutationObserver(() => setTheme(document.documentElement.dataset.theme ?? "light"));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!file) return undefined;
    let cancelled = false;
    import("../../utils/highlightCode.js")
      .then(({ highlightCode }) => highlightCode(file.source, getLanguage(file.name), theme))
      .then((html) => {
        if (!cancelled) setHighlightedCode(html);
      });
    return () => { cancelled = true; };
  }, [file, theme]);

  if (!file) return null;

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(file.source);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <details className="code-explorer" open>
      <summary>
        <span>
          <Code2 aria-hidden="true" size={18} /> Arquivos do exemplo
        </span>
        <span className="code-explorer-count">{files.length} arquivos</span>
      </summary>
      <div className="code-explorer-body">
        <div className="code-file-tabs" role="tablist" aria-label="Arquivos do exemplo">
          {files.map((item) => (
            <button
              className={item.name === activeFile ? "active" : ""}
              type="button"
              role="tab"
              aria-selected={item.name === activeFile}
              onClick={() => {
                setActiveFile(item.name);
                setCopied(false);
              }}
              key={item.name}
            >
              {item.name}
            </button>
          ))}
        </div>
        <div className="code-file-heading">
          <span>{file.description}</span>
          <button
            className={`code-copy-button${copied ? " is-copied" : ""}`}
            type="button"
            onClick={copyCode}
          >
            {copied ? <Check aria-hidden="true" size={15} /> : <Copy aria-hidden="true" size={15} />}
            <span aria-live="polite">{copied ? "Copiado" : "Copiar"}</span>
          </button>
        </div>
        {highlightedCode ? (
          <div className="highlighted-code" dangerouslySetInnerHTML={{ __html: highlightedCode }} />
        ) : (
          <pre><code>{file.source}</code></pre>
        )}
      </div>
    </details>
  );
}

function getLanguage(filename) {
  const extension = filename.split(".").pop();
  return { js: "javascript", jsx: "jsx", css: "css", json: "json" }[extension] ?? "text";
}
