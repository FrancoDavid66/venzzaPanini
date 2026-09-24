import { motion } from 'framer-motion';
import Enfasis from './Enfasis';

const EASE = [0.22, 1, 0.36, 1];

/**
 * Título que aparece línea por línea (cada línea sube desde una máscara).
 *   <Titulo as="h2" lineas={['Nuestros *panini*']} />
 * alCargar: anima apenas está "activo" (para el hero) en vez de al entrar en pantalla.
 */
export default function Titulo({
  as: Etiqueta = 'h2',
  id,
  lineas,
  className = '',
  claseLinea = () => '',
  enfasisClase,
  delay = 0,
  alCargar = false,
  activo = true,
}) {
  return (
    <Etiqueta id={id} className={className}>
      {lineas.map((linea, i) => (
        <span key={`${i}-${linea}`} className="-mb-[0.14em] -mt-[0.06em] block overflow-hidden pb-[0.14em] pt-[0.06em]">
          <motion.span
            className={`block ${claseLinea(i)}`}
            initial={{ y: '112%' }}
            {...(alCargar
              ? { animate: { y: activo ? '0%' : '112%' } }
              : { whileInView: { y: '0%' }, viewport: { once: true, margin: '-40px' } })}
            transition={{ duration: 1, delay: delay + i * 0.12, ease: EASE }}
          >
            <Enfasis texto={linea} className={enfasisClase} />
          </motion.span>
        </span>
      ))}
    </Etiqueta>
  );
}
