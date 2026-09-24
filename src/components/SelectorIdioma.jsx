import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { LuGlobe, LuCheck } from 'react-icons/lu';
import { IDIOMAS } from '../i18n/textos';
import { usePreferencias } from '../context/preferencias';

/**
 * Selector de idioma.
 *   variante="compacto"   → botón con menú desplegable (navbar de escritorio)
 *   variante="segmentado" → tres botones ES · EN · IT (menú del celu)
 */
export default function SelectorIdioma({ variante = 'compacto', className = '' }) {
  const { idioma, setIdioma, t } = usePreferencias();
  const [abierto, setAbierto] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!abierto) return undefined;
    const alTocarFuera = (e) => {
      if (!ref.current?.contains(e.target)) setAbierto(false);
    };
    const alEscape = (e) => e.key === 'Escape' && setAbierto(false);
    document.addEventListener('pointerdown', alTocarFuera);
    document.addEventListener('keydown', alEscape);
    return () => {
      document.removeEventListener('pointerdown', alTocarFuera);
      document.removeEventListener('keydown', alEscape);
    };
  }, [abierto]);

  if (variante === 'segmentado') {
    return (
      <div
        role="radiogroup"
        aria-label={t.nav.idioma}
        className={`inline-flex rounded-full border border-crema/20 p-1 ${className}`}
      >
        {IDIOMAS.map((i) => (
          <button
            key={i.id}
            type="button"
            role="radio"
            aria-checked={idioma === i.id}
            onClick={() => setIdioma(i.id)}
            className={`rounded-full px-4 py-1.5 text-sm font-bold tracking-wide transition-colors duration-300 ${
              idioma === i.id ? 'bg-crema text-bosco' : 'text-crema/70 hover:text-crema'
            }`}
          >
            {i.label}
          </button>
        ))}
      </div>
    );
  }

  const actual = IDIOMAS.find((i) => i.id === idioma) ?? IDIOMAS[0];

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setAbierto((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={abierto}
        aria-label={`${t.nav.idioma}: ${actual.nombre}`}
        className="inline-flex h-11 items-center gap-1.5 rounded-full border border-tinta/15 bg-fondo/60 px-3.5 text-sm font-bold text-tinta backdrop-blur transition-colors duration-300 hover:border-tinta/40"
      >
        <LuGlobe className="text-base" aria-hidden="true" />
        {actual.label}
      </button>

      <AnimatePresence>
        {abierto && (
          <motion.ul
            role="menu"
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.18 }}
            className="absolute right-0 top-[calc(100%+8px)] min-w-[170px] origin-top-right overflow-hidden rounded-2xl border border-tinta/10 bg-fondo p-1.5 shadow-tarjeta"
          >
            {IDIOMAS.map((i) => (
              <li key={i.id} role="none">
                <button
                  type="button"
                  role="menuitemradio"
                  aria-checked={idioma === i.id}
                  onClick={() => {
                    setIdioma(i.id);
                    setAbierto(false);
                  }}
                  className="flex w-full items-center justify-between gap-4 rounded-xl px-3 py-2 text-left text-sm text-tinta transition-colors hover:bg-fondo-2"
                >
                  <span>
                    <span className="mr-2 font-bold">{i.label}</span>
                    <span className="text-tinta-2">{i.nombre}</span>
                  </span>
                  {idioma === i.id && <LuCheck className="text-acento" aria-hidden="true" />}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
