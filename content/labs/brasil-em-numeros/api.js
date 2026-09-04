import { monthsBefore } from './series.js';

const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000;

export function normalizeSeries(rows) {
  if (!Array.isArray(rows)) throw new Error('O Banco Central retornou um formato inesperado.');
  const dates = new Set();
  return rows
    .map((row) => {
      if (
        !/^\d{2}\/\d{2}\/\d{4}$/.test(row.data) ||
        typeof row.valor !== 'string' ||
        !/^-?\d+(\.\d+)?$/.test(row.valor)
      ) {
        throw new Error('A resposta contém uma observação inválida.');
      }
      const [day, month, year] = row.data.split('/');
      const date = `${year}-${month}-${day}`;
      const timestamp = Date.parse(`${date}T00:00:00Z`);
      const value = Number(row.valor);
      if (
        !Number.isFinite(timestamp) ||
        new Date(timestamp).toISOString().slice(0, 10) !== date ||
        !Number.isFinite(value) ||
        dates.has(date)
      ) {
        throw new Error('A resposta contém uma data ou um valor inválido.');
      }
      dates.add(date);
      return { date, value };
    })
    .sort((a, b) => a.date.localeCompare(b.date));
}

export async function fetchSeries(config, { signal, refresh = false } = {}) {
  const saved = cache.get(config.series);
  if (!refresh && saved && Date.now() - saved.savedAt < CACHE_DURATION) return saved.result;

  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date());
  const part = (type) => parts.find((entry) => entry.type === type).value;
  const end = `${part('year')}-${part('month')}-${part('day')}`;
  const start = monthsBefore(end, config.months).slice(0, 7) + '-01';
  const toBrazilian = (date) => date.split('-').reverse().join('/');
  const params = new URLSearchParams({
    formato: 'json',
    dataInicial: toBrazilian(start),
    dataFinal: toBrazilian(end),
  });
  const url = `https://api.bcb.gov.br/dados/serie/bcdata.sgs.${config.series}/dados?${params}`;
  // O limite cancela também a leitura do corpo; o componente controla o ciclo da consulta.
  const requestSignal = AbortSignal.any([
    signal ?? new AbortController().signal,
    AbortSignal.timeout(20000),
  ]);
  const response = await fetch(url, { signal: requestSignal });
  if (!response.ok)
    throw new Error(`O Banco Central não respondeu à consulta (HTTP ${response.status}).`);
  const points = normalizeSeries(await response.json());
  if (
    points.some(
      (point) =>
        point.date < start ||
        point.date > end ||
        (config.monthly && !point.date.endsWith('-01')) ||
        (!config.monthly && point.value < 0) ||
        (config.currency && point.value === 0),
    )
  ) {
    throw new Error('Os dados recebidos não correspondem ao período ou à unidade esperada.');
  }
  const result = { points, url, checkedAt: new Date().toISOString() };
  if (!requestSignal.aborted && points.length)
    cache.set(config.series, { result, savedAt: Date.now() });
  return result;
}
