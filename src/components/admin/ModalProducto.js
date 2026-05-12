import React, { useState, useContext, useEffect } from 'react';
import { TiendaContext } from '../../context/TiendaContext';
import { compressImageFile } from '../../utils/compressImage';

const ModalProducto = ({ tipo, productoEditando, onClose }) => {
  const { agregarProducto, editarProducto } = useContext(TiendaContext);
  
  const [formData, setFormData] = useState({
    nombre: productoEditando?.nombre || '',
    marca: productoEditando?.marca || '',
    precio: productoEditando?.precio || '',
    descripcion: productoEditando?.descripcion || '',
    tallasColores: productoEditando?.tallasColores || [{ talla: '', color: '', cantidad: 0 }],
    imagen: productoEditando?.imagen || null
  });
  
  const [imagenPreview, setImagenPreview] = useState(productoEditando?.imagen || null);
  const [comprimiendo, setComprimiendo] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleItemChange = (index, field, value) => {
    const nuevosItems = [...formData.tallasColores];
    nuevosItems[index][field] = value;
    setFormData({ ...formData, tallasColores: nuevosItems });
  };

  const agregarItem = () => {
    setFormData({
      ...formData,
      tallasColores: [...formData.tallasColores, { talla: '', color: '', cantidad: 0 }]
    });
  };

  const eliminarItem = (index) => {
    const nuevosItems = formData.tallasColores.filter((_, i) => i !== index);
    setFormData({ ...formData, tallasColores: nuevosItems });
  };

  const handleImagenChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setComprimiendo(true);
      try {
        // Comprimir imagen antes de guardar
        const imagenComprimida = await compressImageFile(file, 600, 0.6);
        setFormData({ ...formData, imagen: imagenComprimida });
        setImagenPreview(imagenComprimida);
      } catch (error) {
        console.error('Error comprimiendo imagen:', error);
      } finally {
        setComprimiendo(false);
      }
    }
  };

  const calcularStockTotal = () => {
    return formData.tallasColores.reduce((total, item) => total + (parseInt(item.cantidad) || 0), 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const stockTotal = calcularStockTotal();
    
    const productoData = {
      nombre: formData.nombre,
      marca: formData.marca,
      precio: parseFloat(formData.precio),
      stock: stockTotal,
      descripcion: formData.descripcion,
      tallasColores: formData.tallasColores.filter(item => item.talla && item.color && item.cantidad > 0),
      imagen: formData.imagen
    };

    if (productoEditando) {
      editarProducto(tipo.id, productoEditando.id, productoData);
    } else {
      agregarProducto(tipo.id, productoData);
    }
    
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '20px',
          borderBottom: '2px solid #ff6600',
          paddingBottom: '10px'
        }}>
          <h2 style={{ margin: 0, color: '#ff6600' }}>
            {productoEditando ? '✏️ Editar producto' : '➕ Nuevo producto'}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#aaa', fontSize: '24px', cursor: 'pointer' }}>✕</button>
        </div>
        
        <form onSubmit={handleSubmit} style={{ maxHeight: '70vh', overflowY: 'auto', paddingRight: '10px' }}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#ffaa33', fontWeight: 'bold' }}>Nombre del producto *</label>
            <input type="text" name="nombre" placeholder="Ej: Cachucha New Era" value={formData.nombre} onChange={handleInputChange} required style={{ width: '100%', padding: '10px', borderRadius: '5px', background: '#1a1a1a', border: '1px solid #333', color: 'white' }} />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#ffaa33', fontWeight: 'bold' }}>Marca *</label>
            <input type="text" name="marca" placeholder="Ej: Nike, Adidas, New Era" value={formData.marca} onChange={handleInputChange} required style={{ width: '100%', padding: '10px', borderRadius: '5px', background: '#1a1a1a', border: '1px solid #333', color: 'white' }} />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#ffaa33', fontWeight: 'bold' }}>Precio * ($)</label>
            <input type="number" name="precio" placeholder="0" value={formData.precio} onChange={handleInputChange} required style={{ width: '100%', padding: '10px', borderRadius: '5px', background: '#1a1a1a', border: '1px solid #333', color: 'white' }} />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#ffaa33', fontWeight: 'bold' }}>Tallas, Colores y Stock</label>
            {formData.tallasColores.map((item, index) => (
              <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'center' }}>
                <input
                  type="text"
                  placeholder="Talla (ej: S, M, L, XL)"
                  value={item.talla}
                  onChange={(e) => handleItemChange(index, 'talla', e.target.value)}
                  style={{ flex: 1, padding: '8px', borderRadius: '5px', background: '#1a1a1a', border: '1px solid #333', color: 'white' }}
                />
                <input
                  type="text"
                  placeholder="Color (ej: Negro, Rojo, Azul)"
                  value={item.color}
                  onChange={(e) => handleItemChange(index, 'color', e.target.value)}
                  style={{ flex: 1, padding: '8px', borderRadius: '5px', background: '#1a1a1a', border: '1px solid #333', color: 'white' }}
                />
                <input
                  type="number"
                  placeholder="Cantidad"
                  value={item.cantidad}
                  onChange={(e) => handleItemChange(index, 'cantidad', parseInt(e.target.value) || 0)}
                  style={{ width: '100px', padding: '8px', borderRadius: '5px', background: '#1a1a1a', border: '1px solid #333', color: 'white' }}
                />
                <button type="button" onClick={() => eliminarItem(index)} style={{ background: '#dc2626', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '5px', cursor: 'pointer' }}>🗑️</button>
              </div>
            ))}
            <button type="button" onClick={agregarItem} style={{ background: '#10b981', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer', marginTop: '5px' }}>+ Agregar talla/color</button>
            <div style={{ marginTop: '10px', color: '#66ff66', fontSize: '0.9rem' }}>📦 Stock total: {calcularStockTotal()} unidades</div>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#ffaa33', fontWeight: 'bold' }}>Descripción</label>
            <textarea name="descripcion" placeholder="Describe el producto..." value={formData.descripcion} onChange={handleInputChange} rows="3" style={{ width: '100%', padding: '10px', borderRadius: '5px', resize: 'vertical', background: '#1a1a1a', border: '1px solid #333', color: 'white' }} />
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#ffaa33', fontWeight: 'bold' }}>Imagen del producto</label>
            <input type="file" accept="image/*" onChange={handleImagenChange} style={{ width: '100%', padding: '8px', borderRadius: '5px', background: '#1a1a1a', border: '1px solid #333', color: 'white' }} />
            {comprimiendo && <div style={{ color: '#ffaa33', marginTop: '5px' }}>🔄 Comprimiendo imagen...</div>}
            {imagenPreview && !comprimiendo && (
              <div className="imagen-preview" style={{ marginTop: '10px' }}>
                <img src={imagenPreview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px' }} />
              </div>
            )}
          </div>
          
          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button type="submit" style={{ flex: 1, background: '#10b981', color: 'white', padding: '12px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}>💾 Guardar producto</button>
            <button type="button" onClick={onClose} style={{ flex: 1, background: '#666', color: 'white', padding: '12px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalProducto;