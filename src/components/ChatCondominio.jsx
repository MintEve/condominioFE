import React, { useEffect, useState, useRef } from 'react';
import { echo } from '../lib/echo'; 
import axios from 'axios';
import { CSSTransition } from 'react-transition-group';
// Asegúrate de que este archivo exista en la misma carpeta
import './transitions.css'; 

const ChatCondominio = () => {
    // --- ESTADOS ---
    const [mensajes, setMensajes] = useState([]);
    const [nuevoMensaje, setNuevoMensaje] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState(null);
    
    // --- IDENTIDAD DEL USUARIO ---
    const deptoRef = useRef(null);
    if (!deptoRef.current) {
        deptoRef.current = prompt("¿Qué depto eres? (1 o 2)") || "1";
    }
    const myId = deptoRef.current;

    // --- ESCUCHAR WEBSOCKETS ---
    useEffect(() => {
        const channel = echo.channel(`chat-depa-${myId}`);
        
        channel.listen('.NuevoMensaje', (e) => {
            console.log("Mensaje recibido por WS:", e);
            // Solo agregamos si el mensaje no es nuestro (para no duplicar)
            setMensajes((prev) => [...prev, e.mensaje]);
        });

        return () => channel.stopListening('.NuevoMensaje');
    }, [myId]);

    // --- FUNCIÓN ENVIAR (Petición HTTP) ---
    const enviar = async (e) => {
        e.preventDefault();
        if (!nuevoMensaje.trim() || isLoading) return;

        setIsLoading(true); // Inicia transición de carga

        try {
            const res = await axios.post('http://127.0.0.1:8000/api/enviar-mensaje', {
                remitente: 1, 
                destinatario: 2,
                id_depaa: parseInt(myId),
                id_depab: myId === "1" ? 2 : 1, 
                mensaje: nuevoMensaje
            });
            
            // Agregamos nuestro mensaje a la lista local
            setMensajes((prev) => [...prev, res.data]);
            setNuevoMensaje(""); 
            
            // Éxito: Activamos alerta
            setStatusMessage("¡Mensaje enviado!");
        } catch (err) {
            console.error("Error al enviar:", err);
            setStatusMessage("Error de conexión");
        } finally {
            setIsLoading(false); // Termina carga
            // Quitamos la alerta después de 2.5 segundos
            setTimeout(() => setStatusMessage(null), 2500);
        }
    };

    return (
        <div style={{ position: 'relative', maxWidth: '500px', margin: '40px auto' }}>
            
            {/* 1. ALERTA CON TRANSICIÓN */}
            <CSSTransition
                in={statusMessage !== null}
                timeout={300}
                classNames="alert"
                unmountOnExit
            >
                <div style={{
                    position: 'absolute', top: '-50px', left: '0', right: '0',
                    padding: '10px', borderRadius: '8px', textAlign: 'center',
                    backgroundColor: statusMessage === "¡Mensaje enviado!" ? '#2ecc71' : '#e74c3c',
                    color: 'white', fontWeight: 'bold', zIndex: 100,
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}>
                    {statusMessage}
                </div>
            </CSSTransition>

            {/* 2. CONTENEDOR DEL CHAT */}
            <div style={{ 
                fontFamily: 'Arial, sans-serif', height: '75vh', display: 'flex', 
                flexDirection: 'column', backgroundColor: '#f0f2f5', borderRadius: '12px', 
                boxShadow: '0 4px 15px rgba(0,0,0,0.15)', overflow: 'hidden' 
            }}>
                
                {/* Header */}
                <div style={{ padding: '15px', backgroundColor: '#075e54', color: '#ffffff', textAlign: 'center' }}>
                    <h3 style={{ margin: 0 }}>Chat Departamento {myId}</h3>
                </div>

                {/* Mensajes */}
                <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {mensajes.map((m, i) => (
                        <div key={i} style={{ alignSelf: m.id_depaa == myId ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
                            <div style={{ 
                                backgroundColor: m.id_depaa == myId ? '#dcf8c6' : '#ffffff', 
                                color: '#333', padding: '10px 14px', borderRadius: '12px',
                                boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                            }}>
                                <small style={{ display: 'block', fontSize: '0.7rem', color: '#075e54', marginBottom: '3px' }}>
                                    Depto {m.id_depaa}
                                </small>
                                {m.mensaje}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Formulario */}
                <form onSubmit={enviar} style={{ padding: '15px', backgroundColor: '#fff', display: 'flex', gap: '10px', borderTop: '1px solid #ddd' }}>
                    <input 
                        type="text" 
                        value={nuevoMensaje} 
                        onChange={e => setNuevoMensaje(e.target.value)}
                        placeholder="Escribe un mensaje..."
                        disabled={isLoading}
                        style={{ flex: 1, padding: '12px', borderRadius: '25px', border: '1px solid #ccc', outline: 'none' }}
                    />
                    <button 
                        type="submit" 
                        disabled={isLoading}
                        style={{ 
                            backgroundColor: isLoading ? '#95a5a6' : '#128c7e', 
                            color: 'white', border: 'none', padding: '10px 20px', 
                            borderRadius: '25px', cursor: isLoading ? 'not-allowed' : 'pointer',
                            fontWeight: 'bold', transition: '0.3s'
                        }}
                    >
                        {isLoading ? '...' : 'Enviar'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatCondominio;