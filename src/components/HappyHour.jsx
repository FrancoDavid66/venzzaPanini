import { motion } from 'framer-motion';
import { LuClock, LuMartini, LuMapPin } from 'react-icons/lu';
import { FaWhatsapp } from 'react-icons/fa6';
import aperitivo from '../assets/img/aperitivo.webp';
import dosPorUno from '../assets/img/dos-por-uno.webp';
import Titulo from './Titulo';
import { HappyContador } from './EstadoVivo';
import { NEGOCIO, waLink } from '../data/negocio';
import { usePreferencias } from '../context/preferencias';
import { irA } from '../utils/scroll';

const EASE = [0.22, 1, 0.36, 1];

// Burbujitas de spritz que suben
const BURBUJAS = [
  { left: '6%', size: 10, delay: '0s', dur: '7s' },
  { left: '14%', size: 6, delay: '2.2s', dur: '6s' },
  { left: '27%', size: 14, delay: '1.1s', dur: '8.5s' },
  { left: '41%', size: 8, delay: '3.4s', dur: '6.5s' },
  { left: '58%', size: 12, delay: '0.6s', dur: '7.5s' },
  { left: '71%', size: 7, delay: '2.8s', dur: '6s' },
  { left: '83%', size: 16, delay: '1.7s', dur: '9s' },
  { left: '93%', size: 9, delay: '4s', dur: '7s' },
];

// Rodaja de naranja hecha con CSS
function Rodaja({ className = '' }) {
  return (
    <div aria-hidden="true" className={`rounded-full bg-aperol p-[3.5%] ${className}`}>
      <div className="h-full w-full rounded-full bg-[#FAD2AE] p-[2%]">
        <div
          className="relative h-full w-full animate-[giro_60s_linear_infinite] rounded-full bg-aperol-claro"
          style={{
            backgroundImage:
              'repeating-conic-gradient(from 8deg, rgba(250,210,174,0.9) 0deg 2deg, transparent 2deg 36deg), radial-gradient(circle, rgba(250,210,174,0.9) 0 7%, transparent 7.5%)',
          }}
        />
      </div>
    </div>
  );
}

const claseLinea = (i) => (i === 1 ? 'pl-[0.6em] text-aperol' : i === 2 ? 'pl-[0.25em]' : '');

export default function HappyHour() {
  const { t } = usePreferencias();
  const { desde, hasta } = NEGOCIO.happyHour;

  return (
    <section aria-labelledby="hh-titulo" className="relative overflow-hidden bg-bosco py-24 text-crema md:py-32">
      <div className="grain-claro" aria-hidden="true" />

      {/* Listones de madera sutiles (como la pared del local) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.05]"
        style={{ backgroundImage: 'repeating-linear-gradient(90deg, #F6F0E4 0 1px, transparent 1px 64px)' }}
      />

      {/* Burbujas */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-[420px]">
        {BURBUJAS.map((b) => (
          <span
            key={b.left}
            className="absolute bottom-0 animate-burbuja rounded-full border border-aperol-claro/50 bg-aperol-claro/10"
            style={{
              left: b.left,
              width: b.size,
              height: b.size,
              animationDelay: b.delay,
              animationDuration: b.dur,
            }}
          />
        ))}
      </div>

      <div className="relative mx-auto grid max-w-7xl items-center gap-20 px-5 md:px-8 lg:grid-cols-2 lg:gap-12">
        {/* Texto */}
        <div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE }}
            className="eyebrow !text-salvia-suave"
          >
            {t.happy.eyebrow} · {t.formato.rango(desde, hasta)}
          </motion.p>

          <Titulo
            id="hh-titulo"
            lineas={t.happy.titulo}
            claseLinea={claseLinea}
            className="mt-6 text-[clamp(4.4rem,13vw,9.5rem)] font-black italic leading-[0.84] tracking-[-0.035em]"
          />

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
          >
            <p className="mt-9 max-w-md font-serif text-2xl italic text-crema/90">{t.happy.frase}</p>

            <div className="mt-7 flex flex-wrap items-center gap-4">
              <HappyContador />
              <div className="inline-flex flex-col gap-2 text-[15px] text-crema/85">
                <span className="inline-flex items-center gap-2">
                  <LuClock className="text-aperol-claro" aria-hidden="true" />
                  {t.happy.de(desde, hasta)}
                </span>
                <span className="inline-flex items-center gap-2">
                  <LuMartini className="text-aperol-claro" aria-hidden="true" />
                  {t.happy.promo}
                </span>
              </div>
            </div>

            <div className="mt-9 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => irA('ubicacion')}
                className="btn bg-aperol text-crema hover:-translate-y-0.5 hover:bg-terracota"
              >
                <LuMapPin aria-hidden="true" />
                {t.happy.comoLlegar}
              </button>
              <a
                href={waLink(t.happy.msg)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn border border-crema/25 text-crema hover:border-crema/50 hover:bg-crema/10"
              >
                <FaWhatsapp className="text-lg" aria-hidden="true" />
                {t.happy.consultanos}
              </a>
            </div>
          </motion.div>
        </div>

        {/* Visual */}
        <div className="relative mx-auto w-full max-w-[400px] lg:max-w-[440px]">
          <Rodaja className="absolute -right-12 -top-12 h-56 w-56 opacity-95 sm:-right-20 sm:h-72 sm:w-72" />

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 1, ease: EASE }}
            className="arch-45 relative aspect-[4/5] overflow-hidden bg-bosco-2 shadow-foto"
          >
            <img
              src={aperitivo}
              alt={t.happy.fotoAlt}
              width={720}
              height={900}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover"
            />
          </motion.div>

          {/* Story de la promo */}
          <motion.div
            initial={{ opacity: 0, rotate: -16, y: 40 }}
            whileInView={{ opacity: 1, rotate: -8, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.9, delay: 0.25, ease: EASE }}
            className="absolute -bottom-12 -left-4 w-32 overflow-hidden rounded-2xl border-4 border-crema shadow-foto sm:-left-12 sm:w-40 md:w-44"
          >
            <img
              src={dosPorUno}
              alt={t.happy.storyAlt}
              width={450}
              height={800}
              loading="lazy"
              decoding="async"
              className="aspect-[9/16] w-full object-cover"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
