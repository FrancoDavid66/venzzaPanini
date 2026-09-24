import { Suspense, lazy, useEffect } from 'react';
import Lenis from 'lenis';

// Esenciales (primera pantalla)
import Loader from './components/Loader';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Marquee from './components/Marquee';
import LazySection from './components/LazySection';
import Footer from './components/Footer';
import Chat from './components/Chat';
import Cursor from './components/Cursor';
import { registrarLenis } from './utils/scroll';

// Diferidos (se cargan al acercarse con el scroll)
const cargarCarta = () => import('./components/Carta');
const cargarHappyHour = () => import('./components/HappyHour');
const cargarNosotros = () => import('./components/Nosotros');
const cargarGaleria = () => import('./components/Galeria');
const cargarUbicacion = () => import('./components/Ubicacion');

const Carta = lazy(cargarCarta);
const HappyHour = lazy(cargarHappyHour);
const Nosotros = lazy(cargarNosotros);
const Galeria = lazy(cargarGaleria);
const Ubicacion = lazy(cargarUbicacion);

export default function App() {
  // Scroll suave tipo "manteca" (en celu se mantiene el scroll nativo)
  useEffect(() => {
    const lenis = new Lenis({ autoRaf: true, lerp: 0.1, allowNestedScroll: true });
    registrarLenis(lenis);
    return () => {
      registrarLenis(null);
      lenis.destroy();
    };
  }, []);

  // Precarga el código del resto de las secciones cuando la página ya está tranquila
  useEffect(() => {
    const t = setTimeout(() => {
      cargarCarta();
      cargarHappyHour();
      cargarNosotros();
      cargarGaleria();
      cargarUbicacion();
    }, 2500);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <Loader />
      <Navbar />

      <main>
        <Hero />
        <Marquee />

        <Suspense fallback={null}>
          <LazySection id="carta" minHeight={1500}>
            <Carta />
          </LazySection>

          <LazySection id="happy-hour" minHeight={900}>
            <HappyHour />
          </LazySection>

          <LazySection id="nosotros" minHeight={900}>
            <Nosotros />
          </LazySection>

          <LazySection id="galeria" minHeight={1000}>
            <Galeria />
          </LazySection>

          <LazySection id="ubicacion" minHeight={900}>
            <Ubicacion />
          </LazySection>
        </Suspense>
      </main>

      <Footer />
      <Chat />
      <Cursor />
    </>
  );
}
