import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LuMenu, LuX, LuMapPin } from 'react-icons/lu';
import { FaWhatsapp, FaInstagram } from 'react-icons/fa6';
import Logo from './Logo';
import TemaToggle from './TemaToggle';
import SelectorIdioma from './SelectorIdioma';
import { NAV, NEGOCIO, waLink, instagramLink } from '../data/negocio';
import { usePreferencias } from '../context/preferencias';
import { irA, bloquearScroll } from '../utils/scroll';

export default function Navbar() {
  const { t } = usePreferencias();
  const [scrolled, setScrolled] = useState(false);
  const [abierto, setAbierto] = useState(false);
  const [activo, setActivo] = useState('inicio');

  // Fondo al scrollear
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Sección activa (scrollspy)
  useEffect(() => {
    const ids = ['inicio', ...NAV.map((n) => n.id)];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActivo(e.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  // Menú móvil: bloquear scroll y cerrar con Escape
  useEffect(() => {
    if (!abierto) return undefined;
    bloquearScroll(true);
    const onKey = (e) => e.key === 'Escape' && setAbierto(false);
    window.addEventListener('keydown', onKey);
    return () => {
      bloquearScroll(false);
      window.removeEventListener('keydown', onKey);
    };
  }, [abierto]);

  const navegar = (id) => {
    const estabaAbierto = abierto;
    setAbierto(false);
    // en celu esperamos a que se cierre el menú antes de scrollear
    window.setTimeout(() => irA(id), estabaAbierto ? 350 : 0);
  };

  return (
    <header>
      <motion.nav
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-suave ${
          abierto
            ? 'border-b border-transparent bg-transparent'
            : scrolled
              ? 'border-b border-tinta/10 bg-fondo/85 shadow-[0_8px_30px_-20px_rgba(20,16,12,0.45)] backdrop-blur-md'
              : 'border-b border-transparent bg-transparent'
        }`}
        aria-label={t.nav.menu}
      >
        <div
          className={`mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 transition-all duration-500 ease-suave md:px-8 ${
            scrolled ? 'h-16' : 'h-20'
          }`}
        >
          {/* Logo */}
          <button type="button" onClick={() => navegar('inicio')} className="relative shrink-0" aria-label={t.nav.inicio}>
            <Logo
              className={`w-auto transition-all duration-500 ease-suave ${abierto ? 'text-crema' : 'text-marca'} ${
                scrolled ? 'h-9' : 'h-10 md:h-11'
              }`}
            />
          </button>

          {/* Links escritorio */}
          <ul className="hidden items-center gap-0.5 lg:flex">
            {NAV.map(({ id, clave }) => (
              <li key={id}>
                <button
                  type="button"
                  onClick={() => navegar(id)}
                  className={`relative whitespace-nowrap rounded-full px-3.5 py-2 text-[15px] font-medium transition-colors duration-300 ${
                    activo === id ? 'text-tinta' : 'text-tinta-2 hover:text-tinta'
                  }`}
                >
                  {t.nav[clave]}
                  {activo === id && (
                    <motion.span
                      layoutId="nav-activo"
                      className="absolute inset-x-3.5 -bottom-0.5 h-[2px] rounded-full bg-acento"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2 sm:gap-2.5">
            <SelectorIdioma className="hidden lg:block" />
            <TemaToggle sobreOscuro={abierto} />

            <a
              href={waLink(t.whatsapp.pedido)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t.nav.pedir}
              className={`btn-verde hidden !px-4 !py-2.5 text-sm xl:!px-5 ${abierto ? '' : 'sm:inline-flex'}`}
            >
              <FaWhatsapp className="text-lg" aria-hidden="true" />
              <span className="lg:hidden xl:inline">{t.nav.pedir}</span>
            </a>

            {/* Hamburguesa */}
            <button
              type="button"
              onClick={() => setAbierto((v) => !v)}
              className={`relative grid h-11 w-11 place-items-center rounded-full border text-xl transition-colors duration-300 lg:hidden ${
                abierto ? 'border-crema/30 text-crema' : 'border-tinta/15 bg-fondo/60 text-tinta backdrop-blur'
              }`}
              aria-label={abierto ? t.nav.cerrarMenu : t.nav.abrirMenu}
              aria-expanded={abierto}
              aria-controls="menu-movil"
            >
              {abierto ? <LuX /> : <LuMenu />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Menú móvil a pantalla completa */}
      <AnimatePresence>
        {abierto && (
          <motion.div
            id="menu-movil"
            key="menu-movil"
            data-lenis-prevent
            initial={{ clipPath: 'circle(0% at calc(100% - 42px) 40px)' }}
            animate={{ clipPath: 'circle(150% at calc(100% - 42px) 40px)' }}
            exit={{ clipPath: 'circle(0% at calc(100% - 42px) 40px)' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-40 flex flex-col overflow-y-auto bg-bosco px-6 pb-10 pt-28 text-crema lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label={t.nav.menu}
          >
            <div className="grain-claro" aria-hidden="true" />
            <ul className="relative flex flex-col gap-2">
              {NAV.map(({ id, clave }, i) => (
                <motion.li
                  key={id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <button
                    type="button"
                    onClick={() => navegar(id)}
                    className="group flex w-full items-baseline gap-4 border-b border-crema/10 py-3 text-left"
                  >
                    <span className="font-sans text-xs font-semibold tracking-[0.2em] text-aperol-claro">0{i + 1}</span>
                    <span className="font-serif text-4xl italic transition-transform duration-300 group-hover:translate-x-1">
                      {t.nav[clave]}
                    </span>
                  </button>
                </motion.li>
              ))}
            </ul>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.5 }}
              className="relative mt-auto space-y-5 pt-10"
            >
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-crema/60">{t.nav.idioma}</span>
                <SelectorIdioma variante="segmentado" />
              </div>
              <a href={waLink(t.whatsapp.pedido)} target="_blank" rel="noopener noreferrer" className="btn-claro w-full">
                <FaWhatsapp className="text-lg" aria-hidden="true" />
                {t.nav.pedir}
              </a>
              <div className="flex items-center justify-between text-sm text-crema/70">
                <span className="inline-flex items-center gap-2">
                  <LuMapPin aria-hidden="true" />
                  {NEGOCIO.direccion}, {NEGOCIO.barrio}
                </span>
                <a
                  href={instagramLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-crema"
                  aria-label="Instagram"
                >
                  <FaInstagram className="text-lg" />
                </a>
              </div>
              <div className="tricolore h-1.5 w-full rounded-full opacity-80" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
