import React, { useEffect, useState, useRef } from 'react';
import { echo } from '../lib/echo'; 
import axios from 'axios';

const ChatCondominio = () => {
    const [mensajes, setMensajes] = useState([]);
    const [nuevoMensaje, setNuevoMensaje] = useState("");
    
    // Usamos useRef para que el prompt solo salga una vez y no se repita
    const deptoAsignado = useRef(null);
    if (!deptoAsignado.current) {
        deptoAsignado.current = prompt("¿Qué departamento eres? (Escribe 1 o 2)") || "1";
    }
    const myDepaId = deptoAsignado.current;

    useEffect(() => {
        console.log("Conectando al canal de depto:", myDepaId);
        const channel = echo.channel(`chat-depa-${myDepaId}`);
        
        channel.listen('.NuevoMensaje', (e) => {
            console.log("¡Llegó mensaje por WebSocket!", e);
            setMensajes((prev) => [...prev, e.mensaje]);
        });

        return () => channel.stopListening('.NuevoMensaje');
    }, [myDepaId]);

    const enviarAlBackend = async (e) => {
        e.preventDefault();
        console.log("Intentando enviar:", nuevoMensaje); // Para ver en consola F12

        if (!nuevoMensaje.trim()) return;

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/enviar-mensaje', {
                remitente: 1, 
                destinatario: 2,
                id_depaa: parseInt(myDepaId),
                id_depab: myDepaId === "1" ? 2 : 1, 
                mensaje: nuevoMensaje
            });
            console.log("Respuesta del servidor:", response.data);
            setNuevoMensaje(""); 
        } catch (error) {
            console.error("ERROR DETALLADO:", error);
            alert("Error al enviar. Revisa la consola (F12) y que el Backend esté en 'php artisan serve'");
        }
    };

    return (
        <div style={{ maxWidth: '500px', margin: '20px auto', fontFamily: 'sans-serif', border: '1px solid #ddd', borderRadius: '8px', display: 'flex', flexDirection: 'column', height: '80vh', backgroundColor: '#fff' }}>
            <div style={{ padding: '15px', backgroundColor: '#075e54', color: 'white' }}>
                <h2 style={{ margin: 0 }}>Chat Condominio - Depto {myDepaId}</h2>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '15px', backgroundColor: '#e5ddd5' }}>
                {mensajes.map((m, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: m.id_depaa == myDepaId ? 'flex-end' : 'flex-start', marginBottom: '10px' }}>
                        <div style={{ backgroundColor: m.id_depaa == myDepaId ? '#dcf8c6' : '#fff', padding: '8px 12px', borderRadius: '8px', maxWidth: '80%' }}>
                            <small style={{ display: 'block', color: '#888', fontSize: '0.7rem' }}>Depto {m.id_depaa}</small>
                            {m.mensaje}
                        </div>
                    </div>
                ))}
            </div>
            <form onSubmit={enviarAlBackend} style={{ display: 'flex', padding: '10px', background: '#eee' }}>
                <input 
                    type="text" 
                    value={nuevoMensaje} 
                    onChange={(e) => setNuevoMensaje(e.target.value)}
                    placeholder="Escribe un mensaje..."
                    style={{ flex: 1, padding: '10px', borderRadius: '20px', border: '1px solid #ccc' }}
                />
                <button type="submit" style={{ marginLeft: '10px', padding: '10px 20px', backgroundColor: '#128c7e', color: 'white', border: 'none', borderRadius: '20px', cursor: 'pointer' }}>
                    Enviar
                </button>
            </form>
        </div>
    );
};

export default ChatCondominio;