import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion';
import { usePreferencias } from '../context/preferencias';

/**
 * Cursor propio (solo en compu con mouse).
 * - Sobre links y botones se agranda.
 * - Sobre elementos con data-cursor="pedir" o data-cursor="ver" muestra la etiqueta.
 */
export default function Cursor() {
  const { t } = usePreferencias();
  const [activo, setActivo] = useState(false);
  const [visible, setVisible] = useState(false);
  const [modo, setModo] = useState(null);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const xSuave = useSpring(x, { stiffness: 520, damping: 42, mass: 0.6 });
  const ySuave = useSpring(y, { stiffness: 520, damping: 42, mass: 0.6 });

  useEffect(() => {
    const conMouse = window.matchMedia('(pointer: fine)').matches;
    const reducir = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!conMouse || reducir) return undefined;

    setActivo(true);
    document.documentElement.classList.add('cursor-propio');

    const alMover = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
    };
    const alPasar = (e) => {
      const el = e.target.closest?.('[data-cursor], a, button, [role="button"], input, textarea, select, label');
      if (!el) return setModo(null);
      if (el.matches('input, textarea, select')) return setModo('texto');
      return setModo(el.dataset.cursor || 'hover');
    };
    const alSalir = () => setVisible(false);

    window.addEventListener('pointermove', alMover, { passive: true });
    document.addEventListener('pointerover', alPasar, { passive: true });
    document.documentElement.addEventListener('pointerleave', alSalir);
    window.addEventListener('blur', alSalir);

    return () => {
      window.removeEventListener('pointermove', alMover);
      document.removeEventListener('pointerover', alPasar);
      document.documentElement.removeEventListener('pointerleave', alSalir);
      window.removeEventListener('blur', alSalir);
      document.documentElement.classList.remove('cursor-propio');
    };
  }, [x, y]);

  if (!activo) return null;

  const etiqueta = modo === 'pedir' ? t.cursor.pedir : modo === 'ver' ? t.cursor.ver : null;
  const tamano = etiqueta ? 84 : modo === 'hover' ? 54 : modo === 'texto' ? 10 : 34;

  return (
    <>
      {/* Anillo (sigue al mouse con un poquito de inercia) */}
      <motion.div aria-hidden="true" className="pointer-events-none fixed left-0 top-0 z-[200]" style={{ x: xSuave, y: ySuave }}>
        <motion.div
          className={`flex items-center justify-center rounded-full ${
            etiqueta ? 'bg-aperol text-crema shadow-tarjeta' : 'border-[1.5px] border-white mix-blend-difference'
          }`}
          style={{ translateX: '-50%', translateY: '-50%' }}
          animate={{ width: tamano, height: tamano, opacity: visible ? 1 : 0 }}
          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
        >
          <AnimatePresence>
            {etiqueta && (
              <motion.span
                key={etiqueta}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.2 }}
                className="text-[11px] font-bold uppercase tracking-[0.14em]"
              >
                {etiqueta}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* Punto (va exacto con el mouse) */}
      <motion.div aria-hidden="true" className="pointer-events-none fixed left-0 top-0 z-[201]" style={{ x, y }}>
        <motion.div
          className="rounded-full bg-white mix-blend-difference"
          style={{ translateX: '-50%', translateY: '-50%' }}
          animate={{ width: etiqueta ? 0 : 6, height: etiqueta ? 0 : 6, opacity: visible ? 1 : 0 }}
          transition={{ duration: 0.15 }}
        />
      </motion.div>
    </>
  );
}
