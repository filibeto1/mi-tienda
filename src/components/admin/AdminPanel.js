import React, { useContext, useState } from 'react';
import { TiendaContext } from '../../context/TiendaContext';
import AdminProductosPorTipo from './AdminProductosPorTipo';
import Toast from '../common/Toast';
import ConfirmModal from '../common/ConfirmModal';
import EditTipoModal from '../common/EditTipoModal';
import CreateTipoModal from '../common/CreateTipoModal';
import ShareButton from '../common/ShareButton';
import '../../styles/admin.css';

const AdminPanel = ({ tipoInicial, productoInicial }) => {
  const { tipos, agregarTipo, editarTipo, eliminarTipo } = useContext(TiendaContext);
  const [tipoSeleccionado, setTipoSeleccionado] = useState(tipoInicial || null);
  const [toast, setToast] = useState(null);
  
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [tipoAEliminar, setTipoAEliminar] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [tipoAEditar, setTipoAEditar] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const mostrarToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleEliminarTipo = (tipo) => {
    setTipoAEliminar(tipo);
    setShowConfirmModal(true);
  };

  const confirmarEliminarTipo = () => {
    if (tipoAEliminar) {
      eliminarTipo(tipoAEliminar.id);
      setShowConfirmModal(false);
      setTipoAEliminar(null);
      mostrarToast(`Tipo "${tipoAEliminar.nombre}" eliminado correctamente`, 'success');
    }
  };

  const cancelarEliminarTipo = () => {
    setShowConfirmModal(false);
    setTipoAEliminar(null);
  };

  const handleEditarTipo = (tipo) => {
    setTipoAEditar(tipo);
    setShowEditModal(true);
  };

  const confirmarEditarTipo = (nuevoNombre, nuevaImagen) => {
    if (tipoAEditar && nuevoNombre) {
      editarTipo(tipoAEditar.id, nuevoNombre, nuevaImagen);
      setShowEditModal(false);
      setTipoAEditar(null);
      mostrarToast(`Tipo editado a "${nuevoNombre}"`, 'success');
    }
  };

  const cancelarEditarTipo = () => {
    setShowEditModal(false);
    setTipoAEditar(null);
  };

  const handleCrearTipo = () => {
    setShowCreateModal(true);
  };

  const confirmarCrearTipo = (nombre, imagen) => {
    if (nombre) {
      agregarTipo(nombre, imagen);
      setShowCreateModal(false);
      mostrarToast(`Tipo "${nombre}" creado correctamente`, 'success');
    }
  };

  const cancelarCrearTipo = () => {
    setShowCreateModal(false);
  };

  if (tipoSeleccionado) {
    return (
      <AdminProductosPorTipo 
        tipo={tipoSeleccionado} 
        onRegresar={() => {
          setTipoSeleccionado(null);
          const url = new URL(window.location);
          url.searchParams.delete('tipo');
          url.searchParams.delete('producto');
          window.history.pushState({}, '', url);
        }}
      />
    );
  }

  return (
    <div className="admin-container">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {showConfirmModal && (
        <ConfirmModal
          title="Eliminar tipo"
          message={`¿Estás seguro de que quieres eliminar "${tipoAEliminar?.nombre}"?`}
          subtitle={`Esto también eliminará TODOS sus ${tipoAEliminar?.productos?.length || 0} productos. Esta acción no se puede deshacer.`}
          onConfirm={confirmarEliminarTipo}
          onCancel={cancelarEliminarTipo}
        />
      )}

      {showEditModal && (
        <EditTipoModal
          tipo={tipoAEditar}
          onConfirm={confirmarEditarTipo}
          onCancel={cancelarEditarTipo}
        />
      )}

      {showCreateModal && (
        <CreateTipoModal
          onConfirm={confirmarCrearTipo}
          onCancel={cancelarCrearTipo}
        />
      )}

      <div className="admin-header">
        <h1>👑 Panel de Administración</h1>
        <p>Selecciona una categoría para gestionar sus productos</p>
      </div>
      
      <div className="tipos-botones-admin">
        {tipos.length === 0 ? (
          <div className="empty-state-admin">
            <p>📦 No hay tipos de productos creados</p>
            <button className="btn-crear-tipo-admin" onClick={handleCrearTipo}>
              ➕ Crear primer tipo
            </button>
          </div>
        ) : (
          <>
            <button className="btn-crear-tipo-admin-flotante" onClick={handleCrearTipo}>
              ➕ Crear nuevo tipo
            </button>
            
            <div className="tipos-botones-grid">
              {tipos.map(tipo => (
                <div key={tipo.id} className="tipo-card-admin">
                  <button
                    className="tipo-boton-admin"
                    onClick={() => setTipoSeleccionado(tipo)}
                    style={tipo.imagen ? {
                      backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.6)), url(${tipo.imagen})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat'
                    } : {}}
                  >
                    {!tipo.imagen && <span className="tipo-icono-admin">📁</span>}
                    <span className="tipo-nombre-admin">{tipo.nombre}</span>
                    <span className="tipo-cantidad-admin">{tipo.productos.length} productos</span>
                  </button>
                  <div className="tipo-card-acciones">
                    <button 
                      className="tipo-btn-editar"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditarTipo(tipo);
                      }}
                    >
                      ✏️ Editar
                    </button>
                    <button 
                      className="tipo-btn-eliminar"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEliminarTipo(tipo);
                      }}
                    >
                      🗑️ Eliminar
                    </button>
                    <ShareButton 
                      tipoId={tipo.id}
                      tipoNombre={tipo.nombre}
                      variant="icon"
                    />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;