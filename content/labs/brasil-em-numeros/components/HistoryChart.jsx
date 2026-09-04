import { useId, useState } from 'react';
import { formatDate, formatNumber } from '../series.js';

export default function HistoryChart({ points, config }) {
  const [selected, setSelected] = useState(points.length - 1);
  const id = useId();
  const point = points[selected];
  const values = points.map((entry) => entry.value);
  const low = Math.min(...values, ...(config.kind === 'bar' ? [0] : []));
  const high = Math.max(...values, ...(config.kind === 'bar' ? [0] : []));
  const padding = Math.max((high - low) * 0.12, config.currency ? 0.01 : 0.05);
  const min = low - padding;
  const max = high + padding;
  const firstTime = Date.parse(points[0].date);
  const span = Date.parse(points.at(-1).date) - firstTime || 1;
  const x = (entry) =>
    points.length === 1 ? 380 : 12 + ((Date.parse(entry.date) - firstTime) / span) * 736;
  const y = (value) => 12 + ((max - value) / (max - min)) * 216;
  const path = points
    .map(
      (entry, index) =>
        `${index === 0 ? 'M' : config.kind === 'step' ? 'H' : 'L'}${x(entry)}${index > 0 && config.kind === 'step' ? 'V' : ','}${y(entry.value)}`,
    )
    .join(' ');
  const digits = config.currency ? 4 : 2;
  const description = `${config.label}, ${config.unit}. De ${formatDate(points[0].date, config.monthly)} a ${formatDate(points.at(-1).date, config.monthly)}. Valores exatos no controle e na tabela abaixo.`;

  function inspect(event) {
    const bounds = event.currentTarget.getBoundingClientRect();
    const position = ((event.clientX - bounds.left) / bounds.width) * 760;
    let nearest = 0;
    points.forEach((entry, index) => {
      if (Math.abs(x(entry) - position) < Math.abs(x(points[nearest]) - position)) nearest = index;
    });
    setSelected(nearest);
  }

  return (
    <figure className="br-chart">
      <figcaption className="br-chart-caption">
        <span>
          {config.label} <span className="br-subtle">/ {config.unit}</span>
        </span>
        <span>{config.kind === 'bar' ? 'Variações mensais' : 'Escala vertical ajustada'}</span>
      </figcaption>
      <div className="br-chart-layout">
        <div className="br-y-axis" aria-hidden="true">
          {[max, (min + max) / 2, min].map((value) => (
            <span key={value}>{formatNumber(value)}</span>
          ))}
        </div>
        <svg
          viewBox="0 0 760 240"
          preserveAspectRatio="none"
          role="img"
          aria-labelledby={`${id}-title`}
          onPointerMove={inspect}
          onPointerDown={inspect}
        >
          <title id={`${id}-title`}>{description}</title>
          {[min, (min + max) / 2, max].map((value) => (
            <line
              className="br-grid-line"
              key={value}
              x1="0"
              x2="760"
              y1={y(value)}
              y2={y(value)}
            />
          ))}
          {min < 0 && max > 0 && (
            <line className="br-zero-line" x1="0" x2="760" y1={y(0)} y2={y(0)} />
          )}
          {config.kind === 'bar' ? (
            points.map((entry, index) => (
              <rect
                key={entry.date}
                className={`br-bar${entry.value < 0 ? ' is-negative' : ''}`}
                opacity={index === selected ? 1 : 0.85}
                x={x(entry) - Math.min(18, 500 / points.length) / 2}
                y={Math.min(y(0), y(entry.value))}
                width={Math.min(18, 500 / points.length)}
                height={Math.max(1, Math.abs(y(entry.value) - y(0)))}
                rx="2"
              />
            ))
          ) : (
            <path className="br-chart-line" d={path} />
          )}
          <line className="br-cursor" x1={x(point)} x2={x(point)} y1="0" y2="240" />
          <circle className="br-chart-point" cx={x(point)} cy={y(point.value)} r="4" />
        </svg>
      </div>
      <div className="br-x-axis" aria-hidden="true">
        <span>{formatDate(points[0].date, config.monthly)}</span>
        <span>{formatDate(points.at(-1).date, config.monthly)}</span>
      </div>
      <div className="br-inspector">
        <label htmlFor={`${id}-range`}>
          Explorar observações <span className="br-subtle">· arraste ou use as setas</span>
        </label>
        <output htmlFor={`${id}-range`}>
          <time dateTime={config.monthly ? point.date.slice(0, 7) : point.date}>
            {formatDate(point.date, config.monthly)}
          </time>
          <strong>
            {formatNumber(point.value, digits)} <small>{config.unit}</small>
          </strong>
        </output>
        <input
          id={`${id}-range`}
          type="range"
          min="0"
          max={points.length - 1}
          value={selected}
          disabled={points.length === 1}
          onChange={(event) => setSelected(Number(event.target.value))}
          aria-valuetext={`${formatDate(point.date, config.monthly)}: ${formatNumber(point.value, digits)} ${config.unit}`}
        />
      </div>
      <details className="br-table-details">
        <summary>Ver {points.length} observações em tabela</summary>
        <div
          className="br-table-scroll"
          tabIndex="0"
          role="region"
          aria-label="Histórico de valores"
        >
          <table>
            <caption>
              {config.label} — {config.unit}
            </caption>
            <thead>
              <tr>
                <th scope="col">{config.monthly ? 'Mês de referência' : 'Data'}</th>
                <th scope="col">Valor ({config.unit})</th>
              </tr>
            </thead>
            <tbody>
              {points.toReversed().map((entry) => (
                <tr key={entry.date}>
                  <td>{formatDate(entry.date, config.monthly)}</td>
                  <td>{formatNumber(entry.value, digits)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </figure>
  );
}
