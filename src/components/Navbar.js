import React from 'react';

export default function Navbar({ totalCount, categoriasCount }) {
  return (
    <header className="header">
      <div className="header-contenido header-grid">
        <div className="logo">
          <span className="logo-icono">🍪</span>
          <div>
            <p className="kicker">Cookie Studio</p>
            <h1 className="logo-nombre">Cookie Haven</h1>
            <p className="logo-slogan">Diseña, busca y modifica tu catálogo con una interfaz más viva</p>
          </div>
        </div>

        <div className="header-metricas">
          <div className="contador">
            <span className="contador-numero">{totalCount}</span>
            <span className="contador-texto">Galletas en catálogo</span>
          </div>
          <div className="contador contador-secundario">
            <span className="contador-numero">{categoriasCount}</span>
            <span className="contador-texto">Categorías activas</span>
          </div>
        </div>
      </div>
    </header>
  );
}
