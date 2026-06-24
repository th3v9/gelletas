import './App.css';
import { useEffect, useMemo, useState } from 'react';

function App() {
  const [galletas, setGalletas] = useState(() => {
    const guardadas = localStorage.getItem('galletas');

    if (guardadas) return JSON.parse(guardadas);

    return [
      {
        id: 1,
        nombre: 'Choco Chip Clásica',
        descripcion: 'Masa suave con chips de chocolate belga. Crujiente por fuera, tierna por dentro.',
        precio: '1990',
        categoria: 'Chocolate',
        stock: 24,
        imagen: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&h=300&fit=crop',
      },
      {
        id: 2,
        nombre: 'Limón Merengue',
        descripcion: 'Galleta de mantequilla con crema de limón y merengue tostado. Fresca y equilibrada.',
        precio: '2290',
        categoria: 'Frutal',
        stock: 12,
        imagen: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=300&fit=crop',
      },
      {
        id: 3,
        nombre: 'Canela & Avena',
        descripcion: 'Galleta artesanal con avena integral, canela de Ceilán y pasas. Perfecta para el desayuno.',
        precio: '1590',
        categoria: 'Artesanal',
        stock: 0,
        imagen: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=300&fit=crop',
      },
    ];
  });

  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [categoria, setCategoria] = useState('');
  const [stock, setStock] = useState('');
  const [imagen, setImagen] = useState(null);
  const [imagenPreview, setImagenPreview] = useState('');
  const [errorImagen, setErrorImagen] = useState('');
  const [editarId, setEditarId] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('Todas');
  const [filtroStock, setFiltroStock] = useState('Todas');
  const [orden, setOrden] = useState('destacadas');
  const [galletaActiva, setGalletaActiva] = useState(null);

  useEffect(() => {
    localStorage.setItem('galletas', JSON.stringify(galletas));
  }, [galletas]);

  useEffect(() => {
    if (!galletaActiva && galletas.length > 0) {
      setGalletaActiva(galletas[0]);
    }
  }, [galletas, galletaActiva]);

  const manejarImagen = (e) => {
    const archivo = e.target.files[0];
    setErrorImagen('');

    if (!archivo) return;

    if (archivo.size > 2 * 1024 * 1024) {
      setErrorImagen('La imagen supera el tamaño permitido de 2MB.');
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagen(reader.result);
      setImagenPreview(reader.result);
    };
    reader.readAsDataURL(archivo);
  };

  const limpiarFormulario = () => {
    setNombre('');
    setDescripcion('');
    setPrecio('');
    setCategoria('');
    setStock('');
    setImagen(null);
    setImagenPreview('');
    setErrorImagen('');
  };

  const agregarGalleta = () => {
    if (!nombre || !descripcion || !precio || !categoria || stock === '') {
      alert('Completa todos los campos.');
      return;
    }

    if (Number(stock) < 0) {
      alert('El stock no puede ser negativo.');
      return;
    }

    const nuevaGalleta = {
      id: Date.now(),
      nombre,
      descripcion,
      precio,
      categoria,
      stock: Number(stock),
      imagen: imagen || 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=300&fit=crop',
    };

    setGalletas([...galletas, nuevaGalleta]);
    setGalletaActiva(nuevaGalleta);
    limpiarFormulario();
  };

  const eliminarGalleta = (id) => {
    if (!window.confirm('¿Deseas eliminar esta galleta?')) return;

    setGalletas(galletas.filter((galleta) => galleta.id !== id));

    if (galletaActiva?.id === id) {
      setGalletaActiva(null);
    }

    if (editarId === id) {
      setEditarId(null);
      limpiarFormulario();
    }
  };

  const cargarEdicion = (galleta) => {
    setEditarId(galleta.id);
    setNombre(galleta.nombre);
    setDescripcion(galleta.descripcion);
    setPrecio(galleta.precio);
    setCategoria(galleta.categoria);
    setStock(galleta.stock);
    setImagenPreview(galleta.imagen);
    setImagen(galleta.imagen);
    setGalletaActiva(galleta);
  };

  const actualizarGalleta = () => {
    if (!nombre || !descripcion || !precio || !categoria || stock === '') {
      alert('Completa todos los campos.');
      return;
    }

    const imagenFinal = imagen || imagenPreview;

    setGalletas(
      galletas.map((galleta) =>
        galleta.id === editarId
          ? {
              ...galleta,
              nombre,
              descripcion,
              precio,
              categoria,
              stock: Number(stock),
              imagen: imagenFinal || galleta.imagen,
            }
          : galleta,
      ),
    );

    setGalletaActiva({
      id: editarId,
      nombre,
      descripcion,
      precio,
      categoria,
      stock: Number(stock),
      imagen: imagenFinal,
    });
    setEditarId(null);
    limpiarFormulario();
  };

  const categoriasUnicas = ['Todas', ...new Set(galletas.map((galleta) => galleta.categoria))];

  const galletasFiltradas = useMemo(() => {
    const terminos = busqueda.trim().toLowerCase();

    return [...galletas]
      .filter((galleta) => {
        const coincideBusqueda =
          !terminos ||
          galleta.nombre.toLowerCase().includes(terminos) ||
          galleta.descripcion.toLowerCase().includes(terminos) ||
          galleta.categoria.toLowerCase().includes(terminos);

        const coincideCategoria = filtroCategoria === 'Todas' || galleta.categoria === filtroCategoria;
        const coincideStock =
          filtroStock === 'Todas' ||
          (filtroStock === 'Con stock' && Number(galleta.stock) > 0) ||
          (filtroStock === 'Agotadas' && Number(galleta.stock) === 0);

        return coincideBusqueda && coincideCategoria && coincideStock;
      })
      .sort((a, b) => {
        if (orden === 'precio-asc') return Number(a.precio) - Number(b.precio);
        if (orden === 'precio-desc') return Number(b.precio) - Number(a.precio);
        if (orden === 'stock-desc') return Number(b.stock) - Number(a.stock);
        return Number(b.stock) - Number(a.stock);
      });
  }, [busqueda, filtroCategoria, filtroStock, galletas, orden]);

  const galletaDestacada = galletaActiva || galletasFiltradas[0] || galletas[0];
  const totalStock = galletas.reduce((acumulado, galleta) => acumulado + Number(galleta.stock), 0);
  const agotadas = galletas.filter((galleta) => Number(galleta.stock) === 0).length;
  const categoriasActivas = new Set(galletas.map((galleta) => galleta.categoria)).size;

  const seleccionarCategoria = (categoriaSeleccionada) => {
    setFiltroCategoria(categoriaSeleccionada);
    setBusqueda('');
  };

  return (
    <div className="pagina">
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
              <span className="contador-numero">{galletas.length}</span>
              <span className="contador-texto">Galletas en catálogo</span>
            </div>
            <div className="contador contador-secundario">
              <span className="contador-numero">{categoriasActivas}</span>
              <span className="contador-texto">Categorías activas</span>
            </div>
          </div>
        </div>
      </header>

      <main className="main">
        <section className="hero">
          <div className="hero-contenido">
            <p className="hero-etiqueta">Panel creativo</p>
            <h2>Una web más editorial, con búsqueda rápida, edición directa y catálogo con foco visual.</h2>
            <p className="hero-descripcion">
              Usa el panel de filtros para explorar tipos de galletas, entra al laboratorio para crear o modificar una ficha y navega entre cards con mayor presencia.
            </p>
            <div className="hero-acciones">
              <button className="btn-primario" onClick={() => document.getElementById('buscador').scrollIntoView({ behavior: 'smooth' })}>
                Buscar galletas
              </button>
              <button className="btn-secundario" onClick={() => document.getElementById('editor').scrollIntoView({ behavior: 'smooth' })}>
                Editar catálogo
              </button>
            </div>
          </div>

          <aside className="hero-panel">
            <div className="hero-panel-cabeza">
              <span>Resumen del lote</span>
              <strong>{totalStock} unidades</strong>
            </div>
            <div className="hero-panel-lista">
              <div>
                <span>Stock en vitrina</span>
                <strong>{galletas.filter((galleta) => Number(galleta.stock) > 0).length}</strong>
              </div>
              <div>
                <span>Agotadas</span>
                <strong>{agotadas}</strong>
              </div>
              <div>
                <span>Categorías</span>
                <strong>{categoriasActivas}</strong>
              </div>
            </div>
          </aside>
        </section>

        <section className="seccion-panel" id="buscador">
          <div className="seccion-cabecera">
            <div>
              <p className="kicker">Explorador</p>
              <h2 className="seccion-titulo">Busca por tipo de galleta</h2>
            </div>
            <p className="seccion-descripcion">
              Filtra por nombre, categoría, stock o precio para navegar el catálogo como si fuera una vitrina profesional.
            </p>
          </div>

          <div className="barra-filtros">
            <div className="campo">
              <label>Buscar</label>
              <input type="text" placeholder="Ej: chocolate, avena, limón..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
            </div>
            <div className="campo">
              <label>Categoría</label>
              <select value={filtroCategoria} onChange={(e) => setFiltroCategoria(e.target.value)}>
                {categoriasUnicas.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
            <div className="campo">
              <label>Stock</label>
              <select value={filtroStock} onChange={(e) => setFiltroStock(e.target.value)}>
                <option value="Todas">Todas</option>
                <option value="Con stock">Con stock</option>
                <option value="Agotadas">Agotadas</option>
              </select>
            </div>
            <div className="campo">
              <label>Orden</label>
              <select value={orden} onChange={(e) => setOrden(e.target.value)}>
                <option value="destacadas">Más stock</option>
                <option value="precio-asc">Precio menor</option>
                <option value="precio-desc">Precio mayor</option>
                <option value="stock-desc">Stock mayor</option>
              </select>
            </div>
          </div>

          <div className="chips-categorias">
            {categoriasUnicas.map((categoriaItem) => (
              <button
                key={categoriaItem}
                className={`chip ${filtroCategoria === categoriaItem ? 'chip-activo' : ''}`}
                onClick={() => seleccionarCategoria(categoriaItem)}
              >
                {categoriaItem}
              </button>
            ))}
          </div>
        </section>

        <section className="seccion-doble">
          <section className="seccion-panel panel-destacado">
            <div className="seccion-cabecera">
              <div>
                <p className="kicker">Vitrina destacada</p>
                <h2 className="seccion-titulo">La galleta que estás mirando</h2>
              </div>
            </div>

            {galletaDestacada ? (
              <article className="destacado">
                <img src={galletaDestacada.imagen} alt={galletaDestacada.nombre} className="destacado-imagen" />
                <div className="destacado-cuerpo">
                  <div className={`badge-categoria badge-${galletaDestacada.categoria.toLowerCase().replace(/\s+/g, '-')}`}>
                    {galletaDestacada.categoria}
                  </div>
                  <h3>{galletaDestacada.nombre}</h3>
                  <p>{galletaDestacada.descripcion}</p>
                  <div className="destacado-metas">
                    <span>${Number(galletaDestacada.precio).toLocaleString('es-CL')}</span>
                    <span>{Number(galletaDestacada.stock) > 0 ? `Stock ${galletaDestacada.stock}` : 'Agotada'}</span>
                  </div>
                  <div className="card-acciones card-acciones-amplias">
                    <button className="btn-editar" onClick={() => cargarEdicion(galletaDestacada)}>
                      ✏️ Editar ahora
                    </button>
                    <button className="btn-eliminar" onClick={() => eliminarGalleta(galletaDestacada.id)}>
                      🗑️ Eliminar
                    </button>
                  </div>
                </div>
              </article>
            ) : (
              <div className="catalogo-vacio">
                <p>No hay una galleta seleccionada todavía.</p>
              </div>
            )}
          </section>

          <aside className="seccion-panel panel-lateral">
            <div className="seccion-cabecera">
              <div>
                <p className="kicker">Ruta rápida</p>
                <h2 className="seccion-titulo">Cómo usar la vitrina</h2>
              </div>
            </div>

            <div className="timeline">
              <div>
                <span>01</span>
                <p>Busca una categoría o escribe un sabor en el panel superior.</p>
              </div>
              <div>
                <span>02</span>
                <p>Abre una tarjeta para verla destacada y entra a editarla.</p>
              </div>
              <div>
                <span>03</span>
                <p>Guarda cambios, agrega una nueva ficha o elimina la que ya no quieras mostrar.</p>
              </div>
            </div>
          </aside>
        </section>

        <section className="seccion-formulario" id="editor">
          <div className="seccion-cabecera">
            <div>
              <p className="kicker">Laboratorio</p>
              <h2 className="seccion-titulo">{editarId ? '✏️ Editar galleta' : '➕ Crear nueva galleta'}</h2>
            </div>
            <p className="seccion-descripcion">
              El formulario está pensado para crear fichas limpias y también para modificar lo ya publicado sin perder el foco visual.
            </p>
          </div>

          <div className="formulario formulario-editor">
            <div className="campo">
              <label>Nombre</label>
              <input type="text" placeholder="Ej: Choco Chip Clásica" value={nombre} onChange={(e) => setNombre(e.target.value)} />
            </div>
            <div className="campo">
              <label>Precio (CLP)</label>
              <input type="number" placeholder="Ej: 1990" value={precio} onChange={(e) => setPrecio(e.target.value)} />
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
                  <button className="btn-guardar" onClick={actualizarGalleta}>
                    💾 Guardar cambios
                  </button>
                  <button
                    className="btn-cancelar"
                    onClick={() => {
                      setEditarId(null);
                      limpiarFormulario();
                    }}
                  >
                    ✖ Cancelar
                  </button>
                </>
              ) : (
                <button className="btn-agregar" onClick={agregarGalleta}>
                  🍪 Agregar galleta
                </button>
              )}
            </div>
          </div>
        </section>

        <section className="seccion-catalogo">
          <div className="seccion-cabecera">
            <div>
              <p className="kicker">Catálogo vivo</p>
              <h2 className="seccion-titulo">Colección de galletas</h2>
            </div>
            <p className="seccion-descripcion">
              Cada tarjeta tiene acceso directo a editar, seleccionar o eliminar la galleta sin salir de la vista principal.
            </p>
          </div>

          {galletasFiltradas.length === 0 ? (
            <div className="catalogo-vacio">
              <p>No encontramos coincidencias con esos filtros. Prueba otra categoría o limpia la búsqueda.</p>
            </div>
          ) : (
            <div className="grid-galletas">
              {galletasFiltradas.map((galleta) => (
                <div
                  className={`card ${galletaActiva?.id === galleta.id ? 'card-activa' : ''}`}
                  key={galleta.id}
                  onClick={() => setGalletaActiva(galleta)}
                >
                  <div className="card-imagen-wrapper">
                    <img src={galleta.imagen} alt={galleta.nombre} className="card-imagen" />
                    <span className={`badge-categoria badge-${galleta.categoria.toLowerCase().replace(/\s+/g, '-')}`}>
                      {galleta.categoria}
                    </span>
                  </div>
                  <div className="card-cuerpo">
                    <h3 className="card-nombre">{galleta.nombre}</h3>
                    <p className="card-descripcion">{galleta.descripcion}</p>
                    <div className="card-meta">
                      <span className="card-precio">${Number(galleta.precio).toLocaleString('es-CL')}</span>
                      <span className={`card-stock ${galleta.stock === 0 ? 'sin-stock' : 'con-stock'}`}>
                        {galleta.stock === 0 ? 'Agotado' : `Stock: ${galleta.stock}`}
                      </span>
                    </div>
                    <div className="card-acciones">
                      <button
                        className="btn-editar"
                        onClick={(event) => {
                          event.stopPropagation();
                          cargarEdicion(galleta);
                        }}
                      >
                        ✏️ Editar
                      </button>
                      <button
                        className="btn-eliminar"
                        onClick={(event) => {
                          event.stopPropagation();
                          eliminarGalleta(galleta.id);
                        }}
                      >
                        🗑️ Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="footer">
        <p>🍪 Cookie Haven — Un catálogo más editorial, ágil y fácil de explorar</p>
      </footer>
    </div>
  );
}

export default App;