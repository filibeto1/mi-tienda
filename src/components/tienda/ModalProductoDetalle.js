import React, { useEffect } from 'react';

const ModalProductoDetalle = ({ producto, tipoId, tipoNombre, onClose }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const obtenerColorHex = (colorNombre) => {
    const colores = {
      'negro': '#000000',
      'blanco': '#FFFFFF',
      'rojo': '#FF0000',
      'azul': '#0000FF',
      'verde': '#00FF00',
      'amarillo': '#FFFF00',
      'naranja': '#FFA500',
      'morado': '#800080',
      'rosa': '#FFC0CB',
      'gris': '#808080',
      'cafe': '#8B4513',
      'beige': '#F5F5DC',
      'plateado': '#C0C0C0',
      'dorado': '#FFD700'
    };
    return colores[colorNombre?.toLowerCase()] || '#ff6600';
  };

  return (
    <div className="modal-detalle-overlay" onClick={onClose}>
      <div className="modal-detalle-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-detalle-close" onClick={onClose}>✕</button>
        
        <div className="modal-detalle-grid">
          <div className="modal-detalle-imagen">
            {producto.imagen ? (
              <img src={producto.imagen} alt={producto.nombre} />
            ) : (
              <div className="no-imagen-grande">📷 Sin imagen disponible</div>
            )}
          </div>
          
          <div className="modal-detalle-info">
            <h2 className="detalle-nombre">{producto.nombre}</h2>
            <p className="detalle-marca">Marca: {producto.marca}</p>
            
            <div className="detalle-precio-stock">
              <div className="detalle-precio">${producto.precio}</div>
              <div className={`detalle-stock ${producto.stock > 0 ? 'stock-positivo' : 'stock-negativo'}`}>
                {producto.stock > 0 ? `📦 Stock total: ${producto.stock} unidades` : '❌ Producto agotado'}
              </div>
            </div>
            
            {/* Mostrar tallas con colores detalladas */}
            {producto.tallasColores && producto.tallasColores.length > 0 && (
              <div className="detalle-seccion">
                <h3>📏 Tallas y colores disponibles</h3>
                <div className="tallas-detalle">
                  {producto.tallasColores.map((item, idx) => (
                    <div key={idx} className="talla-detalle-item">
                      <span className="talla-nombre">{item.talla}</span>
                      <div className="talla-color-muestra" style={{ backgroundColor: obtenerColorHex(item.color), width: '25px', height: '25px', borderRadius: '50%', border: '1px solid #fff' }}></div>
                      <span className="talla-color-nombre">{item.color}</span>
                      <span className="talla-cantidad">{item.cantidad} unidades</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {producto.descripcion && (
              <div className="detalle-seccion">
                <h3>📝 Descripción</h3>
                <p>{producto.descripcion}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalProductoDetalle;