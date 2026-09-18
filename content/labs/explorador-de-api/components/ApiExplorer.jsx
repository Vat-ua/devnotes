import { useEffect, useMemo, useRef, useState } from 'react';
import { AlertCircle, LoaderCircle, Send } from 'lucide-react';
import { buildApiRequest, executeApiRequest, operations } from '../api.js';

const initialFields = {
  productId: '1',
  query: 'phone',
  title: 'Teclado mecânico',
  createPrice: '250',
  updatePrice: '12.99',
  delay: false,
};

export default function ApiExplorer() {
  const [operationId, setOperationId] = useState('get-product');
  const [fields, setFields] = useState(initialFields);
  const [result, setResult] = useState({ state: 'idle' });
  const activeRequest = useRef({ id: 0, controller: null });
  const preview = useMemo(() => getPreview(operationId, fields), [operationId, fields]);

  useEffect(() => () => activeRequest.current.controller?.abort(), []);

  function updateField(name, value) {
    setFields((currentFields) => ({ ...currentFields, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!preview.request) return;

    activeRequest.current.controller?.abort();
    const controller = new AbortController();
    const requestId = activeRequest.current.id + 1;
    activeRequest.current = { id: requestId, controller };
    const request = preview.request;

    setResult({ state: 'loading', request });

    try {
      const response = await executeApiRequest(request, { signal: controller.signal });
      if (activeRequest.current.id !== requestId) return;
      setResult({ state: 'received', request, response });
    } catch (error) {
      if (error.name === 'AbortError' || activeRequest.current.id !== requestId) return;
      setResult({ state: 'network-error', request });
    }
  }

  const isLoading = result.state === 'loading';

  return (
    <div className="api-explorer">
      <form className="api-request-panel" onSubmit={handleSubmit}>
        <PanelHeading label="Request" title="Monte a requisição">
          {preview.request && <MethodBadge method={preview.request.method} />}
        </PanelHeading>

        <label className="api-field">
          <span>Operação</span>
          <select value={operationId} onChange={(event) => setOperationId(event.target.value)}>
            {operations.map((operation) => (
              <option key={operation.id} value={operation.id}>
                {operation.label} ({operation.method})
              </option>
            ))}
          </select>
        </label>

        <OperationFields operationId={operationId} fields={fields} updateField={updateField} />

        <label className="api-delay">
          <input
            type="checkbox"
            checked={fields.delay}
            onChange={(event) => updateField('delay', event.target.checked)}
          />
          <span>
            Atrasar 1 segundo
            <small>Ajuda a observar o estado de carregamento.</small>
          </span>
        </label>

        <RequestPreview preview={preview} />

        <button
          className={`api-send${isLoading ? ' is-loading' : ''}`}
          type="submit"
          disabled={isLoading || !preview.request}
        >
          {isLoading ? (
            <>
              <LoaderCircle className="api-spinner" aria-hidden="true" size={17} /> Enviando…
            </>
          ) : (
            <>
              <Send aria-hidden="true" size={17} /> Enviar requisição
            </>
          )}
        </button>
      </form>

      <ResponsePanel result={result} />
    </div>
  );
}

function OperationFields({ operationId, fields, updateField }) {
  if (operationId === 'search-products') {
    return (
      <TextField
        label="Termo de busca"
        value={fields.query}
        onChange={(value) => updateField('query', value)}
        placeholder="Ex.: phone"
      />
    );
  }

  if (operationId === 'add-product') {
    return (
      <div className="api-field-grid">
        <TextField
          label="Nome do produto"
          value={fields.title}
          onChange={(value) => updateField('title', value)}
        />
        <NumberField
          label="Preço"
          value={fields.createPrice}
          onChange={(value) => updateField('createPrice', value)}
        />
      </div>
    );
  }

  if (operationId === 'update-product') {
    return (
      <div className="api-field-grid">
        <IdField value={fields.productId} onChange={(value) => updateField('productId', value)} />
        <NumberField
          label="Novo preço"
          value={fields.updatePrice}
          onChange={(value) => updateField('updatePrice', value)}
        />
      </div>
    );
  }

  return <IdField value={fields.productId} onChange={(value) => updateField('productId', value)} />;
}

function TextField({ label, value, onChange, placeholder }) {
  return (
    <label className="api-field">
      <span>{label}</span>
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required
      />
    </label>
  );
}

function IdField({ value, onChange }) {
  return (
    <label className="api-field">
      <span>ID do produto</span>
      <input
        type="number"
        min="1"
        step="1"
        inputMode="numeric"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required
      />
    </label>
  );
}

function NumberField({ label, value, onChange }) {
  return (
    <label className="api-field">
      <span>{label}</span>
      <input
        type="number"
        min="0"
        step="0.01"
        inputMode="decimal"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required
      />
    </label>
  );
}

function RequestPreview({ preview }) {
  if (!preview.request) {
    return <p className="api-validation">{preview.error}</p>;
  }

  const { request } = preview;

  return (
    <div className="api-request-preview" aria-label="Prévia da requisição">
      <RequestLine request={request} />
      {request.body && (
        <>
          <p>
            <span>Cabeçalho</span> <code>Content-Type: application/json</code>
          </p>
          <pre>{formatJson(request.body)}</pre>
        </>
      )}
    </div>
  );
}

function ResponsePanel({ result }) {
  return (
    <section className="api-response-panel" aria-busy={result.state === 'loading'}>
      <PanelHeading label="Response" title="Inspecione o retorno" />

      {result.state === 'idle' && (
        <div className="api-response-placeholder">
          <p>A resposta aparecerá aqui depois do primeiro envio.</p>
          <span>
            Você verá o status HTTP, <code>response.ok</code> e o JSON recebido.
          </span>
        </div>
      )}

      {result.state === 'loading' && (
        <div className="api-response-placeholder" role="status">
          <LoaderCircle className="api-spinner" aria-hidden="true" size={22} />
          <p>Aguardando a API…</p>
          <ResponseRequest request={result.request} />
        </div>
      )}

      {result.state === 'network-error' && (
        <div className="api-network-error" role="alert">
          <AlertCircle aria-hidden="true" size={22} />
          <div>
            <strong>Não foi possível receber uma resposta.</strong>
            <p>Verifique sua conexão e tente enviar a requisição novamente.</p>
          </div>
          <ResponseRequest request={result.request} />
        </div>
      )}

      {result.state === 'received' && (
        <div className="api-response-result">
          <ResponseRequest request={result.request} showBody />
          <div className="api-response-status" role="status">
            <strong className={result.response.ok ? 'is-ok' : 'is-error'}>
              {result.response.status}
              {result.response.statusText ? ` ${result.response.statusText}` : ''}
            </strong>
            <code>response.ok: {String(result.response.ok)}</code>
          </div>
          <pre>{formatJson(result.response.body)}</pre>
          {isMutation(result.request.method) && (
            <p className="api-simulation-note">
              O DummyJSON simulou esta operação. Os dados do servidor não foram alterados.
            </p>
          )}
        </div>
      )}
    </section>
  );
}

function ResponseRequest({ request, showBody = false }) {
  return (
    <div className="api-response-request">
      <span>Resposta para</span>
      <RequestLine request={request} />
      {showBody && request.body && (
        <details>
          <summary>Ver corpo enviado</summary>
          <pre>{formatJson(request.body)}</pre>
        </details>
      )}
    </div>
  );
}

function RequestLine({ request }) {
  return (
    <div className="api-request-line">
      <MethodBadge method={request.method} />
      <RequestUrl url={request.url} />
    </div>
  );
}

function RequestUrl({ url }) {
  const parsedUrl = new URL(url);

  return (
    <code>
      {parsedUrl.origin}
      <wbr />
      {parsedUrl.pathname}
      {parsedUrl.search && (
        <>
          <wbr />
          {parsedUrl.search}
        </>
      )}
    </code>
  );
}

function MethodBadge({ method }) {
  return <strong className={`api-method is-${method.toLowerCase()}`}>{method}</strong>;
}

function PanelHeading({ label, title, children }) {
  return (
    <header className="api-panel-heading">
      <div>
        <span>{label}</span>
        <h3>{title}</h3>
      </div>
      {children}
    </header>
  );
}

function getPreview(operationId, fields) {
  try {
    return { request: buildApiRequest(operationId, fields), error: null };
  } catch (error) {
    return { request: null, error: error.message };
  }
}

function formatJson(value) {
  return typeof value === 'string' ? value : JSON.stringify(value, null, 2);
}

function isMutation(method) {
  return ['POST', 'PATCH', 'DELETE'].includes(method);
}
