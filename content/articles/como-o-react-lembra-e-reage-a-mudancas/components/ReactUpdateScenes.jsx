import './ReactUpdateScenes.css';

const scenes = [
  {
    title: 'Antes da escolha',
    currency: 'USD',
    value: '5,00',
    method: 'useState',
    explanation: 'A moeda e a taxa já estão na memória. A tela mostra o resultado atual.',
  },
  {
    title: 'A escolha mudou',
    currency: 'EUR',
    loading: true,
    method: 'setCurrency → useEffect',
    explanation:
      'EUR já aparece na tela. O efeito busca a nova taxa, enquanto o resultado aguarda.',
  },
  {
    title: 'A resposta chegou',
    currency: 'EUR',
    value: '5,50',
    method: 'setRate',
    explanation: 'A resposta atualiza a taxa na memória. O React mostra o novo resultado.',
  },
];

export default function ReactUpdateScenes() {
  return (
    <figure className="react-update-scenes" aria-labelledby="currency-scenes-title">
      <figcaption className="react-update-scenes-heading" id="currency-scenes-title">
        <p>Visualmente, esse fluxo pode ser acompanhado em três momentos:</p>
      </figcaption>
      <ol className="currency-scenes">
        {scenes.map(({ title, currency, value, loading, method, explanation }, index) => (
          <li className="currency-scene" key={title}>
            <div className="currency-scene-heading">
              <span aria-hidden="true">0{index + 1}</span>
              <strong>{title}</strong>
            </div>
            <div className={`currency-snapshot${loading ? ' is-loading' : ''}`}>
              <div className="currency-snapshot-selection">
                <span>Moeda escolhida</span>
                <strong>{currency}</strong>
              </div>
              <div className="currency-snapshot-result">
                <span>{loading ? 'Buscando a taxa' : `1 ${currency} em reais`}</span>
                {loading ? (
                  <div className="currency-snapshot-pending">
                    <span aria-hidden="true">•••</span>
                    <strong>Carregando…</strong>
                  </div>
                ) : (
                  <strong className="currency-snapshot-value">
                    <small>R$</small> {value}
                  </strong>
                )}
              </div>
            </div>
            <code className="currency-scene-method">{method}</code>
            <p>{explanation}</p>
          </li>
        ))}
      </ol>
      <p className="react-update-scenes-note">
        Se outra moeda for escolhida durante a busca, a limpeza cancela o pedido anterior.
      </p>
    </figure>
  );
}
