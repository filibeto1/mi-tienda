import React, { useContext, useState, useEffect } from 'react';
import { TiendaContext } from '../../context/TiendaContext';
import ProductosPorTipo from './ProductosPorTipo';
import '../../styles/tienda.css';

const TiendaView = ({ tipoInicial, productoInicial }) => {
  const { tipos } = useContext(TiendaContext);
  const [tipoSeleccionado, setTipoSeleccionado] = useState(null);
  const [productoSeleccionadoDirecto, setProductoSeleccionadoDirecto] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (tipos.length > 0) {
      // Si hay un tipoInicial, seleccionarlo automáticamente
      if (tipoInicial) {
        const tipoEncontrado = tipos.find(t => t.id === tipoInicial.id);
        if (tipoEncontrado) {
          setTipoSeleccionado(tipoEncontrado);
          
          // Si también hay un producto inicial
          if (productoInicial) {
            const productoEncontrado = tipoEncontrado.productos.find(p => p.id === productoInicial.id);
            if (productoEncontrado) {
              setProductoSeleccionadoDirecto(productoEncontrado);
            }
          }
        }
      }
      setCargando(false);
    }
  }, [tipos, tipoInicial, productoInicial]);

  // Si está cargando
  if (cargando) {
    return (
      <div className="tienda-container">
        <div className="tienda-header">
          <h1>Angel Rodriguez</h1>
          <p>Cargando...</p>
        </div>
      </div>
    );
  }

  // Si hay un tipo seleccionado, mostrar sus productos
  if (tipoSeleccionado) {
    return (
      <ProductosPorTipo 
        tipo={tipoSeleccionado} 
        onRegresar={() => {
          setTipoSeleccionado(null);
          setProductoSeleccionadoDirecto(null);
          // Limpiar URL
          const url = new URL(window.location);
          url.searchParams.delete('tipo');
          url.searchParams.delete('producto');
          window.history.pushState({}, '', url);
        }}
        productoInicial={productoSeleccionadoDirecto}
      />
    );
  }

  // Pantalla principal: mostrar tipos como botones
  return (
    <div className="tienda-container">
      <div className="tienda-header">
        <h1>Angel Rodriguez</h1>
        <p>Selecciona una categoría para ver los productos</p>
      </div>
      
      <div className="tipos-botones-container">
        {tipos.length === 0 ? (
          <div className="empty-state">
            <p>📦 No hay productos disponibles</p>
            <p style={{ fontSize: '14px', marginTop: '10px' }}>Vuelve más tarde</p>
          </div>
        ) : (
          tipos.map(tipo => (
            <button
              key={tipo.id}
              className="tipo-boton-cliente"
              onClick={() => setTipoSeleccionado(tipo)}
              style={tipo.imagen ? {
                backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.7)), url(${tipo.imagen})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              } : {}}
            >
              {!tipo.imagen && <span className="tipo-icono-cliente">📁</span>}
              <span className="tipo-nombre-cliente">{tipo.nombre}</span>
              <span className="tipo-cantidad-cliente">{tipo.productos.length} productos</span>
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default TiendaView;