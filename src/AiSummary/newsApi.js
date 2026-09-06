const API_KEY = "4d9ec4d7869a4862a82dabc81cf0e00c"
const BASE_URL = "https://newsapi.org/v2/everything?q=";
// Backend proxy URL - hardcoded for production
const PROXY_URL = 'https://ai-newsmania-api.onrender.com/api/news/fetch';

// Define trusted sources with their priority levels (1 being highest)
const TRUSTED_SOURCES = {
  // Tier 1 - Most trusted global sources
  "Reuters": 1,
  "Associated Press": 1,
  "BBC News": 1,
  "The New York Times": 1,
  "The Guardian": 1,
  "The Wall Street Journal": 1,
  
  // Tier 2 - Highly trusted Indian sources
  "The Hindu": 2,
  "Times of India": 2,
  "Hindustan Times": 2,
  "The Indian Express": 2,
  "Mint": 2,
  "NDTV": 2,
  "Dainik Bhaskar": 2,
  "Dainik Jagran": 2,
  
  // Tier 3 - Other reliable sources
  "Al Jazeera": 3,
  "CNN": 3,
  "NPR": 3,
  "Bloomberg": 3,
  "Financial Times": 3,
  "The Economist": 3,
  "PBS": 3,
  "CBC": 3,
  
  // Tier 4 - Regional or specialized sources
  "Scroll.in": 4,
  "The Wire": 4,
  "The Print": 4,
  "News18": 4,
  "India Today": 4,
  "Zee News": 4,
  "ABP News": 4,
  "Republic TV": 4,
  
  // Tier 5 - Other sources (lowest priority)
  "default": 5
};

// Function to get the priority level of a source
const getSourcePriority = (sourceName) => {
  if (!sourceName) return TRUSTED_SOURCES.default;
  
  // Normalize the source name for better matching
  const normalizedSourceName = sourceName.toLowerCase().trim();
  
  // Check if the source name is in our trusted sources list
  for (const [key, value] of Object.entries(TRUSTED_SOURCES)) {
    // Check for exact match
    if (normalizedSourceName === key.toLowerCase()) {
      return value;
    }
    
    // Check for partial match (source name contains our key)
    if (normalizedSourceName.includes(key.toLowerCase())) {
      return value;
    }
    
    // Check for common variations
    if (key === "Reuters" && normalizedSourceName.includes("reuters")) {
      return value;
    }
    if (key === "Associated Press" && (normalizedSourceName.includes("ap") || normalizedSourceName.includes("associated press"))) {
      return value;
    }
    if (key === "BBC News" && (normalizedSourceName.includes("bbc") || normalizedSourceName.includes("british broadcasting"))) {
      return value;
    }
    if (key === "The New York Times" && (normalizedSourceName.includes("ny times") || normalizedSourceName.includes("nytimes") || normalizedSourceName.includes("new york times"))) {
      return value;
    }
    if (key === "The Guardian" && normalizedSourceName.includes("guardian")) {
      return value;
    }
    if (key === "The Wall Street Journal" && (normalizedSourceName.includes("wsj") || normalizedSourceName.includes("wall street"))) {
      return value;
    }
    if (key === "The Hindu" && normalizedSourceName.includes("hindu")) {
      return value;
    }
    if (key === "Times of India" && (normalizedSourceName.includes("toi") || normalizedSourceName.includes("times of india"))) {
      return value;
    }
    if (key === "Hindustan Times" && normalizedSourceName.includes("hindustan times")) {
      return value;
    }
    if (key === "The Indian Express" && normalizedSourceName.includes("indian express")) {
      return value;
    }
    if (key === "NDTV" && normalizedSourceName.includes("ndtv")) {
      return value;
    }
    if (key === "CNN" && normalizedSourceName.includes("cnn")) {
      return value;
    }
    if (key === "Bloomberg" && normalizedSourceName.includes("bloomberg")) {
      return value;
    }
    if (key === "Financial Times" && (normalizedSourceName.includes("ft") || normalizedSourceName.includes("financial times"))) {
      return value;
    }
    if (key === "The Economist" && normalizedSourceName.includes("economist")) {
      return value;
    }
    if (key === "India Today" && normalizedSourceName.includes("india today")) {
      return value;
    }
    if (key === "Zee News" && normalizedSourceName.includes("zee news")) {
      return value;
    }
    if (key === "ABP News" && normalizedSourceName.includes("abp news")) {
      return value;
    }
    if (key === "Republic TV" && normalizedSourceName.includes("republic tv")) {
      return value;
    }
  }
  
  return TRUSTED_SOURCES.default;
};

export const fetchNews = async (query, lang = 'en') => {
  try {
    // Normalize language codes (e.g., "en-US" -> "en") because many news APIs expect two-letter codes
    const normalizedLang = (lang || 'en').toString().split('-')[0];
    console.log(`Fetching news for query: "${query}" with language: ${lang} (normalized: ${normalizedLang})`);
    
    // Check if we're running on localhost
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    
    let url;
    if (isLocalhost) {
      // Use direct NewsAPI for localhost development
      url = `${BASE_URL}${encodeURIComponent(query)}&apiKey=${API_KEY}&language=${normalizedLang}`;
      console.log(`Making direct request to: ${url.replace(API_KEY, 'API_KEY_HIDDEN')}`);
    } else {
      // Use backend proxy for production
      url = `${PROXY_URL}?query=${encodeURIComponent(query)}&language=${normalizedLang}`;
      console.log(`Making proxied request to: ${url}`);
    }
    
    const response = await fetch(url);

    // Check for specific HTTP error codes
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`NewsAPI Error (${response.status}):`, errorText);

      if (response.status === 401) {
        throw new Error('API key unauthorized. Please check your NewsAPI key.');
      } else if (response.status === 429) {
        throw new Error('News API rate limit exceeded. Please try again later.');
      } else if (response.status === 426) {
        throw new Error('News API developer plan upgrade required. Please use a different API key or upgrade your plan.');
      } else if (response.status === 403) {
        throw new Error('News API access forbidden. Your developer plan may have restrictions on this endpoint.');
      } else {
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText || 'Unknown error'}`);
      }
    }

    let data = await response.json();

    // If no articles were returned for the normalized language, retry once with 'en' (fallback)
    const initialCount = (data.articles && data.articles.length) || 0;
    if (initialCount === 0 && normalizedLang !== 'en') {
      console.warn(`No articles found for language "${normalizedLang}". Retrying with language "en".`);
      
      let retryUrl;
      if (isLocalhost) {
        retryUrl = `${BASE_URL}${encodeURIComponent(query)}&apiKey=${API_KEY}&language=en`;
        console.log(`Retrying direct request to: ${retryUrl.replace(API_KEY, 'API_KEY_HIDDEN')}`);
      } else {
        retryUrl = `${PROXY_URL}?query=${encodeURIComponent(query)}&language=en`;
        console.log(`Retrying proxied request to: ${retryUrl}`);
      }

      const retryResp = await fetch(retryUrl);
      if (!retryResp.ok) {
        const errText = await retryResp.text();
        console.error(`NewsAPI Retry Error (${retryResp.status}):`, errText);
        throw new Error(`News API retry failed with status ${retryResp.status}`);
      }
      data = await retryResp.json();
    }
    
    // Log the response to help with debugging
    console.log(`API returned ${data.articles?.length || 0} articles`);
    
    if (data.status === 'error') {
      throw new Error(`NewsAPI error: ${data.message || 'Unknown API error'}`);
    }
    
    // Standard NewsAPI format
    const articles = data.articles || [];
    
    if (!articles || articles.length === 0) {
      console.warn(`No articles found for query: "${query}"`);
      return [];
    }

    // Filter out articles that are missing a title or description, but allow missing images
    // Provide a fallback placeholder image when an article has no image
    const filteredArticles = articles
      .filter((article) => article.title && article.description)
      .map((article) => ({
        ...article,
        urlToImage: article.urlToImage || 'https://via.placeholder.com/600x400?text=No+Image'
      }));

    console.log(`After filtering, ${filteredArticles.length} articles remain`);
    
    // Sort articles by source priority (highest priority first)
    const sortedArticles = filteredArticles.sort((a, b) => {
      const priorityA = getSourcePriority(a.source?.name);
      const priorityB = getSourcePriority(b.source?.name);
      
      // If priorities are the same, sort by date (newest first)
      if (priorityA === priorityB) {
        return new Date(b.publishedAt) - new Date(a.publishedAt);
      }
      
      // Otherwise, sort by priority (lower number = higher priority)
      return priorityA - priorityB;
    });

    return sortedArticles;
  } catch (error) {
    console.error("Error fetching news:", error);
    
    // Check for known network errors
    if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
      console.error('Network error - possibly CORS issue or network connection problem');
    }
    
    // Re-throw the error so the component can handle it appropriately
    throw error;
  }
};
