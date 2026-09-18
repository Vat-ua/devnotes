import assert from 'node:assert/strict';
import { test } from 'node:test';
import { buildApiRequest, executeApiRequest } from '../content/labs/explorador-de-api/api.js';

const fields = {
  productId: '1',
  query: 'phone',
  title: 'Teclado mecânico',
  createPrice: '250',
  updatePrice: '12.99',
  delay: false,
};

test('monta apenas os requests previstos pelo Lab', () => {
  const get = buildApiRequest('get-product', fields);
  assert.equal(get.method, 'GET');
  assert.equal(get.url, 'https://dummyjson.com/products/1');
  assert.equal(get.body, null);

  const search = buildApiRequest('search-products', { ...fields, delay: true });
  assert.equal(search.url, 'https://dummyjson.com/products/search?q=phone&delay=1000');

  const post = buildApiRequest('add-product', fields);
  assert.equal(post.method, 'POST');
  assert.deepEqual(post.headers, { 'Content-Type': 'application/json' });
  assert.deepEqual(post.body, { title: 'Teclado mecânico', price: 250 });

  const patch = buildApiRequest('update-product', fields);
  assert.equal(patch.method, 'PATCH');
  assert.deepEqual(patch.body, { price: 12.99 });

  const remove = buildApiRequest('delete-product', fields);
  assert.equal(remove.method, 'DELETE');
  assert.throws(() => buildApiRequest('unknown', fields));
  assert.throws(() => buildApiRequest('get-product', { ...fields, productId: '0' }));
  assert.throws(() => buildApiRequest('search-products', { ...fields, query: ' ' }));
});

test('mantém cada resposta ligada ao snapshot enviado', async () => {
  const mutableFields = { ...fields };
  const firstRequest = buildApiRequest('add-product', mutableFields);
  mutableFields.title = 'Outro produto';
  const secondRequest = buildApiRequest('add-product', mutableFields);

  const fetchImpl = async (_url, options) => {
    const body = JSON.parse(options.body);
    return new Response(JSON.stringify({ id: 195, ...body }), {
      status: 201,
      statusText: 'Created',
    });
  };

  const first = await executeApiRequest(firstRequest, { fetchImpl });
  const second = await executeApiRequest(secondRequest, { fetchImpl });
  assert.equal(firstRequest.body.title, 'Teclado mecânico');
  assert.equal(first.body.title, 'Teclado mecânico');
  assert.equal(second.body.title, 'Outro produto');
});

test('distingue resposta HTTP de falha de rede e respeita cancelamento', async () => {
  const request = buildApiRequest('get-product', fields);
  const notFound = await executeApiRequest(request, {
    fetchImpl: async () =>
      new Response(JSON.stringify({ message: 'Product not found' }), {
        status: 404,
        statusText: 'Not Found',
      }),
  });
  assert.equal(notFound.status, 404);
  assert.equal(notFound.ok, false);
  assert.deepEqual(notFound.body, { message: 'Product not found' });

  await assert.rejects(
    executeApiRequest(request, {
      fetchImpl: async () => {
        throw new TypeError('Failed to fetch');
      },
    }),
    TypeError,
  );

  const controller = new AbortController();
  controller.abort();
  await assert.rejects(
    executeApiRequest(request, {
      signal: controller.signal,
      fetchImpl: async (_url, { signal }) => {
        signal.throwIfAborted();
      },
    }),
    { name: 'AbortError' },
  );
});
