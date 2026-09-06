import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { useBookmarks } from "../../context/BookmarkContext";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import QuizComponent from "./QuizComponent";
import {
  User,
  Bookmark,
  MessageCircle,
  History,
  Bell,
  Settings,
  Shield,
  LogOut,
  Edit,
  Camera,
  BookOpen,
  Star,
  Heart,
  Share2,
  ChevronRight,
  BookmarkCheck,
  MessageSquare,
  Clock,
  Newspaper,
  TrendingUp,
  Award,
  Zap,
  Sparkles,
  X,
  Trash2,
  ExternalLink,
  Eye,
  Sun,
  Moon,
  Globe,
  Twitter,
  Facebook,
  Linkedin,
  Github,
  HelpCircle,
  Key,
  Palette,
  Languages,
  Mail,
  Phone,
  MapPin,
  Link,
  Link2,
  BrainCircuit,
  BookmarkX,
  LightbulbIcon,
  NewspaperIcon,
  BookMarked,
  Trophy,
  Instagram,
  Youtube,
  Twitch,
  PlusCircle,
  MoreHorizontal,
  Check
} from "lucide-react";
import toast from "react-hot-toast";
import { useTranslation } from 'react-i18next';

const Profile = () => {
  const { currentUser, logout } = useAuth();
  const { bookmarks, removeBookmark } = useBookmarks();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(currentUser?.displayName || "");
  const [photoURL, setPhotoURL] = useState(currentUser?.photoURL || "");
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [showArticleModal, setShowArticleModal] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizArticle, setQuizArticle] = useState(null);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState(i18n.language || 'en');
  const [notifications, setNotifications] = useState(true);
  const [privacy, setPrivacy] = useState("public");
  const [socialLinks, setSocialLinks] = useState({
    twitter: "",
    facebook: "",
    instagram: "",
    linkedin: "",
    github: "",
    youtube: "",
    twitch: "",
  });
  const [showAllSocialLinks, setShowAllSocialLinks] = useState(false);
  const [activeSocialLinks, setActiveSocialLinks] = useState(["twitter", "instagram", "linkedin"]);
  const bookmarksRef = useRef(null);

  useEffect(() => {
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const menuItems = [
    {
      icon: <BookmarkCheck className="w-6 h-6" />,
      title: t('profile.menu.bookmarks'),
      description: t('profile.menu.bookmarksDesc'),
      color: "bg-blue-500",
      href: "/bookmarks",
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: t('profile.menu.discussions'),
      description: t('profile.menu.discussionsDesc'),
      color: "bg-violet-500",
      href: "/discussions",
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Reading List",
      description: "Articles you want to read later",
      color: "bg-amber-500",
      href: "/reading-list",
    },
    {
      icon: <Newspaper className="w-6 h-6" />,
      title: "News Preferences",
      description: "Customize your news feed",
      color: "bg-emerald-500",
      href: "/preferences",
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Analytics",
      description: "Track your reading habits",
      color: "bg-rose-500",
      href: "/analytics",
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Achievements",
      description: "View your earned badges",
      color: "bg-yellow-500",
      href: "/achievements",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Premium Features",
      description: "Unlock exclusive content",
      color: "bg-purple-500",
      href: "/premium",
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "AI Assistant",
      description: "Get personalized recommendations",
      color: "bg-indigo-500",
      href: "/ai-assistant",
    },
  ];

  const stats = [
    {
      icon: <Bookmark className="w-6 h-6" />,
      label: t('profile.stats.bookmarks'),
      value: bookmarks.length,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      label: t('profile.stats.discussions'),
      value: "12",
      color: "text-violet-500",
      bgColor: "bg-violet-50",
    },
    {
      icon: <Clock className="w-6 h-6" />,
      label: "Articles Read",
      value: "48",
      color: "text-amber-500",
      bgColor: "bg-amber-50",
    },
    {
      icon: <Award className="w-6 h-6" />,
      label: "Achievements",
      value: "8",
      color: "text-emerald-500",
      bgColor: "bg-emerald-50",
    },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Failed to log out");
    }
  };

  const handleUpdateProfile = async () => {
    try {
      await currentUser.updateProfile({
        displayName,
        photoURL,
      });
      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  const handleRemoveBookmark = (articleId) => {
    removeBookmark(articleId);
    toast.success("Article removed from bookmarks");
  };

  const handleViewArticle = (article) => {
    setSelectedArticle(article);
    setShowArticleModal(true);
  };

  const handleTakeQuiz = (article) => {
    setQuizArticle(article);
    setShowQuiz(true);
  };

  const handleCloseQuiz = () => {
    setShowQuiz(false);
    setQuizArticle(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 dark:bg-blue-900 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-violet-200 dark:bg-violet-900 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-amber-200 dark:bg-amber-900 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-500 to-violet-500 opacity-10 rounded-full transform translate-x-20 -translate-y-20"></div>
          <div className="flex flex-col md:flex-row items-center gap-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative"
            >
              <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-white dark:ring-gray-700 shadow-lg">
                <img
                  src={photoURL || currentUser?.photoURL || "/default-avatar.png"}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              {isEditing && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute bottom-0 right-0 bg-white dark:bg-gray-700 p-2 rounded-full shadow-lg"
                >
                  <Edit className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                </motion.button>
              )}
            </motion.div>

            <div className="flex-1 text-center md:text-left">
              {isEditing ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    placeholder="Display Name"
                  />
                  <input
                    type="text"
                    value={photoURL}
                    onChange={(e) => setPhotoURL(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    placeholder="Photo URL"
                  />
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleUpdateProfile}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Save Changes
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </motion.button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {currentUser?.displayName || "User"}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    {currentUser?.email}
                  </p>
                  <div className="flex gap-2 mt-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsEditing(true)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Edit Profile
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleLogout}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      Logout
                    </motion.button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              whileHover={{ scale: 1.02 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 relative overflow-hidden"
            >
              <div className={`absolute top-0 right-0 w-24 h-24 ${stat.bgColor} opacity-20 rounded-full transform translate-x-12 -translate-y-12`}></div>
              <div className="relative">
                <div className={`${stat.color} mb-2`}>{stat.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Menu Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {menuItems.map((item, index) => (
            <motion.div
              key={item.title}
              whileHover={{ scale: 1.02 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 relative overflow-hidden cursor-pointer"
              onClick={() => {
                if (item.title === 'My Bookmarks') {
                  bookmarksRef.current?.scrollIntoView({ behavior: 'smooth' });
                } else if (item.title === 'My Discussions') {
                  navigate('/discussions');
                } else {
                  navigate(item.href);
                }
              }}
            >
              <div className={`absolute top-0 right-0 w-24 h-24 ${item.color} opacity-10 rounded-full transform translate-x-12 -translate-y-12`}></div>
              <div className="relative">
                <div className={`${item.color} mb-2`}>{item.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bookmarked Articles */}
        <motion.div ref={bookmarksRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8 border border-gray-100 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Bookmark className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {t('profile.bookmarksSection.title')}
              </h2>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              <span>{t('profile.bookmarksSection.viewAll')}</span>
            </motion.button>
          </div>

          {bookmarks.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-10 bg-gray-50 dark:bg-gray-700/30 rounded-xl"
            >
              <BookmarkX className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
              <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">No bookmarked articles yet</p>
              <p className="text-gray-400 dark:text-gray-500 text-sm mb-4">Save articles to read them later</p>
              <Link to="/" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2">
                <NewspaperIcon className="w-4 h-4" />
                <span>Browse Articles</span>
              </Link>
            </motion.div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                  {bookmarks.map((article) => (
                    <motion.div
                      key={article.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      whileHover={{ 
                        scale: 1.02,
                        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                      }}
                      className="bg-white dark:bg-gray-700 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-600 transition-all duration-300 flex flex-col"
                    >
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={article.urlToImage || article.image || "/placeholder-news.jpg"}
                          alt={article.title}
                          className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/placeholder-news.jpg";
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-60"></div>
                        <div className="absolute top-2 right-2 flex gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleRemoveBookmark(article.id)}
                            className="p-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg text-red-500 hover:text-red-600 hover:bg-white dark:hover:bg-gray-800 transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </motion.button>
                        </div>
                        <div className="absolute bottom-3 left-3">
                          <span className="px-2 py-1 bg-blue-500/80 backdrop-blur-sm text-white text-xs rounded-full font-medium">
                            {article.category || article.source?.name || "News"}
                          </span>
                        </div>
                      </div>
                      <div className="p-4 flex-1 flex flex-col">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-gray-500 dark:text-gray-400 text-xs flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {article.readTime || new Date(article.publishedAt).toLocaleDateString()}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                          {article.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2 flex-1">
                          {article.description || "No description available."}
                        </p>
                        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100 dark:border-gray-600">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleTakeQuiz(article)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-full text-xs font-medium shadow-sm hover:shadow transition-all"
                          >
                            <BrainCircuit className="w-3.5 h-3.5" />
                            <span>Take Quiz</span>
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => window.open(article.url, '_blank')}
                            className="flex items-center gap-1 text-blue-500 hover:text-blue-600 transition-colors"
                          >
                            <span className="text-xs font-medium">Read Article</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
              
              {bookmarks.length > 0 && bookmarks.length < 3 && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800/30 flex items-center gap-3"
                >
                  <div className="p-2 bg-blue-100 dark:bg-blue-800/30 rounded-full">
                    <LightbulbIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-blue-700 dark:text-blue-300 text-sm">
                      <span className="font-medium">Pro tip:</span> Complete quizzes to earn points and track your reading comprehension!
                    </p>
                  </div>
                </motion.div>
              )}
            </>
          )}
        </motion.div>

        {/* Reading Statistics */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8 border border-gray-100 dark:border-gray-700"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <BookOpen className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t('profile.readingSection.title')}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div 
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/10 rounded-xl p-4 border border-blue-100 dark:border-blue-800/30"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="bg-blue-100 dark:bg-blue-800/30 p-2 rounded-lg">
                  <BookMarked className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-xl font-bold text-blue-600 dark:text-blue-400">{bookmarks.length}</span>
              </div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Articles Read</h3>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/10 rounded-xl p-4 border border-purple-100 dark:border-purple-800/30"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="bg-purple-100 dark:bg-purple-800/30 p-2 rounded-lg">
                  <BrainCircuit className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <span className="text-xl font-bold text-purple-600 dark:text-purple-400">{bookmarks.length}</span>
              </div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Quizzes Taken</h3>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/10 rounded-xl p-4 border border-green-100 dark:border-green-800/30"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="bg-green-100 dark:bg-green-800/30 p-2 rounded-lg">
                  <Trophy className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <span className="text-xl font-bold text-green-600 dark:text-green-400">{bookmarks.length}</span>
              </div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Quizzes Passed</h3>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/10 rounded-xl p-4 border border-amber-100 dark:border-amber-800/30"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="bg-amber-100 dark:bg-amber-800/30 p-2 rounded-lg">
                  <Award className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <span className="text-xl font-bold text-amber-600 dark:text-amber-400">{bookmarks.length}</span>
              </div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Points Earned</h3>
            </motion.div>
          </div>
          
          <div className="space-y-5">
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Reading Comprehension</h3>
                <span className="text-sm font-medium text-green-600 dark:text-green-400">
                  {bookmarks.length > 0 ? "100%" : "0%"}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ 
                    width: bookmarks.length > 0 ? "100%" : "0%" 
                  }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="bg-green-500 dark:bg-green-400 h-2.5 rounded-full"
                ></motion.div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Reading Streak</h3>
                <span className="text-sm font-medium text-amber-600 dark:text-amber-400">{bookmarks.length || 0} days</span>
              </div>
              <div className="flex gap-1">
                {Array.from({ length: 7 }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1 * i }}
                    className={`h-6 flex-1 rounded-md ${
                      i < Math.min(bookmarks.length, 7)
                        ? 'bg-amber-500 dark:bg-amber-400'
                        : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  ></motion.div>
                ))}
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Topics Explored</h3>
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  {Math.min(bookmarks.length, 10)} of 10
                </span>
              </div>
              <div className="grid grid-cols-10 gap-1">
                {Array.from({ length: 10 }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.05 * i }}
                    className={`h-2.5 rounded-md ${
                      i < Math.min(bookmarks.length, 10)
                        ? 'bg-blue-500 dark:bg-blue-400'
                        : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  ></motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Settings Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Settings
          </h2>
          <div className="space-y-6">
            {/* Theme Settings */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  {theme === "light" ? (
                    <Sun className="w-5 h-5 text-amber-500" />
                  ) : (
                    <Moon className="w-5 h-5 text-blue-500" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Theme
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Choose your preferred theme
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                {theme === "light" ? "Dark Mode" : "Light Mode"}
              </motion.button>
            </div>

            {/* Language Settings */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <Globe className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Language
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Select your preferred language
                  </p>
                </div>
              </div>
              <select
                value={language}
                onChange={(e) => {
                  const lng = e.target.value;
                  setLanguage(lng);
                  i18n.changeLanguage(lng);
                }}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <option value="en">English</option>
                <option value="hi">हिंदी</option>
                <option value="mr">मराठी</option>
                <option value="ja">日本語</option>
              </select>
            </div>

            {/* Notification Settings */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <Bell className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Notifications
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Manage your notification preferences
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setNotifications(!notifications)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  notifications
                    ? "bg-green-500 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                }`}
              >
                {notifications ? "Enabled" : "Disabled"}
              </motion.button>
            </div>

            {/* Privacy Settings */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <Shield className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Privacy
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Control your privacy settings
                  </p>
                </div>
              </div>
              <select
                value={privacy}
                onChange={(e) => setPrivacy(e.target.value)}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
                <option value="friends">Friends Only</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mt-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                <Link2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Social Links
              </h2>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAllSocialLinks(!showAllSocialLinks)}
              className="text-sm font-medium text-blue-600 dark:text-blue-400 flex items-center gap-1"
            >
              {showAllSocialLinks ? "Show Less" : "Manage Platforms"}
              <ChevronRight className={`w-4 h-4 transition-transform ${showAllSocialLinks ? "rotate-90" : ""}`} />
            </motion.button>
          </div>
          
          {showAllSocialLinks && (
            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Select platforms to display</p>
              <div className="flex flex-wrap gap-2">
                {Object.keys(socialLinks).map(platform => (
                  <motion.button
                    key={platform}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      if (activeSocialLinks.includes(platform)) {
                        setActiveSocialLinks(activeSocialLinks.filter(p => p !== platform));
                      } else {
                        setActiveSocialLinks([...activeSocialLinks, platform]);
                      }
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      activeSocialLinks.includes(platform) 
                        ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300" 
                        : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400"
                    }`}
                  >
                    {activeSocialLinks.includes(platform) && <Check className="w-3 h-3" />}
                    <span className="capitalize">{platform}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeSocialLinks.map(platform => {
              let icon, color;
              switch(platform) {
                case 'twitter':
                  icon = <Twitter className="w-4 h-4" />;
                  color = "bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400";
                  break;
                case 'facebook':
                  icon = <Facebook className="w-4 h-4" />;
                  color = "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400";
                  break;
                case 'instagram':
                  icon = <Instagram className="w-4 h-4" />;
                  color = "bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400";
                  break;
                case 'linkedin':
                  icon = <Linkedin className="w-4 h-4" />;
                  color = "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400";
                  break;
                case 'github':
                  icon = <Github className="w-4 h-4" />;
                  color = "bg-gray-100 dark:bg-gray-700/80 text-gray-700 dark:text-gray-300";
                  break;
                case 'youtube':
                  icon = <Youtube className="w-4 h-4" />;
                  color = "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400";
                  break;
                case 'twitch':
                  icon = <Twitch className="w-4 h-4" />;
                  color = "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400";
                  break;
                default:
                  icon = <Link className="w-4 h-4" />;
                  color = "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400";
              }
              
              return (
                <SocialLinkInput 
                  key={platform}
                  platform={platform} 
                  value={socialLinks[platform]} 
                  onChange={(value) => setSocialLinks({ ...socialLinks, [platform]: value })}
                  icon={icon}
                  color={color}
                  placeholder={`${platform.charAt(0).toUpperCase() + platform.slice(1)} profile URL`}
                />
              );
            })}
            
            {!showAllSocialLinks && activeSocialLinks.length < Object.keys(socialLinks).length && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowAllSocialLinks(true)}
                className="flex items-center justify-center gap-2 p-4 border border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <PlusCircle className="w-5 h-5" />
                <span>Add More Platforms</span>
              </motion.button>
            )}
          </div>
          
          {activeSocialLinks.length > 0 && (
            <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <HelpCircle className="w-3 h-3" />
              <span>Your social links will be visible on your public profile</span>
            </div>
          )}
        </motion.div>
      </div>

      {/* Article Preview Modal */}
      <AnimatePresence>
        {selectedArticle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-2xl w-full overflow-hidden"
            >
              <div className="relative h-64">
                <img
                  src={selectedArticle.image || "/placeholder-news.jpg"}
                  alt={selectedArticle.title}
                  className="w-full h-full object-cover"
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedArticle(null)}
                  className="absolute top-4 right-4 p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg"
                >
                  <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </motion.button>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 text-xs rounded-full">
                    {selectedArticle.category}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400 text-sm">
                    {selectedArticle.readTime}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  {selectedArticle.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {selectedArticle.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 dark:text-gray-400">
                    {selectedArticle.source}
                  </span>
                  <motion.a
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    href={selectedArticle.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Read Full Article
                  </motion.a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quiz Modal */}
      {showQuiz && quizArticle && (
        <QuizComponent article={quizArticle} onClose={handleCloseQuiz} />
      )}
    </div>
  );
};

const SocialLinkInput = ({ platform, value, onChange, icon, color, placeholder }) => {
  const [isValid, setIsValid] = useState(true);
  const [isFocused, setIsFocused] = useState(false);
  
  const validateUrl = (url) => {
    if (!url) return true; // Empty is fine
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };
  
  const handleChange = (e) => {
    const newValue = e.target.value;
    onChange(newValue);
    setIsValid(validateUrl(newValue));
  };
  
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`flex items-center gap-3 p-3 bg-white dark:bg-gray-700 rounded-xl border ${
        !isValid 
          ? 'border-red-300 dark:border-red-700' 
          : isFocused
            ? 'border-blue-300 dark:border-blue-700 shadow-md' 
            : 'border-gray-100 dark:border-gray-600 shadow-sm hover:shadow-md'
      } transition-all`}
    >
      <div className={`p-2 rounded-lg ${color}`}>
        {icon}
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-center">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 capitalize">
            {platform}
          </p>
          {!isValid && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              Invalid URL
            </p>
          )}
        </div>
        <input
          type="text"
          value={value}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={`w-full bg-transparent border-none focus:ring-0 ${
            isValid ? 'text-gray-700 dark:text-gray-300' : 'text-red-600 dark:text-red-400'
          } p-0 text-sm`}
        />
      </div>
      <motion.a
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        href={value && isValid ? value : undefined}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => {
          if (!value || !isValid) {
            e.preventDefault();
          }
        }}
        className={`p-1.5 rounded-full ${
          value && isValid 
            ? 'text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer' 
            : 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
        }`}
      >
        <ExternalLink className="w-4 h-4" />
      </motion.a>
    </motion.div>
  );
};

export default Profile; 