import { motion } from 'framer-motion';
import { LuChefHat, LuLeaf, LuCoffee, LuMapPin } from 'react-icons/lu';
import local from '../assets/img/local-firenze.webp';
import pomodoro from '../assets/img/pomodoro.webp';
import Titulo from './Titulo';
import Enfasis from './Enfasis';
import { NEGOCIO } from '../data/negocio';
import { usePreferencias } from '../context/preferencias';
import { rellenar } from '../utils/i18n';

const EASE = [0.22, 1, 0.36, 1];

const ICONOS = [LuMapPin, LuLeaf, LuChefHat, LuCoffee];

export default function Nosotros() {
  const { t } = usePreferencias();
  const vars = { chef: NEGOCIO.chef };

  return (
    <section aria-labelledby="nosotros-titulo" className="relative overflow-hidden bg-fondo-2 py-24 md:py-32">
      <div className="grain" aria-hidden="true" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-20 px-5 md:px-8 lg:grid-cols-2 lg:gap-16">
        {/* Collage */}
        <div className="relative mx-auto w-full max-w-[520px] pb-16 lg:pb-0">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 1, ease: EASE }}
            className="arch-45 relative aspect-[4/5] w-[82%] overflow-hidden bg-bosco shadow-foto"
          >
            <img
              src={local}
              alt={t.nosotros.fotoLocalAlt}
              width={880}
              height={1100}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 60, rotate: 6 }}
            whileInView={{ opacity: 1, y: 0, rotate: 3 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 1, delay: 0.2, ease: EASE }}
            className="absolute -bottom-2 right-0 w-[48%] overflow-hidden rounded-3xl border-[6px] border-fondo-2 shadow-foto lg:-bottom-10"
          >
            <img
              src={pomodoro}
              alt={t.nosotros.fotoPomodoroAlt}
              width={640}
              height={800}
              loading="lazy"
              decoding="async"
              className="aspect-[4/5] w-full object-cover"
            />
          </motion.div>

          <div aria-hidden="true" className="tricolore-v absolute -left-2 top-10 h-24 w-2 rounded-full sm:-left-5" />
        </div>

        {/* Texto */}
        <div>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE }}
            className="eyebrow"
          >
            {t.nosotros.eyebrow}
          </motion.p>
          <Titulo
            id="nosotros-titulo"
            lineas={t.nosotros.titulo}
            className="mt-5 text-4xl font-medium leading-[1.05] md:text-6xl"
          />

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.9, delay: 0.15, ease: EASE }}
            className="mt-7 space-y-4 text-lg leading-relaxed text-tinta-2"
          >
            <p>{rellenar(t.nosotros.p1, vars)}</p>
            <p>
              <Enfasis texto={rellenar(t.nosotros.p2, vars)} className="font-serif italic text-tinta" />
            </p>
          </motion.div>

          <ul className="mt-10 grid gap-4 sm:grid-cols-2">
            {t.nosotros.valores.map(({ titulo, texto }, i) => {
              const Icono = ICONOS[i] ?? LuLeaf;
              return (
                <motion.li
                  key={titulo}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 + i * 0.08, ease: EASE }}
                  className="flex gap-4 rounded-2xl border border-tinta/10 bg-tarjeta/70 p-5"
                >
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-salvia text-lg text-crema">
                    <Icono aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="font-serif text-xl italic text-tinta">{titulo}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-tinta-2">{rellenar(texto, vars)}</p>
                  </div>
                </motion.li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
