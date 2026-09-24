// ============================================================
//  HORA DE BUENOS AIRES + estados en vivo (happy hour, abierto)
//  Siempre se calcula con la hora de Argentina, aunque el visitante
//  tenga el celular en otro huso horario.
// ============================================================

export const TZ = 'America/Argentina/Buenos_Aires';

const formato = new Intl.DateTimeFormat('en-US', {
  timeZone: TZ,
  hourCycle: 'h23',
  weekday: 'short',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
});

const DIAS = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

export function horaBA(fecha = new Date()) {
  const p = Object.fromEntries(formato.formatToParts(fecha).map((x) => [x.type, x.value]));
  const h = Number(p.hour) % 24;
  const m = Number(p.minute);
  const s = Number(p.second);
  return { dia: DIAS[p.weekday], h, m, s, seg: h * 3600 + m * 60 + s };
}

const aSegundos = (v) => {
  const [H, M = 0] = String(v).split(':').map(Number);
  return H * 3600 + M * 60;
};

// Día (crema) o noche (verde del local) según la hora
export function temaPorHora(ahora, { desde = 18, hasta = 7 } = {}) {
  return ahora.h >= desde || ahora.h < hasta ? 'noche' : 'dia';
}

// Happy hour: en curso / hoy / mañana / otro día
export function estadoHappy(ahora, { desde, hasta, dias = [0, 1, 2, 3, 4, 5, 6] }) {
  const inicio = desde * 3600;
  const fin = hasta * 3600;

  if (dias.includes(ahora.dia)) {
    if (ahora.seg >= inicio && ahora.seg < fin) return { tipo: 'en-curso', resta: fin - ahora.seg };
    if (ahora.seg < inicio) return { tipo: 'hoy', resta: inicio - ahora.seg };
  }

  for (let d = 1; d <= 7; d += 1) {
    const dia = (ahora.dia + d) % 7;
    if (dias.includes(dia)) {
      return {
        tipo: d === 1 ? 'manana' : 'otro',
        dia,
        resta: 86400 - ahora.seg + (d - 1) * 86400 + inicio,
      };
    }
  }
  return { tipo: 'nunca' };
}

// Abierto / cerrado según los horarios cargados (null si no hay horarios)
export function estadoLocal(ahora, horarios) {
  if (!horarios || horarios.length === 0) return null;
  const deHoy = horarios.filter((h) => h.dias.includes(ahora.dia));

  for (const h of deHoy) {
    const a = aSegundos(h.desde);
    const b = aSegundos(h.hasta);
    const abierto = b > a ? ahora.seg >= a && ahora.seg < b : ahora.seg >= a || ahora.seg < b;
    if (abierto) return { abierto: true, hasta: h.hasta };
  }

  const proximo = deHoy
    .map((h) => h.desde)
    .filter((d) => aSegundos(d) > ahora.seg)
    .sort((x, y) => aSegundos(x) - aSegundos(y))[0];

  return { abierto: false, abre: proximo ?? null };
}

// "2 h 05 min" · "45 min" · "< 1 min"
export function formatoDuracion(seg) {
  const h = Math.floor(seg / 3600);
  const m = Math.floor((seg % 3600) / 60);
  if (h > 0) return `${h} h ${String(m).padStart(2, '0')} min`;
  if (m > 0) return `${m} min`;
  return '< 1 min';
}

// "01:23:45" (o "1d 03:12:00" si falta más de un día)
export function formatoReloj(seg) {
  const d = Math.floor(seg / 86400);
  const h = Math.floor((seg % 86400) / 3600);
  const m = Math.floor((seg % 3600) / 60);
  const s = seg % 60;
  const hhmmss = [h, m, s].map((n) => String(n).padStart(2, '0')).join(':');
  return d > 0 ? `${d}d ${hhmmss}` : hhmmss;
}

// Convierte los horarios cargados en líneas para mostrar: [{ dias: 'Lun a Vie', horas: '8 a 21 hs' }]
export function etiquetaHorarios(horarios, t) {
  const orden = (d) => (d + 6) % 7; // semana de lunes a domingo
  return (horarios || []).map((h) => {
    const dias = [...h.dias].sort((a, b) => orden(a) - orden(b));
    const seguidos = dias.every((d, i) => i === 0 || orden(d) === orden(dias[i - 1]) + 1);
    let etiqueta;
    if (dias.length === 1) etiqueta = t.formato.dias[dias[0]];
    else if (seguidos) etiqueta = t.formato.rangoDias(t.formato.dias[dias[0]], t.formato.dias[dias[dias.length - 1]]);
    else etiqueta = dias.map((d) => t.formato.dias[d]).join(', ');
    return { dias: etiqueta, horas: t.formato.rango(h.desde, h.hasta) };
  });
}
