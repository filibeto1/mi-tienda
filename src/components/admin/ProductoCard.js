import React from 'react';
import ShareButton from '../common/ShareButton';

const ProductoCard = ({ producto, tipoId, tipoNombre, onEditar, onEliminar }) => {
  return (
    <div style={{
      background: '#0a0a0a',
      padding: '12px',
      borderRadius: '8px',
      border: '1px solid #333',
      transition: 'all 0.2s'
    }}>
      {producto.imagen && (
        <img 
          src={producto.imagen} 
          alt={producto.nombre}
          style={{ 
            width: '100%', 
            height: '150px', 
            objectFit: 'cover', 
            borderRadius: '8px', 
            marginBottom: '10px',
            background: '#1a1a1a'
          }}
        />
      )}
      <div style={{ fontWeight: 'bold', color: '#ffaa33', fontSize: '1rem' }}>{producto.nombre}</div>
      <div style={{ color: '#888', fontSize: '0.85rem', marginTop: '4px' }}>{producto.marca}</div>
      <div style={{ color: '#ff6600', fontSize: '1.3rem', fontWeight: 'bold', margin: '8px 0' }}>
        ${producto.precio}
      </div>
      <div style={{ color: '#66ff66', fontSize: '0.8rem', marginBottom: '8px' }}>
        📦 Stock: {producto.stock}
      </div>
      
      <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
        <button 
          onClick={onEditar} 
          style={{ 
            flex: 1, 
            background: '#3b82f6', 
            color: 'white', 
            border: 'none', 
            padding: '6px', 
            borderRadius: '5px', 
            cursor: 'pointer',
            fontSize: '0.85rem'
          }}
        >
          ✏️ Editar
        </button>
        <button 
          onClick={onEliminar} 
          style={{ 
            flex: 1, 
            background: '#dc2626', 
            color: 'white', 
            border: 'none', 
            padding: '6px', 
            borderRadius: '5px', 
            cursor: 'pointer',
            fontSize: '0.85rem'
          }}
        >
          🗑️ Eliminar
        </button>
        <ShareButton 
          tipoId={tipoId}
          productoId={producto.id}
          tipoNombre={tipoNombre}
          productoNombre={producto.nombre}
          variant="icon"
        />
      </div>
    </div>
  );
};

export default ProductoCard;