import Echo from 'laravel-echo';
import Pusher from 'pusher-js'; // Reverb usa el protocolo de Pusher

window.Pusher = Pusher;

export const echo = new Echo({
    broadcaster: 'reverb',
    key: 'd9yek8ymti1qw9oupfv4', //  en el .env del Backend (VITE_REVERB_APP_KEY)
    wsHost: '127.0.0.1',
    wsPort: 8080,
    forceTLS: false,
    enabledTransports: ['ws', 'wss'],
});