const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

// Inicializa o app e servidor
const app = express();
const server = http.createServer(app);

// Configuração do Socket.IO com CORS flexível
const io = socketIo(server, {
  cors: {
    origin: [
      'https://chat-suporte-rose.vercel.app', // Ambiente de produção
      'http://localhost:5173'                // Ambiente de desenvolvimento
    ],
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true
  }
});

// Porta padrão ou variável de ambiente
const port = process.env.PORT || 3001;

// Gerenciamento de conexões
io.on('connection', socket => {
  console.log('Usuário conectado!', socket.id);

  // Evento de desconexão
  socket.on('disconnect', reason => {
    console.log('Usuário desconectado!', socket.id);
  });

  // Define o nome de usuário para o socket
  socket.on('set_username', username => {
    socket.data.username = username;
  });

  // Recebe mensagens e as retransmite para todos os sockets conectados
  socket.on('message', text => {
    io.emit('receive_message', {
      text,
      authorId: socket.id,
      author: socket.data.username || 'Anônimo'
    });
  });
});

// Inicia o servidor
server.listen(port, () => console.log(`Server running on port ${port}...`));
