const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true, // Название чата должно быть уникальным
    },
    isActive: {
      type: Boolean,
      default: true, // Чат по умолчанию активен
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ], // Список участников чата
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',
      },
    ], // Список сообщений в чате
  },
  { timestamps: true }
);

module.exports = mongoose.model('Chat', ChatSchema);
