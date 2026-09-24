import { motion } from 'framer-motion';
import { LuArrowUpRight, LuCroissant, LuCoffee, LuMartini, LuSparkles } from 'react-icons/lu';
import { FaWhatsapp } from 'react-icons/fa6';
import croissant from '../assets/img/croissant.webp';
import Titulo from './Titulo';
import Enfasis from './Enfasis';
import { PANINI, PIZARRA, NEGOCIO, waLink } from '../data/negocio';
import { usePreferencias } from '../context/preferencias';
import { tr, rellenar } from '../utils/i18n';

const EASE = [0.22, 1, 0.36, 1];

const formatoPrecio = (n) => `$${Number(n).toLocaleString('es-AR')}`;

const ICONOS = {
  croissant: LuCroissant,
  cafe: LuCoffee,
  aperol: LuMartini,
};

function PaniniCard({ p, i }) {
  const { t, idioma } = usePreferencias();
  const ingredientes = tr(p.ingredientes, idioma);
  const tag = tr(p.tag, idioma);
  const link = waLink(t.carta.msgPanini(p.nombre));

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, delay: (i % 4) * 0.1, ease: EASE }}
      className="group flex w-[80%] shrink-0 snap-center flex-col sm:w-auto"
    >
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        tabIndex={-1}
        aria-hidden="true"
        data-cursor="pedir"
        className="arch-45 relative block aspect-[4/5] overflow-hidden bg-fondo-3 shadow-tarjeta"
      >
        <img
          src={p.img}
          alt={t.carta.altPanini(p.nombre, ingredientes.join(', '))}
          width={720}
          height={900}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-[900ms] ease-suave group-hover:scale-[1.06]"
        />
        {tag && (
          <span className="absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-crema/90 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-bosco backdrop-blur">
            {tag}
          </span>
        )}
      </a>

      <div className="mt-6 flex flex-1 flex-col px-1">
        <div className="flex items-baseline gap-3">
          <span className="text-xs font-bold tracking-[0.2em] text-marca">0{i + 1}</span>
          <h3 className="font-serif text-[2rem] italic leading-none text-tinta">{p.nombre}</h3>
          {p.precio != null && (
            <>
              <span aria-hidden="true" className="mb-1.5 flex-1 border-b-2 border-dotted border-tinta/25" />
              <span className="font-serif text-xl font-semibold text-tinta">{formatoPrecio(p.precio)}</span>
            </>
          )}
        </div>

        <p className="mt-3 text-[13px] font-semibold uppercase leading-relaxed tracking-[0.08em] text-tinta-2">
          {ingredientes.join(' · ')}
        </p>
        <p className="mt-2 font-serif text-[17px] italic leading-snug text-tinta-3">{tr(p.descripcion, idioma)}</p>

        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor="pedir"
          className="mt-auto inline-flex items-center gap-1.5 self-start pt-5 text-sm font-bold text-acento transition-opacity hover:opacity-80"
          aria-label={t.carta.pedirAria(p.nombre)}
        >
          {t.carta.pedilo}
          <LuArrowUpRight
            className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </a>
      </div>
    </motion.article>
  );
}

export default function Carta() {
  const { t, idioma } = usePreferencias();
  const rangoHappy = t.formato.rango(NEGOCIO.happyHour.desde, NEGOCIO.happyHour.hasta);

  return (
    <section aria-labelledby="carta-titulo" className="relative overflow-hidden bg-fondo pb-28 pt-24 md:pb-36 md:pt-32">
      <div className="grain" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        {/* Encabezado */}
        <div className="mx-auto max-w-2xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE }}
            className="eyebrow"
          >
            {t.carta.eyebrow}
          </motion.p>
          <Titulo
            id="carta-titulo"
            lineas={t.carta.titulo}
            className="mt-5 text-4xl font-medium leading-[1.05] md:text-6xl"
          />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
            className="mt-5 text-lg leading-relaxed text-tinta-2"
          >
            <Enfasis texto={rellenar(t.carta.bajada, { chef: NEGOCIO.chef })} className="font-serif italic" />
          </motion.p>
        </div>

        {/* Panini: carrusel deslizable en celu, grilla en pantallas grandes */}
        <div className="-mx-5 mt-14 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 [scrollbar-width:none] sm:mx-0 sm:mt-16 sm:grid sm:grid-cols-2 sm:gap-x-8 sm:gap-y-16 sm:overflow-visible sm:px-0 sm:pb-0 xl:grid-cols-4 [&::-webkit-scrollbar]:hidden">
          {PANINI.map((p, i) => (
            <PaniniCard key={p.id} p={p} i={i} />
          ))}
        </div>
        <p className="mt-4 text-center text-xs font-semibold uppercase tracking-[0.2em] text-tinta-3 sm:hidden">
          {t.carta.deslizar}
        </p>

        {/* Pausa café + pizarra */}
        <div className="mt-24 grid items-stretch gap-6 lg:grid-cols-5">
          <motion.figure
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, ease: EASE }}
            className="group relative min-h-[380px] overflow-hidden rounded-4xl bg-bosco shadow-tarjeta lg:col-span-2"
          >
            <img
              src={croissant}
              alt={t.carta.croissantAlt}
              width={880}
              height={1084}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-suave group-hover:scale-105"
            />
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-espresso/85 via-espresso/40 to-transparent p-7 pt-24 text-crema">
              <p className="font-serif text-3xl italic">{t.carta.piacere}</p>
              <p className="mt-1 text-sm text-crema/85">{t.carta.croissantTxt}</p>
            </figcaption>
          </motion.figure>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
            className="relative overflow-hidden rounded-4xl bg-bosco p-8 text-crema shadow-tarjeta md:p-12 lg:col-span-3"
          >
            <div className="grain-claro" aria-hidden="true" />

            <p className="eyebrow !text-salvia-suave">{t.carta.paraAcompanar}</p>

            <div className="relative mt-8 grid gap-10 sm:grid-cols-2">
              {PIZARRA.map((grupo) => (
                <div key={grupo.id}>
                  <h3 className="font-serif text-3xl italic">{tr(grupo.titulo, idioma)}</h3>
                  <ul className="mt-5 space-y-5">
                    {grupo.items.map((it) => {
                      const Icono = ICONOS[it.icono] || LuSparkles;
                      return (
                        <li key={it.id}>
                          <div className="flex items-baseline gap-3">
                            <span className="font-semibold">{tr(it.nombre, idioma)}</span>
                            <span aria-hidden="true" className="flex-1 border-b border-dotted border-crema/30" />
                            {it.precio != null ? (
                              <span className="font-serif text-lg">{formatoPrecio(it.precio)}</span>
                            ) : (
                              <Icono className="translate-y-0.5 text-aperol-claro" aria-hidden="true" />
                            )}
                          </div>
                          <p className="mt-1 text-sm leading-relaxed text-crema/70">
                            {rellenar(tr(it.detalle, idioma), { happy: rangoHappy })}
                          </p>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>

            <div className="relative mt-10 flex flex-col gap-4 border-t border-crema/15 pt-8 sm:flex-row sm:items-center sm:justify-between">
              <p className="font-serif text-xl italic text-crema/90">{t.carta.cartaCompleta}</p>
              <a href={waLink(t.carta.msgCarta)} target="_blank" rel="noopener noreferrer" className="btn-claro">
                <FaWhatsapp className="text-lg text-[#1FA855]" aria-hidden="true" />
                {t.carta.pedirCarta}
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
