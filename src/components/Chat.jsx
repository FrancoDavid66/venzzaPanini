import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { LuX, LuSendHorizontal, LuMessageCircleMore, LuMapPin, LuUtensilsCrossed } from 'react-icons/lu';
import { FaWhatsapp } from 'react-icons/fa6';
import { MonogramaV } from './Logo';
import Enfasis from './Enfasis';
import { usePreferencias } from '../context/preferencias';
import { waLink, mapsLink } from '../data/negocio';
import { detectarIntencion, responder, INTENCIONES_CHIPS } from '../chat/bot';
import { horaBA } from '../utils/tiempo';
import { irA, bloquearScroll } from '../utils/scroll';
import useListo from '../hooks/useListo';

const EASE = [0.22, 1, 0.36, 1];
const CLAVE_TEASER = 'venzza-teaser';

let contador = 0;
const nuevoId = () => {
  contador += 1;
  return contador;
};

const estiloCta =
  'inline-flex items-center gap-1.5 rounded-full border border-tinta/15 bg-fondo px-3.5 py-1.5 text-sm font-semibold text-tinta transition-colors hover:border-acento hover:text-acento';

function BotonCta({ cta, t, alIrACarta }) {
  if (cta.tipo === 'carta') {
    return (
      <button type="button" onClick={alIrACarta} className={estiloCta}>
        <LuUtensilsCrossed aria-hidden="true" /> {t.chat.cta.carta}
      </button>
    );
  }
  if (cta.tipo === 'mapa') {
    return (
      <a href={mapsLink} target="_blank" rel="noopener noreferrer" className={estiloCta}>
        <LuMapPin aria-hidden="true" /> {t.chat.cta.mapa}
      </a>
    );
  }
  return (
    <a href={waLink(cta.mensaje)} target="_blank" rel="noopener noreferrer" className={estiloCta}>
      <FaWhatsapp className="text-[#1FA855]" aria-hidden="true" /> {t.chat.cta.whatsapp}
    </a>
  );
}

// Chat con asistente guiado: responde lo básico y deriva a WhatsApp
export default function Chat() {
  const { t, idioma } = usePreferencias();
  const listo = useListo();
  const [visible, setVisible] = useState(false);
  const [abierto, setAbierto] = useState(false);
  const [teaser, setTeaser] = useState(false);
  const [mensajes, setMensajes] = useState([]);
  const [escribiendo, setEscribiendo] = useState(false);
  const [entrada, setEntrada] = useState('');
  const listaRef = useRef(null);
  const inputRef = useRef(null);
  const lanzadorRef = useRef(null);
  const timers = useRef([]);

  // El botón aparece cuando termina el loader
  useEffect(() => {
    if (!listo) return undefined;
    const id = setTimeout(() => setVisible(true), 700);
    return () => clearTimeout(id);
  }, [listo]);

  // Globito de bienvenida (una vez por visita)
  useEffect(() => {
    if (!visible) return undefined;
    let visto = false;
    try {
      visto = sessionStorage.getItem(CLAVE_TEASER) === '1';
    } catch {
      /* sin storage */
    }
    if (visto) return undefined;
    const mostrar = setTimeout(() => setTeaser(true), 5000);
    const ocultar = setTimeout(() => setTeaser(false), 15000);
    return () => {
      clearTimeout(mostrar);
      clearTimeout(ocultar);
    };
  }, [visible]);

  // Limpia los timers al desmontar
  useEffect(() => {
    const lista = timers.current;
    return () => lista.forEach(clearTimeout);
  }, []);

  const marcarTeaserVisto = () => {
    setTeaser(false);
    try {
      sessionStorage.setItem(CLAVE_TEASER, '1');
    } catch {
      /* sin storage */
    }
  };

  const agregarBot = useCallback((respuesta, demora = 650) => {
    setEscribiendo(true);
    const id = setTimeout(() => {
      setEscribiendo(false);
      setMensajes((m) => [...m, { id: nuevoId(), de: 'bot', ...respuesta }]);
    }, demora);
    timers.current.push(id);
  }, []);

  const abrir = () => {
    setAbierto(true);
    marcarTeaserVisto();
    if (mensajes.length === 0) agregarBot({ texto: t.chat.r.saludo }, 450);
  };

  const cerrar = useCallback(() => {
    setAbierto(false);
    lanzadorRef.current?.focus({ preventScroll: true });
  }, []);

  // Escape para cerrar, foco en el campo (en compu) y bloqueo de scroll (en celu)
  useEffect(() => {
    if (!abierto) return undefined;
    const esCelu = window.matchMedia('(max-width: 639px)').matches;
    if (esCelu) bloquearScroll(true);
    const alEscape = (e) => e.key === 'Escape' && cerrar();
    window.addEventListener('keydown', alEscape);
    const foco = esCelu ? null : setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 380);
    return () => {
      if (esCelu) bloquearScroll(false);
      window.removeEventListener('keydown', alEscape);
      if (foco) clearTimeout(foco);
    };
  }, [abierto, cerrar]);

  // Baja solo hasta el último mensaje
  useEffect(() => {
    const el = listaRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [mensajes, escribiendo]);

  const preguntar = (texto, intencion) => {
    const limpio = texto.trim();
    if (!limpio) return;
    setMensajes((m) => [...m, { id: nuevoId(), de: 'yo', texto: limpio }]);
    setEntrada('');
    const respuesta = responder(intencion ?? detectarIntencion(limpio), {
      t,
      idioma,
      ahora: horaBA(),
      pregunta: limpio,
    });
    agregarBot(respuesta, 550 + Math.min(900, respuesta.texto.length * 7));
  };

  const irACarta = () => {
    setAbierto(false);
    window.setTimeout(() => irA('carta'), 250);
  };

  return (
    <>
      {/* Panel del chat */}
      <AnimatePresence>
        {abierto && (
          <motion.div
            key="chat"
            role="dialog"
            aria-label={`Chat · ${t.chat.titulo}`}
            initial={{ opacity: 0, y: 28, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 28, scale: 0.98 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="fixed inset-x-0 bottom-0 top-16 z-[65] flex origin-bottom-right flex-col overflow-hidden rounded-t-3xl border border-tinta/10 bg-fondo shadow-foto sm:inset-x-auto sm:bottom-24 sm:right-5 sm:top-auto sm:h-[min(600px,calc(100vh-8rem))] sm:w-[380px] sm:rounded-3xl md:bottom-28 md:right-7"
          >
            {/* Encabezado */}
            <header className="relative flex items-center gap-3 bg-bosco px-5 py-4 text-crema">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-crema">
                <MonogramaV className="h-6 w-6 text-terracota" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-serif text-xl italic leading-none">{t.chat.titulo}</p>
                <p className="mt-1.5 flex items-center gap-1.5 text-xs text-crema/70">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#3FA35B]" aria-hidden="true" />
                  {t.chat.subtitulo}
                </p>
              </div>
              <button
                type="button"
                onClick={cerrar}
                aria-label={t.chat.cerrar}
                className="grid h-10 w-10 place-items-center rounded-full text-xl text-crema/80 transition-colors hover:bg-crema/10 hover:text-crema"
              >
                <LuX />
              </button>
            </header>

            {/* Mensajes */}
            <div
              ref={listaRef}
              data-lenis-prevent
              aria-live="polite"
              className="flex-1 space-y-3 overflow-y-auto overscroll-contain px-4 py-5"
            >
              {mensajes.map((m) =>
                m.de === 'yo' ? (
                  <div key={m.id} className="flex justify-end">
                    <p className="max-w-[80%] rounded-2xl rounded-br-md bg-terracota px-4 py-2.5 text-[15px] leading-relaxed text-crema">
                      <span className="sr-only">{t.chat.tu}: </span>
                      {m.texto}
                    </p>
                  </div>
                ) : (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col items-start gap-2"
                  >
                    <p className="max-w-[88%] rounded-2xl rounded-bl-md bg-fondo-2 px-4 py-2.5 text-[15px] leading-relaxed text-tinta">
                      <Enfasis texto={m.texto} className="font-semibold not-italic text-acento" />
                    </p>
                    {m.ctas?.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {m.ctas.map((c, i) => (
                          <BotonCta key={i} cta={c} t={t} alIrACarta={irACarta} />
                        ))}
                      </div>
                    )}
                  </motion.div>
                )
              )}

              {escribiendo && (
                <div
                  className="flex w-fit items-center gap-1.5 rounded-2xl rounded-bl-md bg-fondo-2 px-4 py-3.5"
                  role="status"
                  aria-label={t.chat.escribiendo}
                >
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      className="h-1.5 w-1.5 rounded-full bg-tinta-3"
                      animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Preguntas rápidas */}
            <div
              data-lenis-prevent
              className="flex gap-2 overflow-x-auto border-t border-tinta/10 px-4 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {t.chat.chips.map((chip, i) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => preguntar(chip, INTENCIONES_CHIPS[i])}
                  className="shrink-0 rounded-full border border-tinta/15 px-3.5 py-1.5 text-sm font-medium text-tinta-2 transition-colors hover:border-acento hover:text-acento"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Campo para escribir */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                preguntar(entrada);
              }}
              className="flex items-center gap-2 px-4 pb-3"
            >
              <label htmlFor="chat-entrada" className="sr-only">
                {t.chat.placeholder}
              </label>
              <input
                id="chat-entrada"
                ref={inputRef}
                value={entrada}
                onChange={(e) => setEntrada(e.target.value)}
                placeholder={t.chat.placeholder}
                autoComplete="off"
                maxLength={240}
                className="h-12 min-w-0 flex-1 rounded-full border border-tinta/15 bg-fondo-2 px-4 text-base text-tinta placeholder:text-tinta-3 focus:border-acento focus:outline-none"
              />
              <button
                type="submit"
                aria-label={t.chat.enviar}
                disabled={!entrada.trim()}
                className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-terracota text-lg text-crema transition-opacity disabled:opacity-40"
              >
                <LuSendHorizontal aria-hidden="true" />
              </button>
            </form>

            <a
              href={waLink(t.whatsapp.pedido)}
              target="_blank"
              rel="noopener noreferrer"
              className="mx-4 mb-4 flex items-center justify-center gap-2 rounded-full border border-tinta/15 px-4 py-2.5 text-sm font-semibold text-tinta transition-colors hover:bg-fondo-2"
            >
              <FaWhatsapp className="text-lg text-[#1FA855]" aria-hidden="true" />
              {t.chat.whatsapp}
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botón flotante + globito */}
      <AnimatePresence>
        {visible && (
          <motion.div
            key="lanzador"
            initial={{ opacity: 0, scale: 0.6, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ type: 'spring', stiffness: 300, damping: 22 }}
            className="fixed bottom-5 right-5 z-30 flex items-end gap-3 md:bottom-7 md:right-7"
          >
            <AnimatePresence>
              {teaser && !abierto && (
                <motion.div
                  initial={{ opacity: 0, x: 12, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 12, scale: 0.95 }}
                  transition={{ duration: 0.3, ease: EASE }}
                  className="relative mb-2 hidden max-w-[250px] rounded-2xl rounded-br-md border border-tinta/10 bg-fondo px-4 py-3 text-sm leading-snug text-tinta shadow-tarjeta sm:block"
                >
                  <button type="button" onClick={abrir} className="text-left">
                    {t.chat.teaser}
                  </button>
                  <button
                    type="button"
                    onClick={marcarTeaserVisto}
                    aria-label={t.chat.cerrar}
                    className="absolute -right-2 -top-2 grid h-6 w-6 place-items-center rounded-full bg-fondo-3 text-xs text-tinta"
                  >
                    <LuX />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              ref={lanzadorRef}
              type="button"
              onClick={abierto ? cerrar : abrir}
              aria-label={abierto ? t.chat.cerrar : t.chat.abrir}
              aria-expanded={abierto}
              className="relative grid h-14 w-14 place-items-center rounded-full bg-terracota text-2xl text-crema shadow-[0_14px_34px_-10px_rgba(180,83,46,0.7)] transition-transform duration-300 hover:scale-105"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={abierto ? 'cerrar' : 'chat'}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="grid place-items-center"
                >
                  {abierto ? <LuX /> : <LuMessageCircleMore />}
                </motion.span>
              </AnimatePresence>
              {!abierto && (
                <span
                  aria-hidden="true"
                  className="absolute right-0.5 top-0.5 h-3.5 w-3.5 rounded-full border-2 border-terracota bg-[#3FA35B]"
                />
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
