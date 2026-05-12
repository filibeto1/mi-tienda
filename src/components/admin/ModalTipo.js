import React, { useState, useContext } from 'react';
import { TiendaContext } from '../../context/TiendaContext';

const ModalTipo = ({ onClose }) => {
  const [nombre, setNombre] = useState('');
  const { agregarTipo } = useContext(TiendaContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (nombre.trim()) {
      agregarTipo(nombre.trim());
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Crear nuevo tipo</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nombre (ej: Cachuchas, Playeras)"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            autoFocus
          />
          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button type="submit" style={{ flex: 1, background: '#10b981', color: 'white', padding: '10px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
              Guardar
            </button>
            <button type="button" onClick={onClose} style={{ flex: 1, background: '#666', color: 'white', padding: '10px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalTipo;