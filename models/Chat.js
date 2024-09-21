const express = require('express');
const router = express.Router();
const Chat = require('../models/Chat');
const Message = require('../models/Message');

router.post('/create', async (req, res) => {
  const { name } = req.body;
  try {
    const newChat = new Chat({ name });
    await newChat.save();
    res
      .status(201)
      .json({ message: 'Chat created successfully', chat: newChat });
  } catch (err) {
    res
      .status(500)
      .json({ error: 'Error creating chat', details: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const chats = await Chat.find()
      .populate('participants')
      .populate('messages');
    res.status(200).json(chats);
  } catch (err) {
    res
      .status(500)
      .json({ error: 'Error fetching chats', details: err.message });
  }
});

router.get('/:chatId/messages', async (req, res) => {
  const { chatId } = req.params;
  try {
    const messages = await Message.find({ chat: chatId }).populate(
      'sender',
      'username'
    );
    if (!messages) {
      return res.status(404).json({ error: 'Messages not found' });
    }
    res.status(200).json(messages);
  } catch (err) {
    res
      .status(500)
      .json({ error: 'Error fetching messages', details: err.message });
  }
});

router.post('/:chatId/join', async (req, res) => {
  const { chatId } = req.params;
  const { userId } = req.body;
  try {
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }
    chat.participants.push(userId);
    await chat.save();
    res.status(200).json({ message: 'User joined the chat', chat });
  } catch (err) {
    res.status(500).json({ error: 'Error joining chat', details: err.message });
  }
});

router.post('/:chatId/message', async (req, res) => {
  const { chatId } = req.params;
  const { userId, content } = req.body;
  try {
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }
    const newMessage = new Message({ chat: chatId, sender: userId, content });
    await newMessage.save();
    chat.messages.push(newMessage._id);
    await chat.save();
    res
      .status(201)
      .json({ message: 'Message sent successfully', messageData: newMessage });
  } catch (err) {
    res
      .status(500)
      .json({ error: 'Error sending message', details: err.message });
  }
});

module.exports = router;
