import React from 'react';

export default function Footer() {
  const hoy = new Date();
  const fecha = hoy.toLocaleDateString('es-CL');

  return (
    <footer className="footer">
      <p>🍪 Cookie Haven — Un catálogo más editorial, ágil y fácil de explorar</p>
      <p style={{ marginTop: 6 }}>Alumno: <strong>Vicente Galassi</strong> — Fecha: <strong>{fecha}</strong></p>
    </footer>
  );
}
