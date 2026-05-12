import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';
import { io } from 'socket.io-client';

// Conectar al WebSocket
const SOCKET_URL = process.env.REACT_APP_API_URL 
  ? process.env.REACT_APP_API_URL.replace('/api', '')
  : 'http://localhost:5000';

let socket;

export const TiendaContext = createContext();

export const TiendaProvider = ({ children }) => {
  const [tipos, setTipos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // Función para cargar datos del backend
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

  // Conectar WebSocket y escuchar cambios
  useEffect(() => {
    // Conectar Socket.io
    socket = io(SOCKET_URL, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5
    });

    socket.on('connect', () => {
      console.log('✅ WebSocket conectado');
    });

    socket.on('datos-actualizados', () => {
      console.log('🔄 Datos actualizados en el servidor, recargando...');
      cargarDatos(); // Recargar automáticamente cuando hay cambios
    });

    socket.on('disconnect', () => {
      console.log('❌ WebSocket desconectado');
    });

    // Cargar datos iniciales
    cargarDatos();

    // Limpiar al desmontar
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
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
      // No necesitas actualizar manualmente, el WebSocket lo hará
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
      await api.put(`/tipos/${id}`, { nombre: nuevoNombre, imagen: nuevaImagen });
      // El WebSocket actualizará automáticamente
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
      // El WebSocket actualizará automáticamente
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
      await api.post(`/tipos/${tipoId}/productos`, nuevoProducto);
      // El WebSocket actualizará automáticamente
    } catch (error) {
      console.error('Error creando producto:', error);
      setError(error.message);
      throw error;
    }
  };

  const editarProducto = async (tipoId, productoId, productoActualizado) => {
    try {
      console.log('Editando producto:', productoId);
      await api.put(`/tipos/${tipoId}/productos/${productoId}`, productoActualizado);
      // El WebSocket actualizará automáticamente
    } catch (error) {
      console.error('Error editando producto:', error);
      setError(error.message);
      throw error;
    }
  };

  const eliminarProducto = async (tipoId, productoId) => {
    try {
      console.log('Eliminando producto:', productoId);
      await api.delete(`/tipos/${tipoId}/productos/${productoId}`);
      // El WebSocket actualizará automáticamente
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