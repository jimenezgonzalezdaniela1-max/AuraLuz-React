/*
 * Respaldo SIN IA: se usa cuando Gemini no está configurado, se acabó la cuota o falla.
 * Responde preguntas frecuentes por palabras clave y recomienda según los pedidos del cliente.
 */
import { FAQ, faqAnswer } from "../data/faq.js";

const money = (n) => "$" + n.toLocaleString("es-CO");
const norm = (s) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
const has = (t, words) => words.some((w) => t.includes(w));

// Qué aroma suele gustar a quien ya compró otro
const AFFINITY = {
  rosa: ["margarita", "girasol"],
  girasol: ["rosa", "campana"],
  campana: ["margarita", "girasol"],
  margarita: ["campana", "rosa"],
};

function recommend(products, orders) {
  const bySlug = new Map(products.map((p) => [p.slug, p]));
  const bought = {};
  orders.forEach((o) => o.items.forEach((i) => (bought[i.slug] = (bought[i.slug] || 0) + i.qty)));
  const slugs = Object.keys(bought).filter((s) => bySlug.has(s));

  if (slugs.length === 0) {
    const start = ["margarita", "girasol"].filter((s) => bySlug.has(s));
    return {
      reply: "Aún no tienes pedidos, así que te sugiero empezar por la Margarita (aroma limpio con toques de manzanilla) o por el Girasol si prefieres algo más cálido, con notas de vainilla.",
      suggestions: start,
    };
  }

  const fav = slugs.sort((a, b) => bought[b] - bought[a])[0];
  const fresh = (AFFINITY[fav] || []).filter((s) => bySlug.has(s) && !bought[s]);
  const pool = fresh.length ? fresh : products.map((p) => p.slug).filter((s) => !bought[s]);

  if (pool.length === 0) {
    return { reply: `Ya probaste todas nuestras velas, y la que más has pedido es la ${bySlug.get(fav).title}. ¿Te animas a repetirla o a regalarla?`, suggestions: [fav] };
  }
  const picks = pool.slice(0, 2);
  const list = picks.map((s) => `la ${bySlug.get(s).title} (${bySlug.get(s).description.toLowerCase()} ${money(bySlug.get(s).price)})`);
  return { reply: `Por tus pedidos, tu favorita parece ser la ${bySlug.get(fav).title}. Te puede gustar ${list.join(" o ")}.`, suggestions: picks };
}

function lastOrder(orders) {
  if (orders.length === 0) return { reply: "Todavía no tienes pedidos registrados.", suggestions: [] };
  const o = orders[0];
  const detail = o.items.map((i) => `${i.qty} x ${i.name}`).join(", ");
  return {
    reply: `Tu último pedido (${new Date(o.createdAt).toLocaleDateString("es-CO")}) es de ${detail}, por ${money(o.total)}. Estado actual: «${o.status}».`,
    suggestions: [],
  };
}

export function localAnswer(question, { products, orders }) {
  const t = norm(question);

  if (has(t, ["mi pedido", "mis pedidos", "estado", "ya pague", "ya llego"])) return lastOrder(orders);
  if (has(t, ["recomiend", "sugier", "regalo", "que me", "otra vela", "cual compro", "cual elijo"])) {
    return recommend(products, orders);
  }

  let best = null;
  let bestScore = 0;
  for (const f of FAQ) {
    const score = f.keywords.filter((k) => t.includes(k)).length;
    if (score > bestScore) { best = f; bestScore = score; }
  }
  if (best) return { reply: faqAnswer(best, products), suggestions: [] };

  return {
    reply: "No estoy seguro de haber entendido. Puedo recomendarte una vela según tus pedidos, contarte sobre aromas, cuidados, pagos y envíos, o revisar el estado de tu pedido.",
    suggestions: [],
  };
}
