import React, { useState, useContext } from 'react';
import { TiendaContext } from '../../context/TiendaContext';
import ProductoList from './ProductoList';
import ModalProducto from './ModalProducto';

const TipoCard = ({ tipo }) => {
  const { editarTipo, eliminarTipo } = useContext(TiendaContext);
  const [showProductoModal, setShowProductoModal] = useState(false);
  const [editandoProducto, setEditandoProducto] = useState(null);

  const handleEditarTipo = () => {
    const nuevoNombre = prompt('Editar nombre:', tipo.nombre);
    if (nuevoNombre && nuevoNombre.trim()) {
      editarTipo(tipo.id, nuevoNombre.trim());
    }
  };

  return (
    <div className="tipo-card">
      <div className="tipo-header">
        <h2>📁 {tipo.nombre}</h2>
        <div>
          <button className="btn-icon warning" onClick={handleEditarTipo}>
            ✏️
          </button>
          <button className="btn-icon danger" onClick={() => eliminarTipo(tipo.id)}>
            🗑️
          </button>
        </div>
      </div>
      
      <button 
        className="btn-agregar"
        onClick={() => {
          setEditandoProducto(null);
          setShowProductoModal(true);
        }}
      >
        ➕ Agregar producto
      </button>
      
      <ProductoList 
        tipo={tipo} 
        onEditarProducto={(producto) => {
          setEditandoProducto(producto);
          setShowProductoModal(true);
        }}
      />
      
      {showProductoModal && (
        <ModalProducto
          tipo={tipo}
          productoEditando={editandoProducto}
          onClose={() => {
            setShowProductoModal(false);
            setEditandoProducto(null);
          }}
        />
      )}
    </div>
  );
};

export default TipoCard;