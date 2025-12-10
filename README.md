# Backend - Node.js Express REST API

A secure, production-ready REST API built with Node.js and Express, featuring JWT authentication, role-based access control, MongoDB integration, and comprehensive API documentation via Swagger/OpenAPI.

## Overview

This backend service powers the Info Portal application, providing secure authentication, user management, and data operations with enterprise-grade security practices including input validation, error handling, and CORS support.

## Key Features

- **🔐 JWT Authentication**: Secure token-based authentication with bcryptjs password hashing
- **👥 Role-Based Access Control (RBAC)**: Different access levels for Admin, Analyst, and User roles
- **📦 MongoDB Integration**: Persistent data storage with Mongoose ODM
- **✅ Input Validation**: Express Validator for sanitizing and validating all inputs
- **🛡️ Security Headers**: Helmet.js for setting secure HTTP headers
- **📝 API Documentation**: Swagger/OpenAPI specs for complete API reference
- **📊 Request Logging**: Morgan middleware for HTTP request logging
- **📁 File Upload**: Multer integration for handling file uploads
- **🚀 CORS Support**: Configurable CORS for cross-origin requests
- **⚡ Error Handling**: Comprehensive error handling and validation middleware

## Tech Stack

| Category | Tools |
| :--- | :--- |
| **Runtime** | Node.js |
| **Framework** | Express.js 4 |
| **Database** | MongoDB 8 with Mongoose ODM |
| **Authentication** | JWT, bcryptjs |
| **Validation** | Express Validator |
| **Security** | Helmet, CORS |
| **Logging** | Morgan |
| **File Upload** | Multer |
| **API Documentation** | Swagger/OpenAPI (swagger-ui-express, yamljs) |
| **Dev Tools** | Nodemon, ESLint |

## Folder Structure

```
backend/
├── config/
│   └── db.js                  # MongoDB connection configuration
├── controllers/
│   ├── authController.js      # Authentication logic (login, signup)
│   └── userController.js      # User management operations
├── middleware/
│   ├── auth.js                # JWT token verification
│   ├── authMiddleware.js      # Additional auth checks
│   ├── upload.js              # Multer file upload configuration
│   └── validate.js            # Input validation middleware
├── models/
│   └── User.js                # User database schema
├── routes/
│   ├── authRoutes.js          # Authentication endpoints
│   └── userRoutes.js          # User management endpoints
├── public/
│   └── images/                # Directory for uploaded images
├── docs/
│   └── openapi.yaml           # Swagger/OpenAPI documentation
├── app.js                     # Express app configuration
├── server.js                  # Server entry point
├── .env                       # Environment variables
├── package.json
└── README.md
```

## Installation & Setup

### Prerequisites
- Node.js 16+ and npm installed
- MongoDB 6+ running locally or remote connection string available
- Git for version control

### Steps

**1. Navigate to the Backend Directory**
```bash
cd backend
```

**2. Install Dependencies**
```bash
npm install
```

**3. Configure Environment Variables**

Create a `.env` file in the backend root directory:
```env
PORT=4000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/info-portal
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
UPLOAD_DIR=./public/images
MAX_FILE_SIZE=5242880
```

**4. Start the Development Server**
```bash
npm run dev
```

The API will be at `http://localhost:4000` and docs at `http://localhost:4000/api-docs`

## Available Scripts

| Command | Purpose |
| :--- | :--- |
| `npm run dev` | Start with Nodemon (auto-restart) |
| `npm start` | Start in production mode |
| `npm run lint` | Run ESLint checks |

## API Endpoints

### Authentication (`/api/auth`)
- `POST /auth/signup` - Register a new user
- `POST /auth/login` - Login and receive JWT

### Users (`/api/users`)
- `GET /users` - Get all users (Admin only)
- `GET /users/:id` - Get user details
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user (Admin only)

## Authentication Flow

1. **Registration**: POST email, password, role to `/auth/signup`
2. **Password Hashing**: Bcryptjs hashes before database storage
3. **Login**: POST email, password to `/auth/login`
4. **JWT Token**: Server generates and returns JWT token
5. **Token Storage**: Frontend stores JWT in localStorage
6. **Request Headers**: JWT attached to all API requests
7. **Token Verification**: Middleware verifies JWT for protected routes
8. **RBAC**: Additional middleware checks user role

## Request Examples

### Sign Up
```bash
curl -X POST http://localhost:4000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!",
    "role": "user"
  }'
```

### Login
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!"
  }'
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "role": "user"
  }
}
```

## Middleware

- **auth.js**: Verifies JWT, adds user to request
- **validate.js**: Sanitizes and validates input data
- **upload.js**: Multer configuration for file uploads

## Security

- Bcryptjs password hashing with salt rounds
- JWT tokens with expiration (default: 7 days)
- Express Validator for input sanitization
- Helmet.js for secure HTTP headers
- CORS configured for frontend domain
- Environment variables for sensitive data

## Database Schema

### User
```javascript
{
  _id: ObjectId,
  email: String (unique, required),
  password: String (hashed),
  role: String (enum: ['user', 'admin', 'analyst']),
  createdAt: Date,
  updatedAt: Date
}
```

## Error Responses

```json
{
  "success": false,
  "message": "Error description",
  "errors": [{"field": "email", "message": "Invalid email"}]
}
```

Status Codes:
- **200**: Success
- **201**: Created
- **400**: Bad Request
- **401**: Unauthorized
- **403**: Forbidden
- **404**: Not Found
- **500**: Server Error

## Troubleshooting

| Problem | Solution |
| :--- | :--- |
| MongoDB connection refused | Ensure MongoDB is running; check `MONGODB_URI` |
| JWT verification fails | Verify `JWT_SECRET` matches |
| CORS errors | Ensure `FRONTEND_URL` matches frontend origin |
| File upload fails | Check `UPLOAD_DIR` exists and is writable |

## Development Tips

- Test endpoints with Postman or Insomnia
- View API docs at `/api-docs`
- Use MongoDB Compass for database visualization
- Check terminal logs for request details
- Enable verbose logging: `DEBUG=* npm run dev`

## Production Deployment

1. Set `NODE_ENV=production`
2. Use production MongoDB instance
3. Generate secure `JWT_SECRET`
4. Enable HTTPS
5. Configure appropriate `CORS` origins
6. Use PM2 or Docker for process management
7. Set up monitoring and logging
