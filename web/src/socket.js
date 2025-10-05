import { io } from 'socket.io-client';

const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3001';
console.log('Creating socket connection to:', SERVER_URL);

// Create a single socket instance that will be shared across all components
const socket = io(SERVER_URL);

export default socket;
