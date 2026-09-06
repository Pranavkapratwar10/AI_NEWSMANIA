import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { 
  ArrowLeft, 
  Search, 
  X, 
  TrendingUp, 
  Globe, 
  Cpu, 
  Droplets, 
  Heart, 
  DollarSign, 
  Briefcase, 
  Sparkles,
  Newspaper,
  ChevronRight,
  BookOpen,
  ArrowRight,
  Filter,
  MessageCircle,
  Star,
  Coffee,
  Rocket,
  GraduationCap,
  PenTool,
  Camera,
  Headphones,
  Activity,
  MapPin,
  Zap
} from 'lucide-react';

const CategoriesInfo = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [hoverIndex, setHoverIndex] = useState(null);
  const [showScrollHint, setShowScrollHint] = useState(true);
  const [showParticles, setShowParticles] = useState(false);

  // Scroll position tracking
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowScrollHint(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Controls for animated background elements
  const bgControls = useAnimation();
  useEffect(() => {
    const animateBg = async () => {
      await bgControls.start({
        scale: [1, 1.1, 1],
        rotate: [0, 5, -5, 0],
        transition: {
          duration: 20,
          repeat: Infinity,
          repeatType: 'reverse'
        }
      });
    };
    
    animateBg();
  }, [bgControls]);

  // Particle animation for category selection
  const spawnParticles = () => {
    setShowParticles(true);
    setTimeout(() => setShowParticles(false), 1000);
  };

  const categories = [
    {
      name: "Trending",
      description: "Stay up-to-date with the most popular and widely discussed news stories across all topics.",
      icon: TrendingUp,
      color: "from-red-500 to-pink-500",
      bgColor: "bg-red-50",
      query: "trending OR breaking OR latest",
      tag: "popular"
    },
    {
      name: "Politics",
      description: "Coverage of government affairs, elections, policy changes, and political developments.",
      icon: Globe,
      color: "from-blue-500 to-indigo-500",
      bgColor: "bg-blue-50",
      query: "politics OR government OR election",
      tag: "current"
    },
    {
      name: "Technology",
      description: "Latest innovations, tech industry news, digital trends, and scientific breakthroughs.",
      icon: Cpu,
      color: "from-purple-500 to-indigo-500", 
      bgColor: "bg-purple-50",
      query: "technology OR tech OR innovation",
      tag: "innovative"
    },
    {
      name: "Climate",
      description: "Environmental news, climate change updates, sustainability initiatives, and nature conservation.",
      icon: Droplets,
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50",
      query: "climate OR environment OR global warming",
      tag: "important"
    },
    {
      name: "Health",
      description: "Medical discoveries, healthcare updates, wellness tips, and public health news.",
      icon: Heart,
      color: "from-pink-500 to-rose-500",
      bgColor: "bg-pink-50",
      query: "health OR medical OR healthcare",
      tag: "essential"
    },
    {
      name: "Economy",
      description: "Business news, market trends, financial updates, and economic indicators.",
      icon: DollarSign,
      color: "from-yellow-500 to-amber-500",
      bgColor: "bg-yellow-50",
      query: "economy OR business OR finance",
      tag: "current"
    },
    {
      name: "Sports",
      description: "Sports events, tournament coverage, athlete news, and sporting achievements.",
      icon: Activity,
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-50",
      query: "sports OR athletics OR competition",
      tag: "popular"
    },
    {
      name: "Entertainment",
      description: "Celebrity news, movie releases, music updates, and cultural events.",
      icon: Sparkles,
      color: "from-violet-500 to-purple-500",
      bgColor: "bg-violet-50",
      query: "entertainment OR movies OR music",
      tag: "trending"
    },
    // New categories
    {
      name: "Science",
      description: "Scientific discoveries, research breakthroughs, and innovations shaping our future.",
      icon: Rocket,
      color: "from-blue-400 to-cyan-500",
      bgColor: "bg-blue-50",
      query: "science OR research OR discovery",
      tag: "innovative"
    },
    {
      name: "Education",
      description: "Updates on learning, academic developments, and educational policies worldwide.",
      icon: GraduationCap,
      color: "from-amber-400 to-yellow-600",
      bgColor: "bg-amber-50",
      query: "education OR learning OR schools OR university",
      tag: "essential"
    },
    {
      name: "Art & Culture",
      description: "News from the art world, cultural events, museums, and creative exhibitions.",
      icon: PenTool,
      color: "from-purple-400 to-fuchsia-600",
      bgColor: "bg-purple-50",
      query: "art OR culture OR gallery OR museum",
      tag: "inspiring"
    },
    {
      name: "Photography",
      description: "Visual stories, photography trends, and compelling photojournalism from around the world.",
      icon: Camera,
      color: "from-slate-500 to-gray-700",
      bgColor: "bg-slate-50",
      query: "photography OR photos OR photojournalism",
      tag: "visual"
    },
    {
      name: "Music",
      description: "Latest in the music industry, album releases, concerts, and artist spotlights.",
      icon: Headphones,
      color: "from-emerald-400 to-teal-600",
      bgColor: "bg-emerald-50",
      query: "music OR album OR concert OR song",
      tag: "trending"
    },
    {
      name: "Travel",
      description: "Destinations, travel trends, tourism news, and adventure stories from across the globe.",
      icon: MapPin,
      color: "from-sky-400 to-blue-600",
      bgColor: "bg-sky-50",
      query: "travel OR tourism OR destination OR vacation",
      tag: "inspiring"
    },
    {
      name: "Food",
      description: "Culinary trends, food industry news, restaurant openings, and gastronomic discoveries.",
      icon: Coffee,
      color: "from-rose-400 to-red-600",
      bgColor: "bg-rose-50",
      query: "food OR cuisine OR restaurant OR cooking",
      tag: "lifestyle"
    },
    {
      name: "Innovation",
      description: "Cutting-edge innovations, startups, and breakthrough ideas changing our world.",
      icon: Zap,
      color: "from-indigo-400 to-blue-600",
      bgColor: "bg-indigo-50",
      query: "innovation OR startup OR breakthrough OR invention",
      tag: "innovative"
    }
  ];

  // Filter categories based on search query and active filter
  const filteredCategories = categories.filter(
    (category) => {
      const matchesSearch = 
        category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        category.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesFilter = activeFilter === 'all' || category.tag === activeFilter;
      
      return matchesSearch && matchesFilter;
    }
  );

  const handleCategoryClick = (category) => {
    setIsLoading(true);
    setSelectedCategory(category.name);
    spawnParticles();
    
    // Simulate loading state
    setTimeout(() => {
      navigate(`/ai-summary?query=${encodeURIComponent(category.query)}`);
    }, 800);
  };

  const handleBackClick = () => {
    navigate('/ai-summary');
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
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

  const filterVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: (i) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: 0.2 + (i * 0.05),
        type: "spring",
        stiffness: 200,
        damping: 20
      }
    })
  };

  const filterOptions = [
    { id: 'all', label: 'All Categories', icon: Filter },
    { id: 'popular', label: 'Popular', icon: Star },
    { id: 'trending', label: 'Trending', icon: TrendingUp },
    { id: 'important', label: 'Important', icon: Zap },
    { id: 'innovative', label: 'Innovative', icon: Rocket }
  ];

  // Simple animation variants
  const fadeInVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { duration: 0.5 } 
    }
  };

  const lineVariants = {
    hidden: { width: 0 },
    visible: { 
      width: "100%", 
      transition: { duration: 0.8, ease: "easeInOut" } 
    }
  };

  // Particle effect component
  const Particles = () => {
    return (
      <div className="fixed inset-0 pointer-events-none z-50">
        {Array.from({ length: 50 }).map((_, index) => {
          const size = Math.random() * 10 + 5;
          const left = Math.random() * 100;
          const animDuration = Math.random() * 1 + 0.5;
          const delay = Math.random() * 0.2;
          const color = `hsl(${Math.floor(Math.random() * 360)}, 80%, 60%)`;
          
          return (
            <motion.div
              key={index}
              className="absolute rounded-full"
              initial={{ 
                top: '50%',
                left: `${left}%`,
                width: size,
                height: size,
                backgroundColor: color,
                opacity: 1
              }}
              animate={{ 
                top: `${Math.random() * 20}%`,
                opacity: 0,
                scale: 0
              }}
              transition={{
                duration: animDuration,
                delay: delay,
                ease: "easeOut"
              }}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-8 pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Animated Background Elements */}
      <motion.div 
        animate={bgControls}
        className="absolute top-0 -left-52 w-96 h-96 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full opacity-30 blur-3xl"
      />
      <motion.div 
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 20, 0],
          transition: { duration: 15, repeat: Infinity, repeatType: "reverse" },
        }}
        className="absolute bottom-0 -right-52 w-96 h-96 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full opacity-30 blur-3xl"
      />

      {/* Header with Back Button */}
      <div className="max-w-7xl mx-auto mb-6">
        <motion.button
          onClick={handleBackClick}
          className="flex items-center gap-2 px-4 py-2 text-blue-600 bg-blue-50 rounded-full hover:bg-blue-100 transition-all"
          whileHover={{ x: -5, transition: { type: "spring", stiffness: 400 } }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="font-medium">Back to News</span>
        </motion.button>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto relative">
        {/* Clean Professional Header */}
        <motion.header 
          className="text-center mb-10"
          initial="hidden"
          animate="visible"
          variants={fadeInVariants}
        >
          {/* Title with professional styling */}
          <div className="mb-6">
            <motion.h1 
              className="text-3xl sm:text-4xl font-bold tracking-tight mb-2 inline-flex items-center gap-2 justify-center"
            >
              <span className="text-gray-900">Discover News</span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">Categories</span>
            </motion.h1>
            
            <motion.div 
              className="h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full mt-2"
              initial="hidden"
              animate="visible"
              variants={lineVariants}
              style={{ maxWidth: "240px" }}
            />
          </div>

          {/* Clean search and filter layout */}
          <div className="max-w-md mx-auto mb-6">
            {/* Search Bar with counter */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search categories..."
                className="block w-full pl-10 pr-14 py-2.5 text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              
              {/* Categories count inside search bar */}
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-sm text-gray-500 mr-3 flex items-center">
                  <Newspaper className="w-3.5 h-3.5 text-blue-500 mr-1.5" />
                  {filteredCategories.length}
                </span>
                
                {/* Clear button */}
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="pointer-events-auto"
                  >
                    <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="overflow-x-auto mt-6 pb-1">
            <div className="flex gap-3 justify-center px-1">
              {filterOptions.map((filter, i) => (
                <motion.button
                  key={filter.id}
                  custom={i}
                  variants={filterVariants}
                  initial="hidden"
                  animate="visible"
                  onClick={() => setActiveFilter(filter.id)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 whitespace-nowrap ${
                    activeFilter === filter.id
                      ? 'bg-blue-100 text-blue-700 shadow-sm border border-blue-200'
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-100'
                  }`}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <filter.icon className="w-3.5 h-3.5" />
                  {filter.label}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.header>

        {/* Categories Grid */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6"
        >
          <AnimatePresence>
            {filteredCategories.map((category, index) => (
              <motion.div
                key={category.name}
                layout
                variants={itemVariants}
                exit={{ opacity: 0, y: 20, scale: 0.8 }}
                className="relative group"
                whileHover={{ y: -5, transition: { type: "spring", stiffness: 400, damping: 15 } }}
                onHoverStart={() => setHoverIndex(index)}
                onHoverEnd={() => setHoverIndex(null)}
              >
                <div className="h-full rounded-xl overflow-hidden shadow-md transition-all duration-300 bg-white hover:shadow-xl border border-gray-100">
                  <div className={`h-1.5 bg-gradient-to-r ${category.color}`} />
                  <div className="p-5">
                    <div className="flex items-center mb-3">
                      <motion.div 
                        className={`p-2.5 rounded-lg bg-gradient-to-r ${category.color}`}
                        whileHover={{ 
                          rotate: [0, -10, 10, -10, 0],
                          transition: { duration: 0.5 }
                        }}
                      >
                        <category.icon className="w-5 h-5 text-white" />
                      </motion.div>
                      <div className="ml-3">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {category.name}
                        </h3>
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {category.tag}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{category.description}</p>

                    <motion.button
                      className={`w-full py-2.5 px-3 rounded-lg bg-gradient-to-r ${category.color} text-white font-medium transition-all duration-300 flex items-center justify-center ${
                        isLoading && selectedCategory === category.name ? "opacity-75 cursor-not-allowed" : ""
                      }`}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleCategoryClick(category)}
                      disabled={isLoading && selectedCategory === category.name}
                    >
                      {isLoading && selectedCategory === category.name ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin mr-2 h-4 w-4 border-t-2 border-white rounded-full"></div>
                          Loading...
                        </div>
                      ) : (
                        <>
                          <span>Explore</span>
                          <motion.div
                            animate={hoverIndex === index ? { x: [0, 4, 0] } : {}}
                            transition={{ duration: 0.6, repeat: Infinity }}
                          >
                            <ArrowRight className="ml-2 w-4 h-4" />
                          </motion.div>
                        </>
                      )}
                    </motion.button>
                  </div>
                </div>

                {/* Background effect on hover */}
                <motion.div
                  className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 -z-10 blur-sm"
                  animate={{ opacity: hoverIndex === index ? 0.4 : 0 }}
                  transition={{ duration: 0.2 }}
                ></motion.div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.section>

        {/* No Results Message */}
        {filteredCategories.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="text-center py-16 px-4 bg-white rounded-xl shadow-md border border-gray-100"
          >
            <motion.div 
              animate={{ 
                y: [0, -5, 0],
                transition: { duration: 2, repeat: Infinity, repeatType: "reverse" }
              }}
              className="mx-auto mb-6"
            >
              <Newspaper className="w-16 h-16 text-gray-300 mx-auto" />
            </motion.div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No categories found</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              No categories match your search "{searchQuery}". Try a different search term or filter.
            </p>
            <motion.button
              onClick={() => {
                setSearchQuery('');
                setActiveFilter('all');
              }}
              className="mt-6 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Clear filters
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* Particles effect when selecting a category */}
      <AnimatePresence>
        {showParticles && <Particles />}
      </AnimatePresence>
    </div>
  );
};

export default CategoriesInfo; 