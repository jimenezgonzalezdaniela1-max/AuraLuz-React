import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { sendChatMessage } from "../services/api";
import { products } from "../data/products";

const QUICK = [
  "Recomiéndame una vela",
  "¿Cómo está mi pedido?",
  "¿Cómo cuido mi vela?",
  "¿Cómo es el envío?",
];

export default function ChatWidget({ onAdd }) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `Hola ${user.name.split(" ")[0]}, soy el asistente de Auraluz. Puedo recomendarte velas según tus pedidos y resolver tus dudas.`,
    },
  ]);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, busy, open]);

  const send = async (text) => {
    text = text.trim();
    if (!text || busy) return;
    const history = [...messages, { role: "user", content: text }];
    setMessages(history);
    setInput("");
    setBusy(true);
    try {
      const { reply, suggestions } = await sendChatMessage(
        history.map(({ role, content }) => ({ role, content }))
      );
      setMessages([...history, { role: "assistant", content: reply, suggestions }]);
    } catch {
      setMessages([
        ...history,
        { role: "assistant", content: "No pude responder ahora. Intenta de nuevo o escríbenos por WhatsApp." },
      ]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <button className="chat-fab" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        {open ? "Cerrar chat" : "Asistente"}
      </button>

      {open && (
        <section className="chat-panel" aria-label="Chat con el asistente">
          <div className="chat-log" role="log" aria-live="polite">
            {messages.map((m, i) => (
              <div key={i} className={`chat-msg ${m.role}`}>
                <p>{m.content}</p>
                {m.suggestions?.map((id) => {
                  const p = products.find((p) => p.id === id);
                  return p && (
                    <button key={id} className="chat-chip add" onClick={() => onAdd(p)}>
                      Agregar {p.title} al carrito
                    </button>
                  );
                })}
              </div>
            ))}
            {busy && <div className="chat-msg assistant"><p>Escribiendo…</p></div>}
            <div ref={endRef} />
          </div>

          <div className="chat-quick">
            {QUICK.map((q) => (
              <button key={q} className="chat-chip" onClick={() => send(q)} disabled={busy}>{q}</button>
            ))}
          </div>

          <form className="chat-form" onSubmit={(e) => { e.preventDefault(); send(input); }}>
            <input value={input} onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe tu pregunta…" aria-label="Tu mensaje" />
            <button className="btn" type="submit" disabled={busy || !input.trim()}>Enviar</button>
          </form>
        </section>
      )}
    </>
  );
}
