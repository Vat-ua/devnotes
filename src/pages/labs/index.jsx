import LabCard from "../../components/content/LabCard.jsx";
import { labs } from "../../content/registry.js";

export default function Labs() {
  return <main className="page-shell"><header className="page-intro"><h1>Ideias que pedem<br /><em>para ser tocadas.</em></h1><p>Experimentos pequenos para observar comportamento, testar decisões e aprender fazendo.</p></header><section className="content-grid lab-grid">{labs.map((lab) => <LabCard key={lab.slug} lab={lab} />)}</section></main>;
}
