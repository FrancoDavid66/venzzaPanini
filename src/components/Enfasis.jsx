import { Fragment } from 'react';

// Convierte "son *obras de arte*" en: son <em>obras de arte</em>
export default function Enfasis({ texto, className = 'enfasis' }) {
  return String(texto)
    .split('*')
    .map((parte, i) =>
      i % 2 === 1 ? (
        <em key={i} className={className}>
          {parte}
        </em>
      ) : (
        <Fragment key={i}>{parte}</Fragment>
      )
    );
}
