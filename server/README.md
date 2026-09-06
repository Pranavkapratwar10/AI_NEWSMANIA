# NewsMania Server API

This is the backend server for the NewsMania application, providing API endpoints for tracking user reading activity and unlocking badges.

## Features

- Track user reading activity by category
- Unlock badges based on reading thresholds
- JWT authentication
- Rate limiting
- Redis caching for performance
- MongoDB for persistent storage

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Redis

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Configure environment variables:
   - Copy `.env.example` to `.env` (or use the existing `.env` file)
   - Update the values as needed

3. Start the server:
   ```
   npm start
   ```

For development with auto-restart:
```
npm run dev
```

## API Endpoints

### POST /api/track-read

Track a user's reading activity and unlock badges.

**Request:**
```json
{
  "userId": "user123",
  "category": "politics"
}
```

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "unlocked": ["🏛️"],
  "progress": {
    "politics": 6,
    "tech": 2,
    "climate": 0
  }
}
```

## Badge Thresholds

- 🏛️ Policy Wonk: Read 5 politics articles
- 💻 Tech Enthusiast: Read 5 tech articles
- 🌍 Climate Advocate: Read 5 climate articles
- 📚 Bookworm: Read 15 articles across all categories

## Error Handling

The API returns appropriate HTTP status codes and error messages:

- 400: Bad Request (invalid input)
- 401: Unauthorized (missing or invalid token)
- 403: Forbidden (expired token)
- 429: Too Many Requests (rate limit exceeded)
- 500: Server Error

## Rate Limiting

The API is rate-limited to 10 requests per minute per IP address. 