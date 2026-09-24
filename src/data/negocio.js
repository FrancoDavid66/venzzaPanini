// ============================================================
//  DATOS DEL NEGOCIO — Venzza Panini & Caffè
//  Editá todo desde acá y se actualiza la web entera.
//  Los textos que se traducen van con { es, en, it }.
//  Los textos generales de la web están en src/i18n/textos.js
//  ⚠️ = dato que NO estaba en el Instagram → confirmar con el cliente.
// ============================================================

// Carta
import imgFirenze from '../assets/img/carta/firenze.webp';
import imgMilano from '../assets/img/carta/milano.webp';
import imgGenova from '../assets/img/carta/genova.webp';
import imgBologna from '../assets/img/carta/bologna.webp';

// Galería (miniatura cuadrada + foto completa para el visor)
import g01t from '../assets/img/galeria/g01-thumb.webp';
import g01 from '../assets/img/galeria/g01.webp';
import g02t from '../assets/img/galeria/g02-thumb.webp';
import g02 from '../assets/img/galeria/g02.webp';
import g03t from '../assets/img/galeria/g03-thumb.webp';
import g03 from '../assets/img/galeria/g03.webp';
import g04t from '../assets/img/galeria/g04-thumb.webp';
import g04 from '../assets/img/galeria/g04.webp';
import g05t from '../assets/img/galeria/g05-thumb.webp';
import g05 from '../assets/img/galeria/g05.webp';
import g06t from '../assets/img/galeria/g06-thumb.webp';
import g06 from '../assets/img/galeria/g06.webp';
import g07t from '../assets/img/galeria/g07-thumb.webp';
import g07 from '../assets/img/galeria/g07.webp';
import g08t from '../assets/img/galeria/g08-thumb.webp';
import g08 from '../assets/img/galeria/g08.webp';
import g09t from '../assets/img/galeria/g09-thumb.webp';
import g09 from '../assets/img/galeria/g09.webp';
import g10t from '../assets/img/galeria/g10-thumb.webp';
import g10 from '../assets/img/galeria/g10.webp';
import g11t from '../assets/img/galeria/g11-thumb.webp';
import g11 from '../assets/img/galeria/g11.webp';
import g12t from '../assets/img/galeria/g12-thumb.webp';
import g12 from '../assets/img/galeria/g12.webp';

export const NEGOCIO = {
  nombre: 'Venzza',
  nombreCompleto: 'Venzza Panini & Caffè',

  // Contacto
  whatsapp: '5491140896831', // formato wa.me (sin + ni espacios)
  whatsappVisible: '+54 9 11 4089-6831',
  instagram: 'venzza.panini',

  // Ubicación
  direccion: 'Av. Rivadavia 1589',
  ciudad: 'CABA',
  barrio: 'Congreso',
  mapsQuery: 'Av. Rivadavia 1589, Buenos Aires, Argentina',

  // ⚠️ Horarios: no figuran en el Instagram. Formato (hora de Buenos Aires):
  //   dias → 0 = domingo, 1 = lunes … 6 = sábado
  // horarios: [
  //   { dias: [1, 2, 3, 4, 5], desde: '08:00', hasta: '21:00' },
  //   { dias: [6], desde: '10:00', hasta: '21:00' },
  // ],
  // Mientras esté vacío, la web no muestra "Abierto ahora" y ofrece consultar por WhatsApp.
  horarios: [],

  // Happy hour: se usa para el aviso en vivo y la cuenta regresiva
  happyHour: {
    desde: 18,
    hasta: 21,
    dias: [0, 1, 2, 3, 4, 5, 6], // ⚠️ confirmar qué días hay happy hour
  },

  // Modo noche automático: desde esta hora hasta la de la mañana (hora de Buenos Aires)
  modoNoche: { desde: 18, hasta: 7 },

  chef: 'Marcos',

  // ⚠️ Cambiar cuando tenga dominio propio (también en index.html, robots.txt y sitemap.xml)
  url: 'https://venzza-panini.vercel.app',

  // Crédito opcional en el footer (para que te recomienden). Ej:
  // creditoWeb: { texto: 'Web hecha por TuMarca', url: 'https://instagram.com/tumarca' },
  creditoWeb: null,
};

export const waLink = (mensaje) =>
  `https://wa.me/${NEGOCIO.whatsapp}${mensaje ? `?text=${encodeURIComponent(mensaje)}` : ''}`;

export const instagramLink = `https://www.instagram.com/${NEGOCIO.instagram}/`;

export const mapsLink = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
  NEGOCIO.mapsQuery
)}`;

export const mapsEmbed = `https://www.google.com/maps?q=${encodeURIComponent(
  NEGOCIO.mapsQuery
)}&z=16&output=embed`;

// Secciones del menú (el texto de cada una está en textos.js → nav)
export const NAV = [
  { id: 'carta', clave: 'carta' },
  { id: 'happy-hour', clave: 'happy' },
  { id: 'nosotros', clave: 'nosotros' },
  { id: 'galeria', clave: 'galeria' },
  { id: 'ubicacion', clave: 'ubicacion' },
];

// ============================================================
//  LA CARTA
//  precio: número (ej. 8500) o null para no mostrarlo. ⚠️ Los precios no figuran en el IG.
// ============================================================
export const PANINI = [
  {
    id: 'firenze',
    nombre: 'Firenze',
    precio: null,
    img: imgFirenze,
    tag: null,
    ingredientes: {
      es: ['Jamón crudo', 'Rúcula', 'Parmesano', 'Mostaza'],
      en: ['Prosciutto', 'Arugula', 'Parmesan', 'Mustard'],
      it: ['Prosciutto crudo', 'Rucola', 'Parmigiano', 'Senape'],
    },
    descripcion: {
      es: 'La señal que necesitabas para probar un clásico.',
      en: 'The sign you needed to try a classic.',
      it: 'Il segnale che aspettavi per provare un classico.',
    },
  },
  {
    id: 'milano',
    nombre: 'Milano',
    precio: null,
    img: imgMilano,
    tag: { es: 'Elegido del chef', en: 'Chef’s pick', it: 'Scelta dello chef' },
    // ⚠️ Ingredientes deducidos de la foto (no están en el posteo) → confirmar
    ingredientes: {
      es: ['Salame', 'Mozzarella', 'Rúcula', 'Queso azul', 'Miel'],
      en: ['Salami', 'Mozzarella', 'Arugula', 'Blue cheese', 'Honey'],
      it: ['Salame', 'Mozzarella', 'Rucola', 'Formaggio erborinato', 'Miele'],
    },
    descripcion: {
      es: 'El elegido de nuestro chef.',
      en: 'Our chef’s favorite.',
      it: 'Il preferito del nostro chef.',
    },
  },
  {
    id: 'genova',
    nombre: 'Génova',
    precio: null,
    img: imgGenova,
    tag: { es: 'Plus de proteína', en: 'Protein boost', it: 'Extra proteine' },
    ingredientes: {
      es: ['Pollo', 'Tomate asado', 'Rúcula', 'Pesto', 'Albahaca', 'Salsa tártara'],
      en: ['Chicken', 'Roasted tomato', 'Arugula', 'Pesto', 'Basil', 'Tartar sauce'],
      it: ['Pollo', 'Pomodoro arrosto', 'Rucola', 'Pesto', 'Basilico', 'Salsa tartara'],
    },
    descripcion: {
      es: 'Para quienes buscan un plus de proteína.',
      en: 'For those who want an extra protein boost.',
      it: 'Per chi cerca una marcia in più di proteine.',
    },
  },
  {
    id: 'bologna',
    nombre: 'Bologna',
    precio: null,
    img: imgBologna,
    tag: { es: 'Ideal primera vez', en: 'Perfect first bite', it: 'Perfetto per iniziare' },
    // ⚠️ Ingredientes deducidos de la foto (no están en el posteo) → confirmar
    ingredientes: {
      es: ['Mortadela', 'Stracciatella', 'Pesto', 'Pistachos'],
      en: ['Mortadella', 'Stracciatella', 'Pesto', 'Pistachios'],
      it: ['Mortadella', 'Stracciatella', 'Pesto', 'Pistacchi'],
    },
    descripcion: {
      es: 'La recomendación de Marcos si es tu primera vez en Venzza.',
      en: 'Chef Marcos’s pick if it’s your first time at Venzza.',
      it: 'Il consiglio di Marcos se è la tua prima volta da Venzza.',
    },
  },
];

// Pausa café / dulce / aperitivo (pizarra). {happy} se reemplaza por el horario del happy hour.
export const PIZARRA = [
  {
    id: 'caffe',
    titulo: { es: 'Caffè & dolce', en: 'Caffè & dolce', it: 'Caffè & dolce' },
    items: [
      {
        id: 'croissant',
        icono: 'croissant',
        precio: null,
        nombre: { es: 'Croissant', en: 'Croissant', it: 'Croissant' },
        detalle: {
          es: 'Bien dorado, ese toque dulce que hace la diferencia',
          en: 'Golden and flaky, the sweet touch that makes the difference',
          it: 'Ben dorato, quel tocco dolce che fa la differenza',
        },
      },
      {
        id: 'cafe',
        icono: 'cafe',
        precio: null,
        nombre: { es: 'Café', en: 'Coffee', it: 'Caffè' },
        detalle: {
          es: 'Tu pausa café, al estilo italiano',
          en: 'Your coffee break, Italian style',
          it: 'La tua pausa caffè, all’italiana',
        },
      },
    ],
  },
  {
    id: 'aperitivo',
    titulo: { es: 'Aperitivo', en: 'Aperitivo', it: 'Aperitivo' },
    items: [
      {
        id: 'aperol',
        icono: 'aperol',
        precio: null,
        nombre: { es: 'Aperol Spritz', en: 'Aperol Spritz', it: 'Aperol Spritz' },
        detalle: {
          es: '2x1 en happy hour, {happy}',
          en: '2-for-1 during happy hour, {happy}',
          it: '2x1 durante l’happy hour, {happy}',
        },
      },
    ],
  },
];

// ============================================================
//  GALERÍA — posteos del Instagram
// ============================================================
export const GALERIA = [
  {
    thumb: g01t,
    full: g01,
    post: 'reel/DdKsVjVtX0W',
    alt: {
      es: 'Panini con jamón crudo, rúcula y parmesano',
      en: 'Panini with prosciutto, arugula and parmesan',
      it: 'Panino con prosciutto crudo, rucola e parmigiano',
    },
    caption: {
      es: 'No son solo panini, son obras de arte 🤤',
      en: 'Not just panini, they’re works of art 🤤',
      it: 'Non sono solo panini, sono opere d’arte 🤤',
    },
  },
  {
    thumb: g02t,
    full: g02,
    post: 'reel/DdH-xcsouRH',
    alt: {
      es: 'Panini con tomates secos, aceitunas negras, albahaca y mozzarella',
      en: 'Panini with sun-dried tomatoes, black olives, basil and mozzarella',
      it: 'Panino con pomodori secchi, olive nere, basilico e mozzarella',
    },
    caption: {
      es: 'Capaz haciendo un click más aparece en frente tuyo 🤤',
      en: 'One more click and it might just appear in front of you 🤤',
      it: 'Magari con un altro clic ti appare davanti 🤤',
    },
  },
  {
    thumb: g03t,
    full: g03,
    post: 'p/DdCYW4ZlPqM',
    alt: {
      es: 'Panini Firenze servido en el local de Venzza',
      en: 'Firenze panini served at Venzza',
      it: 'Panino Firenze servito da Venzza',
    },
    caption: {
      es: 'La señal que necesitás para probar el Firenze 🇮🇹',
      en: 'The sign you need to try the Firenze 🇮🇹',
      it: 'Il segnale che ti serve per provare il Firenze 🇮🇹',
    },
  },
  {
    thumb: g04t,
    full: g04,
    post: 'reel/Dcyy7uqoPRN',
    alt: {
      es: 'Panini Milano sobre mesa de mármol con pared de ladrillo',
      en: 'Milano panini on a marble table against a brick wall',
      it: 'Panino Milano su un tavolo di marmo con muro di mattoni',
    },
    caption: {
      es: 'Panini Milano, el elegido de nuestro chef',
      en: 'The Milano panini, our chef’s favorite',
      it: 'Il panino Milano, il preferito del nostro chef',
    },
  },
  {
    thumb: g05t,
    full: g05,
    post: 'reel/Dcgps4_obYG',
    alt: {
      es: 'Aperol Spritz en mesa de mármol frente a pared de ladrillo',
      en: 'Aperol Spritz on a marble table against a brick wall',
      it: 'Aperol Spritz su un tavolo di marmo davanti a un muro di mattoni',
    },
    caption: {
      es: 'Nada que un aperitivo con buena compañía no pueda mejorar 🍸',
      en: 'Nothing an aperitivo with good company can’t fix 🍸',
      it: 'Niente che un aperitivo in buona compagnia non possa migliorare 🍸',
    },
  },
  {
    thumb: g06t,
    full: g06,
    post: 'p/DceNmqnFO6o',
    alt: {
      es: 'Mano haciendo piedra en piedra, papel o tijera',
      en: 'Hand making rock in rock, paper, scissors',
      it: 'Mano che fa sasso a sasso, carta, forbice',
    },
    caption: {
      es: 'Nuestro panini le gana a todo 😎',
      en: 'Our panini beats everything 😎',
      it: 'Il nostro panino batte tutto 😎',
    },
  },
  {
    thumb: g07t,
    full: g07,
    post: 'p/DcT0ETVorPa',
    alt: {
      es: 'Bandeja de croissants dorados',
      en: 'Tray of golden croissants',
      it: 'Vassoio di croissant dorati',
    },
    caption: {
      es: 'Un piccolo piacere 🥐',
      en: 'Un piccolo piacere 🥐',
      it: 'Un piccolo piacere 🥐',
    },
  },
  {
    thumb: g08t,
    full: g08,
    post: 'reel/Db_wxVJocRv',
    alt: {
      es: 'Panini Bologna con mortadela, pistachos y stracciatella',
      en: 'Bologna panini with mortadella, pistachios and stracciatella',
      it: 'Panino Bologna con mortadella, pistacchi e stracciatella',
    },
    caption: {
      es: 'La recomendación de Marcos para tu primera vez',
      en: 'Marcos’s pick for your first time',
      it: 'Il consiglio di Marcos per la tua prima volta',
    },
  },
  {
    thumb: g09t,
    full: g09,
    post: 'reel/Db9EmoeIs5C',
    alt: {
      es: 'Aperol Spritz con la promo dos por uno',
      en: 'Aperol Spritz with the two-for-one promo',
      it: 'Aperol Spritz con la promo due per uno',
    },
    caption: {
      es: '¿Algo mejor que un Aperol? Sí, dos 😝',
      en: 'What’s better than an Aperol? Two 😝',
      it: 'Cosa c’è di meglio di un Aperol? Due 😝',
    },
  },
  {
    thumb: g10t,
    full: g10,
    post: 'p/Dbn3lmbOgbw',
    alt: {
      es: 'Panini Génova servido en el local',
      en: 'Génova panini served at the venue',
      it: 'Panino Génova servito nel locale',
    },
    caption: {
      es: 'Génova: un plus de proteína 🥖',
      en: 'Génova: an extra protein boost 🥖',
      it: 'Génova: una marcia in più di proteine 🥖',
    },
  },
  {
    thumb: g11t,
    full: g11,
    post: 'reel/DbTj3w5IeCk',
    alt: {
      es: 'Panini con salame, mozzarella y rúcula',
      en: 'Panini with salami, mozzarella and arugula',
      it: 'Panino con salame, mozzarella e rucola',
    },
    caption: {
      es: 'Fatto con amore ❤️🇮🇹',
      en: 'Fatto con amore ❤️🇮🇹',
      it: 'Fatto con amore ❤️🇮🇹',
    },
  },
  {
    thumb: g12t,
    full: g12,
    post: 'reel/DaTrvjfoar_',
    alt: {
      es: 'Palacio del Congreso al atardecer',
      en: 'The Congress Palace at sunset',
      it: 'Il Palazzo del Congresso al tramonto',
    },
    caption: {
      es: 'Algo premium se está cocinando en Congreso',
      en: 'Something premium is cooking in Congreso',
      it: 'Qualcosa di premium sta bollendo in pentola a Congreso',
    },
  },
];
