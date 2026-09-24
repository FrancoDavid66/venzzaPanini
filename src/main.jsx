import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { MotionConfig } from 'framer-motion';

// Tipografías (se sirven desde la propia web, sin depender de Google Fonts)
import '@fontsource-variable/fraunces/opsz.css';
import '@fontsource-variable/fraunces/opsz-italic.css';
import '@fontsource-variable/dm-sans/wght.css';

// Estilos base del scroll suave
import 'lenis/dist/lenis.css';

import './index.css';
import App from './App';
import PreferenciasProvider from './context/PreferenciasProvider';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MotionConfig reducedMotion="user">
      <PreferenciasProvider>
        <App />
      </PreferenciasProvider>
    </MotionConfig>
  </StrictMode>
);
