import { useState } from "react";
import { Code2, Copy } from "lucide-react";

export default function CodeExplorer({ files }) {
  const [activeFile, setActiveFile] = useState(files[0]?.name);
  const file = files.find((item) => item.name === activeFile);

  if (!file) return null;

  async function copyCode() {
    await navigator.clipboard?.writeText(file.source);
  }

  return (
    <details className="code-explorer" open>
      <summary><span><Code2 aria-hidden="true" size={18} /> Código do exemplo</span><span className="code-explorer-count">{files.length} arquivos</span></summary>
      <div className="code-explorer-body">
        <div className="code-file-tabs" role="tablist" aria-label="Arquivos do exemplo">
          {files.map((item) => <button className={item.name === activeFile ? "active" : ""} type="button" role="tab" aria-selected={item.name === activeFile} onClick={() => setActiveFile(item.name)} key={item.name}>{item.name}</button>)}
        </div>
        <div className="code-file-heading"><span>{file.description}</span><button type="button" onClick={copyCode}><Copy aria-hidden="true" size={15} /> Copiar</button></div>
        <pre><code>{file.source}</code></pre>
      </div>
    </details>
  );
}
