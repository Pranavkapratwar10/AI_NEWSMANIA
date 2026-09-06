import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  Globe,
  Cpu,
  Droplets,
  Heart,
  DollarSign,
  Briefcase,
  Sparkles,
  ArrowLeft,
  Search,
  X,
  Newspaper,
  ChevronRight,
  BookOpen,
} from "lucide-react";

// Define categories with their details
const categories = [
  {
    name: "Trending",
    icon: TrendingUp,
    description: "Stay updated with the latest breaking news and trending topics from around the world.",
    color: "from-red-500 to-pink-500",
    query: "trending OR breaking OR latest",
  },
  {
    name: "Politics",
    icon: Globe,
    description: "Explore political news, government policies, and election updates from multiple perspectives.",
    color: "from-blue-500 to-indigo-500",
    query: "politics OR government OR election",
  },
  {
    name: "Technology",
    icon: Cpu,
    description: "Discover the latest in tech innovations, AI developments, and digital transformations.",
    color: "from-purple-500 to-indigo-500",
    query: "technology OR tech OR innovation",
  },
  {
    name: "Climate",
    icon: Droplets,
    description: "Learn about environmental changes, climate policies, and sustainability initiatives.",
    color: "from-green-500 to-emerald-500",
    query: "climate OR environment OR global warming",
  },
  {
    name: "Health",
    icon: Heart,
    description: "Stay informed about healthcare developments, medical research, and wellness tips.",
    color: "from-pink-500 to-rose-500",
    query: "health OR medical OR healthcare",
  },
  {
    name: "Economy",
    icon: DollarSign,
    description: "Track economic trends, business news, and financial market updates.",
    color: "from-yellow-500 to-amber-500",
    query: "economy OR business OR finance",
  },
  {
    name: "Sports",
    icon: Briefcase,
    description: "Get the latest sports news, match updates, and athlete profiles.",
    color: "from-orange-500 to-red-500",
    query: "sports OR athletics OR competition",
  },
  {
    name: "Entertainment",
    icon: Sparkles,
    description: "Explore news from the world of entertainment, movies, music, and celebrity updates.",
    color: "from-violet-500 to-purple-500",
    query: "entertainment OR movies OR music",
  },
];

export default function CategoriesInfo() {
  const navigate = useNavigate();
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Filter categories based on search query
  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCategoryClick = (category) => {
    setIsLoading(true);
    setSelectedCategory(category.name);
    
    // Simulate loading state
    setTimeout(() => {
      // Navigate to AI Summary page with the category's search query
      navigate(`/ai-summary?query=${encodeURIComponent(category.query)}`);
    }, 500);
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
        delay: 0.3,
      },
    },
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
        delay: 0.5,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          onClick={handleBackClick}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" />
          Back to News
        </motion.button>

        {/* Enhanced Header */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          animate="visible"
          className="relative mb-16"
        >
          {/* Decorative elements */}
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-100 rounded-full blur-3xl opacity-50"></div>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-red-100 rounded-full blur-3xl opacity-50"></div>
          
          <div className="relative z-10 text-center">
            <motion.div 
              className="inline-flex items-center justify-center mb-4 px-4 py-2 bg-white rounded-full shadow-md"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <BookOpen className="w-5 h-5 text-blue-500 mr-2" />
              <span className="text-sm font-medium text-gray-600">News Categories</span>
            </motion.div>
            
            <motion.div 
              className="relative inline-block"
              variants={textVariants}
            >
              <h1 className="text-5xl font-bold mb-6 relative">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                  Explore News Categories
                </span>
                <motion.div 
                  className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                />
              </h1>
            </motion.div>
            
            <motion.div 
              className="relative max-w-3xl mx-auto"
              variants={textVariants}
            >
              <p className="text-xl text-gray-600 leading-relaxed relative z-10">
                Discover news from different perspectives and stay informed about the topics that matter to you.
              </p>
              <div className="absolute -left-4 -top-4 w-8 h-8 text-blue-400 opacity-20">
                <Sparkles className="w-full h-full" />
              </div>
              <div className="absolute -right-4 -bottom-4 w-8 h-8 text-indigo-400 opacity-20">
                <Sparkles className="w-full h-full" />
              </div>
            </motion.div>
            
            <motion.div 
              className="mt-8 flex justify-center"
              variants={textVariants}
            >
              <div className="inline-flex items-center px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200">
                <Sparkles className="w-4 h-4 text-amber-500 mr-2 animate-pulse" />
                <span className="text-sm font-medium text-gray-700">Curated for you</span>
                <ChevronRight className="w-4 h-4 text-gray-400 ml-2" />
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-2xl mx-auto mb-12"
        >
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search categories..."
              className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
        </motion.div>

        {/* Categories Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence>
            {filteredCategories.map((category) => (
              <motion.div
                key={category.name}
                variants={itemVariants}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative group cursor-pointer"
                onClick={() => handleCategoryClick(category)}
                onHoverStart={() => setHoveredCategory(category.name)}
                onHoverEnd={() => setHoveredCategory(null)}
                whileHover={{ scale: 1.03, y: -5 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="bg-white rounded-xl shadow-lg overflow-hidden h-full transform transition-all duration-300 hover:shadow-xl">
                  <div className={`h-2 bg-gradient-to-r ${category.color}`} />
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <div className={`p-3 rounded-full bg-gradient-to-r ${category.color} bg-opacity-10`}>
                        <category.icon className={`w-6 h-6 text-gradient-to-r ${category.color}`} />
                      </div>
                      <h3 className="ml-4 text-xl font-semibold text-gray-900">
                        {category.name}
                      </h3>
                    </div>
                    <p className="text-gray-600">{category.description}</p>
                  </div>
                  <div className="px-6 pb-6">
                    <motion.button
                      className={`w-full py-2 px-4 rounded-lg bg-gradient-to-r ${category.color} text-white font-medium transition-all duration-300 ${
                        isLoading && selectedCategory === category.name ? "opacity-75 cursor-not-allowed" : ""
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCategoryClick(category);
                      }}
                      disabled={isLoading && selectedCategory === category.name}
                    >
                      {isLoading && selectedCategory === category.name ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin mr-2 h-4 w-4 border-t-2 border-white rounded-full"></div>
                          Loading...
                        </div>
                      ) : (
                        `Explore ${category.name}`
                      )}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* No Results Message */}
        {filteredCategories.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-gray-500 text-lg">
              No categories found matching "{searchQuery}". Try a different search term.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
} 