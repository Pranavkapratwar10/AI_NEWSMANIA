import React, { useState, useEffect } from "react";
import { fetchNews } from "./newsApi";
import { generatePerspectives, generateSummary, generateSentiment, generateControversy } from "./geminiApi";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Search,
  Clock,
  ChevronDown,
  ChevronUp,
  X,
  Sparkles,
  Shield,
  Award,
  CheckCircle,
  Zap,
  Eye,
  Brain,
  TrendingUp,
  Globe,
  Briefcase,
  Heart,
  Cpu,
  Droplets,
  DollarSign,
  Bookmark,
  Share2,
  MessageCircle,
  ExternalLink,
  BookOpen,
  BarChart2,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { useBookmarks } from "../context/BookmarkContext";
import { useTranslation } from 'react-i18next';

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
  
  // Check if the source name is in our trusted sources list
  for (const [key, value] of Object.entries(TRUSTED_SOURCES)) {
    if (sourceName.includes(key)) {
      return value;
    }
  }
  
  return TRUSTED_SOURCES.default;
};

// Function to get the badge component based on source priority
const getSourceBadge = (sourceName) => {
  const priority = getSourcePriority(sourceName);
  
  switch (priority) {
    case 1:
      return (
        <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold bg-green-100 text-green-800 border-2 border-green-300 shadow-sm">
          <Shield className="w-4 h-4 mr-1.5" />
          Tier 1: Highly Trusted
        </span>
      );
    case 2:
      return (
        <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold bg-blue-100 text-blue-800 border-2 border-blue-300 shadow-sm">
          <Award className="w-4 h-4 mr-1.5" />
          Tier 2: Trusted
        </span>
      );
    case 3:
      return (
        <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold bg-indigo-100 text-indigo-800 border-2 border-indigo-300 shadow-sm">
          <CheckCircle className="w-4 h-4 mr-1.5" />
          Tier 3: Reliable
        </span>
      );
    case 4:
      return (
        <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold bg-gray-100 text-gray-800 border-2 border-gray-300 shadow-sm">
          <CheckCircle className="w-4 h-4 mr-1.5" />
          Tier 4: Source
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold bg-gray-50 text-gray-500 border-2 border-gray-200">
          <CheckCircle className="w-4 h-4 mr-1.5" />
          Tier 5: Other
        </span>
      );
  }
};

// Add sentiment badge helper
const getSentimentBadge = (sentiment) => {
  switch (sentiment) {
    case "Positive":
      return (
        <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold bg-green-100 text-green-800 border-2 border-green-300 shadow-sm">
          Positive
        </span>
      );
    case "Negative":
      return (
        <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold bg-red-100 text-red-800 border-2 border-red-300 shadow-sm">
          Negative
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold bg-gray-100 text-gray-800 border-2 border-gray-300 shadow-sm">
          Neutral
        </span>
      );
  }
};

// Add controversy badge helper
const getControversyBadge = (level) => {
  return (
    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold ${
      level === 'High'
        ? 'bg-yellow-100 text-yellow-800 border-yellow-300'
        : 'bg-gray-100 text-gray-800 border-gray-300'
    } border-2 shadow-sm`}>
      {level} Controversy
    </span>
  );
};

// After getControversyBadge (before categories definition)
const getUniquenessBadge = (uniqueness) => {
  const score = Number.isFinite(uniqueness) ? uniqueness : 0;
  let bg;
  if (score >= 75) bg = 'bg-green-100 text-green-800 border-green-300';
  else if (score >= 50) bg = 'bg-blue-100 text-blue-800 border-blue-300';
  else bg = 'bg-gray-100 text-gray-800 border-gray-300';
  return (
    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold ${bg} border-2 shadow-sm`}>
      {score}% Unique
    </span>
  );
};

// Define categories with their icons and search queries
const categories = [
  {
    name: "Trending",
    icon: TrendingUp,
    query: "trending OR breaking OR latest",
    color: "from-red-500 to-pink-500",
  },
  {
    name: "Politics",
    icon: Globe,
    query: "politics OR government OR election",
    color: "from-blue-500 to-indigo-500",
  },
  {
    name: "Technology",
    icon: Cpu,
    query: "technology OR tech OR innovation",
    color: "from-purple-500 to-indigo-500",
  },
  {
    name: "Climate",
    icon: Droplets,
    query: "climate OR environment OR global warming",
    color: "from-green-500 to-emerald-500",
  },
  {
    name: "Health",
    icon: Heart,
    query: "health OR medical OR healthcare",
    color: "from-pink-500 to-rose-500",
  },
  {
    name: "Economy",
    icon: DollarSign,
    query: "economy OR business OR finance",
    color: "from-yellow-500 to-amber-500",
  },
  {
    name: "Sports",
    icon: Briefcase,
    query: "sports OR athletics OR competition",
    color: "from-orange-500 to-red-500",
  },
  {
    name: "Entertainment",
    icon: Sparkles,
    query: "entertainment OR movies OR music",
    color: "from-violet-500 to-purple-500",
  },
];

const NewsHomepage = () => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const [activeNav, setActiveNav] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [summary, setSummary] = useState("");
  const [generatingArticles, setGeneratingArticles] = useState({});
  const [sentimentMap, setSentimentMap] = useState({});
  const [controversyMap, setControversyMap] = useState({});
  const [uniquenessMap, setUniquenessMap] = useState({});
  const [searchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState("Trending");
  const { bookmarks, addBookmark, removeBookmark, isBookmarked } = useBookmarks();
  const [isShared, setIsShared] = useState(false);

  useEffect(() => {
    // Get query from URL parameters
    const query = searchParams.get("query");
    if (query) {
      setSearchQuery(query);
      loadNews(query);
    } else {
      // Load trending news by default
      loadNews("trending OR breaking OR latest");
    }
  }, [searchParams, i18n.language]);

  const loadNews = async (query) => {
    setIsLoading(true);
    setError(null);
    setArticles([]); // Clear existing articles while loading
    
    console.log(`Loading news for query: ${query}`);
    
    try {
      const articles = await fetchNews(query, i18n.language);
      
      // Check if we got any articles
      if (!articles || articles.length === 0) {
        console.warn("No articles returned for query:", query);
        setArticles([]);
        setError("No news articles found. Please try a different search term.");
        setIsLoading(false);
        return;
      }
      
      console.log(`Successfully loaded ${articles.length} articles`);
      setArticles(articles);

      // Fetch sentiment & controversy
      try {
        const analysisResults = await Promise.all(
          articles.map(async (article) => {
            const [sentiment, controversy] = await Promise.all([
              generateSentiment(article, i18n.language),
              generateControversy(article, i18n.language)
            ]);
            return { url: article.url, sentiment, controversy };
          })
        );
        const newSentiment = {};
        const newControversy = {};
        analysisResults.forEach(({ url, sentiment, controversy }) => {
          newSentiment[url] = sentiment;
          newControversy[url] = controversy;
        });
        setSentimentMap(newSentiment);
        setControversyMap(newControversy);
      } catch (analysisError) {
        console.error("Error analyzing articles:", analysisError);
        // Non-critical error, continue without sentiment/controversy
      }

      // Compute uniqueness by comparing text similarity
      try {
        const uniqMap = {};
        articles.forEach((article) => {
          const baseWords = new Set(
            (article.title + ' ' + article.description)
              .toLowerCase()
              .split(/\W+/)
              .filter(Boolean)
          );
          let totalSim = 0;
          let count = 0;
          articles.forEach((other) => {
            if (other.url !== article.url) {
              const otherWords = new Set(
                (other.title + ' ' + other.description)
                  .toLowerCase()
                  .split(/\W+/)
                  .filter(Boolean)
              );
              const intersection = [...baseWords].filter(w => otherWords.has(w)).length;
              const union = new Set([...baseWords, ...otherWords]).size;
              totalSim += union ? intersection / union : 0;
              count++;
            }
          });
          const avgSim = count ? totalSim / count : 0;
          uniqMap[article.url] = Math.round((1 - avgSim) * 100);
        });
        setUniquenessMap(uniqMap);
      } catch (uniqueError) {
        console.error("Error computing uniqueness:", uniqueError);
        // Non-critical error, continue without uniqueness
      }

    } catch (err) {
      console.error("Error loading news:", err);
      
      let errorMessage = "Failed to load news. Please try again later.";
      
      // Handle specific error messages
      if (err.message.includes("developer plan") || err.message.includes("426")) {
        errorMessage = "Developer API plan restriction: News can't be loaded in production. Please contact the administrator.";
      } else if (err.message.includes("rate limit") || err.message.includes("429")) {
        errorMessage = "API rate limit exceeded. Please wait a moment and try again.";
      } else if (err.message.includes("CORS") || err.message.includes("origin")) {
        errorMessage = "Cross-origin request blocked. Using a direct API call isn't supported in production.";
      }
      
      setError(errorMessage);
      setArticles([]);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavClick = (category) => {
    console.log("Nav clicked:", category);
    if (category === "Categories") {
      console.log("Navigating to categories-info");
      setActiveNav("categories");
      navigate('/categories-info');
      return;
    }
    if (category === "Trending") {
      console.log("Navigating to trending-info");
      setActiveNav("trending");
      navigate('/trending-info');
      return;
    }
    setActiveNav(category.name.toLowerCase());
    setActiveCategory(category.name);
    loadNews(category.query);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    loadNews(searchQuery);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const formatDate = (dateString) => {
    const options = { month: "short", day: "numeric", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const handleGenerateSummary = async (article) => {
    // Check cache first to avoid repeated API rate limits
    const cacheKey = `aiCache_${encodeURIComponent(article.url)}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const { summary: cachedSummary, perspectives: cachedPerspectives } = JSON.parse(cached);
      navigate('/summary-and-impacts', {
        state: { article, summary: cachedSummary, perspectives: cachedPerspectives }
      });
      return;
    }
    try {
      // Set loading state for this specific article
      setGeneratingArticles(prev => ({
        ...prev,
        [article.url]: true
      }));
      
      setSelectedArticle(article);
      setSummary("Generating summary...");

      const summaryText = await generateSummary(article, i18n.language);
      const perspectivesText = await generatePerspectives(article, i18n.language);
      
      // Cache results to prevent future rate-limit errors
      localStorage.setItem(cacheKey, JSON.stringify({ summary: summaryText, perspectives: perspectivesText }));
      
      // Always set summary and navigate, using fallback if necessary
      setSummary(summaryText);
      navigate('/summary-and-impacts', {
        state: {
          article,
          summary: summaryText,
          perspectives: perspectivesText
        }
      });
    } catch (error) {
      console.error("Error generating summary:", error);
      // If rate limited, show a specific message
      if (error.message.includes('429') || (error?.response?.status === 429)) {
        toast.error('API rate limit exceeded. Please wait a moment and try again.');
      } else {
        toast.error('Failed to generate summary. Please try again.');
      }
      setError("Failed to generate summary. Please try again.");
      setSummary("");
    } finally {
      // Clear loading state for this specific article
      setGeneratingArticles(prev => ({
        ...prev,
        [article.url]: false
      }));
    }
  };

  const handleGeneratePerspective = async (article) => {
    try {
      console.log("Generating perspectives...");
      const perspectives = await generatePerspectives(article, i18n.language);
      console.log("Perspectives:", perspectives);
    } catch (error) {
      console.error("Error generating perspectives:", error);
    }
  };

  const searchVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    hover: { scale: 1.02 },
  };

  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
  };

  // Use bookmark context for adding/removing bookmarks
  const handleBookmark = (article) => {
    if (isBookmarked(article.url)) {
      removeBookmark(article.url);
    } else {
      addBookmark({
        id: article.url,
        title: article.title,
        description: article.description,
        image: article.urlToImage,
        date: new Date().toISOString(),
        category: activeCategory,
        readTime: '5 min read',
        source: article.source?.name || 'Unknown Source',
        url: article.url
      });
    }
    toast.success(
      isBookmarked(article.url)
        ? 'Article removed from bookmarks'
        : 'Article added to bookmarks'
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Hero Section */}
        <section className="relative pt-24 pb-16 overflow-hidden">
          {/* Decorative Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-700 to-blue-800">
            {/* Animated gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-transparent to-indigo-400/20 animate-gradient"></div>
            
            {/* Subtle pattern overlay */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 mix-blend-overlay"></div>
            
            {/* Light effects */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-blue-300/10 to-transparent"></div>
            <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-indigo-300/10 to-transparent"></div>
            
            {/* Animated circles */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-72 h-72 bg-indigo-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
            
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer"></div>
          </div>
          
          <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col items-center justify-center"
            >
              <h1 className="text-5xl font-bold mb-6 leading-tight text-center">
                Stay Informed with
                <span className="relative inline-block">
                  <span className="text-blue-300"> 360° News</span>
                  <motion.div
                    className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                  />
                </span>
              </h1>
              <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto leading-relaxed text-center">
                Unbiased reporting from multiple credible sources. Discover the full
                story behind every headline.
              </p>
            </motion.div>

            {/* Enhanced Search */}
            <motion.div
              initial="initial"
              animate="animate"
              className="relative max-w-2xl mx-auto"
            >
              <motion.form
                onSubmit={handleSearch}
                className="flex shadow-2xl rounded-full bg-white/95 backdrop-blur-sm"
                variants={searchVariants}
                whileHover="hover"
              >
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Search news, topics, or articles..."
                  className="w-full py-4 px-8 rounded-l-full focus:outline-none text-lg text-gray-800 placeholder-gray-400 flex-grow"
                />

                <motion.button
                  type="submit"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  className={`bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-10 py-4 rounded-r-full flex items-center justify-center transition-all ${
                    isLoading
                      ? "opacity-75 cursor-not-allowed"
                      : "hover:bg-blue-700"
                  }`}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin mr-2 h-5 w-5 border-t-2 border-white rounded-full"></div>
                      Searching...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <Search className="mr-2" size={20} />
                      Search
                    </div>
                  )}
                </motion.button>
              </motion.form>
            </motion.div>
          </div>
        </section>

        {/* Category Navigation */}
        <div className="sticky top-16 z-20 bg-gradient-to-b from-white to-gray-50/90 backdrop-blur-md shadow-[0_8px_30px_-12px_rgba(0,0,0,0.15)] rounded-2xl mb-8 border border-gray-100/50 transform -translate-y-1">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex overflow-x-auto py-4 scrollbar-hide justify-center">
              {categories.map((category) => (
                <motion.button
                  key={category.name}
                  onClick={() => handleNavClick(category)}
                  className={`flex items-center px-6 py-3 mx-2 whitespace-nowrap text-sm font-bold rounded-full transition-all transform hover:scale-105 ${
                    activeCategory === category.name
                      ? `bg-gradient-to-b ${category.color} text-white shadow-md`
                      : "bg-white text-gray-700 hover:bg-gray-50 shadow-sm hover:shadow-md"
                  }`}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <category.icon className="w-5 h-5 mr-2" />
                  {category.name}
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto">
          {/* Feature Message */}
          <div className="mb-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 shadow-lg">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="flex items-start space-x-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Zap className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Save Time</h3>
                  <p className="text-gray-600">Get instant AI-powered summaries of complex news stories in seconds.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-indigo-100 p-3 rounded-full">
                  <Eye className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Multiple Perspectives</h3>
                  <p className="text-gray-600">View news from different angles with our comprehensive source analysis.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-purple-100 p-3 rounded-full">
                  <Brain className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Insights</h3>
                  <p className="text-gray-600">Understand the impact and implications of news stories with AI analysis.</p>
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="text-center py-12 bg-red-50 rounded-2xl">
              <div className="text-2xl text-red-500 mb-4">🚨 {error}</div>
              <button
                onClick={() => loadNews("Trending")}
                className="text-blue-600 hover:underline"
              >
                Try reloading with trending news
              </button>
            </div>
          )}

          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  {/* Article Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={article.urlToImage || '/placeholder-news.jpg'}
                      alt={article.title}
                      className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                    />
                    {article.source?.name && (
                      <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm font-medium">
                        {article.source.name}
                      </div>
                    )}
                  </div>

                  {/* Article Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-3 line-clamp-2 text-gray-900">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {article.description}
                    </p>

                    {/* Badges */}
                    <div className="mb-2">
                      {getSourceBadge(article.source?.name)}
                    </div>
                    <div className="flex items-center gap-2 mb-4">
                      {getSentimentBadge(sentimentMap[article.url])}
                      {getControversyBadge(controversyMap[article.url])}
                      {getUniquenessBadge(uniquenessMap[article.url])}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between mt-6">
                      <div className="flex items-center gap-4">
                        <motion.div
                          animate={isBookmarked(article.url) ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          <motion.button
                            onClick={() => handleBookmark(article)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.9 }}
                            className={`flex items-center justify-center w-14 h-14 rounded-lg transition-all ${
                              isBookmarked(article.url)
                                ? 'bg-amber-500 text-white border-2 border-amber-600 shadow-md'
                                : 'bg-amber-100 text-amber-700 hover:bg-amber-200 border-2 border-amber-300'
                            }`}
                            title={
                              isBookmarked(article.url)
                                ? 'Remove from bookmarks'
                                : 'Add to bookmarks'
                            }
                          >
                            <Bookmark className="w-10 h-10" />
                          </motion.button>
                        </motion.div>
                        <button
                          onClick={() => {
                            setIsShared(true);
                            navigator.share?.({
                              title: article.title,
                              text: article.description,
                              url: article.url,
                            }).catch(() => {
                              navigator.clipboard.writeText(article.url);
                              toast.success('Link copied to clipboard!');
                            });
                          }}
                          className="flex items-center justify-center w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-all border-2 border-emerald-300"
                          title="Share article"
                        >
                          <Share2 className="w-10 h-10" />
                        </button>
                        <div className="relative group">
                          <button
                            onClick={() => handleGenerateSummary(article)}
                            className={`flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg border-2 border-blue-400 ${
                              generatingArticles[article.url] ? 'animate-pulse' : ''
                            }`}
                            title="Generate AI Summary & Perspectives"
                          >
                            {generatingArticles[article.url] ? (
                              <div className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
                              </div>
                            ) : (
                              <Brain className="w-10 h-10" />
                            )}
                          </button>
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-3 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 border border-gray-100">
                            <div className="text-xs text-gray-600">
                              <div className="font-medium text-gray-800 mb-1">AI-Powered Analysis:</div>
                              <ul className="space-y-1">
                                <li className="flex items-start">
                                  <span className="text-blue-500 mr-1">•</span>
                                  <span>Comprehensive article summary</span>
                                </li>
                                <li className="flex items-start">
                                  <span className="text-blue-500 mr-1">•</span>
                                  <span>Multiple perspective analysis</span>
                                </li>
                                <li className="flex items-start">
                                  <span className="text-blue-500 mr-1">•</span>
                                  <span>Key insights and implications</span>
                                </li>
                              </ul>
                            </div>
                            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-white border-r border-b border-gray-100"></div>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            // Navigate to discussion page
                            navigate(`/article-discussion/${encodeURIComponent(article.url)}`, {
                              state: {
                                articleId: article.url,
                                articleTitle: article.title,
                                articleImage: article.urlToImage,
                                articleSource: article.source?.name
                              }
                            });
                          }}
                          className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-violet-500 to-purple-500 text-white hover:from-violet-600 hover:to-purple-600 transition-all shadow-md hover:shadow-lg border-2 border-violet-400 group relative"
                          title="Join the discussion"
                        >
                          <MessageCircle className="w-8 h-8" />
                          <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-800 text-white text-sm rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap">
                            Join Discussion
                            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-800"></div>
                          </span>
                        </button>
                        <a
                          href={article.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center w-14 h-14 rounded-lg bg-gradient-to-r from-teal-500 to-cyan-500 text-white hover:from-teal-600 hover:to-cyan-600 transition-all shadow-md hover:shadow-lg border-2 border-teal-400 group relative"
                          title="Read full article"
                        >
                          <ExternalLink className="w-8 h-8" />
                          <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-800 text-white text-sm rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap">
                            Read Full Story
                            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-800"></div>
                          </span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default NewsHomepage;
