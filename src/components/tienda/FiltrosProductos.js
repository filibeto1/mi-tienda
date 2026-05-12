import React, { useState, useEffect } from 'react';

const FiltrosProductos = ({ productos, onFilterChange }) => {
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    let filtrados = [...productos];

    // Buscar por nombre
    if (searchTerm) {
      filtrados = filtrados.filter(p =>
        p.nombre.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    onFilterChange(filtrados);
  }, [searchTerm, productos, onFilterChange]);

  const limpiarFiltros = () => {
    setSearchTerm('');
    onFilterChange(productos);
  };

  return (
    <div className="filtros-container">
      <div className="filtros-fila">
        <div className="filtro-busqueda">
          <span className="filtro-icono">🔍</span>
          <input
            type="text"
            placeholder="Buscar producto por nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="filtro-input"
          />
        </div>

        <button onClick={limpiarFiltros} className="btn-limpiar">
          🧹 Limpiar búsqueda
        </button>
      </div>
    </div>
  );
};

export default FiltrosProductos;