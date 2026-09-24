import { useEffect, useState } from 'react';
import { horaBA } from '../utils/tiempo';

// Hora de Buenos Aires que se actualiza sola (por defecto, cada segundo)
export default function useHoraBA(intervalo = 1000) {
  const [ahora, setAhora] = useState(horaBA);

  useEffect(() => {
    const id = setInterval(() => setAhora(horaBA()), intervalo);
    return () => clearInterval(id);
  }, [intervalo]);

  return ahora;
}
