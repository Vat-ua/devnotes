import { useEffect, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { fetchSeries } from '../api.js';
import { formatDate, formatNumber, indicators, selectPeriod, sourceUrl } from '../series.js';
import HistoryChart from './HistoryChart.jsx';

export default function EconomyExplorer() {
  const [indicator, setIndicator] = useState('selic');
  return (
    <div className="br-explorer">
      <header className="br-heading">
        <h2>
          Indicadores do Brasil<span>.</span>
        </h2>
        <p>Escolha um indicador. Explore sua história.</p>
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
      <Indicator key={indicator} config={indicators[indicator]} />
    </div>
  );
}

function Indicator({ config }) {
  const [months, setMonths] = useState(config.currency ? 3 : 12);
  const [attempt, setAttempt] = useState(0);
  const [request, setRequest] = useState({ status: 'loading', points: [] });

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    fetchSeries(config, { signal: controller.signal })
      .then((points) => {
        if (active) setRequest({ status: points.length ? 'ready' : 'empty', points });
      })
      .catch(() => {
        if (active) setRequest({ status: 'error', points: [] });
      });
    return () => {
      active = false;
      controller.abort();
    };
  }, [config, attempt]);

  function retry() {
    setRequest({ status: 'loading', points: [] });
    setAttempt((value) => value + 1);
  }

  const latest = request.points.at(-1);
  const points = selectPeriod(request.points, months, config.monthly);
  return (
    <section className="br-detail" aria-label={config.name}>
      <div className="br-summary">
        <h3>{config.title}</h3>
        <p className="br-description">{config.description}</p>
        {latest && (
          <div className="br-latest">
            <span className="br-label">Última observação · {config.label}</span>
            <p className="br-value">
              {formatNumber(latest.value, config.currency ? 4 : 2)}
              <span>{config.unit}</span>
            </p>
            <p className="br-date">
              {config.monthly ? 'Referência: ' : 'Em '}
              {formatDate(latest.date, config.monthly)}
            </p>
          </div>
        )}
        {latest && config.currency && <CurrencyReference config={config} latest={latest} />}
        <a className="br-source" href={sourceUrl(config.series)} target="_blank" rel="noreferrer">
          Banco Central · SGS {config.series}
          <ArrowUpRight size={13} aria-hidden="true" />
        </a>
      </div>
      <div className="br-history">
        {request.status === 'ready' ? (
          <>
            <div className="br-periods" role="group" aria-label="Período do histórico">
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
            <HistoryChart key={months} points={points} config={config} />
          </>
        ) : (
          <div className="br-feedback" role={request.status === 'error' ? 'alert' : 'status'}>
            {request.status === 'loading' ? (
              <>
                <span className="br-loading-mark" aria-hidden="true" />
                <p>Consultando o Banco Central…</p>
              </>
            ) : (
              <>
                <p>
                  {request.status === 'empty'
                    ? 'Nenhuma observação disponível.'
                    : 'Não foi possível consultar o Banco Central agora.'}
                </p>
                <button type="button" onClick={retry}>
                  Tentar novamente
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

function CurrencyReference({ config, latest }) {
  const [amount, setAmount] = useState('100');
  const value = Number(amount);
  const valid = amount !== '' && Number.isFinite(value) && value > 0 && value <= 100000000;
  return (
    <div className="br-converter">
      <label htmlFor="br-amount">E no seu bolso?</label>
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
      <div className="br-conversion" aria-live="polite">
        {valid ? (
          <strong>R$ {formatNumber(value * latest.value)}</strong>
        ) : (
          <p>Informe um valor maior que zero e até 100 milhões.</p>
        )}
      </div>
      <p id="br-amount-help">Pelo último câmbio publicado, sem tarifas ou impostos.</p>
    </div>
  );
}
