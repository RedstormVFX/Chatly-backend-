const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const redis = require('redis');
const RedisStore = require('connect-redis').default;
const authRoutes = require('./routes/auth'); // Импортируем маршруты авторизации
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();
const chatRoutes = require('./routes/chat');
const User = require('./models/User');
const Chat = require('./models/Chat');

const app = express();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

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
    cookie: { secure: false, httpOnly: true, maxAge: 600000 }, // 10 min
  })
);

(async () => {
  const AdminJS = (await import('adminjs')).default;
  const AdminJSExpress = (await import('@adminjs/express')).default;
  const AdminJSMongoose = (await import('@adminjs/mongoose')).default;

  AdminJS.registerAdapter(AdminJSMongoose);

  const adminJs = new AdminJS({
    databases: [mongoose],
    rootPath: '/admin',
    resources: [{ resource: User }, { resource: Chat }],
  });

  const adminRouter = AdminJSExpress.buildRouter(adminJs);
  app.use(adminJs.options.rootPath, adminRouter);
})();

app.use(express.json());

app.use('/api/auth', authRoutes);

app.use('/api/chats', chatRoutes);

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Chatly API Gateway',
      version: '1.0.0',
      description: 'API Gateway for Chatly Application',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  apis: ['./routes/*.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Run server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
