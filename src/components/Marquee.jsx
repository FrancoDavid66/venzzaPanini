import { usePreferencias } from '../context/preferencias';

function Tira({ frases }) {
  return (
    <div className="flex shrink-0 items-center">
      {frases.map((f) => (
        <span key={f} className="flex items-center">
          <span className="whitespace-nowrap px-6 font-serif text-2xl italic md:px-10 md:text-4xl">{f}</span>
          <span className="text-lg text-aperol-claro md:text-xl">✦</span>
        </span>
      ))}
    </div>
  );
}

export default function Marquee() {
  const { t } = usePreferencias();

  return (
    <div className="relative z-10 -mt-6 overflow-hidden py-4" aria-hidden="true">
      <div className="-mx-8 -rotate-[1.6deg] bg-salvia py-4 text-crema shadow-tarjeta md:py-5">
        <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
          <Tira frases={t.marquee} />
          <Tira frases={t.marquee} />
        </div>
      </div>
    </div>
  );
}
