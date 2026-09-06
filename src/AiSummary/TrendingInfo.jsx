import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, Clock, Globe, Sparkles, Zap, Eye, ExternalLink, ChevronRight, BarChart2, Activity, Share2, Bookmark, Flame } from 'lucide-react';
import { fetchNews } from './newsApi';
import { motion } from 'framer-motion';

const TrendingInfo = () => {
  const navigate = useNavigate();
  const [trendingNews, setTrendingNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [animateChart, setAnimateChart] = useState(false);

  useEffect(() => {
    loadTrendingNews();
    
    // Trigger chart animation after a delay
    const timer = setTimeout(() => {
      setAnimateChart(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const loadTrendingNews = async () => {
    try {
      setIsLoading(true);
      const news = await fetchNews("trending OR breaking OR latest");
      
      // Add a trending score and category to each article
      const enhancedNews = news.map(article => ({
        ...article,
        trendingScore: Math.floor(Math.random() * 100) + 1,
        category: ['politics', 'technology', 'health', 'business', 'entertainment'][Math.floor(Math.random() * 5)]
      }));
      
      setTrendingNews(enhancedNews);
    } catch (err) {
      setError("Failed to load trending news");
      console.error("Error loading trending news:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const trendingCategories = [
    { id: 'all', name: 'All Topics' },
    { id: 'politics', name: 'Politics' },
    { id: 'technology', name: 'Technology' },
    { id: 'health', name: 'Health' },
    { id: 'business', name: 'Business' },
    { id: 'entertainment', name: 'Entertainment' },
  ];

  const features = [
    {
      icon: <Activity className="w-6 h-6" />,
      title: "Real-time Updates",
      description: "Stay informed with the latest trending stories that are making waves across the globe."
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "24/7 Coverage",
      description: "Get continuous updates on breaking news and trending topics as they develop."
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Global Perspective",
      description: "Access trending news from multiple regions and understand global impact."
    }
  ];

  const formatDate = (dateString) => {
    const options = { month: "short", day: "numeric", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const filteredNews = activeCategory === 'all' 
    ? trendingNews 
    : trendingNews.filter(article => article.category === activeCategory);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50">
      <motion.div 
        className="max-w-5xl mx-auto p-4 md:p-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.button
          onClick={() => navigate('/ai-summary')}
          className="flex items-center text-blue-600 font-medium hover:text-blue-800 transition-colors mb-8"
          whileHover={{ x: -5 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft className="mr-2" size={20} />
          Back to News
        </motion.button>

        {/* Hero Section */}
        <motion.div 
          className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl shadow-xl overflow-hidden mb-8 relative"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-10 left-40 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute top-20 right-10 w-60 h-60 bg-purple-500/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 left-10 w-40 h-40 bg-blue-300/10 rounded-full blur-2xl"></div>
          </div>
          
          <div className="relative p-8 md:p-10 flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0 md:w-3/5">
              <motion.div 
                className="flex items-center mb-4"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Flame className="w-8 h-8 mr-3 text-yellow-300" />
                <h1 className="text-3xl md:text-4xl font-bold text-white">Trending Now</h1>
              </motion.div>
              <motion.p 
                className="text-lg md:text-xl text-blue-100 mb-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Discover the pulse of global conversations with our real-time trending news. 
                Stay ahead of the curve with stories that are shaping today's world.
              </motion.p>
              <motion.div 
                className="flex flex-wrap gap-2"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                  <Zap className="w-5 h-5 mr-2 text-yellow-300" />
                  <span>Live Updates</span>
                </div>
                <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                  <Eye className="w-5 h-5 mr-2 text-yellow-300" />
                  <span>Global Impact</span>
                </div>
                <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                  <BarChart2 className="w-5 h-5 mr-2 text-yellow-300" />
                  <span>Trending Data</span>
                </div>
              </motion.div>
            </div>
            
            <motion.div 
              className="hidden md:block w-2/5 relative"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.6, type: "spring" }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-transparent rounded-xl"></div>
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-40 h-40 relative">
                    {[0, 1, 2, 3, 4].map(index => (
                      <motion.div
                        key={index}
                        className="absolute w-full h-full rounded-full border-4 border-white/20"
                        style={{ 
                          scale: 1 - index * 0.15,
                          backgroundColor: `rgba(255, 255, 255, ${0.05 - index * 0.01})` 
                        }}
                        animate={animateChart ? {
                          scale: [1 - index * 0.15, 1 + (1 - index * 0.15) * 0.05, 1 - index * 0.15],
                        } : {}}
                        transition={{
                          repeat: Infinity,
                          duration: 2,
                          delay: index * 0.2,
                          ease: "easeInOut"
                        }}
                      />
                    ))}
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 }}
                    >
                      <TrendingUp className="w-14 h-14 text-white" />
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Trending Filters */}
        <motion.div 
          className="bg-white rounded-xl shadow-lg p-4 mb-8 overflow-x-auto"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex space-x-2">
            {trendingCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                  activeCategory === category.id
                    ? "bg-blue-600 text-white font-medium"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300"
              variants={itemVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="text-blue-600 mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Trending News Section */}
        <motion.div 
          className="bg-white rounded-xl shadow-lg p-6 md:p-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <TrendingUp className="w-6 h-6 mr-2 text-blue-600" />
              Latest Trending Stories
            </h2>
            <div className="hidden md:flex items-center text-sm text-gray-500">
              <Clock className="w-4 h-4 mr-1" />
              Updated just now
            </div>
          </div>

          {isLoading ? (
            <div className="flex flex-col justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-r-2 border-blue-600"></div>
              <p className="mt-4 text-gray-500">Loading trending stories...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-600">
              {error}
            </div>
          ) : (
            <motion.div 
              className="space-y-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredNews.map((article, index) => (
                <motion.div
                  key={index}
                  className="border-b border-gray-100 last:border-0 pb-8 last:pb-0"
                  variants={itemVariants}
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    {article.urlToImage && (
                      <div className="md:w-1/3 relative overflow-hidden group">
                        <div className="aspect-w-16 aspect-h-9 md:aspect-auto md:h-full">
                          <img
                            src={article.urlToImage}
                            alt={article.title}
                            className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "/placeholder.jpeg";
                            }}
                          />
                        </div>
                        <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs font-medium px-2.5 py-1 rounded-full flex items-center">
                          <Flame className="w-3 h-3 mr-1" />
                          {article.trendingScore}
                        </div>
                        <div className="absolute top-2 right-2 bg-gray-900/70 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-full">
                          {article.category}
                        </div>
                      </div>
                    )}
                    <div className="md:w-2/3">
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div className="flex items-center">
                          <span className="text-sm bg-blue-50 text-blue-700 font-medium px-3 py-1 rounded-full">
                            {article.source?.name || "Unknown Source"}
                          </span>
                          <span className="text-sm text-gray-500 ml-2">
                            {formatDate(article.publishedAt)}
                          </span>
                        </div>
                        <div className="flex space-x-1">
                          <button className="p-1.5 text-gray-500 hover:text-blue-600 transition-colors rounded-full hover:bg-gray-100">
                            <Bookmark className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 text-gray-500 hover:text-blue-600 transition-colors rounded-full hover:bg-gray-100">
                            <Share2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-3 leading-tight hover:text-blue-600 transition-colors">
                        <a href={article.url} target="_blank" rel="noopener noreferrer">
                          {article.title}
                        </a>
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {article.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <motion.a
                          href={article.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-blue-600 font-medium hover:text-blue-800 transition-colors"
                          whileHover={{ x: 5 }}
                        >
                          Read Full Story
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </motion.a>
                        
                        <div className="hidden md:flex items-center">
                          <div className="relative h-1.5 w-24 bg-gray-200 rounded-full overflow-hidden mr-2">
                            <div 
                              className="absolute inset-y-0 left-0 bg-blue-600 rounded-full"
                              style={{ width: `${article.trendingScore}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-500 flex items-center">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            Trending
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default TrendingInfo; 