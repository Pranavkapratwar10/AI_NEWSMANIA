const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware - CORS Configuration
const allowedOrigins = [
  'https://ai-newsmania1.onrender.com',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173'
];

// Add CLIENT_URL from environment if it exists and is properly formatted
if (process.env.CLIENT_URL) {
  const clientUrl = process.env.CLIENT_URL.trim();
  // Ensure it starts with http:// or https://
  if (clientUrl.startsWith('http://') || clientUrl.startsWith('https://')) {
    if (!allowedOrigins.includes(clientUrl)) {
      allowedOrigins.push(clientUrl);
    }
  } else {
    // If CLIENT_URL doesn't have protocol, add https://
    const correctedUrl = `https://${clientUrl}`;
    if (!allowedOrigins.includes(correctedUrl)) {
      allowedOrigins.push(correctedUrl);
    }
  }
}

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Import routes
const newsProxyRouter = require('./routes/newsProxy');

// Routes
app.use('/api/news', newsProxyRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
