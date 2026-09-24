// ============================================================
//  ASISTENTE DEL CHAT (sin IA, sin costo)
//  Detecta la intención por palabras clave (ES/EN/IT) y responde
//  con los datos de negocio.js. Lo que no sabe, lo pasa a WhatsApp.
// ============================================================
import { NEGOCIO, PANINI } from '../data/negocio';
import { tr, unir } from '../utils/i18n';
import { estadoHappy, estadoLocal, etiquetaHorarios, formatoDuracion } from '../utils/tiempo';

// Orden = prioridad (la primera que coincide gana)
const INTENCIONES = [
  ['happy', ['happy', 'aperol', 'spritz', '2x1', 'dos por uno', 'promo', 'aperitivo', 'trago', 'drink', 'bebida', 'cocktail', 'coctel', 'due per uno']],
  ['ubicacion', ['donde', 'direccion', 'ubicacion', 'ubicad', 'llegar', 'llego', 'mapa', 'where', 'address', 'location', 'direction', 'map', 'dove', 'indirizzo', 'arrivare']],
  ['horario', ['horario', 'hora', 'abren', 'abierto', 'cierran', 'cierra', 'open', 'close', 'hours', 'orari', 'aperto', 'chiuso', 'chiude']],
  ['precio', ['precio', 'cuanto', 'cuesta', 'sale ', 'valor', 'costo', 'price', 'cost', 'how much', 'prezz', 'quanto']],
  ['delivery', ['delivery', 'envio', 'envian', 'domicilio', 'pedidosya', 'pedidos ya', 'rappi', 'llevar', 'take away', 'takeaway', 'deliver', 'consegna', 'asporto']],
  ['veggie', ['vegetarian', 'vegan', 'sin carne', 'veggie', 'vegetal', 'celiac', 'sin tacc', 'gluten']],
  ['recomendacion', ['recomend', 'recomiend', 'suger', 'cual', 'primera vez', 'que pido', 'mejor', 'recommend', 'suggest', 'best', 'first time', 'consigl', 'miglior']],
  ['cafe', ['cafe', 'coffee', 'caffe', 'croissant', 'desayun', 'merienda', 'breakfast', 'colazion', 'dulce', 'sweet', 'dolce', 'cornetto']],
  ['carta', ['carta', 'menu', 'panini', 'panino', 'sandwich', 'sanguche', 'opciones', 'que tienen', 'que hay', 'comida', 'comer', 'food', 'eat', 'mangiare']],
  ['gracias', ['gracias', 'genial', 'perfecto', 'buenisimo', 'thanks', 'thank', 'grazie', 'perfetto']],
  ['saludo', ['hola', 'buenas', 'buen dia', 'hello', 'hi ', 'hey', 'ciao', 'buongiorno', 'buonasera']],
];

const normalizar = (texto) =>
  ` ${String(texto)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9 ]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()} `;

export function detectarIntencion(texto) {
  const n = normalizar(texto);
  for (const [id, claves] of INTENCIONES) {
    if (claves.some((k) => n.includes(` ${k}`))) return id;
  }
  return null;
}

// Intenciones de los botones rápidos (en el mismo orden que t.chat.chips)
export const INTENCIONES_CHIPS = ['recomendacion', 'carta', 'happy', 'ubicacion', 'horario'];

const ingredientesDe = (id, idioma) => {
  const p = PANINI.find((x) => x.id === id);
  return p ? unir(tr(p.ingredientes, idioma).map((i) => i.toLowerCase()), idioma) : null;
};

/**
 * Devuelve { texto, ctas } — ctas: [{ tipo: 'carta' | 'mapa' | 'whatsapp', mensaje? }]
 */
export function responder(intencion, { t, idioma, ahora, pregunta = '' }) {
  const r = t.chat.r;
  const hh = NEGOCIO.happyHour;

  switch (intencion) {
    case 'saludo':
      return { texto: r.saludo };

    case 'recomendacion': {
      const bologna = ingredientesDe('bologna', idioma);
      const firenze = ingredientesDe('firenze', idioma);
      if (!bologna || !firenze) return responder('carta', { t, idioma, ahora, pregunta });
      return { texto: r.recomendacion({ chef: NEGOCIO.chef, bologna, firenze }), ctas: [{ tipo: 'carta' }] };
    }

    case 'carta':
      return { texto: r.carta({ lista: unir(PANINI.map((p) => p.nombre), idioma) }), ctas: [{ tipo: 'carta' }] };

    case 'happy': {
      const base = r.happy({ rango: t.formato.rango(hh.desde, hh.hasta), promo: t.happy.promo });
      const e = estadoHappy(ahora, hh);
      const hora = t.formato.hora(hh.desde);
      let extra = '';
      if (e.tipo === 'en-curso') extra = r.happyEnCurso(formatoDuracion(e.resta));
      else if (e.tipo === 'hoy') extra = r.happyHoy(formatoDuracion(e.resta));
      else if (e.tipo === 'manana') extra = r.happyOtro(t.estado.hhManana(hora));
      else if (e.tipo === 'otro') extra = r.happyOtro(t.estado.hhDia(t.formato.diasLargo[e.dia], hora));
      return { texto: `${base} ${extra}`.trim(), ctas: [{ tipo: 'mapa' }] };
    }

    case 'ubicacion':
      return {
        texto: r.ubicacion({ direccion: NEGOCIO.direccion, barrio: NEGOCIO.barrio, ciudad: NEGOCIO.ciudad }),
        ctas: [{ tipo: 'mapa' }],
      };

    case 'horario': {
      if (!NEGOCIO.horarios || NEGOCIO.horarios.length === 0) {
        return { texto: r.sinHorarios, ctas: [{ tipo: 'whatsapp', mensaje: t.ubicacion.msgHorario }] };
      }
      const lista = etiquetaHorarios(NEGOCIO.horarios, t)
        .map((h) => `${h.dias} ${h.horas}`)
        .join(' · ');
      const e = estadoLocal(ahora, NEGOCIO.horarios);
      const estado = e ? ` ${e.abierto ? t.estado.abierto : t.estado.cerrado}.` : '';
      return { texto: `${r.horarios({ lista })}${estado}` };
    }

    case 'precio': {
      const conPrecio = PANINI.filter((p) => p.precio != null);
      if (conPrecio.length === 0) {
        return { texto: r.sinPrecios, ctas: [{ tipo: 'whatsapp', mensaje: t.carta.msgCarta }] };
      }
      const lista = conPrecio.map((p) => `${p.nombre} $${Number(p.precio).toLocaleString('es-AR')}`).join(' · ');
      return { texto: r.precios({ lista }), ctas: [{ tipo: 'carta' }] };
    }

    case 'delivery':
      return { texto: r.delivery, ctas: [{ tipo: 'whatsapp', mensaje: t.whatsapp.pedido }] };

    case 'veggie':
      return { texto: r.veggie, ctas: [{ tipo: 'whatsapp', mensaje: r.msgPregunta(pregunta) }] };

    case 'cafe':
      return { texto: r.cafe, ctas: [{ tipo: 'carta' }] };

    case 'gracias':
      return { texto: r.gracias };

    default:
      return {
        texto: r.noSe,
        ctas: [{ tipo: 'whatsapp', mensaje: pregunta ? r.msgPregunta(pregunta) : t.whatsapp.pedido }],
      };
  }
}
