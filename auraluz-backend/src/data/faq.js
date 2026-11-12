/*
 * Base de conocimiento del asistente. EDITA las respuestas con la información real de tu negocio.
 * Se usa de dos formas: va dentro del prompt de la IA y sirve para el respaldo sin IA.
 * "answer" puede ser un texto o una función que recibe los productos reales de la base de datos.
 */
export const FAQ = [
  {
    q: "¿Cómo hago un pedido?",
    keywords: ["pedir", "comprar", "compra", "como hago", "carrito"],
    answer: "Elige tus velas en el catálogo, agrégalas al carrito y presiona «Finalizar pedido». Tu pedido queda registrado y se abre WhatsApp para coordinar contigo.",
  },
  {
    q: "¿Cómo puedo pagar?",
    keywords: ["pago", "pagar", "transferencia", "efectivo", "tarjeta", "nequi"],
    answer: "El pago lo coordinamos por WhatsApp al confirmar el pedido. Cuando lo recibimos, el pedido pasa de «pendiente» a «pagado».",
  },
  {
    q: "¿Cómo es el envío y cuánto tarda?",
    keywords: ["envio", "enviar", "domicilio", "entrega", "demora", "tarda", "llega"],
    answer: "Estamos en Barranquilla. La entrega o el envío se coordinan por WhatsApp; el tiempo y el costo dependen de la ubicación.",
  },
  {
    q: "¿Cómo cuido mi vela y cuánto dura?",
    keywords: ["cuidado", "cuido", "prender", "encender", "mecha", "dura", "duracion", "apagar", "humo"],
    answer: "Recorta la mecha a unos 5 mm antes de encenderla, deja que la cera se derrita de forma pareja en cada uso, no la dejes sola y mantenla lejos de corrientes de aire, niños y mascotas. Apágala con un apagavelas para que no suelte humo. La duración depende del tamaño: escríbenos por WhatsApp para el dato exacto.",
  },
  {
    q: "¿Qué aromas tienen?",
    keywords: ["aroma", "huele", "olor", "fragancia", "perfume", "alergia", "intenso"],
    answer: (products) =>
      "Nuestros aromas: " +
      products.map((p) => `${p.title} (${p.description.replace(/\.$/, "").toLowerCase()})`).join("; ") +
      ". Si tienes alergias o eres sensible a los olores, cuéntanoslo por WhatsApp antes de pedir.",
  },
  {
    q: "¿Hacen pedidos personalizados o por cantidad?",
    keywords: ["personaliz", "evento", "por mayor", "mayorista", "recuerdo", "matrimonio", "boda"],
    answer: "Sí, hacemos pedidos especiales y por cantidad (eventos, recuerdos, detalles). Escríbenos por WhatsApp con lo que necesitas y te cotizamos.",
  },
  {
    q: "¿Qué pasa si mi vela llega dañada?",
    keywords: ["cambio", "devolucion", "devolver", "danada", "rota", "garantia", "reclamo"],
    answer: "Escríbenos por WhatsApp con una foto y lo resolvemos.",
  },
  {
    q: "¿Cómo los contacto?",
    keywords: ["contacto", "whatsapp", "horario", "instagram", "correo", "telefono", "ubicacion"],
    answer: "WhatsApp +57 324 480 4156 o correo hola@floraluz.com. Estamos en Barranquilla, Colombia.",
  },
];

export const faqAnswer = (f, products) => (typeof f.answer === "function" ? f.answer(products) : f.answer);
