import useHoraBA from '../hooks/useHoraBA';
import { estadoHappy, estadoLocal, formatoDuracion, formatoReloj } from '../utils/tiempo';
import { NEGOCIO } from '../data/negocio';
import { usePreferencias } from '../context/preferencias';

function Punto({ vivo, color = 'bg-aperol', apagado = 'bg-marca' }) {
  return (
    <span className="relative flex h-2 w-2 shrink-0" aria-hidden="true">
      {vivo && <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 ${color}`} />}
      <span className={`relative inline-flex h-2 w-2 rounded-full ${vivo ? color : apagado}`} />
    </span>
  );
}

// Chip del hero: "Happy hour en curso · termina en 1 h 20 min" / "Happy hour hoy a las 18 hs · faltan 2 h"
export function HappyChip({ className = '' }) {
  const { t } = usePreferencias();
  const ahora = useHoraBA(1000);
  const e = estadoHappy(ahora, NEGOCIO.happyHour);
  const hora = t.formato.hora(NEGOCIO.happyHour.desde);

  let contenido = null;
  if (e.tipo === 'en-curso') {
    contenido = (
      <>
        <strong className="font-bold text-tinta">{t.estado.hhEnCurso}</strong>
        <span>· {t.estado.termina(formatoDuracion(e.resta))}</span>
      </>
    );
  } else if (e.tipo === 'hoy') {
    contenido = (
      <>
        <span>{t.estado.hhHoy(hora)}</span>
        <span>· {t.estado.faltan(formatoDuracion(e.resta))}</span>
      </>
    );
  } else if (e.tipo === 'manana') {
    contenido = <span>{t.estado.hhManana(hora)}</span>;
  } else if (e.tipo === 'otro') {
    contenido = <span>{t.estado.hhDia(t.formato.diasLargo[e.dia], hora)}</span>;
  }
  if (!contenido) return null;

  return (
    <span className={`inline-flex flex-wrap items-center gap-x-1.5 gap-y-0.5 ${className}`}>
      <span className="mr-1 flex items-center">
        <Punto vivo={e.tipo === 'en-curso'} />
      </span>
      {contenido}
    </span>
  );
}

// Chip "Abierto ahora / Cerrado" (solo aparece si hay horarios cargados en negocio.js)
export function AbiertoChip({ className = '' }) {
  const { t } = usePreferencias();
  const ahora = useHoraBA(30000);
  const e = estadoLocal(ahora, NEGOCIO.horarios);
  if (!e) return null;

  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <Punto vivo={e.abierto} color="bg-[#3FA35B]" apagado="bg-tinta-3" />
      {e.abierto ? (
        <span>
          <strong className="font-bold text-tinta">{t.estado.abierto}</strong>
          {e.hasta && ` · ${t.estado.cierraA(t.formato.hora(e.hasta))}`}
        </span>
      ) : (
        <span>
          {t.estado.cerrado}
          {e.abre && ` · ${t.estado.abreA(t.formato.hora(e.abre))}`}
        </span>
      )}
    </span>
  );
}

// Cuenta regresiva grande (sección Happy hour, fondo oscuro)
export function HappyContador({ className = '' }) {
  const { t } = usePreferencias();
  const ahora = useHoraBA(1000);
  const e = estadoHappy(ahora, NEGOCIO.happyHour);
  if (e.tipo === 'nunca') return null;
  const enCurso = e.tipo === 'en-curso';

  return (
    <div
      className={`inline-flex items-center gap-4 rounded-2xl border px-5 py-3.5 transition-colors duration-500 ${
        enCurso ? 'border-aperol/70 bg-aperol/15' : 'border-crema/15 bg-crema/[0.04]'
      } ${className}`}
    >
      <Punto vivo={enCurso} apagado="bg-crema/40" />
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-crema/70">
          {enCurso ? t.happy.enCurso : t.happy.arrancaEn}
        </p>
        <p className="mt-0.5 font-sans text-3xl font-semibold tabular-nums tracking-tight text-crema">
          {formatoReloj(e.resta)}
        </p>
      </div>
    </div>
  );
}
