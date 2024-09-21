const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const redis = require('redis');
const RedisStore = require('connect-redis').default;
const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chat');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs'); // Import YAML for working with Swagger
const http = require('http'); // For working with socket.io
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// Connect WebSocket logic
require('./sockets/websocket')(server);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Connect to Redis
const redisClient = redis.createClient({
  url: 'redis://localhost:6379',
});

redisClient.on('ready', () => console.log('Redis connected successfully'));
redisClient.on('error', (err) => console.error('Redis connection error:', err));
redisClient
  .connect()
  .catch((err) => console.error('Failed to connect to Redis:', err));

app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: process.env.SESSION_SECRET || 'yourSecretKey',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true, maxAge: 600000 },
  })
);

// Middleware for parsing JSON
app.use(express.json());

// Connect routes
app.use('/api/auth', authRoutes);
app.use('/api/chats', chatRoutes);

// Setup Swagger using the YAML file
const swaggerDocument = YAML.load('./swagger-docs/swagger.yaml'); // Load swagger.yml
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Log for WebSocket server startup
server.on('listening', () => {
  console.log(`WebSocket server running on port ${PORT}`);
});
