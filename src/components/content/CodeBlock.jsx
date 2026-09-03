import { Children, isValidElement, useEffect, useRef, useState } from 'react';
import { Check, Copy } from 'lucide-react';

export default function CodeBlock({ children, className = '', copy = true, source }) {
  const [copyState, setCopyState] = useState('idle');
  const timeoutRef = useRef();
  const copySource = source ?? getCodeText(children);

  useEffect(() => {
    return () => window.clearTimeout(timeoutRef.current);
  }, []);

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(copySource);
      setCopyState('success');
    } catch {
      setCopyState('error');
    }

    window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => setCopyState('idle'), 1800);
  }

  const hasCopyButton = copy !== false && copy !== 'false' && copySource.trim().length > 0;
  const copied = copyState === 'success';
  const label = copied ? 'Copiado' : copyState === 'error' ? 'Tente novamente' : 'Copiar';

  return (
    <div className={`code-block${className ? ` ${className}` : ''}`}>
      {hasCopyButton && (
        <button
          className={`code-copy-button${copied ? ' is-copied' : ''}`}
          type="button"
          onClick={copyCode}
        >
          {copied ? <Check aria-hidden="true" size={15} /> : <Copy aria-hidden="true" size={15} />}
          <span aria-live="polite">{label}</span>
        </button>
      )}
      {children}
    </div>
  );
}

export function MdxCodeBlock({ children, 'data-copy': copy, ...preProps }) {
  return (
    <CodeBlock copy={copy} source={getCodeText(children)}>
      <pre {...preProps}>{children}</pre>
    </CodeBlock>
  );
}

function getCodeText(node) {
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (!isValidElement(node)) return Children.toArray(node).map(getCodeText).join('');

  return Children.toArray(node.props.children).map(getCodeText).join('');
}
