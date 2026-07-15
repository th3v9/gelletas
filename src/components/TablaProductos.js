import React from 'react';
import { IconEdit, IconDelete } from './icons';

export default function TablaProductos({ productos, onEdit, onDelete, onSelect }) {
  if (!productos) return null;

  return (
    <div>
      <div className="seccion-cabecera">
        <div>
          <p className="kicker">Catálogo vivo</p>
          <h2 className="seccion-titulo">Colección de galletas</h2>
        </div>
        <p className="seccion-descripcion">
          Cada ficha tiene acceso directo a editar, seleccionar o eliminar la galleta sin salir de la vista principal.
        </p>
      </div>

      {productos.length === 0 ? (
        <div className="catalogo-vacio">
          <p>No encontramos coincidencias con esos filtros. Prueba otra categoría o limpia la búsqueda.</p>
        </div>
      ) : (
        <div className="tabla-wrap">
        <table className="tabla-productos">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Editar</th>
              <th>Eliminar</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((p) => (
              <tr key={p.id} onClick={() => onSelect && onSelect(p)}>
                <td data-label="ID">{p.id}</td>
                <td data-label="Nombre">{p.nombre}</td>
                <td data-label="Categoría">{p.categoria}</td>
                <td data-label="Precio">${Number(p.precio).toLocaleString('es-CL')}</td>
                <td data-label="Stock">{p.stock}</td>
                <td>
                  <button
                    className="btn-editar"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(p);
                    }}
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                      <IconEdit />
                    </span>
                  </button>
                </td>
                <td>
                  <button
                    className="btn-eliminar"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(p);
                    }}
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                      <IconDelete />
                    </span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      )}
    </div>
  );
}
