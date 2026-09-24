import { createContext, useContext } from 'react';

// Preferencias del visitante: idioma (ES/EN/IT) y tema (día/noche)
export const PreferenciasContext = createContext(null);

export function usePreferencias() {
  const valor = useContext(PreferenciasContext);
  if (!valor) throw new Error('usePreferencias tiene que usarse dentro de <PreferenciasProvider>');
  return valor;
}
