// Devuelve el texto en el idioma elegido (si el dato es { es, en, it }), con español de respaldo
export const tr = (valor, idioma) =>
  valor && typeof valor === 'object' && !Array.isArray(valor) ? valor[idioma] ?? valor.es : valor;

// Reemplaza {clave} por su valor: rellenar('Hola {nombre}', { nombre: 'Franco' })
export const rellenar = (texto, vars = {}) =>
  String(texto).replace(/\{(\w+)\}/g, (coincidencia, clave) => (vars[clave] ?? coincidencia));

// "a, b y c" / "a, b and c" / "a, b e c"
export const unir = (lista, idioma) => {
  try {
    return new Intl.ListFormat(idioma, { style: 'long', type: 'conjunction' }).format(lista);
  } catch {
    return lista.join(', ');
  }
};
