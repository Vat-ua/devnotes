import { useEffect, useId, useRef, useState } from "react";
import { Check, Code2, Copy } from "lucide-react";

export default function CodeExplorer({ files }) {
  const [activeFile, setActiveFile] = useState(files[0]?.name);
  const [highlightedCode, setHighlightedCode] = useState("");
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme ?? "light");
  const [copied, setCopied] = useState(false);
  const explorerId = useId();
  const tabRefs = useRef([]);
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

  function selectFile(index, shouldFocus = false) {
    setActiveFile(files[index].name);
    setCopied(false);

    if (shouldFocus) {
      tabRefs.current[index]?.focus();
    }
  }

  function handleTabKeyDown(event, index) {
    const lastIndex = files.length - 1;
    let nextIndex = index;

    if (event.key === "ArrowRight") nextIndex = index === lastIndex ? 0 : index + 1;
    if (event.key === "ArrowLeft") nextIndex = index === 0 ? lastIndex : index - 1;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = lastIndex;

    if (nextIndex !== index) {
      event.preventDefault();
      selectFile(nextIndex, true);
    }
  }

  function tabId(filename) {
    return `${explorerId}-${filename}`;
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
          {files.map((item, index) => (
            <button
              className={item.name === activeFile ? "active" : ""}
              type="button"
              role="tab"
              id={tabId(item.name)}
              aria-selected={item.name === activeFile}
              aria-controls={`${explorerId}-panel`}
              tabIndex={item.name === activeFile ? 0 : -1}
              onClick={() => selectFile(index)}
              onKeyDown={(event) => handleTabKeyDown(event, index)}
              ref={(element) => { tabRefs.current[index] = element; }}
              key={item.name}
            >
              {item.name}
            </button>
          ))}
        </div>
        <div id={`${explorerId}-panel`} role="tabpanel" aria-labelledby={tabId(file.name)}>
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
      </div>
    </details>
  );
}

function getLanguage(filename) {
  const extension = filename.split(".").pop();
  return { js: "javascript", jsx: "jsx", css: "css", json: "json" }[extension] ?? "text";
}
