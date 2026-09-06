import React, { useState, useEffect } from "react";
import { Menu, X, User, LogOut, BookOpen, TrendingUp, Cpu, MessageSquare, Info, Sparkles, Grid, ChevronDown, LayoutDashboard, Repeat, ArrowLeft, Clock, Globe, Zap, Eye, ExternalLink, ChevronRight, BarChart2, Activity, Share2, Bookmark, Users, BookmarkX } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

export default function NewsManiaHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("Home");
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { name: "Home", icon: LayoutDashboard, path: "/" },
    { name: "Categories", icon: BookOpen, path: "/categories-info" },
    { name: "Trending", icon: TrendingUp, path: "/trending-info" },
    { name: "AI Summary", icon: Cpu, path: "/ai-summary" },
    { name: "Discussions", icon: MessageSquare, path: "/discussions" },
    { name: "About Us", icon: Info, path: "/about-us" },
  ];

  // Update active item based on current location
  useEffect(() => {
    const path = location.pathname;
    const item = navItems.find(item => path === item.path || path.startsWith(item.path + '/'));
    if (item) {
      setActiveItem(item.name);
    }
  }, [location]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (item) => {
    setActiveItem(item.name);
    setIsMenuOpen(false);
    navigate(item.path);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isUserMenuOpen && !event.target.closest(".user-menu")) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isUserMenuOpen]);

  // Animation variants
  const headerVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 30 
      }
    }
  };

  const menuItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }),
    hover: {
      scale: 1.02,
      y: -2,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 10
      }
    }
  };
  
  const iconHoverVariants = {
    initial: { rotate: 0 },
    hover: { 
      rotate: [0, -5, 5, -5, 0],
      transition: { 
        duration: 0.4,
        ease: "easeInOut"
      }
    }
  };

  return (
    <>  {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 w-72 transform transition-transform duration-300 z-50 bg-white/95 backdrop-blur-md shadow-xl overflow-y-auto max-h-screen scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header - sticky */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-sm px-6 py-5 flex items-center justify-between border-b border-gray-200 z-20">
          <Link to="/" className="flex items-center" onClick={() => setSidebarOpen(false)}>
            <span className="text-2xl font-bold tracking-tight">
              <span className="text-blue-600">News</span>
              <span className="text-red-500">Mania</span>
            </span>
          </Link>
          <button 
            onClick={() => setSidebarOpen(false)} 
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        {/* Navigation Links */}
        <nav className="px-4 py-6">
          <ul className="flex flex-col gap-2">
            {navItems.map((item) => (
              <motion.li 
                key={item.name}
                whileHover={{ 
                  x: 4,
                  transition: { type: "spring", stiffness: 400, damping: 10 }
                }}
              >
                <Link
                  to={item.path}
                  onClick={() => {
                    setSidebarOpen(false);
                    setActiveItem(item.name);
                  }}
                  aria-current={activeItem === item.name ? "page" : undefined}
                >
                  <div
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer group ${
                      activeItem === item.name
                        ? 'text-blue-600 font-medium border-l-2 border-blue-600'
                        : item.highlight 
                          ? 'text-indigo-600 hover:text-indigo-700'
                          : 'text-gray-700 hover:text-blue-600'
                    }`}
                  >
                    <motion.div 
                      className={`p-1.5 rounded-md ${item.highlight && activeItem !== item.name ? 'bg-indigo-50' : 'bg-transparent'}`}
                      whileHover="hover"
                      initial="initial"
                      variants={iconHoverVariants}
                    >
                      <item.icon className={`w-5 h-5 ${
                        activeItem === item.name 
                          ? 'text-blue-600' 
                          : item.highlight 
                            ? 'text-indigo-600' 
                            : 'text-gray-600 group-hover:text-blue-600'
                      }`} />
                    </motion.div>
                    <span className={`font-medium tracking-tight ${item.highlight && activeItem !== item.name ? 'relative' : ''}`}>
                      {item.name}
                      {item.badge && activeItem !== item.name && (
                        <span className="absolute -top-2 -right-12 px-2 py-0.5 bg-indigo-100 text-indigo-800 text-xs font-semibold rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </span>
                  </div>
                </Link>
              </motion.li>
            ))}
          </ul>
          
          {!currentUser && (
            <div className="mt-8 px-3">
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                <h3 className="font-medium text-blue-800 mb-2">Join NewsManila</h3>
                <p className="text-sm text-gray-600 mb-3">Create an account to save articles and join discussions.</p>
                <div className="flex flex-col gap-2">
                  <Link to="/register" className="w-full py-2 bg-blue-600 text-white text-center font-medium rounded-lg hover:bg-blue-700 transition-colors">
                    Sign Up
                  </Link>
                  <Link to="/login" className="w-full py-2 bg-white text-blue-600 text-center font-medium rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors">
                    Log In
                  </Link>
                </div>
              </div>
            </div>
          )}
        </nav>
      </aside>
      <motion.header 
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled 
            ? "bg-white/95 shadow-md backdrop-blur-md border-b border-gray-100" 
            : "bg-white"
        }`}
        initial="hidden"
        animate="visible"
        variants={headerVariants}
      >
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-10 -left-10 w-48 h-48 bg-blue-50 rounded-full blur-3xl opacity-70"></div>
          <div className="absolute top-0 right-0 w-48 h-48 bg-red-50 rounded-full blur-3xl opacity-70"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center justify-between h-16 md:h-18">
            <div className="flex items-center">
              <motion.button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="mr-3 p-2 rounded-lg bg-transparent text-gray-700 hover:bg-gray-100 active:bg-gray-200 transition-colors focus:outline-none"
                aria-label="Open menu"
                whileHover={{ rotate: [0, -10, 10, -10, 0], transition: { duration: 0.4 } }}
                whileTap={{ scale: 0.9 }}
              >
                <Grid className="w-5 h-5" />
              </motion.button>
              {/* Logo */}
              <Link to="/" className="flex items-center group">
                <motion.div 
                  className="relative"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Sparkles className="absolute -top-2 -right-2 w-4 h-4 text-blue-500 animate-pulse" />
                  <span className="text-2xl md:text-3xl font-bold tracking-tight">
                    <span className="text-blue-600">News</span>
                    <span className="text-red-500">Mania</span>
                  </span>
                </motion.div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center">
              <div className="flex items-center bg-transparent rounded-full pl-1 py-1 mr-4">
                {navItems.map((item, i) => (
                  <motion.div
                    key={item.name}
                    custom={i}
                    variants={menuItemVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                    className="relative"
                  >
                    <Link
                      to={item.path}
                      onClick={() => handleNavClick(item)}
                      className={`flex items-center px-4 py-2 rounded-full transition-all duration-300 hover:bg-gray-50 ${
                        activeItem === item.name
                          ? "text-blue-600 font-medium"
                          : item.highlight
                            ? "text-indigo-600 font-medium"
                            : "text-gray-600 hover:text-gray-900"
                      }`}
                      aria-current={activeItem === item.name ? "page" : undefined}
                    >
                      <motion.div
                        className={`mr-2 ${item.highlight && activeItem !== item.name ? 'p-1 bg-indigo-50 rounded-full' : ''}`}
                        whileHover="hover"
                        initial="initial"
                        variants={iconHoverVariants}
                      >
                        <item.icon className="w-4 h-4" />
                      </motion.div>
                      <span className="font-medium tracking-tight relative">
                        {item.name}
                        {item.badge && activeItem !== item.name && (
                          <span className="ml-2 px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-full animate-pulse">
                            {item.badge}
                          </span>
                        )}
                      </span>
                      
                      {activeItem === item.name && (
                        <motion.div 
                          className={`absolute bottom-0 left-3 right-3 h-0.5 ${item.highlight ? 'bg-indigo-500' : 'bg-blue-500'} rounded-full`}
                          layoutId="activeNavIndicator"
                          transition={{ type: "spring", bounce: 0.2 }}
                        />
                      )}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </nav>

            {/* Right Side - Desktop Actions */}
            <div className="hidden md:flex items-center justify-end space-x-2">
              {currentUser ? (
                <div className="relative user-menu">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 py-1.5 px-3 rounded-full bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold shadow-sm">
                      {currentUser.displayName ? currentUser.displayName[0].toUpperCase() : 'U'}
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {currentUser.displayName || 'Account'}
                    </span>
                    <motion.div
                      animate={{ rotate: isUserMenuOpen ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    </motion.div>
                  </motion.button>

                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200"
                      >
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900">{currentUser.displayName || 'User'}</p>
                          <p className="text-xs text-gray-500 truncate">{currentUser.email || ''}</p>
                        </div>
                        <div className="p-2">
                          <Link
                            to="/profile"
                            className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <User className="w-4 h-4 mr-2" />
                            Profile
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <LogOut className="w-4 h-4 mr-2" />
                            Logout
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <motion.div whileHover={{ scale: 1.05 }}>
                    <Link
                      to="/login"
                      className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                    >
                      Log In
                    </Link>
                  </motion.div>
                  <motion.div
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" 
                    }}
                    whileTap={{ scale: 0.98 }}
                    className="rounded-lg overflow-hidden"
                  >
                    <Link
                      to="/register"
                      className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-sm"
                    >
                      Sign Up
                    </Link>
                  </motion.div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              whileHover={{ 
                rotate: [0, -5, 5, -5, 0],
                transition: { duration: 0.4 }
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden bg-white border-t border-gray-200 shadow-md"
            >
              <div className="container mx-auto px-4 py-4 space-y-3">
                {navItems.map((item, i) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 }}
                    whileHover={{ x: 5 }}
                    className="relative"
                  >
                    <Link
                      to={item.path}
                      onClick={() => handleNavClick(item)}
                      className={`flex items-center px-4 py-3 rounded-lg transition-all group ${
                        activeItem === item.name
                          ? "text-blue-600 font-medium border-l-2 border-blue-500"
                          : item.highlight
                            ? "text-indigo-600 font-medium border-l-2 border-indigo-200"
                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                      aria-current={activeItem === item.name ? "page" : undefined}
                    >
                      <motion.div 
                        className={`mr-3 ${item.highlight && activeItem !== item.name ? 'p-1 bg-indigo-50 rounded-full' : ''}`}
                        whileHover={{
                          rotate: [0, -10, 10, -10, 0],
                          transition: { duration: 0.4 }
                        }}
                      >
                        <item.icon className={`w-5 h-5 ${
                          activeItem === item.name 
                            ? 'text-blue-600' 
                            : item.highlight 
                              ? 'text-indigo-600' 
                              : 'text-gray-600 group-hover:text-blue-600'
                        }`} />
                      </motion.div>
                      <span className="font-medium tracking-tight relative">
                        {item.name}
                        {item.badge && activeItem !== item.name && (
                          <span className="ml-2 px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </span>
                    </Link>
                  </motion.div>
                ))}
                
                {!currentUser && (
                  <motion.div 
                    className="pt-4 border-t border-gray-200"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="flex flex-col space-y-2">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Link
                          to="/login"
                          className="px-4 py-3 text-center text-gray-700 border border-gray-200 hover:bg-gray-50 rounded-lg transition-colors font-medium"
                        >
                          Log In
                        </Link>
                      </motion.div>
                      <motion.div
                        whileHover={{ 
                          scale: 1.02,
                          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
                        }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Link
                          to="/register"
                          className="px-4 py-3 text-center bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all block font-medium shadow-sm"
                        >
                          Sign Up
                        </Link>
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}
