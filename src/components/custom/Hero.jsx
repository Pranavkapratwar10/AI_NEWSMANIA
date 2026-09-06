import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Globe, BarChart2, BookOpen, TrendingUp, ChevronLeft, ChevronRight, Clock, ExternalLink, Loader2, X, RotateCw, Sparkles } from "lucide-react";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import { fetchNews } from "../../AiSummary/newsApi";
import SpinWheel from "./SpinWheel";

export default function Hero() {
  const [searchQuery, setSearchQuery] = useState("");
  const [rotatingText, setRotatingText] = useState("diverse perspectives");
  const [isLoading, setIsLoading] = useState(false);
  const [trendingNews, setTrendingNews] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoScroll, setAutoScroll] = useState(true);
  const [showSpinWheel, setShowSpinWheel] = useState(false);
  const timeoutRef = useRef(null);
  const navigate = useNavigate();
  const [carouselLoading, setCarouselLoading] = useState(true);
  const [carouselError, setCarouselError] = useState(null);

  // Trending topics with their search queries
  const trendingTopics = [
    { label: "Politics", query: "politics OR government OR election" },
    { label: "Technology", query: "technology OR tech OR innovation" },
    { label: "Climate", query: "climate OR environment OR global warming" },
    { label: "Health", query: "health OR medical OR healthcare" },
    { label: "Economy", query: "economy OR business OR finance" },
  ];

  // Rotating text effect for the headline
  useEffect(() => {
    const phrases = [
      "diverse perspectives",
      "unbiased reporting",
      "balanced viewpoints",
      "comprehensive coverage",
      "global insights",
    ];

    const interval = setInterval(() => {
      const currentIndex = phrases.indexOf(rotatingText);
      const nextIndex = (currentIndex + 1) % phrases.length;
      setRotatingText(phrases[nextIndex]);
    }, 3000);

    return () => clearInterval(interval);
  }, [rotatingText]);
  
  // Fetch trending news on component mount
  useEffect(() => {
    const loadTrendingNews = async () => {
      try {
        setCarouselLoading(true);
        setCarouselError(null);
        const news = await fetchNews("trending OR breaking OR important");
        // Take only the top 5 news articles with images
        const filteredNews = news
          .filter(article => article.urlToImage && !article.urlToImage.includes('unavailable'))
          .slice(0, 5);
        
        if (filteredNews.length === 0) {
          setCarouselError("No trending news found");
        } else {
          setTrendingNews(filteredNews);
        }
      } catch (error) {
        console.error("Error loading trending news:", error);
        setCarouselError("Failed to load trending news");
      } finally {
        setCarouselLoading(false);
      }
    };
    
    loadTrendingNews();
  }, []);
  
  // Auto-scroll functionality for the carousel
  useEffect(() => {
    const resetTimeout = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
    
    if (autoScroll && trendingNews.length > 0) {
      resetTimeout();
      timeoutRef.current = setTimeout(() => {
        setCurrentSlide(prev => 
          prev === trendingNews.length - 1 ? 0 : prev + 1
        );
      }, 5000); // Change slide every 5 seconds
    }
    
    return () => resetTimeout();
  }, [currentSlide, autoScroll, trendingNews.length]);
  
  // Format publication date
  const formatDate = (dateString) => {
    const options = { month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    // Navigate to AI Summary page with the search query
    navigate(`/ai-summary?query=${encodeURIComponent(searchQuery.trim())}`);
    setIsLoading(false);
  };

  const handleTopicClick = (topic) => {
    setSearchQuery(topic.label);
    setIsLoading(true);
    // Navigate to AI Summary page with the topic's search query
    navigate(`/ai-summary?query=${encodeURIComponent(topic.query)}`);
    setIsLoading(false);
  };
  
  const nextSlide = () => {
    setCurrentSlide(prev => 
      prev === trendingNews.length - 1 ? 0 : prev + 1
    );
  };
  
  const prevSlide = () => {
    setCurrentSlide(prev => 
      prev === 0 ? trendingNews.length - 1 : prev - 1
    );
  };
  
  const goToSlide = (index) => {
    setCurrentSlide(index);
  };
  
  // Pause auto-scroll on hover
  const handleMouseEnter = () => setAutoScroll(false);
  const handleMouseLeave = () => setAutoScroll(true);

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-blue-900 to-indigo-800 text-white">
      {/* Background animations */}
      <motion.div
        className="absolute -top-20 -left-20 w-64 h-64 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full blur-3xl opacity-20"
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute top-40 right-20 w-80 h-80 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full blur-3xl opacity-20"
        animate={{ rotate: -360 }}
        transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
      />

      <div className="container mx-auto px-4 py-16 pt-24 relative z-10">
        <motion.div
          className="max-w-4xl mx-auto text-center mb-10"
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
        >
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8"
            variants={itemVariants}
          >
            Discover News With{" "}
            <motion.span
              className="text-yellow-400 inline-block min-w-32 md:min-w-48"
              animate={{
                scale: [1, 1.05, 1],
                opacity: [1, 1, 1],
              }}
              transition={{
                duration: 1.5,
                times: [0, 0.5, 1],
                repeat: Infinity,
                repeatDelay: 1.5,
              }}
            >
              {rotatingText}
            </motion.span>
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl mb-8"
            variants={itemVariants}
          >
            NewsMannia aggregates multiple credible sources to provide you a
            360° view of today's news
          </motion.p>

          {/* Enhanced Search bar with animation */}
          <motion.form
            onSubmit={handleSearchSubmit}
            className="flex items-center max-w-2xl mx-auto bg-white rounded-full overflow-hidden p-2 shadow-lg transform transition-transform duration-300 hover:scale-105"
            variants={itemVariants}
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for news, topics, or articles..."
              className="flex-grow px-4 py-3 focus:outline-none text-gray-800 text-sm md:text-base placeholder-gray-500"
            />
            <button
              type="submit"
              className={`bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-full flex items-center font-semibold transition-all duration-300 ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isLoading}
              style={{ borderRadius: "999px" }}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <div className="animate-spin mr-2 h-5 w-5 border-t-2 border-white rounded-full"></div>
                  Searching...
                </span>
              ) : (
                <span className="flex items-center">
                  <Search className="mr-2" size={16} />
                  Search
                </span>
              )}
            </button>
          </motion.form>
        </motion.div>

        {/* Trending topics */}
        <motion.div
          className="max-w-4xl mx-auto mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <div className="flex items-center justify-center space-x-2 text-sm">
            <TrendingUp size={16} className="text-yellow-400" />
            <span className="font-semibold">Trending:</span>
            <div className="flex flex-wrap justify-center gap-2">
              {trendingTopics.map((topic, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleTopicClick(topic)}
                  className="px-3 py-1 bg-blue-800 bg-opacity-40 hover:bg-blue-700 rounded-full text-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {topic.label}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* News Carousel */}
        <motion.div
          className="max-w-5xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <motion.div
            className="bg-gray-900 bg-opacity-50 rounded-xl p-4 shadow-2xl overflow-hidden relative"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {carouselLoading ? (
              // Loading state
              <div className="relative w-full h-64 md:h-80 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="w-10 h-10 text-white animate-spin" />
                  <p className="text-white text-lg">Loading trending news...</p>
                </div>
              </div>
            ) : carouselError ? (
              // Error state with fallback
              <div className="relative w-full h-64 md:h-80">
                <img
                  src="/news_homecard.webp"
                  alt="News Preview"
                  className="w-full h-full object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70 rounded-lg" />
                <div className="absolute bottom-0 left-0 p-6">
                  <div className="flex space-x-2 mb-3">
                    <span className="bg-yellow-500 text-black px-2 py-1 rounded text-xs font-bold">
                      FEATURED
                    </span>
                    <span className="bg-blue-600 px-2 py-1 rounded text-xs font-bold">
                      NEWS
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-2">
                    See multiple perspectives on breaking stories
                  </h2>
                  <p className="text-gray-300 text-sm md:text-base">
                    Compare viewpoints from sources across the different spectrum
                  </p>
                </div>
              </div>
            ) : trendingNews.length > 0 ? (
              // Carousel with news
              <>
                {/* Carousel container */}
                <div className="relative w-full h-64 md:h-80 overflow-hidden rounded-lg">
                  {/* Carousel slides */}
                  <div className="relative w-full h-full">
                    {trendingNews.map((article, index) => (
                      <div
                        key={index}
                        className={`absolute top-0 left-0 w-full h-full transition-all duration-500 ease-in-out ${
                          index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
                        }`}
                        style={{ transform: `translateX(${(index - currentSlide) * 100}%)` }}
                      >
                        <a 
                          href={article.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="block w-full h-full group"
                        >
                          <img
                            src={article.urlToImage}
                            alt={article.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            onError={(e) => {
                              e.target.onerror = null; // Prevent infinite loops
                              e.target.src = "/news_homecard.webp"; // Fallback image
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-80" />
                          <div className="absolute bottom-0 left-0 p-6 w-full">
                            <div className="flex justify-between items-center mb-3">
                              <div className="flex space-x-2">
                                <span className="bg-yellow-500 text-black px-2 py-1 rounded text-xs font-bold">
                                  TRENDING
                                </span>
                                {article.source?.name && (
                                  <span className="bg-blue-600 px-2 py-1 rounded text-xs font-bold truncate max-w-[150px]">
                                    {article.source.name}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center text-gray-300 text-xs">
                                <Clock size={12} className="mr-1" />
                                {formatDate(article.publishedAt)}
                              </div>
                            </div>
                            <h2 className="text-xl md:text-2xl font-bold mb-2 line-clamp-2 group-hover:text-yellow-400 transition-colors">
                              {article.title}
                            </h2>
                            <p className="text-gray-300 text-sm md:text-base line-clamp-2">
                              {article.description}
                            </p>
                            <div className="flex items-center mt-3 text-yellow-400 text-sm font-medium group-hover:translate-x-2 transition-transform">
                              Read Full Story
                              <ExternalLink size={14} className="ml-1" />
                            </div>
                          </div>
                        </a>
                      </div>
                    ))}
                  </div>
                  
                  {/* Navigation buttons */}
                  <button
                    onClick={(e) => {
                      e.preventDefault(); // Prevent triggering the parent link
                      prevSlide();
                    }}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full p-2 z-20 transition-all hover:scale-110"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault(); // Prevent triggering the parent link
                      nextSlide();
                    }}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full p-2 z-20 transition-all hover:scale-110"
                  >
                    <ChevronRight size={24} />
                  </button>
                  
                  {/* Dots indicator */}
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
                    {trendingNews.map((_, index) => (
                      <button
                        key={index}
                        onClick={(e) => {
                          e.preventDefault(); // Prevent triggering the parent link
                          goToSlide(index);
                        }}
                        className={`w-2 h-2 rounded-full transition-all ${
                          index === currentSlide ? "bg-white w-4" : "bg-white/50 hover:bg-white/70"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </>
            ) : (
              // Fallback when no valid news found but no error occurred
              <div className="relative w-full h-64 md:h-80">
                <img
                  src="/news_homecard.webp"
                  alt="News Preview"
                  className="w-full h-full object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70 rounded-lg" />
                <div className="absolute bottom-0 left-0 p-6">
                  <div className="flex space-x-2 mb-3">
                    <span className="bg-yellow-500 text-black px-2 py-1 rounded text-xs font-bold">
                      FEATURED
                    </span>
                    <span className="bg-blue-600 px-2 py-1 rounded text-xs font-bold">
                      NEWS
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-2">
                    See multiple perspectives on breaking stories
                  </h2>
                  <p className="text-gray-300 text-sm md:text-base">
                    Compare viewpoints from sources across the different spectrum
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
        
        {/* Feature highlights */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionVariants}
        >
          {[
            {
              icon: <Globe size={48} className="text-yellow-300" />,
              title: "Multi-source Aggregation",
              description:
                "News from diverse global sources for a comprehensive understanding",
            },
            {
              icon: <BarChart2 size={48} className="text-yellow-300" />,
              title: "Credibility Rating",
              description: "AI-powered fact-checking and source verification",
            },
            {
              icon: <BookOpen size={48} className="text-yellow-300" />,
              title: "In-depth Analysis",
              description:
                "Explore the nuances and multiple dimensions of complex stories",
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="bg-blue-800 bg-opacity-40 p-6 rounded-xl text-center transform transition-transform duration-300 hover:scale-105"
              variants={itemVariants}
            >
              <div className="flex justify-center mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-blue-100">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
        {/* Stats counter */}
        <motion.div
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionVariants}
        >
          {[
            { value: "100+", label: "News Sources" },
            { value: "15K+", label: "Daily Articles" },
            { value: "5", label: "Perspectives" },
            { value: "12", label: "Languages" },
          ].map((stat, index) => (
            <motion.div key={index} variants={itemVariants}>
              <motion.div
                className="text-4xl font-bold text-yellow-400"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: 0.1 * index,
                  duration: 0.5,
                }}
              >
                {stat.value}
              </motion.div>
              <div className="text-sm text-gray-300">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="mt-16 bg-gradient-to-r from-blue-800 via-indigo-800 to-purple-800 rounded-lg p-8 shadow-lg"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-center text-2xl font-bold mb-6 text-yellow-400">
            Trusted Sources
          </h2>
          <div className="flex justify-center space-x-8 items-center flex-wrap gap-y-6">
            {[
              "The Hindu",
              "Times of India",
              "BBC",
              "Al Jazeera",
              "Dainik Bhaskar",
            ].map((source, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0.8 }}
                whileHover={{
                  opacity: 1,
                  scale: 1.15,
                  boxShadow: "0 8px 20px rgba(255, 255, 255, 0.3)",
                }}
                className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold rounded-full text-sm shadow-md transform transition-transform duration-300"
              >
                {source}
              </motion.div>
            ))}
          </div>
        </motion.div>
        {/* CTA Section */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            Experience news from every angle 📐
          </h2>
          <Link to="/Ai-summary">
            <Button className="px-3 py-1 bg-blue-800 bg-opacity-40 hover:bg-blue-700 rounded-full text-sm">
              Get Started Now 🚀
            </Button>
          </Link>
        </motion.div>

        {/* Floating Spin Wheel button - with wheel design */}
        <motion.div
          className="fixed bottom-32 right-8 z-50"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 1.5
          }}
        >
          <motion.button
            onClick={() => setShowSpinWheel(true)}
            className="bg-gradient-to-r from-yellow-400 to-orange-500 w-20 h-20 rounded-full flex items-center justify-center shadow-lg cursor-pointer relative overflow-hidden"
            whileHover={{ 
              scale: 1.1,
              boxShadow: "0 0 25px rgba(255, 214, 0, 0.7)",
              rotate: 15
            }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Wheel segments in the background */}
            {[...Array(8)].map((_, i) => (
              <div 
                key={i}
                className="absolute inset-0"
                style={{
                  transform: `rotate(${i * 45}deg)`,
                  clipPath: 'polygon(50% 50%, 50% 0%, 100% 0%, 100% 50%)',
                  background: i % 2 === 0 ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.1)',
                }}
              />
            ))}
            
            {/* Center pin */}
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                >
                  <RotateCw className="w-7 h-7 text-yellow-300" />
                </motion.div>
              </div>
            </div>
            
            {/* Spinning animation */}
            <motion.div
              className="absolute inset-0 border-4 border-dashed border-white/30 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
            
            {/* Sparkles overlay */}
            <motion.div
              animate={{ 
                scale: [1, 1.3, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              className="absolute z-20 top-1 right-1"
            >
              <Sparkles className="w-5 h-5 text-white" />
            </motion.div>
          </motion.button>
          
          <motion.div
            className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center z-10"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 2, type: "spring" }}
          >
            <span>!</span>
          </motion.div>
          
          <motion.div
            className="absolute -left-32 top-4 bg-white text-indigo-900 text-xs font-bold rounded-full px-3 py-2 shadow-md whitespace-nowrap"
            initial={{ opacity: 0, x: 10 }}
            animate={{ 
              opacity: [0, 1, 0],
              x: [10, 0, 10]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatDelay: 5,
              delay: 2.5
            }}
          >
            Spin the Wheel for News!
          </motion.div>
        </motion.div>
        
        {/* Spin Wheel Modal - improved formatting */}
        <AnimatePresence>
          {showSpinWheel && (
            <motion.div
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center overflow-y-auto py-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSpinWheel(false)}
            >
              <motion.div 
                className="relative bg-gradient-to-br from-indigo-900 to-purple-900 p-6 rounded-xl max-w-3xl w-full mx-4 my-6"
                initial={{ scale: 0.8, y: 50, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.8, y: 50, opacity: 0 }}
                transition={{ type: "spring", damping: 25 }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Back to home button */}
                <div className="flex justify-between items-center mb-6">
                  <motion.button 
                    className="flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-full shadow-lg"
                    onClick={() => setShowSpinWheel(false)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ChevronLeft className="w-5 h-5 mr-1" />
                    Back to Home
                  </motion.button>
                  
                  <button 
                    className="bg-white/10 p-2 rounded-full text-white hover:bg-white/20 transition-colors"
                    onClick={() => setShowSpinWheel(false)}
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <h2 className="text-2xl font-bold text-yellow-300 text-center mb-2">Discover Random News!</h2>
                <p className="text-center text-indigo-200 mb-6">Spin the wheel to find unique stories from across the globe</p>
                
                {/* Particles for decoration */}
                {[...Array(10)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 rounded-full bg-yellow-400 opacity-70"
                    initial={{ 
                      top: Math.random() * 100 + '%',
                      left: Math.random() * 100 + '%',
                      scale: 0
                    }}
                    animate={{
                      top: [
                        Math.random() * 100 + '%',
                        Math.random() * 100 + '%',
                        Math.random() * 100 + '%'
                      ],
                      left: [
                        Math.random() * 100 + '%',
                        Math.random() * 100 + '%',
                        Math.random() * 100 + '%'
                      ],
                      scale: [0, 1, 0],
                      opacity: [0, 0.8, 0]
                    }}
                    transition={{
                      duration: 4 + Math.random() * 6,
                      repeat: Infinity,
                      delay: Math.random() * 2,
                    }}
                  />
                ))}
                
                <div className="relative mx-auto">
                  <SpinWheel />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
