import React, { useContext } from 'react';
import { TiendaContext } from '../../context/TiendaContext';
import TipoCard from './TipoCard';

const TipoList = () => {
  const { tipos } = useContext(TiendaContext);

  if (tipos.length === 0) {
    return (
      <div style={{ textAlign: 'center', color: '#888', padding: '50px' }}>
        ✨ No hay tipos creados. Haz clic en "Crear nuevo tipo" para empezar
      </div>
    );
  }

  return (
    <div className="tipos-grid">
      {tipos.map(tipo => (
        <TipoCard key={tipo.id} tipo={tipo} />
      ))}
    </div>
  );
};

export default TipoList;