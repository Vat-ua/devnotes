import { useState } from "react";

export default function FormFeedbackLab() {
  const [name, setName] = useState("");
  return <form className="lab-form" onSubmit={(event) => event.preventDefault()}><label htmlFor="lab-name">Seu nome</label><div><input id="lab-name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Digite pelo menos 3 letras" /><button type="submit">Enviar</button></div><p className={name.length >= 3 ? "feedback success" : "feedback"}>{name.length >= 3 ? `Tudo certo, ${name}. O feedback chegou no momento certo.` : "A interface vai orientar o próximo passo."}</p></form>;
}
