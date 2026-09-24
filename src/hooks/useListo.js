import { useEffect, useState } from 'react';

// Avisa cuando terminó el loader, para arrancar las animaciones del hero a la vista
const EVENTO_LISTO = 'venzza:listo';

export function marcarListo() {
  window.__venzzaListo = true;
  window.dispatchEvent(new Event(EVENTO_LISTO));
}

export default function useListo() {
  const [listo, setListo] = useState(() => Boolean(window.__venzzaListo));

  useEffect(() => {
    if (listo) return undefined;
    const alTerminar = () => setListo(true);
    window.addEventListener(EVENTO_LISTO, alTerminar);
    return () => window.removeEventListener(EVENTO_LISTO, alTerminar);
  }, [listo]);

  return listo;
}
