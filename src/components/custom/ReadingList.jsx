import React, { useState } from 'react';
import { useBookmarks } from '../../context/BookmarkContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, ArrowLeft, Clock, Calendar, ExternalLink, Tag, Share2, Trash2, Search } from 'lucide-react';

export default function ReadingList() {
  const { bookmarks, removeBookmark } = useBookmarks();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  const filteredBookmarks = bookmarks
    .filter(article => 
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      article.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(article => {
      if (filter === 'all') return true;
      if (filter === 'recent') return new Date(article.publishedAt || Date.now()) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return article.category === filter;
    });

  const formatDate = (dateString) => {
    const date = new Date(dateString || Date.now());
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const handleRemoveBookmark = (e, articleId) => {
    e.stopPropagation();
    removeBookmark(articleId);
  };

  const getRandomReadTime = () => {
    return Math.floor(Math.random() * 10) + 3; // Between 3-12 minutes
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 p-6"
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <motion.button 
              whileHover={{ x: -3 }}
              onClick={() => navigate(-1)} 
              className="flex items-center text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </motion.button>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Reading List</h1>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input 
              type="text" 
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
            />
          </div>
        </div>
        
        <div className="mb-6 flex space-x-2 overflow-x-auto pb-2">
          <FilterButton active={filter === 'all'} onClick={() => setFilter('all')}>
            All
          </FilterButton>
          <FilterButton active={filter === 'recent'} onClick={() => setFilter('recent')}>
            Recent
          </FilterButton>
          <FilterButton active={filter === 'Technology'} onClick={() => setFilter('Technology')}>
            Technology
          </FilterButton>
          <FilterButton active={filter === 'Politics'} onClick={() => setFilter('Politics')}>
            Politics
          </FilterButton>
          <FilterButton active={filter === 'Business'} onClick={() => setFilter('Business')}>
            Business
          </FilterButton>
          <FilterButton active={filter === 'Health'} onClick={() => setFilter('Health')}>
            Health
          </FilterButton>
        </div>
        
        {filteredBookmarks.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-center"
          >
            <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Your reading list is empty
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {searchTerm ? "No articles match your search criteria." : "Articles you save will appear here for you to read later."}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/discover')}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full hover:from-blue-700 hover:to-indigo-700 transition-all font-medium"
            >
              Discover Articles
            </motion.button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredBookmarks.map((article, index) => (
                <motion.div 
                  key={article.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ 
                    y: -5, 
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" 
                  }}
                  onClick={() => window.open(article.url, '_blank')}
                  className="cursor-pointer group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all border border-gray-100 dark:border-gray-700 relative flex flex-col h-full"
                >
                  {article.urlToImage && (
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={article.urlToImage} 
                        alt={article.title} 
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  )}
                  
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-3">
                      <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-medium rounded-full">
                        {article.category || "News"}
                      </span>
                      <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                        <Clock className="h-3 w-3" />
                        <span>{article.readTime || `${getRandomReadTime()} min read`}</span>
                      </div>
                    </div>
                    
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {article.title}
                    </h2>
                    
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3 flex-1">
                      {article.description || "No description available."}
                    </p>
                    
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700 mt-auto">
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>{formatDate(article.publishedAt)}</span>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            navigator.clipboard.writeText(article.url);
                            alert('Link copied to clipboard!');
                          }}
                          className="p-1.5 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                          <Share2 className="h-4 w-4" />
                        </button>
                        
                        <button 
                          onClick={(e) => handleRemoveBookmark(e, article.id)}
                          className="p-1.5 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
        
        {filteredBookmarks.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              You have {filteredBookmarks.length} article{filteredBookmarks.length !== 1 ? 's' : ''} in your reading list
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// Helper component for filter buttons
function FilterButton({ children, active, onClick }) {
  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
        active 
          ? 'bg-blue-600 text-white shadow-md' 
          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
      }`}
    >
      {children}
    </motion.button>
  );
} 