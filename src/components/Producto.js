import React from 'react';
import { IconEdit, IconDelete } from './icons';

export default function Producto({ producto, onEdit, onDelete, onSelect }) {
  if (!producto) return null;

  return (
    <article className="destacado">
      <img src={producto.imagen} alt={producto.nombre} className="destacado-imagen" />
      <div className="destacado-cuerpo">
        <div className={`badge-categoria badge-${producto.categoria.toLowerCase().replace(/\s+/g, '-')}`}>
          {producto.categoria}
        </div>
        <h3>{producto.nombre}</h3>
        <p>{producto.descripcion}</p>
        <div className="destacado-metas">
          <span>${Number(producto.precio).toLocaleString('es-CL')}</span>
          <span>{Number(producto.stock) > 0 ? `Stock ${producto.stock}` : 'Agotada'}</span>
        </div>
        <div className="card-acciones card-acciones-amplias">
          <button className="btn-editar" onClick={() => onEdit(producto)}>
            <span style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }}>
              <IconEdit width={14} height={14} />
              <span>Editar ahora</span>
            </span>
          </button>
          <button className="btn-eliminar" onClick={() => onDelete(producto)}>
            <span style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }}>
              <IconDelete width={14} height={14} />
              <span>Eliminar</span>
            </span>
          </button>
        </div>
      </div>
    </article>
  );
}
