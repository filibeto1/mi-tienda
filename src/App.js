import React, { useState, useEffect, useContext } from 'react';
import { TiendaProvider, TiendaContext } from './context/TiendaContext';
import AdminPanel from './components/admin/AdminPanel';
import TiendaView from './components/tienda/TiendaView';
import './index.css';

const AppContent = () => {
  const { tipos, cargando } = useContext(TiendaContext);
  const [modo, setModo] = useState('tienda');
  const [tipoSeleccionadoId, setTipoSeleccionadoId] = useState(null);
  const [productoSeleccionadoId, setProductoSeleccionadoId] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const esAdmin = urlParams.get('admin') === 'true';
    const tipoId = urlParams.get('tipo');
    const productoId = urlParams.get('producto');
    
    setModo(esAdmin ? 'admin' : 'tienda');
    setTipoSeleccionadoId(tipoId);
    setProductoSeleccionadoId(productoId);
  }, []);

  if (cargando) {
    return (
      <div style={{
        background: 'linear-gradient(135deg, #0a0a0a, #1a1a1a)',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#ff6600',
        fontSize: '1.5rem'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🛍️</div>
          <p>Cargando tienda...</p>
        </div>
      </div>
    );
  }

  const esAdmin = modo === 'admin';
  const tipoSeleccionado = tipoSeleccionadoId ? tipos.find(t => t.id === tipoSeleccionadoId) : null;
  const productoSeleccionado = productoSeleccionadoId && tipoSeleccionado
    ? tipoSeleccionado.productos.find(p => p.id === productoSeleccionadoId)
    : null;

  const AdminHeader = () => (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      background: 'linear-gradient(135deg, #0a0a0a, #1a1a1a)',
      padding: '10px 20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      zIndex: 1000,
      borderBottom: '1px solid #ff6600'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <img 
          src="/AngelR.png"
          alt="Angel Rodriguez" 
          style={{
            width: '45px',
            height: '45px',
            borderRadius: '50%',
            objectFit: 'cover',
            border: '2px solid #ff6600'
          }}
          onError={(e) => e.target.src = 'https://via.placeholder.com/45?text=AR'}
        />
        <div>
          <h2 style={{ margin: 0, color: '#ff6600', fontSize: '1.2rem' }}>Angel Rodriguez</h2>
          <p style={{ margin: 0, color: '#888', fontSize: '0.8rem' }}>Administrador</p>
        </div>
      </div>
      
      <button 
        onClick={() => {
          const url = new URL(window.location);
          url.searchParams.delete('admin');
          url.searchParams.delete('tipo');
          url.searchParams.delete('producto');
          window.location.href = url.toString();
        }}
        style={{
          background: '#ff6600',
          color: 'white',
          border: 'none',
          padding: '8px 16px',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}
      >
        🛍️ Ver Tienda
      </button>
    </div>
  );

// Header para CLIENTE (con AR Tienda)
const ClienteHeader = () => (
  <div style={{
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    background: 'linear-gradient(135deg, #0a0a0a, #1a1a1a)',
    padding: '10px 20px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    borderBottom: '1px solid #ff6600'
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
      <img 
        src="/AngelR.png"
        alt="AR Tienda" 
        style={{
          width: '45px',
          height: '45px',
          borderRadius: '50%',
          objectFit: 'cover',
          border: '2px solid #ff6600'
        }}
        onError={(e) => {
          e.target.src = 'https://via.placeholder.com/45?text=AR';
        }}
      />
      <h1 style={{ margin: 0, color: '#ff6600', fontSize: '1.8rem' }}>AR Tienda</h1>
    </div>
  </div>
);

  return (
    <div>
      {esAdmin ? <AdminHeader /> : <ClienteHeader />}
      <div style={{ height: '70px' }}></div>
      
      {modo === 'admin' ? (
        <AdminPanel 
          tipoInicial={tipoSeleccionado}
          productoInicial={productoSeleccionado}
        />
      ) : (
        <TiendaView 
          tipoInicial={tipoSeleccionado}
          productoInicial={productoSeleccionado}
        />
      )}
    </div>
  );
};

function App() {
  return (
    <TiendaProvider>
      <AppContent />
    </TiendaProvider>
  );
}

export default App;