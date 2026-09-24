import { MONTAR_TODO } from '../components/LazySection';

// Instancia de Lenis (scroll suave). Se registra desde App.jsx
let lenis = null;

export function registrarLenis(instancia) {
  lenis = instancia;
}

const OFFSET = 64; // alto del navbar al scrollear (Lenis ya respeta el scroll-margin de cada sección)

/**
 * Scroll suave a una sección por id.
 * 1) Monta todas las secciones diferidas (para que el alto sea el real)
 * 2) Scrollea (con Lenis si está activo)
 * 3) Corrige la posición si algo terminó de cargar en el camino
 */
export function irA(id) {
  if (id === 'inicio') {
    if (lenis) lenis.scrollTo(0, { duration: 1.4 });
    else window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  window.dispatchEvent(new Event(MONTAR_TODO));

  const corregir = () => {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top;
    if (Math.abs(top - OFFSET) <= 24) return;
    if (lenis) lenis.scrollTo(el, { duration: 0.5 });
    else el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const mover = () => {
    const el = document.getElementById(id);
    if (!el) return;
    if (lenis) {
      lenis.scrollTo(el, { duration: 1.2, onComplete: () => window.setTimeout(corregir, 60) });
    } else {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.setTimeout(corregir, 900);
    }
  };

  requestAnimationFrame(() => requestAnimationFrame(mover));
}

// Frena el scroll de la página (menú móvil, visor de fotos, chat en celu)
export function bloquearScroll(activo) {
  document.body.style.overflow = activo ? 'hidden' : '';
  if (!lenis) return;
  if (activo) lenis.stop();
  else lenis.start();
}
