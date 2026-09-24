import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaWhatsapp } from 'react-icons/fa6';
import { waLink } from '../data/negocio';

// Botón flotante de WhatsApp: aparece después del hero
export default function WhatsAppFlotante() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.7);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.a
          key="wa"
          href={waLink()}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Pedí por WhatsApp"
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 20 }}
          transition={{ type: 'spring', stiffness: 320, damping: 22 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          className="group fixed bottom-5 right-5 z-30 flex items-center gap-3 md:bottom-7 md:right-7"
        >
          <span className="pointer-events-none hidden translate-x-2 rounded-full bg-espresso px-4 py-2 text-sm font-semibold text-crema opacity-0 shadow-tarjeta transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 md:block">
            ¿Pedimos?
          </span>
          <span className="relative grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-3xl text-white shadow-[0_12px_30px_-8px_rgba(37,211,102,0.65)]">
            <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366] opacity-25" aria-hidden="true" />
            <FaWhatsapp className="relative" aria-hidden="true" />
          </span>
        </motion.a>
      )}
    </AnimatePresence>
  );
}
