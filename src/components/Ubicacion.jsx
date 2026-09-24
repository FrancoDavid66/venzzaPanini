import { motion } from 'framer-motion';
import { LuMapPin, LuClock, LuNavigation, LuMartini } from 'react-icons/lu';
import { FaWhatsapp, FaInstagram } from 'react-icons/fa6';
import congreso from '../assets/img/congreso.webp';
import Titulo from './Titulo';
import { AbiertoChip } from './EstadoVivo';
import { NEGOCIO, waLink, instagramLink, mapsLink, mapsEmbed } from '../data/negocio';
import { usePreferencias } from '../context/preferencias';
import { rellenar } from '../utils/i18n';
import { etiquetaHorarios } from '../utils/tiempo';

const EASE = [0.22, 1, 0.36, 1];

function Dato({ Icono, titulo, children }) {
  return (
    <div className="flex gap-4">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-salvia-suave text-lg text-bosco">
        <Icono aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-tinta-3">{titulo}</p>
        <div className="mt-1.5 text-[15px] leading-relaxed text-tinta">{children}</div>
      </div>
    </div>
  );
}

export default function Ubicacion() {
  const { t } = usePreferencias();
  const horarios = etiquetaHorarios(NEGOCIO.horarios, t);
  const { desde, hasta } = NEGOCIO.happyHour;

  return (
    <section aria-labelledby="ubicacion-titulo" className="relative overflow-hidden bg-fondo-2 py-24 md:py-32">
      <div className="grain" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <div className="max-w-2xl">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE }}
            className="eyebrow"
          >
            {t.ubicacion.eyebrow}
          </motion.p>
          <Titulo
            id="ubicacion-titulo"
            lineas={t.ubicacion.titulo}
            className="mt-5 text-4xl font-medium leading-[1.05] md:text-6xl"
          />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
            className="mt-5 text-lg leading-relaxed text-tinta-2"
          >
            {rellenar(t.ubicacion.bajada, { direccion: NEGOCIO.direccion, ciudad: NEGOCIO.ciudad })}
          </motion.p>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-12">
          {/* Info */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, ease: EASE }}
            className="relative lg:col-span-5"
          >
            <div className="relative space-y-7 rounded-4xl border border-tinta/10 bg-tarjeta p-7 shadow-tarjeta md:p-9">
              <Dato Icono={LuMapPin} titulo={t.ubicacion.direccion}>
                <p className="font-semibold">
                  {NEGOCIO.direccion}, {NEGOCIO.ciudad}
                </p>
                <p className="text-tinta-2">
                  {NEGOCIO.barrio} · {t.ubicacion.referencia}
                </p>
                <a
                  href={mapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1.5 text-sm font-bold text-acento transition-opacity hover:opacity-80"
                >
                  <LuNavigation aria-hidden="true" /> {t.ubicacion.comoLlegar}
                </a>
              </Dato>

              <Dato Icono={LuClock} titulo={t.ubicacion.horarios}>
                {horarios.length > 0 ? (
                  <>
                    <ul className="space-y-1">
                      {horarios.map((h) => (
                        <li key={h.dias} className="flex justify-between gap-6">
                          <span>{h.dias}</span>
                          <span className="font-semibold">{h.horas}</span>
                        </li>
                      ))}
                    </ul>
                    <AbiertoChip className="mt-3 text-sm text-tinta-2" />
                  </>
                ) : (
                  <p>
                    {t.ubicacion.sinHorarios}{' '}
                    <a
                      href={waLink(t.ubicacion.msgHorario)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-acento underline decoration-acento/30 underline-offset-4 hover:decoration-acento"
                    >
                      WhatsApp
                    </a>
                    .
                  </p>
                )}
              </Dato>

              <Dato Icono={LuMartini} titulo={t.ubicacion.happy}>
                <p>
                  <span className="font-semibold">{t.formato.rango(desde, hasta)}</span> · {t.happy.promo}
                </p>
              </Dato>

              <div className="flex flex-wrap gap-3 border-t border-tinta/10 pt-7">
                <a
                  href={waLink(t.whatsapp.pedido)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-verde !px-5"
                >
                  <FaWhatsapp className="text-lg" aria-hidden="true" />
                  {NEGOCIO.whatsappVisible}
                </a>
                <a href={instagramLink} target="_blank" rel="noopener noreferrer" className="btn-secundario !px-5">
                  <FaInstagram className="text-lg" aria-hidden="true" />@{NEGOCIO.instagram}
                </a>
              </div>
            </div>
          </motion.div>

          {/* Mapa */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
            className="relative lg:col-span-7"
          >
            <div className="relative h-[380px] overflow-hidden rounded-4xl border border-tinta/10 bg-fondo-3 shadow-tarjeta sm:h-[440px] lg:h-full lg:min-h-[500px]">
              <iframe
                title={`${t.ubicacion.mapa}: ${NEGOCIO.nombreCompleto}, ${NEGOCIO.direccion}`}
                src={mapsEmbed}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                className="mapa-noche absolute inset-0 h-full w-full border-0 [filter:sepia(0.18)_saturate(0.85)]"
              />
            </div>

            {/* Polaroid de Congreso */}
            <motion.figure
              initial={{ opacity: 0, rotate: 10, y: 30 }}
              whileInView={{ opacity: 1, rotate: 5, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.3, ease: EASE }}
              className="pointer-events-none absolute -bottom-10 -right-2 hidden w-40 rounded-xl bg-crema p-2 pb-3 shadow-foto sm:block md:-right-6 md:w-48"
            >
              <img
                src={congreso}
                alt={t.ubicacion.congresoAlt}
                width={480}
                height={854}
                loading="lazy"
                decoding="async"
                className="aspect-[4/5] w-full rounded-lg object-cover"
              />
              <figcaption className="mt-2 text-center font-serif text-sm italic text-espresso-2">
                {t.ubicacion.congreso}
              </figcaption>
            </motion.figure>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
