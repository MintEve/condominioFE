import React, { useEffect, useState, useRef } from 'react';
import { echo } from '../lib/echo'; 
import axios from 'axios';

const ChatCondominio = () => {
    const [mensajes, setMensajes] = useState([]);
    const [nuevoMensaje, setNuevoMensaje] = useState("");
    const deptoRef = useRef(null);

    if (!deptoRef.current) {
        deptoRef.current = prompt("¿Qué depto eres? (1 o 2)") || "1";
    }
    const myId = deptoRef.current;

    useEffect(() => {
        const channel = echo.channel(`chat-depa-${myId}`);
        
        // El punto antes de NuevoMensaje es CRUCIAL por el broadcastAs
        channel.listen('.NuevoMensaje', (e) => {
            setMensajes((prev) => [...prev, e.mensaje]);
        });

        return () => channel.stopListening('.NuevoMensaje');
    }, [myId]);

    const enviar = async (e) => {
        e.preventDefault();
        if (!nuevoMensaje.trim()) return;

        try {
            const res = await axios.post('http://127.0.0.1:8000/api/enviar-mensaje', {
                remitente: 1, 
                destinatario: 2,
                id_depaa: parseInt(myId),
                id_depab: myId === "1" ? 2 : 1, 
                mensaje: nuevoMensaje
            });
            // Agregamos el nuestro manualmente
            setMensajes((prev) => [...prev, res.data]);
            setNuevoMensaje(""); 
        } catch (err) {
            console.error(err);
        }
    };

return (
    <div style={{ 
        maxWidth: '500px', 
        margin: '20px auto', 
        fontFamily: 'Arial, sans-serif',
        height: '85vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#f0f2f5', // Gris claro de fondo
        borderRadius: '12px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
        overflow: 'hidden'
    }}>
        {/* Encabezado */}
        <div style={{ padding: '15px', backgroundColor: '#075e54', color: '#ffffff', textAlign: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Admin Condominio</h3>
            <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>Conectado como Depto: {myId}</span>
        </div>

        {/* Área de Mensajes */}
        <div style={{ 
            flex: 1, 
            padding: '20px', 
            overflowY: 'auto', 
            display: 'flex', 
            flexDirection: 'column',
            gap: '10px'
        }}>
            {mensajes.length === 0 && (
                <p style={{ textAlign: 'center', color: '#999', marginTop: '20px' }}>No hay mensajes aún...</p>
            )}
            
            {mensajes.map((m, i) => (
                <div key={i} style={{ 
                    alignSelf: m.id_depaa == myId ? 'flex-end' : 'flex-start',
                    maxWidth: '80%'
                }}>
                    <div style={{ 
                        backgroundColor: m.id_depaa == myId ? '#dcf8c6' : '#ffffff', 
                        color: '#333333', // Letras oscuras para que se vean bien
                        padding: '10px 14px', 
                        borderRadius: '12px',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                        fontSize: '0.95rem',
                        lineHeight: '1.4'
                    }}>
                        {/* Etiqueta del depto que envió */}
                        <div style={{ fontWeight: 'bold', fontSize: '0.7rem', color: '#075e54', marginBottom: '4px' }}>
                            Depto {m.id_depaa}
                        </div>
                        {m.mensaje}
                    </div>
                </div>
            ))}
        </div>

        {/* Barra de Entrada */}
        <form onSubmit={enviar} style={{ 
            padding: '15px', 
            backgroundColor: '#ffffff', 
            display: 'flex', 
            alignItems: 'center',
            gap: '10px',
            borderTop: '1px solid #ddd'
        }}>
            <input 
                type="text" 
                value={nuevoMensaje} 
                onChange={e => setNuevoMensaje(e.target.value)}
                placeholder="Escribir mensaje..."
                style={{ 
                    flex: 1, 
                    padding: '12px', 
                    borderRadius: '25px', 
                    border: '1px solid #ccc',
                    outline: 'none',
                    fontSize: '1rem',
                    color: '#000' // Texto negro al escribir
                }}
            />
            <button type="submit" style={{ 
                backgroundColor: '#128c7e', 
                color: 'white', 
                border: 'none', 
                padding: '12px 20px', 
                borderRadius: '25px', 
                fontWeight: 'bold',
                cursor: 'pointer'
            }}>
                Enviar
            </button>
        </form>
    </div>
);
};

export default ChatCondominio;