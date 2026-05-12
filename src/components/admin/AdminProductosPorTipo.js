import React, { useState, useContext, useEffect } from 'react';
import { TiendaContext } from '../../context/TiendaContext';
import ModalProducto from './ModalProducto';
import Toast from '../common/Toast';
import ConfirmModal from '../common/ConfirmModal';
import EditTipoModal from '../common/EditTipoModal';
import ShareButton from '../common/ShareButton';

const AdminProductosPorTipo = ({ tipo, onRegresar }) => {
  const { editarTipo, eliminarTipo, eliminarProducto, tipos } = useContext(TiendaContext);
  const [showProductoModal, setShowProductoModal] = useState(false);
  const [productoEditando, setProductoEditando] = useState(null);
  const [toast, setToast] = useState(null);
  
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [productoAEliminar, setProductoAEliminar] = useState(null);
  
  const [showEditTipoModal, setShowEditTipoModal] = useState(false);
  
  const tipoActualizado = tipos.find(t => t.id === tipo.id);

  const mostrarToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleEditarTipo = () => {
    setShowEditTipoModal(true);
  };

  const confirmarEditarTipo = (nuevoNombre) => {
    if (nuevoNombre && nuevoNombre.trim()) {
      editarTipo(tipo.id, nuevoNombre.trim());
      setShowEditTipoModal(false);
      mostrarToast(`Tipo editado a "${nuevoNombre}"`, 'success');
    }
  };

  const handleEliminarTipo = () => {
    eliminarTipo(tipo.id);
    mostrarToast(`Tipo "${tipo.nombre}" eliminado correctamente`, 'success');
    onRegresar();
  };

  const handleEliminarProducto = (producto) => {
    setProductoAEliminar(producto);
    setShowConfirmModal(true);
  };

  const confirmarEliminarProducto = () => {
    if (productoAEliminar) {
      eliminarProducto(tipo.id, productoAEliminar.id);
      setShowConfirmModal(false);
      setProductoAEliminar(null);
      mostrarToast(`"${productoAEliminar.nombre}" eliminado correctamente`, 'success');
    }
  };

  useEffect(() => {
    if (!tipoActualizado && tipo) {
      onRegresar();
    }
  }, [tipoActualizado, tipo, onRegresar]);

  return (
    <div className="admin-productos-container">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {showConfirmModal && (
        <ConfirmModal
          title="Eliminar producto"
          message={`¿Estás seguro de que quieres eliminar "${productoAEliminar?.nombre}"?`}
          subtitle="Esta acción no se puede deshacer."
          onConfirm={confirmarEliminarProducto}
          onCancel={() => setShowConfirmModal(false)}
        />
      )}

      {showEditTipoModal && (
        <EditTipoModal
          tipo={tipo}
          onConfirm={confirmarEditarTipo}
          onCancel={() => setShowEditTipoModal(false)}
        />
      )}
      
      <div className="admin-productos-header">
        <button className="btn-regresar-admin" onClick={onRegresar}>
          ← Volver a tipos
        </button>
        
        <div className="header-info">
          <h2 className="titulo-categoria-admin">📁 {tipoActualizado?.nombre || tipo.nombre}</h2>
          <div className="tipo-acciones">
            <button className="btn-editar-tipo-admin" onClick={handleEditarTipo}>
              ✏️ Editar tipo
            </button>
            <button className="btn-eliminar-tipo-admin" onClick={handleEliminarTipo}>
              🗑️ Eliminar tipo
            </button>
          </div>
        </div>
        
        <p className="contador-productos-admin">
          {tipoActualizado?.productos?.length || 0} producto{tipoActualizado?.productos?.length !== 1 ? 's' : ''} en total
        </p>
      </div>

      <div className="agregar-producto-container">
        <button 
          className="btn-agregar-producto-admin"
          onClick={() => {
            setProductoEditando(null);
            setShowProductoModal(true);
          }}
        >
          ➕ Agregar nuevo producto
        </button>
      </div>

      {!tipoActualizado || tipoActualizado.productos.length === 0 ? (
        <div className="empty-productos-admin">
          <p>✨ No hay productos en esta categoría</p>
          <p style={{ fontSize: '14px', marginTop: '10px' }}>Haz clic en "Agregar nuevo producto" para comenzar</p>
        </div>
      ) : (
        <div className="productos-crud-grid">
          {tipoActualizado.productos.map(producto => (
            <div key={producto.id} className="producto-crud-card">
              <div className="producto-crud-imagen">
                {producto.imagen ? (
                  <img src={producto.imagen} alt={producto.nombre} />
                ) : (
                  <div className="no-imagen-crud">📷</div>
                )}
              </div>
              
              <div className="producto-crud-info">
                <h3 className="producto-crud-nombre">{producto.nombre}</h3>
                <p className="producto-crud-marca">{producto.marca}</p>
                <div className="producto-crud-precio">💰 ${producto.precio}</div>
                <div className="producto-crud-stock">📦 Stock: {producto.stock}</div>
                {producto.descripcion && (
                  <div className="producto-crud-descripcion">{producto.descripcion}</div>
                )}
                <div className="producto-crud-detalles">
                  {producto.color && <span>🎨 {producto.color}</span>}
                  {producto.talla && <span>📏 {producto.talla}</span>}
                </div>
              </div>
              
              <div className="producto-crud-acciones">
                <button 
                  className="btn-editar-producto-admin"
                  onClick={() => {
                    setProductoEditando(producto);
                    setShowProductoModal(true);
                  }}
                >
                  ✏️ Editar
                </button>
                <button 
                  className="btn-eliminar-producto-admin"
                  onClick={() => handleEliminarProducto(producto)}
                >
                  🗑️ Eliminar
                </button>
                <ShareButton 
                  tipoId={tipo.id}
                  productoId={producto.id}
                  tipoNombre={tipo.nombre}
                  productoNombre={producto.nombre}
                  variant="icon"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {showProductoModal && (
        <ModalProducto
          tipo={tipo}
          productoEditando={productoEditando}
          onClose={() => {
            setShowProductoModal(false);
            setProductoEditando(null);
          }}
        />
      )}
    </div>
  );
};

export default AdminProductosPorTipo;