import { motion } from 'framer-motion';
import { LuArrowUp, LuMapPin, LuMartini } from 'react-icons/lu';
import { FaWhatsapp, FaInstagram } from 'react-icons/fa6';
import Logo from './Logo';
import Titulo from './Titulo';
import { NAV, NEGOCIO, waLink, instagramLink } from '../data/negocio';
import { usePreferencias } from '../context/preferencias';
import { irA } from '../utils/scroll';

const EASE = [0.22, 1, 0.36, 1];

export default function Footer() {
  const { t } = usePreferencias();
  const anio = new Date().getFullYear();
  const { desde, hasta } = NEGOCIO.happyHour;

  return (
    <footer className="relative overflow-hidden bg-bosco text-crema" aria-label={NEGOCIO.nombreCompleto}>
      <div className="grain-claro" aria-hidden="true" />
      <div aria-hidden="true" className="tricolore h-1.5 w-full" />

      {/* CTA final */}
      <div className="relative mx-auto max-w-7xl px-5 pb-16 pt-20 md:px-8 md:pt-28">
        <div className="flex flex-col items-start gap-8 border-b border-crema/15 pb-16 md:flex-row md:items-end md:justify-between">
          <div>
            <Titulo
              as="p"
              lineas={t.footer.antojo}
              enfasisClase="italic text-aperol-claro"
              className="font-serif text-[clamp(3rem,8vw,6.5rem)] font-medium italic leading-[0.95]"
            />
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
              className="mt-4 max-w-md text-lg text-crema/75"
            >
              {t.footer.bajada}
            </motion.p>
          </div>
          <motion.a
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.25, ease: EASE }}
            href={waLink(t.whatsapp.pedido)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-claro !px-8 !py-4 text-base"
          >
            <FaWhatsapp className="text-xl text-[#1FA855]" aria-hidden="true" />
            {t.nav.pedir}
          </motion.a>
        </div>

        {/* Columnas */}
        <div className="grid gap-12 pt-14 md:grid-cols-12">
          <div className="md:col-span-5">
            <Logo className="h-14 w-auto text-crema" />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-crema/65">{t.footer.slogan}</p>
            <div className="mt-6 flex gap-3">
              <a
                href={instagramLink}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="grid h-11 w-11 place-items-center rounded-full border border-crema/20 text-lg transition-colors hover:border-crema/60 hover:bg-crema/10"
              >
                <FaInstagram />
              </a>
              <a
                href={waLink(t.whatsapp.pedido)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="grid h-11 w-11 place-items-center rounded-full border border-crema/20 text-lg transition-colors hover:border-crema/60 hover:bg-crema/10"
              >
                <FaWhatsapp />
              </a>
            </div>
          </div>

          <nav className="md:col-span-3" aria-label={t.footer.navegacion}>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-salvia-suave">{t.footer.navegacion}</p>
            <ul className="mt-5 space-y-3">
              {NAV.map(({ id, clave }) => (
                <li key={id}>
                  <button
                    type="button"
                    onClick={() => irA(id)}
                    className="text-[15px] text-crema/80 transition-colors hover:text-crema"
                  >
                    {t.nav[clave]}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-4">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-salvia-suave">{t.footer.visitanos}</p>
            <ul className="mt-5 space-y-4 text-[15px] text-crema/80">
              <li className="flex gap-3">
                <LuMapPin className="mt-1 shrink-0 text-aperol-claro" aria-hidden="true" />
                <span>
                  {NEGOCIO.direccion}, {NEGOCIO.ciudad}
                  <br />
                  <span className="text-crema/60">{t.ubicacion.referencia}</span>
                </span>
              </li>
              <li className="flex gap-3">
                <LuMartini className="mt-1 shrink-0 text-aperol-claro" aria-hidden="true" />
                <span>
                  {t.happy.eyebrow} {t.formato.rango(desde, hasta)}
                  <br />
                  <span className="text-crema/60">{t.happy.promo}</span>
                </span>
              </li>
              <li className="flex gap-3">
                <FaWhatsapp className="mt-1 shrink-0 text-aperol-claro" aria-hidden="true" />
                <a href={waLink(t.whatsapp.pedido)} target="_blank" rel="noopener noreferrer" className="hover:text-crema">
                  {NEGOCIO.whatsappVisible}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Base */}
        <div className="mt-16 flex flex-col-reverse items-start justify-between gap-5 border-t border-crema/15 pt-8 text-sm text-crema/55 sm:flex-row sm:items-center">
          <p>
            © {anio} {NEGOCIO.nombreCompleto} · {t.footer.derechos}
            {NEGOCIO.creditoWeb && (
              <>
                {' · '}
                <a
                  href={NEGOCIO.creditoWeb.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-crema/30 underline-offset-4 hover:text-crema"
                >
                  {NEGOCIO.creditoWeb.texto}
                </a>
              </>
            )}
          </p>
          <button
            type="button"
            onClick={() => irA('inicio')}
            className="group inline-flex items-center gap-2 text-crema/70 transition-colors hover:text-crema"
          >
            {t.footer.volverArriba}
            <span className="grid h-9 w-9 place-items-center rounded-full border border-crema/20 transition-transform duration-300 group-hover:-translate-y-1">
              <LuArrowUp aria-hidden="true" />
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
}
