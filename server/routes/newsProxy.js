const express = require('express');
const router = express.Router();

const NEWS_API_KEY = process.env.NEWS_API_KEY || '4d9ec4d7869a4862a82dabc81cf0e00c';
const NEWS_API_BASE = 'https://newsapi.org/v2/everything';

// Proxy endpoint for news fetching
router.get('/fetch', async (req, res) => {
  try {
    const { query, language = 'en' } = req.query;

    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    // Build the NewsAPI URL
    const url = `${NEWS_API_BASE}?q=${encodeURIComponent(query)}&apiKey=${NEWS_API_KEY}&language=${language}`;

    console.log(`Proxying news request for query: "${query}", language: ${language}`);

    // Fetch from NewsAPI
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      console.error('NewsAPI error:', data);
      return res.status(response.status).json(data);
    }

    // Return the news data
    res.json(data);
  } catch (error) {
    console.error('Error in news proxy:', error);
    res.status(500).json({ error: 'Failed to fetch news', message: error.message });
  }
});

module.exports = router;
