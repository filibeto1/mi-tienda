import React, { useState, useEffect } from 'react';
import ModalProductoDetalle from './ModalProductoDetalle';
import FiltrosProductos from './FiltrosProductos';

const ProductosPorTipo = ({ tipo, onRegresar, productoInicial }) => {
  const [productoSeleccionado, setProductoSeleccionado] = useState(productoInicial || null);
  const [productosFiltrados, setProductosFiltrados] = useState(tipo?.productos || []);

  useEffect(() => {
    if (productoInicial) {
      setProductoSeleccionado(productoInicial);
    }
  }, [productoInicial]);

  useEffect(() => {
    setProductosFiltrados(tipo?.productos || []);
  }, [tipo]);

  return (
    <div className="productos-por-tipo-container">
      <div className="header-productos">
        <button className="btn-regresar" onClick={onRegresar}>← Volver a categorías</button>
        <h2 className="titulo-categoria">📁 {tipo.nombre}</h2>
        <p className="contador-productos">{productosFiltrados.length} producto{productosFiltrados.length !== 1 ? 's' : ''}</p>
      </div>

      {tipo.productos.length > 0 && (
        <FiltrosProductos 
          productos={tipo.productos} 
          onFilterChange={setProductosFiltrados} 
        />
      )}

      <div className="productos-grid-tienda">
        {productosFiltrados.length === 0 ? (
          <div className="empty-productos">
            <p>✨ No hay productos que coincidan con los filtros</p>
            <p style={{ fontSize: '14px' }}>Prueba con otros criterios de búsqueda</p>
          </div>
        ) : (
          productosFiltrados.map(producto => (
            <div key={producto.id} className="producto-card-clickeable" onClick={() => setProductoSeleccionado(producto)}>
              <div className="producto-imagen-container">
                {producto.imagen ? (
                  <img src={producto.imagen} alt={producto.nombre} className="producto-imagen-tienda" />
                ) : (
                  <div className="producto-imagen-placeholder">📷 Sin imagen</div>
                )}
              </div>
              <div className="producto-info">
                <h3 className="producto-nombre-tienda">{producto.nombre}</h3>
                <p className="producto-marca-tienda">{producto.marca}</p>
                <div className="producto-precio-tienda">${producto.precio}</div>
                <div className="ver-detalle">👆 Haz clic para ver detalles</div>
              </div>
            </div>
          ))
        )}
      </div>

      {productoSeleccionado && (
        <ModalProductoDetalle 
          producto={productoSeleccionado}
          tipoId={tipo.id}
          tipoNombre={tipo.nombre}
          onClose={() => setProductoSeleccionado(null)}
        />
      )}
    </div>
  );
};

export default ProductosPorTipo;