import assert from 'node:assert/strict';
import { test } from 'node:test';
import { fetchSeries, normalizeSeries } from '../content/labs/brasil-em-numeros/api.js';
import {
  formatDate,
  indicators,
  monthsBefore,
  selectPeriod,
} from '../content/labs/brasil-em-numeros/series.js';

test('datas do SGS preservam mês, ordem e sinal', () => {
  const points = normalizeSeries([
    { data: '01/03/2024', valor: '-0.10' },
    { data: '29/02/2024', valor: '0.00' },
  ]);
  assert.deepEqual(points, [
    { date: '2024-02-29', value: 0 },
    { date: '2024-03-01', value: -0.1 },
  ]);
  assert.match(formatDate('2024-03-01', true), /mar.*2024/);
  for (const rows of [
    {},
    [{ data: '31/02/2024', valor: '1' }],
    [{ data: '01/01/2024', valor: '' }],
    [{ data: '01/01/2024', valor: 'NaN' }],
    [
      { data: '01/01/2024', valor: '1' },
      { data: '01/01/2024', valor: '2' },
    ],
  ]) {
    assert.throws(() => normalizeSeries(rows));
  }
  assert.deepEqual(normalizeSeries([]), []);
});

test('janelas respeitam fim de mês, ano bissexto e meses de referência', () => {
  assert.equal(monthsBefore('2024-03-31', 1), '2024-02-29');
  assert.equal(monthsBefore('2025-03-31', 1), '2025-02-28');
  const points = Array.from({ length: 13 }, (_, index) => ({
    date: monthsBefore('2026-07-01', 12 - index),
    value: index,
  }));
  const selected = selectPeriod(points, 12, true);
  assert.equal(selected.length, 12);
  assert.equal(selected[0].date, '2025-08-01');
  assert.equal(selected.at(-1).date, '2026-07-01');
  assert.deepEqual(selectPeriod([], 12, false), []);
  const businessDays = [
    { date: '2026-07-31', value: 5 },
    { date: '2026-08-03', value: 5.1 },
    { date: '2026-09-01', value: 5.2 },
  ];
  assert.equal(selectPeriod(businessDays, 1, false)[0].date, '2026-08-03');
});

test('consulta limita datas, propaga falhas e cancelamento', async () => {
  const original = globalThis.fetch;
  let behavior = 'valid';
  let lastUrl;
  globalThis.fetch = async (url, { signal }) => {
    lastUrl = new URL(url);
    signal.throwIfAborted();
    if (behavior === 'http') return new Response('{}', { status: 503 });
    if (behavior === 'invalid') return new Response('[{"data":"31/02/2026","valor":"1"}]');
    if (behavior === 'empty') return new Response('[]');
    const date = lastUrl.searchParams.get('dataFinal');
    return new Response(JSON.stringify([{ data: date, valor: '5.1234' }]));
  };
  try {
    const config = indicators.dolar;
    const result = await fetchSeries(config);
    assert.equal(result[0].value, 5.1234);
    assert.equal(lastUrl.hostname, 'api.bcb.gov.br');
    assert.equal(lastUrl.searchParams.get('formato'), 'json');
    const date = (name) => lastUrl.searchParams.get(name).split('/').reverse().join('-');
    assert.ok((Date.parse(date('dataFinal')) - Date.parse(date('dataInicial'))) / 86400000 < 430);
    for (const next of ['http', 'invalid']) {
      behavior = next;
      await assert.rejects(fetchSeries(config));
    }
    behavior = 'empty';
    assert.deepEqual(await fetchSeries(config), []);
    behavior = 'valid';
    const controller = new AbortController();
    controller.abort();
    await assert.rejects(fetchSeries(config, { signal: controller.signal }), {
      name: 'AbortError',
    });
    assert.equal((await fetchSeries(config))[0].value, 5.1234);
  } finally {
    globalThis.fetch = original;
  }
});
