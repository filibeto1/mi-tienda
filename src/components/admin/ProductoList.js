import React, { useContext } from 'react';
import { TiendaContext } from '../../context/TiendaContext';
import ProductoCard from './ProductoCard';

const ProductoList = ({ tipo, onEditarProducto }) => {
  const { eliminarProducto } = useContext(TiendaContext);

  if (tipo.productos.length === 0) {
    return <div className="no-productos">📦 Sin productos aún</div>;
  }

  return (
    <div className="productos-grid">
      {tipo.productos.map(producto => (
        <ProductoCard
          key={producto.id}
          producto={producto}
          tipoId={tipo.id}
          onEditar={() => onEditarProducto(producto)}
          onEliminar={() => eliminarProducto(tipo.id, producto.id)}
        />
      ))}
    </div>
  );
};

export default ProductoList;