import { Suspense, useEffect, useRef, useState } from 'react';

// Evento global: cuando alguien toca un link del menú montamos todas las
// secciones de una, así el scroll cae justo donde tiene que caer.
export const MONTAR_TODO = 'venzza:montar-todo';

/**
 * LazySection — monta su contenido solo cuando se acerca en el scroll.
 * El id va en el contenedor (siempre existe), así los links del menú
 * funcionan aunque la sección todavía no se haya cargado.
 *
 * Uso:
 *   <LazySection id="carta" minHeight={1200}>
 *     <Carta />
 *   </LazySection>
 */
export default function LazySection({ id, children, minHeight = 600, rootMargin = '500px' }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(
    () => typeof window !== 'undefined' && window.location.hash.length > 1
  );

  useEffect(() => {
    if (visible) return undefined;
    const el = ref.current;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { rootMargin }
    );
    io.observe(el);

    const montar = () => setVisible(true);
    window.addEventListener(MONTAR_TODO, montar);

    return () => {
      io.disconnect();
      window.removeEventListener(MONTAR_TODO, montar);
    };
  }, [visible, rootMargin]);

  return (
    <div
      id={id}
      ref={ref}
      className="scroll-mt-16"
      style={{ minHeight: visible ? undefined : minHeight }}
    >
      {visible && (
        <Suspense fallback={<div style={{ minHeight }} aria-hidden="true" />}>{children}</Suspense>
      )}
    </div>
  );
}
