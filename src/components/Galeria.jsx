import { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LuX, LuChevronLeft, LuChevronRight, LuArrowUpRight } from 'react-icons/lu';
import { FaInstagram } from 'react-icons/fa6';
import Titulo from './Titulo';
import { GALERIA, NEGOCIO, instagramLink } from '../data/negocio';
import { usePreferencias } from '../context/preferencias';
import { tr } from '../utils/i18n';
import { bloquearScroll } from '../utils/scroll';

const EASE = [0.22, 1, 0.36, 1];

export default function Galeria() {
  const { t, idioma } = usePreferencias();
  const [indice, setIndice] = useState(null);
  const abierto = indice !== null;

  const cerrar = useCallback(() => setIndice(null), []);
  const siguiente = useCallback(() => setIndice((i) => (i + 1) % GALERIA.length), []);
  const anterior = useCallback(() => setIndice((i) => (i - 1 + GALERIA.length) % GALERIA.length), []);

  useEffect(() => {
    if (!abierto) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') cerrar();
      if (e.key === 'ArrowRight') siguiente();
      if (e.key === 'ArrowLeft') anterior();
    };
    window.addEventListener('keydown', onKey);
    bloquearScroll(true);
    return () => {
      window.removeEventListener('keydown', onKey);
      bloquearScroll(false);
    };
  }, [abierto, cerrar, siguiente, anterior]);

  const actual = abierto ? GALERIA[indice] : null;

  return (
    <section aria-labelledby="galeria-titulo" className="relative bg-fondo py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        {/* Encabezado */}
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: EASE }}
              className="eyebrow"
            >
              @{NEGOCIO.instagram}
            </motion.p>
            <Titulo
              id="galeria-titulo"
              lineas={t.galeria.titulo}
              className="mt-5 text-4xl font-medium leading-[1.05] md:text-6xl"
            />
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
              className="mt-5 text-lg leading-relaxed text-tinta-2"
            >
              {t.galeria.bajada}
            </motion.p>
          </div>
          <motion.a
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.25, ease: EASE }}
            href={instagramLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-verde self-start md:self-auto"
          >
            <FaInstagram className="text-lg" aria-hidden="true" />
            {t.galeria.seguir}
          </motion.a>
        </div>

        {/* Grilla */}
        <ul className="mt-14 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {GALERIA.map((foto, i) => (
            <motion.li
              key={foto.post}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.7, delay: (i % 4) * 0.07, ease: EASE }}
            >
              <button
                type="button"
                onClick={() => setIndice(i)}
                data-cursor="ver"
                className="group relative block aspect-square w-full overflow-hidden rounded-[1.25rem] bg-fondo-3"
                aria-label={`${t.galeria.verFoto}: ${tr(foto.alt, idioma)}`}
              >
                <img
                  src={foto.thumb}
                  alt={tr(foto.alt, idioma)}
                  width={600}
                  height={600}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-700 ease-suave group-hover:scale-[1.07]"
                />
                <span className="absolute inset-0 flex flex-col justify-between bg-bosco/0 p-4 text-left text-crema opacity-0 transition-all duration-500 ease-suave group-hover:bg-bosco/60 group-hover:opacity-100 group-focus-visible:bg-bosco/60 group-focus-visible:opacity-100">
                  <FaInstagram className="self-end text-xl" aria-hidden="true" />
                  <span className="font-serif text-lg italic leading-snug">{tr(foto.caption, idioma)}</span>
                </span>
              </button>
            </motion.li>
          ))}
        </ul>
      </div>

      {/* Visor */}
      <AnimatePresence>
        {actual && (
          <motion.div
            key="visor"
            data-lenis-prevent
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-espresso/90 p-4 backdrop-blur-sm"
            onClick={cerrar}
            role="dialog"
            aria-modal="true"
            aria-label={t.galeria.ampliada}
          >
            <button
              type="button"
              onClick={cerrar}
              className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-crema/10 text-2xl text-crema transition-colors hover:bg-crema/20"
              aria-label={t.galeria.cerrar}
            >
              <LuX />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                anterior();
              }}
              className="absolute left-3 top-1/2 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-crema/10 text-2xl text-crema transition-colors hover:bg-crema/20 sm:grid"
              aria-label={t.galeria.anterior}
            >
              <LuChevronLeft />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                siguiente();
              }}
              className="absolute right-3 top-1/2 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-crema/10 text-2xl text-crema transition-colors hover:bg-crema/20 sm:grid"
              aria-label={t.galeria.siguiente}
            >
              <LuChevronRight />
            </button>

            <motion.figure
              key={actual.full}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="flex max-w-[min(92vw,540px)] flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.img
                src={actual.full}
                alt={tr(actual.alt, idioma)}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.4}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -60) siguiente();
                  if (info.offset.x > 60) anterior();
                }}
                className="max-h-[74vh] w-auto cursor-grab rounded-2xl object-contain shadow-foto active:cursor-grabbing"
              />
              <figcaption className="mt-5 flex w-full flex-wrap items-center justify-between gap-3 text-crema">
                <span className="font-serif text-lg italic">{tr(actual.caption, idioma)}</span>
                <a
                  href={`https://www.instagram.com/${actual.post}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-aperol-claro hover:text-crema"
                >
                  {t.galeria.verEnIg} <LuArrowUpRight aria-hidden="true" />
                </a>
              </figcaption>
              <p className="mt-3 text-xs tracking-[0.2em] text-crema/50">
                {indice + 1} / {GALERIA.length}
              </p>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
