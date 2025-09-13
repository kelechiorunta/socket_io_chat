import { io } from 'socket.io-client';

const host = window.location.hostname;
const socketServerURL =
  host === 'localhost' ? 'http://localhost:7334' : 'https://socket-io-chat-zory.onrender.com';

const socketInstance = io(socketServerURL, {
  transports: ['websocket'],
  // extraHeaders: ['Authorization', 'Content-Type'],
  withCredentials: true
});

export default socketInstance;
