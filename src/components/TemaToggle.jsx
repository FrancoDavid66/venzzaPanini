import { AnimatePresence, motion } from 'framer-motion';
import { LuSun, LuMoon } from 'react-icons/lu';
import { usePreferencias } from '../context/preferencias';

// Botón Modo día / Modo noche
export default function TemaToggle({ sobreOscuro = false, className = '' }) {
  const { tema, alternarTema, t } = usePreferencias();
  const noche = tema === 'noche';

  const alHacerClick = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    alternarTema({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
  };

  return (
    <button
      type="button"
      onClick={alHacerClick}
      aria-label={noche ? t.nav.aDia : t.nav.aNoche}
      title={noche ? t.nav.temaNoche : t.nav.temaDia}
      className={`relative grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-full border text-lg transition-colors duration-300 ${
        sobreOscuro
          ? 'border-crema/30 text-crema hover:border-crema/60'
          : 'border-tinta/15 bg-fondo/60 text-tinta backdrop-blur hover:border-tinta/40'
      } ${className}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={tema}
          initial={{ y: 16, rotate: -60, opacity: 0 }}
          animate={{ y: 0, rotate: 0, opacity: 1 }}
          exit={{ y: -16, rotate: 60, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="grid place-items-center"
        >
          {noche ? <LuMoon aria-hidden="true" /> : <LuSun aria-hidden="true" />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
