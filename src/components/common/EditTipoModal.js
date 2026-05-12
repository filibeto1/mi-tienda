import React, { useState, useEffect } from 'react';
import { compressImageFile } from '../../utils/compressImage';

const EditTipoModal = ({ tipo, onConfirm, onCancel }) => {
  const [nombre, setNombre] = useState(tipo?.nombre || '');
  const [imagen, setImagen] = useState(tipo?.imagen || null);
  const [imagenPreview, setImagenPreview] = useState(tipo?.imagen || null);
  const [comprimiendo, setComprimiendo] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleImagenChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setComprimiendo(true);
      try {
        const imagenComprimida = await compressImageFile(file, 400, 0.6);
        setImagen(imagenComprimida);
        setImagenPreview(imagenComprimida);
      } catch (error) {
        console.error('Error comprimiendo imagen:', error);
      } finally {
        setComprimiendo(false);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (nombre.trim()) {
      onConfirm(nombre.trim(), imagen);
    }
  };

  return (
    <div className="edit-modal-overlay" onClick={onCancel}>
      <div className="edit-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="edit-modal-header">
          <span className="edit-modal-icon">✏️</span>
          <h3>Editar tipo</h3>
          <button className="edit-modal-close" onClick={onCancel}>✕</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="edit-modal-body">
            <label className="edit-modal-label">Nombre del tipo</label>
            <input
              type="text"
              className="edit-modal-input"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Cachuchas, Playeras, Termos"
              autoFocus
            />
            
            <label className="edit-modal-label" style={{ marginTop: '15px' }}>Imagen del tipo</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImagenChange}
              style={{ width: '100%', padding: '8px', borderRadius: '5px', background: '#1a1a1a', border: '1px solid #333', color: 'white' }}
            />
            {comprimiendo && <div style={{ color: '#ffaa33', marginTop: '5px' }}>🔄 Comprimiendo imagen...</div>}
            {imagenPreview && !comprimiendo && (
              <div style={{ marginTop: '10px', textAlign: 'center' }}>
                <img src={imagenPreview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '150px', borderRadius: '8px' }} />
              </div>
            )}
          </div>
          
          <div className="edit-modal-footer">
            <button type="button" className="edit-btn-cancel" onClick={onCancel}>
              Cancelar
            </button>
            <button type="submit" className="edit-btn-confirm">
              Guardar cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTipoModal;