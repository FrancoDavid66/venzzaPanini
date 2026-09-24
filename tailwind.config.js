/** @type {import('tailwindcss').Config} */

// Colores que cambian con el modo Día / Noche (los valores están en src/index.css)
const tema = (variable) => `rgb(var(--${variable}) / <alpha-value>)`;

export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        // Fraunces = títulos (serif italiana, con itálica "de pizarra"). DM Sans = cuerpo.
        serif: ['"Fraunces Variable"', 'Georgia', 'serif'],
        sans: ['"DM Sans Variable"', 'system-ui', 'sans-serif'],
      },
      colors: {
        // ===== Colores de tema (Día / Noche) =====
        fondo: { DEFAULT: tema('fondo'), 2: tema('fondo-2'), 3: tema('fondo-3') }, // fondos de sección
        tarjeta: tema('tarjeta'), // superficies de tarjetas
        tinta: { DEFAULT: tema('tinta'), 2: tema('tinta-2'), 3: tema('tinta-3') }, // textos
        marca: tema('marca'), // salvia del logo (más clara de noche)
        acento: tema('acento'), // terracota (más luminosa de noche)

        // ===== Paleta fija de la marca (no cambia con el tema) =====
        crema: {
          DEFAULT: '#F6F0E4',
          2: '#EFE6D5',
          3: '#E4D7C0',
        },
        salvia: {
          DEFAULT: '#5C6C5B',
          claro: '#8D9A89',
          suave: '#DDE2D6',
        },
        bosco: {
          DEFAULT: '#2E3A2F',
          2: '#232D24',
        },
        terracota: {
          DEFAULT: '#B4532E',
          2: '#944020',
        },
        aperol: {
          DEFAULT: '#EC5B24',
          claro: '#F59A5E',
        },
        espresso: {
          DEFAULT: '#2A211B',
          2: '#5B4D43',
          3: '#8A7B6E',
        },
        piedra: '#D5CFBE',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      transitionTimingFunction: {
        suave: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      boxShadow: {
        foto: '0 30px 60px -28px rgba(20, 16, 12, 0.5)',
        tarjeta: '0 18px 40px -24px rgba(20, 16, 12, 0.4)',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        giro: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        flotar: {
          '0%, 100%': { transform: 'translateY(0) rotate(var(--rot, 0deg))' },
          '50%': { transform: 'translateY(-10px) rotate(var(--rot, 0deg))' },
        },
        burbuja: {
          '0%': { transform: 'translateY(0) scale(0.6)', opacity: '0' },
          '15%': { opacity: '0.7' },
          '100%': { transform: 'translateY(-420px) scale(1)', opacity: '0' },
        },
      },
      animation: {
        marquee: 'marquee 38s linear infinite',
        giro: 'giro 22s linear infinite',
        flotar: 'flotar 6s ease-in-out infinite',
        burbuja: 'burbuja 7s ease-in infinite',
      },
    },
  },
  plugins: [],
};
