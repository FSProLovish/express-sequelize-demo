# Express App

A RESTful API built with Express.js for managing user authentication, profiles, connection requests, and real-time chat functionality.

## Introduction

This is a Node.js backend application that provides a complete API for a social networking platform. It includes user authentication, profile management, connection request system, and real-time chat capabilities using WebSockets.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js 5.0
- **Database**: MySQL with Sequelize ORM
- **Authentication**: JWT (JSON Web Tokens) with bcrypt for password hashing
- **Real-time Communication**: Socket.io
- **Validation**: Validator.js
- **Other Dependencies**:
  - CORS for cross-origin resource sharing
  - Cookie Parser for handling cookies
  - dotenv for environment variables

## API Routes

All routes are prefixed with `/api`

### Authentication Routes (`/api/`)
- `POST /signup` - Register a new user
- `POST /login` - User login
- `POST /logout` - User logout (requires authentication)

### User Routes (`/api/user`)
- `GET /requests/received` - Get pending connection requests received by the user (requires authentication)
- `GET /connections` - Get all user connections (requires authentication)

### Profile Routes (`/api/profile`)
- `GET /view` - View user profile (requires authentication)
- `PATCH /edit` - Update user profile (requires authentication)
- `PATCH /password` - Reset user password (requires authentication)

### Connection Request Routes (`/api/request`)
- `POST /send/:status/:toUserId` - Send a connection request to another user (requires authentication)
- `POST /review/:status/:requestId` - Review (accept/reject) a connection request (requires authentication)

### Chat Routes (`/api/chat`)
- `GET /:targetUserId` - Get chat messages with a specific user (requires authentication)

## Getting Started

### Prerequisites
- Node.js installed
- MySQL database

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables in a `.env` file

3. Start the server:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

The server will run on `http://localhost:3000` by default.

## Features

- User authentication with JWT
- Password hashing with bcrypt
- Real-time chat using Socket.io
- Connection request system
- User profile management
- RESTful API design

