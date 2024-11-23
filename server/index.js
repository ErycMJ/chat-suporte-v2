const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

// Inicializa o app e o servidor HTTP
const app = express();
const server = http.createServer(app);

// Configuração do CORS para permitir múltiplas origens
const allowedOrigins = [
  'https://chat-suporte-rose.vercel.app', // Ambiente de produção
  'http://localhost:5173'                // Ambiente de desenvolvimento
];

// Configuração do Socket.IO com CORS flexível
const io = socketIo(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true
  }
});

// Porta padrão ou variável de ambiente
const port = process.env.PORT || 3001;

// Middleware para servir arquivos estáticos (caso haja necessidade no futuro)
app.use(express.static('public'));

// Gerenciamento de conexões
io.on('connection', socket => {
  console.log('Usuário conectado!', socket.id);

  // Evento de desconexão
  socket.on('disconnect', reason => {
    console.log('Usuário desconectado!', socket.id);
    // Limpeza de recursos, caso necessário (ex: timers, etc.)
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
