import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { PreferenciasContext } from './preferencias';
import { TEXTOS } from '../i18n/textos';
import { NEGOCIO } from '../data/negocio';
import { horaBA, temaPorHora } from '../utils/tiempo';

const CLAVE_TEMA = 'venzza-tema'; // sessionStorage: elección manual durante la visita
const CLAVE_IDIOMA = 'venzza-idioma'; // localStorage: idioma elegido

const leer = (almacen, clave) => {
  try {
    return window[almacen].getItem(clave);
  } catch {
    return null;
  }
};

const guardar = (almacen, clave, valor) => {
  try {
    window[almacen].setItem(clave, valor);
  } catch {
    /* navegador sin storage: no pasa nada */
  }
};

// Idioma inicial: el elegido antes > inglés/italiano si el visitante viene de afuera > español
// (los buscadores como Google siempre ven la versión en español, para no perder SEO local)
function idiomaInicial() {
  const guardado = leer('localStorage', CLAVE_IDIOMA);
  if (guardado && TEXTOS[guardado]) return guardado;
  if (/bot|crawl|spider|slurp|lighthouse|headless|preview/i.test(navigator.userAgent)) return 'es';
  const idiomaNav = (navigator.language || 'es').slice(0, 2).toLowerCase();
  const zona = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
  // Zonas horarias de Argentina (incluye los nombres viejos que usan algunos navegadores)
  const enArgentina = /^America\/(Argentina\/|Buenos_Aires|Cordoba|Catamarca|Jujuy|Mendoza|Rosario)/.test(zona);
  if ((idiomaNav === 'en' || idiomaNav === 'it') && !enArgentina) return idiomaNav;
  return 'es';
}

function aplicarTema(tema) {
  const html = document.documentElement;
  html.classList.toggle('noche', tema === 'noche');
  html.style.colorScheme = tema === 'noche' ? 'dark' : 'light';
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', tema === 'noche' ? '#1B241D' : '#F6F0E4');
}

export default function PreferenciasProvider({ children }) {
  const [idioma, setIdiomaEstado] = useState(idiomaInicial);
  const [tema, setTema] = useState(() =>
    document.documentElement.classList.contains('noche') ? 'noche' : 'dia'
  );
  const manual = useRef(Boolean(leer('sessionStorage', CLAVE_TEMA)));

  // Idioma → <html lang> y título de la pestaña
  useEffect(() => {
    const t = TEXTOS[idioma];
    document.documentElement.lang = t.meta.lang;
    document.title = t.meta.titulo;
  }, [idioma]);

  useEffect(() => {
    aplicarTema(tema);
  }, [tema]);

  // Modo día/noche automático según la hora de Buenos Aires (si no se cambió a mano)
  useEffect(() => {
    const revisar = () => {
      if (manual.current) return;
      const auto = temaPorHora(horaBA(), NEGOCIO.modoNoche);
      setTema((actual) => (actual === auto ? actual : auto));
    };
    revisar();
    const id = setInterval(revisar, 60 * 1000);
    return () => clearInterval(id);
  }, []);

  const setIdioma = useCallback((nuevo) => {
    setIdiomaEstado(nuevo);
    guardar('localStorage', CLAVE_IDIOMA, nuevo);
  }, []);

  // Cambio de tema con transición circular desde el botón
  const alternarTema = useCallback((origen) => {
    const nuevo = document.documentElement.classList.contains('noche') ? 'dia' : 'noche';
    manual.current = true;
    guardar('sessionStorage', CLAVE_TEMA, nuevo);

    const cambiar = () => {
      flushSync(() => setTema(nuevo));
      aplicarTema(nuevo);
    };

    const reducir = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!document.startViewTransition || reducir) {
      cambiar();
      return;
    }

    const x = origen?.x ?? window.innerWidth - 60;
    const y = origen?.y ?? 40;
    const radio = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));

    const transicion = document.startViewTransition(cambiar);
    transicion.ready
      .then(() => {
        document.documentElement.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radio}px at ${x}px ${y}px)`] },
          { duration: 750, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', pseudoElement: '::view-transition-new(root)' }
        );
      })
      .catch(() => {});
  }, []);

  const valor = useMemo(
    () => ({ idioma, setIdioma, t: TEXTOS[idioma], tema, alternarTema }),
    [idioma, setIdioma, tema, alternarTema]
  );

  return <PreferenciasContext.Provider value={valor}>{children}</PreferenciasContext.Provider>;
}
