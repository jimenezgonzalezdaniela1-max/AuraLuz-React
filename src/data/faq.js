import { products } from "./products";

/*
 * Preguntas frecuentes. Es la "base de conocimiento" del asistente.
 * Cuando exista el backend, este mismo contenido va en el prompt del sistema de la IA.
 * EDITA las respuestas con la información real de tu negocio.
 */
export const FAQ = [
  {
    id: "pedir",
    keywords: ["pedir", "comprar", "compra", "como hago", "carrito"],
    answer:
      "Elige tus velas en el catálogo, agrégalas al carrito y presiona «Finalizar pedido». Tu pedido queda registrado y se abre WhatsApp para coordinar contigo.",
  },
  {
    id: "pago",
    keywords: ["pago", "pagar", "transferencia", "efectivo", "tarjeta", "nequi"],
    answer:
      "El pago lo coordinamos contigo por WhatsApp al confirmar tu pedido. Cuando lo recibimos, tu pedido pasa de «pendiente» a «pagado».",
  },
  {
    id: "envio",
    keywords: ["envio", "enviar", "domicilio", "entrega", "demora", "tarda", "llega"],
    answer:
      "Estamos en Barranquilla. La entrega o el envío se coordinan por WhatsApp; el tiempo y el costo dependen de tu ubicación.",
  },
  {
    id: "cuidado",
    keywords: ["cuidado", "cuido", "prender", "encender", "mecha", "dura", "duracion", "apagar", "humo"],
    answer:
      "Recorta la mecha a unos 5 mm antes de encenderla, deja que la cera se derrita de forma pareja en cada uso, no la dejes sola y mantenla lejos de corrientes de aire, niños y mascotas. Apágala con un apagavelas para que no suelte humo. La duración depende del tamaño: escríbenos si quieres el dato exacto.",
  },
  {
    id: "aromas",
    keywords: ["aroma", "huele", "olor", "fragancia", "perfume", "alergia", "intenso"],
    answer:
      "Nuestros aromas: " +
      products.map((p) => `${p.title} (${p.description.replace(/\.$/, "").toLowerCase()})`).join("; ") +
      ". Si tienes alergias o eres sensible a los olores, cuéntanoslo por WhatsApp antes de pedir.",
  },
  {
    id: "personalizar",
    keywords: ["personaliz", "evento", "por mayor", "mayorista", "recuerdo", "matrimonio", "boda"],
    answer:
      "Hacemos pedidos especiales y por cantidad (eventos, recuerdos, detalles). Escríbenos por WhatsApp con lo que necesitas y te cotizamos.",
  },
  {
    id: "cambios",
    keywords: ["cambio", "devolucion", "devolver", "danada", "rota", "garantia", "reclamo"],
    answer:
      "Si tu vela llega con algún daño, escríbenos por WhatsApp con una foto y lo resolvemos.",
  },
  {
    id: "contacto",
    keywords: ["contacto", "whatsapp", "horario", "instagram", "correo", "telefono", "ubicacion"],
    answer:
      "Puedes escribirnos por WhatsApp al +57 324 480 4156 o al correo hola@floraluz.com. Estamos en Barranquilla, Colombia.",
  },
];
