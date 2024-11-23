import React, { useRef, useState } from 'react';
import io from 'socket.io-client';
import '../../output.css';

export default function Join({ setChatVisibility, setSocket }) {
  const usernameRef = useRef();
  const [darkMode, setDarkMode] = useState(false);

  const handleSubmit = async () => {
    const username = usernameRef.current.value;
    if (!username.trim()) return;

    const socket = await io.connect('https://chat-suporte-backend.vercel.app/');
    socket.emit('set_username', username);
    setSocket(socket);
    setChatVisibility(true);
  };

  return (
    <div
    
      className={`flex flex-col items-center justify-center min-h-screen p-4 transition-colors ${
        darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'
      }`}
    >
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="absolute top-4 right-4 px-4 py-2 text-sm font-medium rounded-md border transition-colors 
          border-gray-500 hover:bg-gray-500 hover:text-white"
      >
        {darkMode ? 'Modo Claro' : 'Modo Escuro'}
      </button>
      <h1 className="text-3xl font-bold mb-8">Join</h1>
      <input
        type="text"
        ref={usernameRef}
        placeholder="Nome de usuário"
        className="w-64 px-4 py-2 mb-4 text-gray-900 rounded-md shadow-md outline-none
          focus:ring-2 focus:ring-blue-400"
      />
      <button
        onClick={() => handleSubmit()}
        className="px-6 py-2 bg-blue-500 text-white font-medium rounded-md shadow-md hover:bg-blue-600"
      >
        Entrar
      </button>
    </div>
  );
}