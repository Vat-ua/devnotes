export const indicators = {
  selic: {
    name: 'Selic',
    category: 'Juros',
    series: 432,
    unit: '% a.a.',
    title: 'O ritmo dos juros.',
    label: 'Meta Selic',
    kind: 'step',
    periods: [12, 24, 60],
    months: 61,
    description:
      'A meta definida pelo Copom, em percentual ao ano. Cada degrau marca uma mudança de patamar.',
  },
  dolar: {
    name: 'Dólar',
    category: 'Câmbio',
    series: 1,
    unit: 'R$ / US$',
    title: 'Quanto custa um dólar?',
    label: 'Dólar · venda',
    kind: 'line',
    periods: [1, 3, 6, 12],
    months: 13,
    currency: 'US$',
    description:
      'Referência PTAX de venda, em reais por dólar. Fechamentos publicados, sem cotações em tempo real.',
  },
  euro: {
    name: 'Euro',
    category: 'Câmbio',
    series: 21619,
    unit: 'R$ / €',
    title: 'O euro, visto em reais.',
    label: 'Euro · venda',
    kind: 'line',
    periods: [1, 3, 6, 12],
    months: 13,
    currency: '€',
    description:
      'A referência de venda do Banco Central, em reais por euro. Sem cotações em tempo real.',
  },
  ipca: {
    name: 'IPCA',
    category: 'Inflação',
    series: 433,
    unit: '% no mês',
    title: 'Os preços, mês a mês.',
    label: 'IPCA · mensal',
    kind: 'bar',
    periods: [12, 24, 60],
    months: 62,
    monthly: true,
    description:
      'A inflação mensal medida pelo IBGE. Valores negativos indicam queda média de preços no mês de referência.',
  },
};

export function sourceUrl(series) {
  return `https://www3.bcb.gov.br/sgspub/consultarvalores/consultarValoresSeries.do?method=consultarGraficoPorId&hdOidSeriesSelecionadas=${series}`;
}

export function formatDate(date, monthly = false) {
  return new Intl.DateTimeFormat('pt-BR', {
    ...(monthly ? {} : { day: '2-digit' }),
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${date}T00:00:00Z`));
}

export function formatNumber(value, digits = 2) {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}

// Ajusta o dia: um mês antes de 31 de março é 28 (ou 29) de fevereiro.
export function monthsBefore(isoDate, months) {
  const date = new Date(`${isoDate}T00:00:00Z`);
  const day = date.getUTCDate();
  date.setUTCDate(1);
  date.setUTCMonth(date.getUTCMonth() - months);
  const lastDay = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0)).getUTCDate();
  date.setUTCDate(Math.min(day, lastDay));
  return date.toISOString().slice(0, 10);
}

export function selectPeriod(points, months, monthly) {
  if (!points.length) return [];
  const start = monthsBefore(points.at(-1).date, monthly ? months - 1 : months);
  return points.filter((point) => point.date >= start);
}
