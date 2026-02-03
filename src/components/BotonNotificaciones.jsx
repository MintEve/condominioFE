import React, { useState, useEffect } from 'react';
import { echo } from '../lib/echo';

const BotonNotificaciones = () => {
    const [notificaciones, setNotificaciones] = useState([]);
    const [tieneNuevas, setTieneNuevas] = useState(false);
    const [mostrarMenu, setMostrarMenu] = useState(false);

    useEffect(() => {
        // Escuchamos el canal global
        const channel = echo.channel('notificaciones-globales');
        
        channel.listen('.NuevaNotificacion', (e) => {
            console.log("Nueva notificación recibida:", e.datos);
            setNotificaciones(prev => [e.datos, ...prev]);
            setTieneNuevas(true);
        });

        return () => channel.stopListening('.NuevaNotificacion');
    }, []);

    return (
        <div style={{ position: 'relative', display: 'inline-block' }}>
            {/* Botón que cambia de color si hay notificaciones */}
            <button 
                onClick={() => { setMostrarMenu(!mostrarMenu); setTieneNuevas(false); }}
                style={{
                    backgroundColor: tieneNuevas ? '#e74c3c' : '#2c3e50',
                    color: 'white',
                    padding: '10px 15px',
                    borderRadius: '50%',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '20px'
                }}
            >
                🔔 {tieneNuevas && <span style={{ fontSize: '12px' }}>●</span>}
            </button>

            {/* Menú desplegable de notificaciones */}
            {mostrarMenu && (
                <div style={{
                    position: 'absolute', right: 0, top: '50px', width: '250px',
                    backgroundColor: 'white', boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                    borderRadius: '8px', overflow: 'hidden', zIndex: 1000
                }}>
                    <div style={{ padding: '10px', background: '#f4f4f4', fontWeight: 'bold' }}>Notificaciones</div>
                    {notificaciones.length === 0 ? (
                        <p style={{ padding: '10px', color: '#999' }}>Sin notificaciones</p>
                    ) : (
                        notificaciones.map((n, i) => (
                            <div key={i} style={{ 
                                padding: '10px', borderBottom: '1px solid #eee', cursor: 'pointer',
                                hover: { background: '#f9f9f9' }
                            }}>
                                <strong style={{ fontSize: '0.9rem', color: '#333' }}>{n.tipo.toUpperCase()}</strong>
                                <p style={{ margin: 0, fontSize: '0.8rem' }}>{n.titulo}</p>
                                <small style={{ color: '#888' }}>{n.fecha}</small>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default BotonNotificaciones;