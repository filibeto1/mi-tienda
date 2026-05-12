import React from 'react';
import ProductoTienda from './ProductoTienda';

const TipoTienda = ({ tipo }) => {
  return (
    <div className="tipo-tienda-card">
      <h2>📁 {tipo.nombre}</h2>
      <div className="productos-tienda-grid">
        {tipo.productos.length === 0 ? (
          <div className="no-productos">Próximamente más productos...</div>
        ) : (
          tipo.productos.map(producto => (
            <ProductoTienda key={producto.id} producto={producto} />
          ))
        )}
      </div>
    </div>
  );
};

export default TipoTienda;