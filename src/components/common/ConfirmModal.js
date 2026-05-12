import React, { useEffect } from 'react';

const ConfirmModal = ({ title, message, subtitle, onConfirm, onCancel }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="confirm-modal-overlay" onClick={onCancel}>
      <div className="confirm-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="confirm-modal-icon">
          <span>🗑️</span>
        </div>
        <div className="confirm-modal-header">
          <h3>{title}</h3>
        </div>
        <div className="confirm-modal-body">
          <p className="confirm-message">{message}</p>
          {subtitle && <p className="confirm-subtitle">{subtitle}</p>}
        </div>
        <div className="confirm-modal-footer">
          <button className="confirm-btn-cancel" onClick={onCancel}>
            Cancelar
          </button>
          <button className="confirm-btn-confirm" onClick={onConfirm}>
            Sí, eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;