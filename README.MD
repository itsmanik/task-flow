# TaskFlow

TaskFlow is a modern mobile task management application built with React Native and a Node.js backend.

## Features

- User registration and login
- JWT authentication
- Create, edit and delete tasks
- Task descriptions
- Task deadlines
- Task priority levels
- Mark tasks as completed
- All / Active / Completed task filters
- Task statistics
- Today's progress tracking
- Pull-to-refresh
- Delete confirmation
- Clean and responsive mobile UI

## Tech Stack

### Mobile

- React Native
- TypeScript
- React Navigation
- Axios
- AsyncStorage
- React Native DateTimePicker

### Backend

- Node.js
- Express
- TypeScript
- MongoDB
- Mongoose
- JWT
- bcrypt

## Project Structure

    TaskFlow/
    ├── mobile/     # React Native mobile application
    ├── server/     # Node.js REST API
    └── README.md

## Getting Started

### 1. Clone the repository

    git clone <repository-url>
    cd TaskFlow

### 2. Backend Setup

Navigate to the server directory:

    cd server

Install dependencies:

    npm install

Create a `.env` file inside the `server` directory:

    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret

Start the development server:

    npm run dev

The backend will run on:

    http://localhost:5000

### 3. Mobile Setup

Open another terminal and navigate to the mobile directory:

    cd mobile

Install dependencies:

    npm install

Start Metro:

    npm start

In another terminal, run the Android application:

    npm run android

## Authentication

TaskFlow uses JWT-based authentication.

After successful registration or login, the server returns a JWT token. The mobile application stores the token locally and automatically attaches it to authenticated API requests.

## Task Management

Authenticated users can:

- Create tasks
- View their tasks
- Edit task details
- Change task priority
- Update deadlines
- Mark tasks as completed
- Delete tasks
- Filter tasks by status

Each task is associated with the authenticated user, ensuring users can only access their own tasks.

## API Overview

### Authentication

    POST /api/auth/register
    POST /api/auth/login

### Tasks

    GET /api/tasks
    POST /api/tasks
    PATCH /api/tasks/:id
    DELETE /api/tasks/:id

Task endpoints require JWT authentication.

## Environment Variables

The backend requires the following environment variables:

    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret

Do not commit the `.env` file or expose your MongoDB credentials or JWT secret.

## Notes

The mobile application is configured to communicate with the local backend when running on an Android emulator.

## License

This project was developed as an internship assignment.
