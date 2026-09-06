import React from 'react';
import { motion } from 'framer-motion';
import { BookmarkIcon, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import BookmarksGrid from './BookmarksGrid';

const BookmarksPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-blue-100 dark:bg-blue-900/20 rounded-full filter blur-3xl opacity-20 transform translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-indigo-100 dark:bg-indigo-900/20 rounded-full filter blur-3xl opacity-20 transform -translate-x-1/3 translate-y-1/3"></div>
      </div>
      
      <div className="container mx-auto relative z-10">
        {/* Back button */}
        <motion.button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mb-6"
          whileHover={{ x: -5 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronLeft size={16} />
          <span className="ml-1">{t('common.back')}</span>
        </motion.button>
        
        {/* Page header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-3">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-full">
              <BookmarkIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              {t('bookmarksSection.title', 'My Bookmarks')}
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300 ml-16">
            {t('bookmarksSection.subtitle', 'Test your knowledge with quizzes on your saved articles.')}
          </p>
          
          {/* Horizontal divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent mt-8"></div>
        </motion.div>
        
        {/* Bookmarks grid */}
        <div className="mt-8">
          <BookmarksGrid />
        </div>
      </div>
    </div>
  );
};

export default BookmarksPage; 