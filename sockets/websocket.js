const { Server } = require('socket.io');
const Message = require('../models/Message');

module.exports = (server) => {
  const io = new Server(server);

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Join the chat room
    socket.on('joinChat', ({ chatId, username }) => {
      socket.join(chatId);
      console.log(`${username} joined chat ${chatId}`);
    });

    // Send a message
    socket.on('chatMessage', async ({ chatId, message, username }) => {
      const newMessage = new Message({
        chat: chatId,
        sender: username,
        content: message,
      });
      await newMessage.save();
      io.to(chatId).emit('message', { username, message });
      console.log(`Message sent to chat ${chatId} by ${username}`);
    });

    // Indicate "typing"
    socket.on('typing', ({ chatId, username }) => {
      socket.to(chatId).emit('userTyping', { username });
      console.log(`${username} is typing in chat ${chatId}`);
    });

    // Handle user disconnection
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};
