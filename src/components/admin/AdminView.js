import React, { useContext } from 'react';
import { TiendaContext } from '../../context/TiendaContext';
import AdminProductosPorTipo from './AdminProductosPorTipo';

const AdminView = () => {
  const { tipos } = useContext(TiendaContext);
  const [tipoSeleccionado, setTipoSeleccionado] = React.useState(null);

  // Si hay un tipo seleccionado, mostrar sus productos con CRUD
  if (tipoSeleccionado) {
    return (
      <AdminProductosPorTipo 
        tipo={tipoSeleccionado} 
        onRegresar={() => setTipoSeleccionado(null)}
      />
    );
  }

  // Pantalla principal: mostrar tipos como botones
  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>👑 Panel de Administración</h1>
        <p>Selecciona una categoría para gestionar sus productos</p>
      </div>
      
      <div className="tipos-botones-admin">
        {tipos.length === 0 ? (
          <div className="empty-state-admin">
            <p>📦 No hay tipos de productos creados</p>
            <button 
              className="btn-crear-tipo-admin"
              onClick={() => {
                const nombre = prompt('Nombre del nuevo tipo:');
                if (nombre) {
                  const { agregarTipo } = useContext(TiendaContext);
                  agregarTipo(nombre);
                }
              }}
            >
              ➕ Crear primer tipo
            </button>
          </div>
        ) : (
          <>
            <button 
              className="btn-crear-tipo-admin-flotante"
              onClick={() => {
                const nombre = prompt('Nombre del nuevo tipo:');
                if (nombre && nombre.trim()) {
                  const { agregarTipo } = useContext(TiendaContext);
                  agregarTipo(nombre.trim());
                }
              }}
            >
              ➕ Crear nuevo tipo
            </button>
            
            <div className="tipos-botones-grid">
              {tipos.map(tipo => (
                <button
                  key={tipo.id}
                  className="tipo-boton-admin"
                  onClick={() => setTipoSeleccionado(tipo)}
                >
                  <span className="tipo-icono-admin">📁</span>
                  <span className="tipo-nombre-admin">{tipo.nombre}</span>
                  <span className="tipo-cantidad-admin">{tipo.productos.length} productos</span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminView;