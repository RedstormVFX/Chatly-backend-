# Chatly - Realtime Chat Application

**Chatly** is a real-time chat application backend built with Express.js, MongoDB, Redis, and Socket.io, offering features like user authentication, chat management, and real-time messaging.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [WebSocket Events](#websocket-events)
- [Admin Panel](#admin-panel)
- [Features](#features)

## Prerequisites

Before you start, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or later)
- [MongoDB](https://www.mongodb.com/)
- [Redis](https://redis.io/)

## Installation

Follow these steps to get the project running locally:

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/chatly-backend.git
   cd chatly-backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create a `.env` file**
   Create a `.env` file in the root of the project and configure the environment variables (see [Environment Variables](#environment-variables)).

## Environment Variables

The application uses environment variables defined in the `.env` file. Make sure to create and configure it with the following values:

```ini
MONGO_URI=mongodb://localhost:27017/chatly
SESSION_SECRET=yourSecretKey
PORT=3000
REDIS_URL=redis://localhost:6379
```

- `MONGO_URI`: Your MongoDB connection string.
- `SESSION_SECRET`: A secret key used for session management.
- `PORT`: Port on which the application will run.
- `REDIS_URL`: URL for Redis connection.

## Running the Application

1. **Start the MongoDB and Redis servers**

   Make sure that MongoDB and Redis are running locally on your machine before starting the app.

2. **Run the application**

   ```bash
   npm start
   ```

   The server will be available at `http://localhost:3000`.

## API Documentation

The API is documented using Swagger and can be accessed by navigating to:

```
http://localhost:3000/api-docs
```

### Available Endpoints

- **Authentication:**

  - `POST /api/auth/login`: Login or register a user by username.
  - `POST /api/auth/logout`: Logout the current user.

- **Chats:**
  - `POST /api/chats/create`: Create a new chat (admin only).
  - `GET /api/chats`: Retrieve a list of all chats.
  - `POST /api/chats/:chatId/join`: Join a specific chat.
  - `POST /api/chats/:chatId/message`: Send a message to a specific chat.

## WebSocket Events

The application uses Socket.io for real-time communication. The following WebSocket events are available:

- `joinChat`: Join a chat room.
  - Payload: `{ chatId: string, username: string }`
- `chatMessage`: Send a message to a chat room.

  - Payload: `{ chatId: string, message: string, username: string }`

- `typing`: Notify other users in the chat that someone is typing.

  - Payload: `{ chatId: string, username: string }`

- `message`: Receive a message from a chat room (broadcasted to all users in the chat).
  - Payload: `{ username: string, message: string }`

## Admin Panel

The application has an admin panel that can be accessed at:

```
http://localhost:3000/admin
```

The admin panel allows administrators to:

- Manage users.
- Manage chats.

## Features

- User authentication with sessions.
- Admin panel for chat and user management.
- Real-time messaging with WebSockets.
- Redis for session storage and fast lookups.
- MongoDB as the database for storing users, chats, and messages.
- Swagger API documentation.

## Future Improvements

- Implement private messaging.
- Add notifications for new messages.
- Enhance user roles and permissions in the admin panel.
- Deploy to cloud platforms like Heroku or AWS.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```

```
