import { useEffect, useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { LuMapPin, LuChefHat, LuArrowRight } from 'react-icons/lu';
import { FaWhatsapp } from 'react-icons/fa6';
import videoHero from '../assets/video/hero.mp4';
import poster from '../assets/img/hero-poster.webp';
import Logo, { MonogramaV } from './Logo';
import Titulo from './Titulo';
import { HappyChip, AbiertoChip } from './EstadoVivo';
import { NEGOCIO, waLink } from '../data/negocio';
import { usePreferencias } from '../context/preferencias';
import useListo from '../hooks/useListo';
import { irA } from '../utils/scroll';

const EASE = [0.22, 1, 0.36, 1];

export default function Hero() {
  const { t } = usePreferencias();
  const listo = useListo();
  const reduce = useReducedMotion();
  const videoRef = useRef(null);
  const seccionRef = useRef(null);

  // Parallax suave
  const { scrollYProgress } = useScroll({ target: seccionRef, offset: ['start start', 'end start'] });
  const yFoto = useTransform(scrollYProgress, [0, 1], [0, 70]);
  const yMarca = useTransform(scrollYProgress, [0, 1], [0, -50]);

  // El video solo corre cuando se ve (ahorra batería y datos)
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return undefined;
    v.muted = true;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.15 }
    );
    io.observe(v);
    return () => io.disconnect();
  }, [reduce]);

  // Aparición escalonada después del loader
  const aparecer = (orden) => ({
    initial: { opacity: 0, y: 26 },
    animate: listo ? { opacity: 1, y: 0 } : { opacity: 0, y: 26 },
    transition: { duration: 0.9, delay: 0.1 + orden * 0.12, ease: EASE },
  });

  return (
    <section
      id="inicio"
      ref={seccionRef}
      className="relative overflow-hidden bg-fondo pb-24 pt-28 md:pt-36 lg:pb-32"
      aria-labelledby="hero-titulo"
    >
      <div className="grain" aria-hidden="true" />

      {/* Marca gigante de fondo */}
      <motion.div
        style={{ y: yMarca }}
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center overflow-hidden"
      >
        <Logo conTagline={false} titulo="" className="w-[125%] max-w-none shrink-0 text-marca/[0.07] lg:w-[108%]" />
      </motion.div>

      <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-5 md:px-8 lg:grid-cols-12 lg:gap-10">
        {/* Texto */}
        <div className="lg:col-span-7">
          <motion.p {...aparecer(0)} className="eyebrow">
            {t.hero.eyebrow}
            <span className="-ml-3 hidden sm:inline">{t.hero.ciudad}</span>
          </motion.p>

          <Titulo
            as="h1"
            id="hero-titulo"
            lineas={t.hero.titulo}
            alCargar
            activo={listo}
            delay={0.15}
            className="mt-6 text-[2.75rem] font-medium leading-[1.02] text-tinta sm:text-6xl lg:text-[5.2rem]"
          />

          <motion.p {...aparecer(3)} className="mt-6 max-w-xl text-lg leading-relaxed text-tinta-2 md:text-xl">
            {t.hero.bajada}
          </motion.p>

          <motion.div {...aparecer(4)} className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <button type="button" onClick={() => irA('carta')} className="btn-primario group w-full sm:w-auto">
              {t.hero.verCarta}
              <LuArrowRight className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
            </button>
            <a
              href={waLink(t.whatsapp.pedido)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secundario w-full sm:w-auto"
            >
              <FaWhatsapp className="text-lg text-[#1FA855]" aria-hidden="true" />
              {t.nav.pedir}
            </a>
          </motion.div>

          <motion.ul
            {...aparecer(5)}
            className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-tinta-2"
          >
            <li className="inline-flex items-center gap-2">
              <LuMapPin className="text-base text-acento" aria-hidden="true" />
              {NEGOCIO.direccion}
            </li>
            <li>
              <HappyChip />
            </li>
            {NEGOCIO.horarios.length > 0 && (
              <li>
                <AbiertoChip />
              </li>
            )}
            <li className="inline-flex items-center gap-2">
              <LuChefHat className="text-base text-acento" aria-hidden="true" />
              {t.hero.recetas}
            </li>
          </motion.ul>
        </div>

        {/* Video en arco */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={listo ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 40, scale: 0.97 }}
          transition={{ duration: 1.1, delay: 0.25, ease: EASE }}
          className="relative lg:col-span-5"
        >
          <motion.div
            style={{ y: yFoto }}
            className="relative mx-auto w-full max-w-[340px] sm:max-w-[400px] lg:max-w-[440px]"
          >
            {/* Arco de contorno desplazado */}
            <div
              aria-hidden="true"
              className="arch-45 absolute inset-0 translate-x-4 translate-y-4 border-2 border-marca/40 md:translate-x-5 md:translate-y-5"
            />

            <div
              className="arch-45 relative aspect-[4/5] overflow-hidden bg-bosco shadow-foto"
              data-cursor="pedir"
              onClick={() => irA('carta')}
              role="presentation"
            >
              {reduce ? (
                <img
                  src={poster}
                  alt={t.hero.videoAlt}
                  width={720}
                  height={1280}
                  className="h-full w-full object-cover object-[50%_75%]"
                />
              ) : (
                <video
                  ref={videoRef}
                  className="h-full w-full object-cover object-[50%_75%]"
                  poster={poster}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                  disablePictureInPicture
                  aria-hidden="true"
                >
                  <source src={videoHero} type="video/mp4" />
                </video>
              )}
              <div
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-espresso/35 to-transparent"
              />
            </div>

            {/* Sello giratorio */}
            <div aria-hidden="true" className="absolute -bottom-9 -left-4 h-28 w-28 sm:-left-10 sm:h-36 sm:w-36">
              <div className="relative h-full w-full rounded-full bg-crema shadow-tarjeta ring-1 ring-espresso/10">
                <svg viewBox="0 0 120 120" className="absolute inset-0 h-full w-full animate-giro text-bosco">
                  <defs>
                    <path id="sello-circulo" d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" />
                  </defs>
                  <text fill="currentColor" fontSize="9.4" fontWeight="600" fontFamily="'DM Sans Variable', sans-serif">
                    <textPath href="#sello-circulo" textLength="272" lengthAdjust="spacing">
                      {t.hero.sello}
                    </textPath>
                  </text>
                </svg>
                <MonogramaV className="absolute left-1/2 top-1/2 h-9 w-9 -translate-x-1/2 -translate-y-1/2 text-terracota sm:h-11 sm:w-11" />
              </div>
            </div>

            {/* Sticker happy hour */}
            <div
              aria-hidden="true"
              className="absolute -right-3 top-12 animate-flotar sm:-right-8"
              style={{ '--rot': '6deg' }}
            >
              <div className="rounded-2xl bg-aperol px-4 py-3 text-crema shadow-tarjeta">
                <p className="font-serif text-3xl font-black italic leading-none">2x1</p>
                <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.16em]">
                  Aperol · {t.formato.rango(NEGOCIO.happyHour.desde, NEGOCIO.happyHour.hasta)}
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
