import { useEffect, useState } from 'react';
import { ArrowUpRight, RefreshCw, ChartNoAxesCombined } from 'lucide-react';
import { fetchSeries } from '../api.js';
import {
  formatDate,
  formatNumber,
  getSeries,
  indicators,
  selectPeriod,
  sourceUrl,
  summarize,
} from '../series.js';
import HistoryChart from './HistoryChart.jsx';

export default function EconomyExplorer() {
  const [indicator, setIndicator] = useState('selic');
  return (
    <div className="br-explorer">
      <header className="br-heading">
        <span className="br-kicker">
          <ChartNoAxesCombined size={16} aria-hidden="true" /> Um olhar sobre a economia
        </span>
        <h2>
          Brasil em números<span>.</span>
        </h2>
        <p>Quatro indicadores. Muitas histórias para explorar.</p>
      </header>
      <div className="br-indicators" role="group" aria-label="Indicador econômico">
        {Object.entries(indicators).map(([key, config]) => (
          <button
            key={key}
            type="button"
            aria-pressed={indicator === key}
            onClick={() => setIndicator(key)}
          >
            <span>{config.category}</span>
            <strong>{config.name}</strong>
            <ArrowUpRight size={16} aria-hidden="true" />
          </button>
        ))}
      </div>
      <Indicator key={indicator} indicator={indicator} />
    </div>
  );
}

function Indicator({ indicator }) {
  const [mode, setMode] = useState('monthly');
  const [months, setMonths] = useState(indicators[indicator].currency ? 3 : 12);
  const [requestKey, setRequestKey] = useState(0);
  const [request, setRequest] = useState({ status: 'loading' });
  const config = getSeries(indicator, mode);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    fetchSeries(getSeries(indicator, mode), { signal: controller.signal, refresh: requestKey > 0 })
      .then((result) => {
        if (active) setRequest({ status: result.points.length ? 'ready' : 'empty', ...result });
      })
      .catch((error) => {
        if (active)
          setRequest({
            status: 'error',
            message:
              error.name === 'TimeoutError'
                ? 'A consulta demorou mais que o esperado.'
                : 'Não foi possível consultar o Banco Central agora.',
          });
      });
    return () => {
      active = false;
      controller.abort();
    };
  }, [indicator, mode, requestKey]);

  function refresh() {
    setRequest({ status: 'loading' });
    setRequestKey((key) => key + 1);
  }

  function changeMode(next) {
    if (next === mode) return;
    setRequest({ status: 'loading' });
    setMode(next);
  }

  return (
    <section className="br-detail" aria-label={config.name}>
      <header className="br-detail-heading">
        <div>
          <h3>{config.title}</h3>
          <p>{config.description}</p>
        </div>
        <button
          className="br-refresh"
          type="button"
          disabled={request.status === 'loading'}
          onClick={refresh}
        >
          <RefreshCw size={14} aria-hidden="true" /> Atualizar
        </button>
      </header>
      {indicator === 'ipca' && (
        <div className="br-modes" role="group" aria-label="Medida de inflação">
          <button
            type="button"
            aria-pressed={mode === 'monthly'}
            onClick={() => changeMode('monthly')}
          >
            No mês
          </button>
          <button
            type="button"
            aria-pressed={mode === 'annual'}
            onClick={() => changeMode('annual')}
          >
            Acumulado em 12 meses
          </button>
        </div>
      )}
      <div className="br-periods" role="group" aria-label="Período do histórico">
        <span>Explorar</span>
        {config.periods.map((period) => (
          <button
            type="button"
            key={period}
            aria-pressed={months === period}
            onClick={() => setMonths(period)}
          >
            {period === 1 ? '1 mês' : `${period} meses`}
          </button>
        ))}
      </div>
      {request.status === 'loading' && (
        <div className="br-feedback" role="status">
          <span className="br-loading-mark" aria-hidden="true" />
          <strong>Consultando o Banco Central…</strong>
          <p>Buscando o histórico de {config.name}.</p>
        </div>
      )}
      {request.status === 'error' && (
        <div className="br-feedback" role="alert">
          <strong>{request.message}</strong>
          <p>Verifique sua conexão e tente novamente.</p>
          <button type="button" onClick={refresh}>
            Tentar novamente
          </button>
        </div>
      )}
      {request.status === 'empty' && (
        <div className="br-feedback" role="status">
          <strong>Nenhuma observação disponível.</strong>
          <p>O Banco Central não retornou dados para esta consulta.</p>
          <button type="button" onClick={refresh}>
            Consultar novamente
          </button>
        </div>
      )}
      {request.status === 'ready' && (
        <Results
          key={`${config.series}-${request.checkedAt}`}
          request={request}
          config={config}
          months={months}
        />
      )}
      <footer className="br-source">
        <p>{config.note}</p>
        <a href={sourceUrl(config.series)} target="_blank" rel="noreferrer">
          Banco Central · SGS {config.series} <ArrowUpRight size={13} aria-hidden="true" />
        </a>
        {config.monthly && <span>Origem: IBGE</span>}
      </footer>
    </section>
  );
}

function Results({ request, config, months }) {
  const points = selectPeriod(request.points, months, config.monthly);
  const { first, last, min, max, change } = summarize(points, config);
  const digits = config.currency ? 4 : 2;
  const formatValue = (value) => `${formatNumber(value, digits)} ${config.unit}`;
  return (
    <>
      <div className="br-overview">
        <div className="br-latest">
          <span className="br-kicker">Última observação · {config.label}</span>
          <p className="br-value">
            {formatNumber(last.value, digits)}
            <span>{config.unit}</span>
          </p>
          <p className="br-subtle">
            {config.monthly ? 'Referência: ' : 'Em '}
            {formatDate(last.date, config.monthly)}
          </p>
        </div>
        <div className="br-change">
          <span>{config.currency ? 'Variação no período' : 'Diferença entre as pontas'}</span>
          <strong>
            {formatNumber(change, 2, true)} {config.currency ? '%' : 'p.p.'}
          </strong>
          <small>
            {formatDate(first.date, config.monthly)} → {formatDate(last.date, config.monthly)}
          </small>
        </div>
      </div>
      <HistoryChart key={`${config.series}-${months}`} points={points} config={config} />
      <dl className="br-extremes">
        <div>
          <dt>Menor {config.monthly ? 'taxa' : 'valor'} no período</dt>
          <dd>
            {formatValue(min.value)}
            <small>{formatDate(min.date, config.monthly)}</small>
          </dd>
        </div>
        <div>
          <dt>Maior {config.monthly ? 'taxa' : 'valor'} no período</dt>
          <dd>
            {formatValue(max.value)}
            <small>{formatDate(max.date, config.monthly)}</small>
          </dd>
        </div>
      </dl>
      {config.currency && (
        <CurrencyReference key={config.series} config={config} first={first} last={last} />
      )}
      <p className="br-method">
        Janela contada a partir da última observação publicada.{' '}
        {config.monthly
          ? 'Cada ponto representa um mês de referência.'
          : 'As datas nas pontas são as observações disponíveis dentro da janela.'}{' '}
        {config.monthly &&
          'A diferença em p.p. compara as taxas nas pontas; não é a inflação acumulada do período.'}{' '}
        Em caso de empate, os extremos mostram a primeira ocorrência.
      </p>
      <div className="br-query">
        <span>
          Consulta:{' '}
          {new Intl.DateTimeFormat('pt-BR', {
            dateStyle: 'short',
            timeStyle: 'short',
            timeZone: 'America/Sao_Paulo',
          }).format(new Date(request.checkedAt))}{' '}
          (Brasília)
        </span>
        <a href={request.url} target="_blank" rel="noreferrer">
          Abrir dados da consulta ↗
        </a>
      </div>
    </>
  );
}

function CurrencyReference({ config, first, last }) {
  const [amount, setAmount] = useState('100');
  const value = Number(amount);
  const valid = amount !== '' && Number.isFinite(value) && value > 0 && value <= 100000000;
  return (
    <div className="br-converter">
      <div>
        <label htmlFor="br-amount">E no seu bolso?</label>
        <p>Compare o mesmo valor nas duas datas.</p>
        <div className="br-amount">
          <span>{config.currency}</span>
          <input
            id="br-amount"
            type="number"
            inputMode="decimal"
            min="0.01"
            max="100000000"
            step="0.01"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            aria-invalid={!valid}
            aria-describedby="br-amount-help"
          />
        </div>
      </div>
      <div className="br-conversion" aria-live="polite">
        {valid ? (
          <>
            <span>
              R$ {formatNumber(value * first.value)} <small>em {formatDate(first.date)}</small>
            </span>
            <strong>
              R$ {formatNumber(value * last.value)} <small>em {formatDate(last.date)}</small>
            </strong>
          </>
        ) : (
          <p>Informe um valor maior que zero e até 100 milhões.</p>
        )}
        <p id="br-amount-help">Conversão pela referência de venda, sem tarifas ou impostos.</p>
      </div>
    </div>
  );
}
