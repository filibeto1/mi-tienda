import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const TiendaContext = createContext();

export const TiendaProvider = ({ children }) => {
  const [tipos, setTipos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // Cargar datos
  const cargarDatos = async () => {
    try {
      setCargando(true);
      setError(null);
      console.log('Cargando datos del backend...');
      const response = await api.get('/tipos');
      console.log('Datos cargados:', response.data);
      setTipos(response.data || []);
    } catch (error) {
      console.error('Error cargando datos:', error);
      setError(error.message);
      setTipos([]);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  // CRUD para Tipos
  const agregarTipo = async (nombre, imagen = null) => {
    const nuevoTipo = {
      id: Date.now().toString(),
      nombre,
      imagen,
      productos: []
    };
    
    try {
      console.log('Creando tipo:', nuevoTipo);
      const response = await api.post('/tipos', nuevoTipo);
      console.log('Tipo creado:', response.data);
      setTipos(prev => [...prev, response.data]);
      return response.data;
    } catch (error) {
      console.error('Error creando tipo:', error);
      setError(error.message);
      throw error;
    }
  };

  const editarTipo = async (id, nuevoNombre, nuevaImagen) => {
    try {
      console.log('Editando tipo:', id, nuevoNombre);
      const response = await api.put(`/tipos/${id}`, { nombre: nuevoNombre, imagen: nuevaImagen });
      setTipos(prev => prev.map(tipo => 
        tipo.id === id ? response.data : tipo
      ));
    } catch (error) {
      console.error('Error editando tipo:', error);
      setError(error.message);
      throw error;
    }
  };

  const eliminarTipo = async (id) => {
    try {
      console.log('Eliminando tipo:', id);
      await api.delete(`/tipos/${id}`);
      setTipos(prev => prev.filter(tipo => tipo.id !== id));
    } catch (error) {
      console.error('Error eliminando tipo:', error);
      setError(error.message);
      throw error;
    }
  };

  // CRUD para Productos
  const agregarProducto = async (tipoId, producto) => {
    const nuevoProducto = {
      ...producto,
      id: Date.now().toString()
    };
    
    try {
      console.log('Agregando producto:', nuevoProducto);
      const response = await api.post(`/tipos/${tipoId}/productos`, nuevoProducto);
      setTipos(prev => prev.map(tipo => 
        tipo.id === tipoId ? response.data : tipo
      ));
    } catch (error) {
      console.error('Error creando producto:', error);
      setError(error.message);
      throw error;
    }
  };

  const editarProducto = async (tipoId, productoId, productoActualizado) => {
    try {
      console.log('Editando producto:', productoId);
      const response = await api.put(`/tipos/${tipoId}/productos/${productoId}`, productoActualizado);
      setTipos(prev => prev.map(tipo => 
        tipo.id === tipoId ? response.data : tipo
      ));
    } catch (error) {
      console.error('Error editando producto:', error);
      setError(error.message);
      throw error;
    }
  };

  const eliminarProducto = async (tipoId, productoId) => {
    try {
      console.log('Eliminando producto:', productoId);
      const response = await api.delete(`/tipos/${tipoId}/productos/${productoId}`);
      setTipos(prev => prev.map(tipo => 
        tipo.id === tipoId ? response.data : tipo
      ));
    } catch (error) {
      console.error('Error eliminando producto:', error);
      setError(error.message);
      throw error;
    }
  };

  return (
    <TiendaContext.Provider value={{
      tipos,
      cargando,
      error,
      agregarTipo,
      editarTipo,
      eliminarTipo,
      agregarProducto,
      editarProducto,
      eliminarProducto,
      recargar: cargarDatos
    }}>
      {children}
    </TiendaContext.Provider>
  );
};