import { GoogleGenerativeAI } from "@google/generative-ai";

// Get API key from environment variables - try both possible key names
let API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// If the primary key is not available, try the alternate key
if (!API_KEY) {
  API_KEY = import.meta.env.VITE_GOOGLE_GEMINI_AI_API_KEY;
  if (API_KEY) {
    console.log("Using alternate Gemini API key");
  } else {
    console.error("Gemini API key is not set in environment variables. Please check your .env file.");
  }
}

// Initialize the Gemini API with the available key
const genAI = new GoogleGenerativeAI(API_KEY);

// Mapping from i18n language codes to human-readable names
const langNames = {
  en: 'English',
  hi: 'Hindi',
  mr: 'Marathi',
  ja: 'Japanese',
  es: 'Spanish',
  fr: 'French',
  de: 'German',
  it: 'Italian',
  pt: 'Portuguese',
  ru: 'Russian',
  zh: 'Chinese',
  ko: 'Korean',
  ar: 'Arabic',
  tr: 'Turkish',
  nl: 'Dutch'
};

// Helper to retry Gemini generateContent on 429 errors (Re-added)
async function retryGeminiGenerateContent(model, prompt, maxRetries = 3) {
  let attempt = 0;
  let backoff = 1000; // Initial backoff 1 second
  
  while (true) {
    try {
      console.log(`Attempting Gemini API call (attempt ${attempt + 1}/${maxRetries + 1})...`);
      const result = await model.generateContent(prompt);
      console.log("Gemini API call successful");
      return result; // Return successful result
    } catch (error) {
      const errorMessage = error.message || '';
      const status = error?.status || '';
      
      // Check if it's a rate limit error (429)
      const is429 = errorMessage.includes('429') || (status === 429);
      
      if (is429 && attempt < maxRetries) {
        console.warn(`Gemini API rate limited (HTTP 429), retrying in ${backoff}ms (attempt ${attempt + 1}/${maxRetries})`);
        await new Promise(res => setTimeout(res, backoff));
        attempt++;
        backoff *= 2; // Exponential backoff
        continue; // Retry the loop
      } else {
        // If not a 429 or max retries reached, provide detailed error info
        if (is429) {
          console.error(`Gemini API rate limit (HTTP 429) persisted after ${maxRetries} retries`);
        } else if (errorMessage.includes('401') || status === 401) {
          console.error(`Gemini API authentication error (HTTP 401): Invalid API key`);
        } else if (errorMessage.includes('400') || status === 400) {
          console.error(`Gemini API bad request error (HTTP 400): ${errorMessage}`);
        } else {
          console.error(`Gemini API error (${status || 'unknown'}): ${errorMessage}`);
        }
        
        throw error;
      }
    }
  }
}

// Add local fallback implementations for when the API fails
const localFallbacks = {
  // Local function to generate summary without API
  generateLocalSummary: (article) => {
    if (!article || !article.description) return "Summary not available.";
    
    // Use first 2-3 sentences as summary
    const sentences = article.description.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const summaryText = sentences.slice(0, Math.min(2, sentences.length)).join('. ') + '.';
    
    console.log("Using local fallback for summary generation");
    return summaryText;
  },
  
  // Local function to analyze sentiment without API
  analyzeLocalSentiment: (article) => {
    if (!article || !article.title) return "Neutral";
    
    // Simple keyword-based sentiment analysis
    const text = (article.title + " " + (article.description || "")).toLowerCase();
    
    const positiveWords = ['success', 'positive', 'good', 'great', 'excellent', 'breakthrough', 
                         'win', 'growth', 'improve', 'progress', 'happy', 'benefit', 'celebrate'];
                         
    const negativeWords = ['crisis', 'negative', 'bad', 'terrible', 'poor', 'disaster', 
                         'fail', 'decline', 'damage', 'problem', 'sad', 'death', 'conflict'];
    
    let positiveScore = positiveWords.filter(word => text.includes(word)).length;
    let negativeScore = negativeWords.filter(word => text.includes(word)).length;
    
    console.log("Using local fallback for sentiment analysis");
    
    if (positiveScore > negativeScore) return "Positive";
    if (negativeScore > positiveScore) return "Negative";
    return "Neutral";
  },
  
  // Local function to determine controversy level without API
  analyzeLocalControversy: (article) => {
    if (!article || !article.title) return "Low";
    
    // Simple keyword-based controversy analysis
    const text = (article.title + " " + (article.description || "")).toLowerCase();
    
    const controversialWords = ['controversy', 'scandal', 'debate', 'protest', 'clash', 'dispute',
                              'conflict', 'divided', 'accusation', 'criticized', 'dispute',
                              'controversial', 'opposing', 'allegation', 'tension'];
    
    let controversyScore = controversialWords.filter(word => text.includes(word)).length;
    
    console.log("Using local fallback for controversy analysis");
    
    return controversyScore >= 1 ? "High" : "Low";
  },
  
  // Local function to generate perspectives without API
  generateLocalPerspectives: (article) => {
    if (!article || !article.title) return "Perspectives not available.";
    
    console.log("Using local fallback for perspectives generation");
    
    // Generate generic perspectives based on article topic
    const text = (article.title + " " + (article.description || "")).toLowerCase();
    
    // Detect topic areas
    const topicAreas = {
      economic: ['economy', 'market', 'business', 'financial', 'trade', 'economic', 'investment', 'stock', 'price'],
      political: ['government', 'political', 'policy', 'election', 'vote', 'president', 'congress', 'law', 'legislation'],
      social: ['community', 'people', 'social', 'public', 'education', 'health', 'society', 'cultural', 'lifestyle'],
      environmental: ['environment', 'climate', 'pollution', 'sustainable', 'energy', 'green', 'conservation', 'wildlife'],
      technological: ['technology', 'digital', 'innovation', 'tech', 'online', 'internet', 'AI', 'software', 'device']
    };
    
    // Find matching topic areas
    const matchedTopics = [];
    for (const [topic, keywords] of Object.entries(topicAreas)) {
      if (keywords.some(keyword => text.includes(keyword))) {
        matchedTopics.push(topic);
      }
    }
    
    // Use default topics if no matches
    const perspectiveTopics = matchedTopics.length >= 2 ? 
      matchedTopics.slice(0, 3) : 
      ['economic', 'social', 'political'].slice(0, 3);
    
    // Generate perspectives based on detected topics
    const perspectives = perspectiveTopics.map(topic => {
      switch(topic) {
        case 'economic':
          return `• Economic Perspective: This news could impact markets and businesses by affecting consumer confidence and investment decisions.`;
        case 'political':
          return `• Political Perspective: Policymakers may need to respond to this development with new legislation or regulatory changes.`;
        case 'social':
          return `• Social Perspective: This may affect communities and social structures, potentially changing how people interact or access resources.`;
        case 'environmental':
          return `• Environmental Perspective: There could be implications for sustainability efforts and natural resource management.`;
        case 'technological':
          return `• Technological Perspective: This might drive innovation or adoption of new technologies to address the situation.`;
        default:
          return `• General Perspective: This news represents a significant development that warrants further monitoring and analysis.`;
      }
    }).join('\n\n');
    
    return perspectives;
  },
  
  // Add local virality calculator to fallbacks
  calculateLocalVirality: (article) => {
    if (!article || !article.title) return "0%";
    
    console.log("Using local fallback for virality calculation");
    
    // Simple scoring system based on article characteristics
    let score = 50; // Start with default score of 50%
    
    const text = (article.title + " " + (article.description || "")).toLowerCase();
    
    // Keywords that might indicate viral potential
    const viralKeywords = [
      'breaking', 'exclusive', 'shocking', 'incredible', 'viral',
      'trending', 'scandal', 'celebrity', 'famous', 'controversy',
      'amazing', 'unbelievable', 'surprising', 'revolutionary'
    ];
    
    // Add points for each viral keyword found (max 25 points)
    const keywordMatches = viralKeywords.filter(word => text.includes(word)).length;
    score += Math.min(keywordMatches * 5, 25);
    
    // Title length factor (shorter titles tend to go viral more easily)
    if (article.title.length < 40) score += 10;
    else if (article.title.length < 60) score += 5;
    
    // Adjust for title case (ALL CAPS titles get attention but can be spammy)
    const allCapsWords = article.title.split(' ').filter(word => 
      word.length > 2 && word === word.toUpperCase()
    ).length;
    
    if (allCapsWords > 0) score += 5;
    
    // Cap the score between 10% and 90%
    score = Math.max(10, Math.min(90, score));
    
    return `${score}%`;
  },
  
  // Add a local chat fallback
  localChatResponse: (question) => {
    if (!question || question.trim().length === 0) {
      return "Please ask a question.";
    }
    
    console.log("Using local fallback for chat response");
    
    // Generic responses for common queries
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes('hello') || lowerQuestion.includes('hi ')) {
      return "Hello! I'm your AI assistant. How can I help you with news today?";
    }
    
    if (lowerQuestion.includes('who are you') || lowerQuestion.includes('what are you')) {
      return "I'm an AI assistant designed to help you understand news articles better.";
    }
    
    if (lowerQuestion.includes('how are you')) {
      return "I'm functioning well, thank you for asking! How can I assist you today?";
    }
    
    if (lowerQuestion.includes('weather')) {
      return "I don't have access to real-time weather data, but I can help you understand news articles about weather events.";
    }
    
    if (lowerQuestion.includes('news') || lowerQuestion.includes('latest')) {
      return "I can help analyze news articles for you. Try opening an article and I'll provide summaries and insights.";
    }
    
    // Default response for other queries
    return "I'm currently operating in offline mode. If you're asking about news articles, I can still help provide basic information and analysis.";
  }
};

export const generateSummary = async (article, lang = 'en') => {
  try {
    // First try with API if conditions allow
    if (API_KEY && article.title && article.description) {
      try {
        const languageName = langNames[lang] || 'English';
        const prompt = `Please provide a concise 2-4 line summary of the following news article in ${languageName}. Focus on the key points and maintain a neutral tone:

        Title: ${article.title}
        Description: ${article.description || article.content}
        
        Summary:`;
        
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        console.log("Attempting summary with Gemini API:", article.title);
        
        const result = await retryGeminiGenerateContent(model, prompt);
        let text = "";
        
        if (result && result.response) {
          const response = await result.response;
          if (response && typeof response.text === 'function') {
            text = response.text().trim();
            
            if (text) {
              console.log("Generated summary (Gemini):", text);
              return text;
            }
          }
        }
        
        // If we reach here, something went wrong with the API response
        throw new Error("Invalid or empty API response");
      } catch (error) {
        console.warn("API-based summary generation failed, using fallback:", error.message);
        // Continue to fallback
      }
    }
    
    // Use local fallback if API is not available or failed
    return localFallbacks.generateLocalSummary(article);
  } catch (error) {
    console.error("Error in generateSummary:", error);
    return localFallbacks.generateLocalSummary(article);
  }
};

export const generatePerspectives = async (article, lang = 'en') => {
  try {
    // First try with API if conditions allow
    if (API_KEY && article.title && article.description) {
      try {
        const languageName = langNames[lang] || 'English';
        const prompt = `Analyze the following news article and provide 3 different perspectives in bullet points in ${languageName}. Each perspective should be from a different viewpoint (e.g., economic, social, political, environmental):

        Title: ${article.title}
        Description: ${article.description || article.content}
        
        Perspectives:`;
        
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        console.log("Attempting perspectives with Gemini API:", article.title);
        
        const result = await retryGeminiGenerateContent(model, prompt);
        let text = "";
        
        if (result && result.response) {
          const response = await result.response;
          if (response && typeof response.text === 'function') {
            text = response.text().trim();
            
            if (text) {
              // Clean up the response if needed
              if (!text.includes('•') && !text.includes('-') && !text.includes('*')) {
                text = text.split('\n')
                  .filter(line => line.trim().length > 0)
                  .map(line => `• ${line.trim()}`)
                  .join('\n');
              }
              
              console.log("Generated perspectives (Gemini):", text);
              return text;
            }
          }
        }
        
        // If we reach here, something went wrong with the API response
        throw new Error("Invalid or empty API response");
      } catch (error) {
        console.warn("API-based perspectives generation failed, using fallback:", error.message);
        // Continue to fallback
      }
    }
    
    // Use local fallback if API is not available or failed
    return localFallbacks.generateLocalPerspectives(article);
  } catch (error) {
    console.error("Error in generatePerspectives:", error);
    return localFallbacks.generateLocalPerspectives(article);
  }
};

export const generateSentiment = async (article, lang = 'en') => {
  try {
    // First try with API if conditions allow
    if (API_KEY && article.title && article.description) {
      try {
        const languageName = langNames[lang] || 'English';
        const prompt = `Analyze the sentiment of the following news article title and description. 
        RESPOND WITH EXACTLY ONE WORD from these options: Positive, Negative, or Neutral.
        
        Example 1:
        Title: Stock market reaches new highs on strong economic data.
        Description: The stock market surged today, reaching record highs after the release of positive economic indicators, boosting investor confidence.
        Sentiment: Positive
        
        Example 2:
        Title: Company announces major layoffs amid declining profits.
        Description: Facing significant financial challenges, the tech giant confirmed it will cut 15% of its workforce due to consistently falling revenue.
        Sentiment: Negative
        
        Example 3:
        Title: City council schedules meeting to discuss park maintenance.
        Description: The local city council will hold its regular meeting next Tuesday to review the budget allocated for maintaining public parks.
        Sentiment: Neutral
        
        Article:
        Title: ${article.title}
        Description: ${article.description}
        Sentiment:`;
        
        const model = genAI.getGenerativeModel({
          model: "gemini-1.5-flash",
          generationConfig: { 
            temperature: 0,
            maxOutputTokens: 10
          }
        });
        
        console.log("Attempting sentiment analysis with Gemini API:", article.title);
        
        const result = await retryGeminiGenerateContent(model, prompt);
        let text = "";
        
        if (result && result.response) {
          const response = await result.response;
          if (response && typeof response.text === 'function') {
            const rawText = response.text();
            text = rawText.trim();
            
            // Use Regex to find the keyword 
            const sentimentMatch = text.match(/\b(Positive|Negative|Neutral)\b/i);
            if (sentimentMatch && sentimentMatch[1]) {
              const foundSentiment = sentimentMatch[1].charAt(0).toUpperCase() + sentimentMatch[1].slice(1).toLowerCase();
              console.log(`Generated sentiment (Gemini): ${foundSentiment}`);
              return foundSentiment;
            }
            
            // Simple keyword matching fallback
            const lowerText = text.toLowerCase();
            if (lowerText.includes('positive')) return "Positive";
            if (lowerText.includes('negative')) return "Negative";
            if (lowerText.includes('neutral')) return "Neutral";
          }
        }
        
        // If we reach here, something went wrong with the API response
        throw new Error("Invalid or empty API response");
      } catch (error) {
        console.warn("API-based sentiment analysis failed, using fallback:", error.message);
        // Continue to fallback
      }
    }
    
    // Use local fallback if API is not available or failed
    return localFallbacks.analyzeLocalSentiment(article);
  } catch (error) {
    console.error("Error in generateSentiment:", error);
    return localFallbacks.analyzeLocalSentiment(article);
  }
};

export const generateControversy = async (article, lang = 'en') => {
  try {
    // First try with API if conditions allow
    if (API_KEY && article.title && article.description) {
      try {
        const languageName = langNames[lang] || 'English';
        const prompt = `Analyze the controversy level of the following news article title and description.
        RESPOND WITH EXACTLY ONE WORD from these options: High or Low.
        
        Example 1:
        Title: Government passes divisive new tax law after heated debate.
        Description: The legislature approved the controversial tax reform bill along party lines, sparking protests from opposition groups.
        Controversy: High
        
        Example 2:
        Title: Local library announces summer reading program for children.
        Description: The public library is launching its annual summer reading challenge next month to encourage literacy among young readers.
        Controversy: Low
        
        Article:
        Title: ${article.title}
        Description: ${article.description}
        Controversy:`;
        
        const model = genAI.getGenerativeModel({
          model: "gemini-1.5-flash",
          generationConfig: { 
            temperature: 0,
            maxOutputTokens: 10
          }
        });
        
        console.log("Attempting controversy analysis with Gemini API:", article.title);
        
        const result = await retryGeminiGenerateContent(model, prompt);
        let text = "";
        
        if (result && result.response) {
          const response = await result.response;
          if (response && typeof response.text === 'function') {
            const rawText = response.text();
            text = rawText.trim();
            
            // Use Regex to find the keyword
            const controversyMatch = text.match(/\b(High|Low)\b/i);
            if (controversyMatch && controversyMatch[1]) {
              const foundControversy = controversyMatch[1].charAt(0).toUpperCase() + controversyMatch[1].slice(1).toLowerCase();
              console.log(`Generated controversy (Gemini): ${foundControversy}`);
              return foundControversy;
            }
            
            // Simple keyword matching fallback
            const lowerText = text.toLowerCase();
            if (lowerText.includes('high')) return "High";
            if (lowerText.includes('low')) return "Low";
          }
        }
        
        // If we reach here, something went wrong with the API response
        throw new Error("Invalid or empty API response");
      } catch (error) {
        console.warn("API-based controversy analysis failed, using fallback:", error.message);
        // Continue to fallback
      }
    }
    
    // Use local fallback if API is not available or failed
    return localFallbacks.analyzeLocalControversy(article);
  } catch (error) {
    console.error("Error in generateControversy:", error);
    return localFallbacks.analyzeLocalControversy(article);
  }
};

// Replace existing implementation with a try-catch pattern
export const generateVirality = async (article, lang = 'en') => {
  try {
    // First try with API if conditions allow
    if (API_KEY && article.title && article.description) {
      try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const languageName = langNames[lang] || 'English';
        const prompt = `Predict the virality of the following news article in ${languageName} as a percentage between 0 and 100. Respond with a single numeric value followed by '%'.
Title: ${article.title}
Description: ${article.description}
Virality:`;
        
        console.log("Attempting virality calculation with Gemini API:", article.title);
        
        const result = await retryGeminiGenerateContent(model, prompt);
        
        if (result && result.response) {
          const response = await result.response;
          if (response && typeof response.text === 'function') {
            const text = await response.text();
            const percentage = text.trim();
            
            // Validate that the result contains a percentage
            if (percentage.match(/\d+%/)) {
              console.log("Generated virality (Gemini):", percentage);
              return percentage;
            }
          }
        }
        
        // If we reach here, something went wrong with the API response
        throw new Error("Invalid or empty API response");
      } catch (error) {
        console.warn("API-based virality calculation failed, using fallback:", error.message);
        // Continue to fallback
      }
    }
    
    // Use local fallback if API is not available or failed
    return localFallbacks.calculateLocalVirality(article);
  } catch (error) {
    console.error("Error in generateVirality:", error);
    return localFallbacks.calculateLocalVirality(article);
  }
};

// Update the chat function to follow the same pattern
export const chatWithGemini = async (question, lang = 'en') => {
  try {
    // First try with API if conditions allow
    if (API_KEY && question && question.trim().length > 0) {
      try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", temperature: 0.6 });
        const languageName = langNames[lang] || 'English';
        const prompt = `You are a helpful AI assistant. Answer the following question in ${languageName}:
Question: ${question}
Answer:`;
        
        console.log("Attempting chat with Gemini API:", question);
        
        const result = await retryGeminiGenerateContent(model, prompt);
        
        if (result && result.response) {
          const response = await result.response;
          if (response && typeof response.text === 'function') {
            const text = await response.text();
            if (text && text.trim().length > 0) {
              console.log("Chat answer from Gemini API");
              return text;
            }
          }
        }
        
        // If we reach here, something went wrong with the API response
        throw new Error("Invalid or empty API response");
      } catch (error) {
        console.warn("API-based chat failed, using fallback:", error.message);
        // Continue to fallback
      }
    }
    
    // Use local fallback if API is not available or failed
    return localFallbacks.localChatResponse(question);
  } catch (error) {
    console.error("Error in chatWithGemini:", error);
    return localFallbacks.localChatResponse(question);
  }
};
