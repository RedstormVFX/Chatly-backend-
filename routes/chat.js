const express = require('express');
const router = express.Router();
const Chat = require('../models/Chat');
const Message = require('../models/Message');

/**
 * @swagger
 * tags:
 *   name: Chats
 *   description: API для управления чатами
 */

/**
 * @swagger
 * /api/chats/create:
 *   post:
 *     summary: Создать новый чат
 *     tags: [Chats]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "General Chat"
 *     responses:
 *       201:
 *         description: Чат успешно создан
 *       500:
 *         description: Ошибка создания чата
 */
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

/**
 * @swagger
 * /api/chats:
 *   get:
 *     summary: Получить все чаты
 *     tags: [Chats]
 *     responses:
 *       200:
 *         description: Список всех чатов
 *       500:
 *         description: Ошибка при получении чатов
 */
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

/**
 * @swagger
 * /api/chats/{chatId}/join:
 *   post:
 *     summary: Присоединить пользователя к чату
 *     tags: [Chats]
 *     parameters:
 *       - in: path
 *         name: chatId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID чата
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "60f85e8c8c8c8c8c8c8c8c8"
 *     responses:
 *       200:
 *         description: Пользователь успешно присоединился к чату
 *       404:
 *         description: Чат не найден
 *       500:
 *         description: Ошибка при присоединении пользователя к чату
 */
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

/**
 * @swagger
 * /api/chats/{chatId}/message:
 *   post:
 *     summary: Send a message to chat
 *     tags: [Chats]
 *     parameters:
 *       - in: path
 *         name: chatId
 *         required: true
 *         schema:
 *           type: string
 *         description: Chat ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "60f85e8c8c8c8c8c8c8c8c8"
 *               content:
 *                 type: string
 *                 example: "Hello, world!"
 *     responses:
 *       201:
 *         description: Message sent successfully
 *       404:
 *         description: Chat not found
 *       500:
 *         description: Error sending message
 */
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
