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
    note: 'A meta Selic orienta os juros da economia. Não é a Selic efetiva diária nem uma promessa de rendimento.',
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
      'A cotação de referência de venda, em reais por dólar. Explore os fechamentos publicados pelo Banco Central.',
    note: 'Referência PTAX de fechamento, não cotação em tempo real. O preço de uma compra inclui condições da instituição, tarifas e impostos. Fins de semana e feriados podem não ter observações.',
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
      'A cotação de referência de venda, em reais por euro. Uma história própria, além do movimento do dólar.',
    note: 'Referência de venda do BCB, calculada a partir do dólar e da paridade euro/dólar. Não é cotação em tempo real nem preço final de uma compra. Só aparecem datas publicadas.',
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
      'A inflação medida pelo IBGE e disponibilizada pelo Banco Central. Veja cada mês ou a variação acumulada em 12 meses.',
    note: 'O mês exibido é o de referência, não a data de divulgação. Uma taxa mensal negativa indica queda média de preços naquele mês. O acumulado em 12 meses combina as variações, não as soma.',
  },
};

export function getSeries(indicator, mode) {
  const config = indicators[indicator];
  return indicator === 'ipca' && mode === 'annual'
    ? {
        ...config,
        series: 13522,
        unit: '% em 12 meses',
        label: 'IPCA · acumulado em 12 meses',
        kind: 'line',
      }
    : config;
}

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

export function formatNumber(value, digits = 2, signed = false) {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
    ...(signed ? { signDisplay: 'exceptZero' } : {}),
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

export function summarize(points, config) {
  const first = points[0];
  const last = points.at(-1);
  const min = points.reduce((result, point) => (point.value < result.value ? point : result));
  const max = points.reduce((result, point) => (point.value > result.value ? point : result));
  const change = config.currency ? (last.value / first.value - 1) * 100 : last.value - first.value;
  return { first, last, min, max, change };
}
