import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './Logo';
import { usePreferencias } from '../context/preferencias';
import { marcarListo } from '../hooks/useListo';

const EASE = [0.22, 1, 0.36, 1];

const VAPOR = ['M48 44 C42 36 54 30 48 20', 'M60 46 C54 36 66 29 60 14', 'M72 44 C66 36 78 30 72 20'];

export default function Loader() {
  const { t } = usePreferencias();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Se va cuando cargó la página (mínimo 1,1 s para que se vea la animación, máximo 3 s)
    let terminado = false;
    const terminar = () => {
      if (terminado) return;
      terminado = true;
      setVisible(false);
      marcarListo();
    };
    const minimo = new Promise((r) => setTimeout(r, 1100));
    const carga = new Promise((r) => {
      if (document.readyState === 'complete') r();
      else window.addEventListener('load', r, { once: true });
    });
    const tope = setTimeout(terminar, 3000);
    Promise.all([minimo, carga]).then(terminar);
    return () => clearTimeout(tope);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-fondo"
          exit={{ opacity: 0, transition: { duration: 0.6, ease: EASE } }}
          role="status"
          aria-label={t.loader}
        >
          <div className="grain" aria-hidden="true" />

          <svg
            viewBox="0 0 120 120"
            className="relative h-28 w-28 text-marca"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            {VAPOR.map((d, i) => (
              <motion.path
                key={d}
                d={d}
                className="text-acento"
                stroke="currentColor"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: [0, 1, 1], opacity: [0, 1, 0], y: [4, 0, -6] }}
                transition={{ duration: 1.6, delay: 0.3 + i * 0.18, repeat: Infinity, ease: 'easeInOut' }}
              />
            ))}
            <motion.path
              d="M34 54 H86 V64 C86 80 74 90 60 90 C46 90 34 80 34 64 Z"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.9, ease: EASE }}
            />
            <motion.path
              d="M86 59 C97 59 97 76 84 76"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: 0.6, ease: EASE }}
            />
            <motion.path
              d="M26 98 H94"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.6, delay: 0.4, ease: EASE }}
            />
          </svg>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5, ease: EASE }}
            className="relative mt-6"
          >
            <Logo className="h-12 w-auto text-marca" />
          </motion.div>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.3, ease: EASE }}
            className="tricolore relative mt-7 h-1 w-40 origin-left rounded-full"
            aria-hidden="true"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
