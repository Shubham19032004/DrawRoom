import http from 'http';
import express from 'express';

const app = express();
const server = http.createServer(app);

import { Server } from 'socket.io';
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

io.on('connection', async (socket) => {
  const id = await socket.handshake.query.roomID;
  const name = await socket.handshake.query.name; 
  if (id) {
    socket.join(id);
    socket.on('client-ready', () => {
      socket.to(id).emit('get-canvas-state');
    });

    socket.on('canvas-state', (state) => {
      socket.to(id).emit('canvas-state-from-server', state);
    });

    socket.on('draw-line', ({ prevPoint, currentPoint, color }) => {
      socket.to(id).emit('draw-line', { prevPoint, currentPoint, color });
    });

    socket.on('message', ({ sendMessage }) => {
      console.log('Received message:', sendMessage, 'from:', name);
      io.to(id).emit('message', { name, sendMessage });
    });

    socket.on('clear', () => io.to(id).emit('clear'));
  }
});

server.listen(3001, () => {
  console.log('Server listening on port 3001');
});
