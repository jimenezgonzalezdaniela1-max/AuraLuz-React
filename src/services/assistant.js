/*
 * Simula la "IA" mientras no hay backend: FAQ por palabras clave + recomendaciones
 * según los pedidos del cliente. Con el backend real, esto lo reemplaza un modelo
 * (p. ej. Gemini) al que el servidor le pasa el historial del cliente y el FAQ.
 */
import { products } from "../data/products";
import { FAQ } from "../data/faq";
import { formatPrice } from "../utils/format";

const norm = (s) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
const has = (text, words) => words.some((w) => text.includes(w));
const byId = (id) => products.find((p) => p.id === id);

// Qué aroma suele gustar a quien ya compró otro
const AFFINITY = {
  rosa: ["margarita", "girasol"],
  girasol: ["rosa", "campana"],
  campana: ["margarita", "girasol"],
  margarita: ["campana", "rosa"],
};

function recommend(orders) {
  const bought = {};
  orders.forEach((o) => o.items.forEach((i) => (bought[i.id] = (bought[i.id] || 0) + i.qty)));
  const ids = Object.keys(bought);

  if (ids.length === 0) {
    return {
      reply:
        "Aún no tienes pedidos, así que te sugiero empezar por la Margarita (aroma limpio con toques de manzanilla, muy fácil de querer) o por el Girasol si prefieres algo más cálido, con notas de vainilla.",
      suggestions: ["margarita", "girasol"],
    };
  }

  const fav = ids.sort((a, b) => bought[b] - bought[a])[0];
  const fresh = AFFINITY[fav].filter((id) => !bought[id]);
  const pool = fresh.length ? fresh : products.map((p) => p.id).filter((id) => !bought[id]);

  if (pool.length === 0) {
    return {
      reply: `Ya probaste todas nuestras velas, y la que más has pedido es la ${byId(fav).title}. ¿Te animas a repetirla o a regalarla?`,
      suggestions: [fav],
    };
  }

  const picks = pool.slice(0, 2);
  const list = picks.map((id) => `la ${byId(id).title} (${byId(id).description.toLowerCase()} ${formatPrice(byId(id).price)})`);
  return {
    reply: `Por tus pedidos, tu favorita parece ser la ${byId(fav).title}. Te puede gustar ${list.join(" o ")}.`,
    suggestions: picks,
  };
}

function orderStatus(orders) {
  if (orders.length === 0) return { reply: "Todavía no tienes pedidos registrados.", suggestions: [] };
  const o = orders[0]; // el más reciente
  const detail = o.items.map((i) => `${i.qty} x ${i.name}`).join(", ");
  return {
    reply: `Tu último pedido (${new Date(o.createdAt).toLocaleDateString("es-CO")}) es de ${detail}, por ${formatPrice(o.total)}. Estado actual: «${o.status}».`,
    suggestions: [],
  };
}

export function answer(question, orders, name = "") {
  const t = norm(question);

  if (has(t, ["mi pedido", "mis pedidos", "estado", "ya pague", "ya llego"])) return orderStatus(orders);
  if (has(t, ["recomiend", "recomienda", "sugier", "regalo", "que me", "otra vela", "cual compro", "cual elijo"])) {
    return recommend(orders);
  }

  let best = null;
  let bestScore = 0;
  for (const f of FAQ) {
    const score = f.keywords.filter((k) => t.includes(k)).length;
    if (score > bestScore) { best = f; bestScore = score; }
  }
  if (best) return { reply: best.answer, suggestions: [] };

  return {
    reply: `${name ? name.split(" ")[0] + ", n" : "N"}o estoy seguro de haber entendido. Puedo recomendarte una vela según tus pedidos, contarte sobre aromas, cuidados, pagos y envíos, o revisar el estado de tu pedido.`,
    suggestions: [],
  };
}
