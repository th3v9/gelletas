import React from 'react';

export default function FormularioProducto({
  editarId,
  nombre,
  setNombre,
  descripcion,
  setDescripcion,
  precio,
  setPrecio,
  categoria,
  setCategoria,
  stock,
  setStock,
  manejarImagen,
  imagenPreview,
  errorImagen,
  onAdd,
  onUpdate,
  onCancel,
  formErrors = [],
}) {
  const fieldError = (field) => {
    if (!formErrors || formErrors.length === 0) return null;
    const f = formErrors.find((m) => m.toLowerCase().includes(field));
    return f || null;
  };
  return (
    <div className="formulario formulario-editor">
      {formErrors && formErrors.length > 0 && (
        <div className="form-errors campo-ancho">
          <ul>
            {formErrors.map((err, i) => (
              <li key={i} style={{ color: 'var(--danger)', fontWeight: 800 }}>{err}</li>
            ))}
          </ul>
        </div>
      )}
      <div className="campo">
        <label>Nombre</label>
        <input type="text" placeholder="Ej: Choco Chip Clásica" value={nombre} onChange={(e) => setNombre(e.target.value)} />
        {fieldError('nombre') && <p className="error-imagen">{fieldError('nombre')}</p>}
      </div>
      <div className="campo">
        <label>Precio (CLP)</label>
        <input type="number" placeholder="Ej: 1990" value={precio} onChange={(e) => setPrecio(e.target.value)} />
        {fieldError('precio') && <p className="error-imagen">{fieldError('precio')}</p>}
      </div>
      <div className="campo">
        <label>Categoría</label>
        <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
          <option value="">Seleccionar...</option>
          <option value="Chocolate">Chocolate</option>
          <option value="Frutal">Frutal</option>
          <option value="Artesanal">Artesanal</option>
          <option value="Rellena">Rellena</option>
          <option value="Sin gluten">Sin gluten</option>
          <option value="Vegan">Vegan</option>
        </select>
      </div>
      <div className="campo">
        <label>Stock</label>
        <input type="number" placeholder="Ej: 20" value={stock} min="0" onChange={(e) => setStock(e.target.value)} />
        {fieldError('stock') && <p className="error-imagen">{fieldError('stock')}</p>}
      </div>
      <div className="campo campo-ancho">
        <label>Descripción</label>
        <textarea placeholder="Describe la galleta..." value={descripcion} onChange={(e) => setDescripcion(e.target.value)} rows={4} />
      </div>
      <div className="campo campo-ancho">
        <label>Imagen</label>
        <input type="file" accept="image/*" onChange={manejarImagen} className="input-archivo" />
        {errorImagen && <p className="error-imagen">{errorImagen}</p>}
        {imagenPreview && <img src={imagenPreview} alt="Preview" className="imagen-preview" />}
      </div>
      <div className="campo-botones">
        {editarId ? (
          <>
            <button className="btn-guardar" onClick={onUpdate}>
              💾 Guardar cambios
            </button>
            <button className="btn-cancelar" onClick={onCancel}>
              ✖ Cancelar
            </button>
          </>
        ) : (
          <button className="btn-agregar" onClick={onAdd}>
            🍪 Agregar galleta
          </button>
        )}
      </div>
    </div>
  );
}
