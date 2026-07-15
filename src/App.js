import './App.css';
import { useEffect, useMemo, useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Producto from './components/Producto';
import TablaProductos from './components/TablaProductos';
import FormularioProducto from './components/FormularioProducto';
import Alert from './components/Alert';
import Confirm from './components/Confirm';

function App() {
  const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:3002';
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
  const [formErrors, setFormErrors] = useState([]);
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [confirm, setConfirm] = useState({ visible: false, id: null, name: null });

  const showAlert = (message, type = 'success') => {
    setAlert({ type, message });
    setTimeout(() => setAlert({ type: '', message: '' }), 4000);
  };
  const [busqueda, setBusqueda] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('Todas');
  const [filtroStock, setFiltroStock] = useState('Todas');
  const [orden, setOrden] = useState('destacadas');
  const [galletaActiva, setGalletaActiva] = useState(null);

  useEffect(() => {
    localStorage.setItem('galletas', JSON.stringify(galletas));
  }, [galletas]);

  // Cargar desde backend (si está disponible)
  useEffect(() => {
    const cargar = async () => {
      try {
        const res = await fetch(`${API_BASE}/productos`);
        if (!res.ok) throw new Error('No se pudo obtener productos');
        const data = await res.json();
        setGalletas(data.map((p) => ({ ...p, precio: String(p.precio) })));
      } catch (err) {
        console.warn('Backend no disponible, usando datos locales');
      }
    };
    cargar();
  }, [API_BASE]);

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
    setFormErrors([]);
  };
  const agregarGalleta = () => {
    const clientErrors = [];
    if (!nombre) clientErrors.push('nombre vacío');
    if (!categoria) clientErrors.push('categoría vacía');
    if (!precio || Number(precio) <= 0) clientErrors.push('precio inválido');
    if (stock === '' || !Number.isInteger(Number(stock)) || Number(stock) < 0) clientErrors.push('stock inválido');
    if (clientErrors.length) {
      setFormErrors(clientErrors);
      return;
    }

    const payload = {
      nombre,
      descripcion,
      categoria,
      precio: Number(precio),
      stock: Number(stock),
      imagen: imagen || 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=300&fit=crop',
    };

    setFormErrors([]);
    fetch(`${API_BASE}/productos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then((r) => {
        if (!r.ok) return r.json().then((e) => Promise.reject(e));
        return r.json();
      })
      .then((nuevo) => {
        setGalletas([...galletas, { ...nuevo, precio: String(nuevo.precio) }]);
        setGalletaActiva(nuevo);
        limpiarFormulario();
        showAlert('Galleta creada correctamente', 'success');
      })
      .catch((err) => {
        const msgs = err?.errors || [err.message || 'Error al crear en el servidor'];
        setFormErrors(msgs);
      });
  };

  const solicitarEliminarGalleta = (producto) => {
    setConfirm({ visible: true, id: producto.id, name: producto.nombre });
  };

  const realizarEliminarGalleta = (id) => {
    setConfirm({ visible: false, id: null, name: null });
    fetch(`${API_BASE}/productos/${id}`, { method: 'DELETE' })
      .then((r) => {
        if (!r.ok) return r.json().then((e) => Promise.reject(e));
        return r.json();
      })
      .then(() => {
        setGalletas(galletas.filter((galleta) => galleta.id !== id));

        if (galletaActiva?.id === id) {
          setGalletaActiva(null);
        }

        if (editarId === id) {
          setEditarId(null);
          limpiarFormulario();
        }
        showAlert('Galleta eliminada', 'success');
      })
      .catch((err) => showAlert('Error al eliminar: ' + (err?.error || err.message || err), 'error'));
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
    setFormErrors([]);
  };

  const actualizarGalleta = () => {
    const clientErrors = [];
    if (!nombre) clientErrors.push('nombre vacío');
    if (!categoria) clientErrors.push('categoría vacía');
    if (!precio || Number(precio) <= 0) clientErrors.push('precio inválido');
    if (stock === '' || !Number.isInteger(Number(stock)) || Number(stock) < 0) clientErrors.push('stock inválido');
    if (clientErrors.length) {
      setFormErrors(clientErrors);
      return;
    }
    const imagenFinal = imagen || imagenPreview;
    const payload = {
      nombre,
      descripcion,
      categoria,
      precio: Number(precio),
      stock: Number(stock),
      imagen: imagenFinal,
    };

    setFormErrors([]);
    fetch(`${API_BASE}/productos/${editarId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then((r) => {
        if (!r.ok) return r.json().then((e) => Promise.reject(e));
        return r.json();
      })
      .then((actualizado) => {
        setGalletas(
          galletas.map((galleta) => (galleta.id === actualizado.id ? { ...actualizado, precio: String(actualizado.precio) } : galleta)),
        );
        setGalletaActiva(actualizado);
        setEditarId(null);
        limpiarFormulario();
        showAlert('Galleta actualizada', 'success');
      })
      .catch((err) => {
        const msgs = err?.errors || [err.message || 'Error al actualizar en el servidor'];
        setFormErrors(msgs);
      });
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
      <Navbar totalCount={galletas.length} categoriasCount={categoriasActivas} />
      <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ type: '', message: '' })} />
      <Confirm
        visible={confirm.visible}
        title="Confirmar eliminación"
        message={confirm.name ? `¿Deseas eliminar "${confirm.name}"? Esta acción no se puede deshacer.` : '¿Deseas eliminar esta galleta? Esta acción no se puede deshacer.'}
        onConfirm={() => realizarEliminarGalleta(confirm.id)}
        onCancel={() => setConfirm({ visible: false, id: null, name: null })}
      />

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

            <Producto producto={galletaDestacada} onEdit={cargarEdicion} onDelete={solicitarEliminarGalleta} onSelect={setGalletaActiva} />
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
                <p>Abre una ficha para verla destacada y entra a editarla.</p>
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

          <FormularioProducto
            editarId={editarId}
            nombre={nombre}
            setNombre={setNombre}
            descripcion={descripcion}
            setDescripcion={setDescripcion}
            precio={precio}
            setPrecio={setPrecio}
            categoria={categoria}
            setCategoria={setCategoria}
            stock={stock}
            setStock={setStock}
            manejarImagen={manejarImagen}
            imagenPreview={imagenPreview}
            errorImagen={errorImagen}
            formErrors={formErrors}
            onAdd={agregarGalleta}
            onUpdate={actualizarGalleta}
            onCancel={() => {
              setEditarId(null);
              limpiarFormulario();
            }}
          />
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

        <div className="seccion-catalogo">
          <TablaProductos productos={galletasFiltradas} onEdit={cargarEdicion} onDelete={solicitarEliminarGalleta} onSelect={setGalletaActiva} />
        </div>
        
        
        
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default App;