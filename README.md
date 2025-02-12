# Student Portal Web Application

## Overview
A full-stack web application for student registration and management built using:
- Frontend: React.js, Vite, Tailwind CSS
- Backend: Node.js, Express.js
- Database: MongoDB

## Prerequisites
- Node.js (v14 or later)
- MongoDB
- npm or yarn
- Vercel Account (for deployment)

## Setup Instructions

### Backend Setup
1. Navigate to the backend directory
```bash
cd backend
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file with the following variables:
- `MONGODB_URI`: Your MongoDB connection string
- `JWT_SECRET`: A secret key for JWT authentication
- `PORT`: Backend server port (default: 3000)
- `BACKEND_URL`: Backend server URL
- `FRONTEND_URL`: Frontend application URL

4. Start the backend server
```bash
npm start
```

### Frontend Setup
1. Navigate to the frontend directory
```bash
cd frontend
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file with the following variables:
- `VITE_BACKEND_URL`: Backend server URL
- `VITE_FRONTEND_URL`: Frontend application URL

Note: In the frontend code, use `import.meta.env.VITE_BACKEND_URL` to access these variables.

4. Start the frontend development server
```bash
npm run dev
```

## Deployment to Vercel

### Backend Deployment
1. Create a new project in Vercel
2. Import your backend repository
3. Set environment variables in Vercel dashboard:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `BACKEND_URL`
   - `FRONTEND_URL`
4. Vercel will automatically detect and deploy using the `vercel.json`

### Frontend Deployment
1. Create a new project in Vercel
2. Import your frontend repository
3. Set environment variables in Vercel dashboard:
   - `VITE_BACKEND_URL`
   - `VITE_FRONTEND_URL`
4. Vercel will automatically detect and deploy using the `vercel.json`

## Features
- User Registration
- User Authentication
- Student Dashboard
- Responsive Design

## Technologies
- React.js
- Tailwind CSS
- Node.js
- Express.js
- MongoDB
- JWT Authentication
