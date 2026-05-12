import React, { useState } from 'react';
import Toast from './Toast';

const ShareButton = ({ tipoId, productoId, tipoNombre, productoNombre, variant = 'icon' }) => {
  const [showToast, setShowToast] = useState(false);

  const generarUrlCompartir = () => {
    const baseUrl = window.location.origin;
    const params = new URLSearchParams();
    
    if (productoId) {
      // Compartir producto específico
      params.set('tipo', tipoId);
      params.set('producto', productoId);
    } else if (tipoId) {
      // Compartir tipo - muestra todos los productos de ese tipo
      params.set('tipo', tipoId);
    }
    
    return `${baseUrl}?${params.toString()}`;
  };

  const handleShare = async () => {
    const url = generarUrlCompartir();
    const texto = productoId 
      ? `📦 ${productoNombre} - ${tipoNombre}\nMira este producto: ${url}`
      : `📁 ${tipoNombre}\nMira todos los productos de esta categoría: ${url}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: productoId ? productoNombre : tipoNombre,
          text: `Mira ${productoId ? 'este producto' : 'esta categoría'} de Angel Rodriguez`,
          url: url,
        });
      } catch (error) {
        // Usuario canceló
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${texto}\n\nEnlace: ${url}`);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      } catch (err) {
        alert('No se pudo copiar el enlace');
      }
    }
  };

  return (
    <>
      {showToast && (
        <Toast 
          message="✅ Enlace copiado al portapapeles" 
          type="success" 
          onClose={() => setShowToast(false)} 
        />
      )}
      
      {variant === 'icon' ? (
        <button 
          className="share-btn-icon"
          onClick={handleShare}
          title="Compartir"
        >
          📤
        </button>
      ) : (
        <button 
          className="share-btn-full"
          onClick={handleShare}
        >
          📤 Compartir
        </button>
      )}
    </>
  );
};

export default ShareButton;