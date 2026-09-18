const API_ORIGIN = 'https://dummyjson.com';
const JSON_HEADERS = Object.freeze({ 'Content-Type': 'application/json' });

export const operations = Object.freeze([
  { id: 'get-product', label: 'Consultar produto', method: 'GET' },
  { id: 'search-products', label: 'Pesquisar produtos', method: 'GET' },
  { id: 'add-product', label: 'Criar produto', method: 'POST' },
  { id: 'update-product', label: 'Atualizar preço', method: 'PATCH' },
  { id: 'delete-product', label: 'Excluir produto', method: 'DELETE' },
]);

export function buildApiRequest(operationId, fields) {
  const operation = operations.find(({ id }) => id === operationId);
  if (!operation) throw new Error('Escolha uma operação válida.');

  const url = new URL(API_ORIGIN);
  let body = null;

  switch (operationId) {
    case 'get-product':
      url.pathname = `/products/${positiveInteger(fields.productId, 'Informe um ID válido.')}`;
      break;
    case 'search-products':
      url.pathname = '/products/search';
      url.searchParams.set('q', requiredText(fields.query, 'Informe um termo de busca.'));
      break;
    case 'add-product':
      url.pathname = '/products/add';
      body = {
        title: requiredText(fields.title, 'Informe o nome do produto.'),
        price: nonNegativeNumber(fields.createPrice, 'Informe um preço válido.'),
      };
      break;
    case 'update-product':
      url.pathname = `/products/${positiveInteger(fields.productId, 'Informe um ID válido.')}`;
      body = {
        price: nonNegativeNumber(fields.updatePrice, 'Informe um preço válido.'),
      };
      break;
    case 'delete-product':
      url.pathname = `/products/${positiveInteger(fields.productId, 'Informe um ID válido.')}`;
      break;
  }

  if (fields.delay) url.searchParams.set('delay', '1000');

  return Object.freeze({
    operationId,
    operationLabel: operation.label,
    method: operation.method,
    url: url.toString(),
    headers: body ? JSON_HEADERS : Object.freeze({}),
    body: body ? Object.freeze(body) : null,
  });
}

export async function executeApiRequest(request, { signal, fetchImpl = fetch } = {}) {
  assertRequest(request);

  const response = await fetchImpl(request.url, {
    method: request.method,
    headers: request.headers,
    body: request.body ? JSON.stringify(request.body) : undefined,
    signal,
  });
  const rawBody = await response.text();

  return {
    status: response.status,
    statusText: response.statusText,
    ok: response.ok,
    body: parseBody(rawBody),
  };
}

function assertRequest(request) {
  const operation = operations.find(({ id }) => id === request?.operationId);
  const url = new URL(request?.url ?? '', API_ORIGIN);

  if (!operation || operation.method !== request.method || url.origin !== API_ORIGIN) {
    throw new Error('A requisição não pertence a este experimento.');
  }
}

function parseBody(rawBody) {
  if (!rawBody) return null;

  try {
    return JSON.parse(rawBody);
  } catch {
    return rawBody;
  }
}

function requiredText(value, message) {
  const text = String(value ?? '').trim();
  if (!text) throw new Error(message);
  return text;
}

function positiveInteger(value, message) {
  const number = Number(value);
  if (!Number.isInteger(number) || number < 1) throw new Error(message);
  return number;
}

function nonNegativeNumber(value, message) {
  const number = Number(value);
  if (!Number.isFinite(number) || number < 0 || String(value).trim() === '') {
    throw new Error(message);
  }
  return number;
}
