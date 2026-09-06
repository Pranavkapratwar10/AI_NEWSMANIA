import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Trash2, ExternalLink, BrainCircuit } from 'lucide-react';
import { useBookmarks } from '../../context/BookmarkContext';
import QuizComponent from './QuizComponent';

const BookmarkCard = ({ article }) => {
  const { removeBookmark } = useBookmarks();
  const [showQuiz, setShowQuiz] = useState(false);

  // Ensure article has an ID
  const articleWithId = article.id ? article : { ...article, id: article.url };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const handleQuizClick = () => {
    console.log("Quiz button clicked for article:", articleWithId);
    setShowQuiz(true);
  };

  const handleCloseQuiz = () => {
    setShowQuiz(false);
  };

  return (
    <>
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all overflow-hidden"
        whileHover={{ y: -5 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Article image */}
        <div className="h-48 w-full overflow-hidden relative">
          {article.urlToImage ? (
            <img
              src={article.urlToImage}
              alt={article.title}
              className="w-full h-full object-cover transform transition-transform hover:scale-105"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/news_placeholder.jpg';
              }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center">
              <BookOpen className="w-16 h-16 text-white opacity-50" />
            </div>
          )}
          <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/60 to-transparent p-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium text-white bg-blue-500 px-2 py-1 rounded-full">
                {article.source?.name || 'News'}
              </span>
              <span className="text-xs text-white opacity-75">
                {formatDate(article.publishedAt)}
              </span>
            </div>
          </div>
        </div>

        {/* Article content */}
        <div className="p-5">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2 line-clamp-2">
            {article.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
            {article.description || 'No description available for this article.'}
          </p>

          {/* Actions */}
          <div className="flex justify-between items-center mt-4">
            <div className="flex gap-2">
              <motion.button
                onClick={() => window.open(article.url, '_blank')}
                className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 p-2 rounded-full hover:bg-blue-100 dark:hover:bg-blue-800/50"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ExternalLink size={18} />
              </motion.button>
              <motion.button
                onClick={() => removeBookmark(article.id)}
                className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-800/50"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Trash2 size={18} />
              </motion.button>
            </div>
            <motion.button
              onClick={handleQuizClick}
              className="flex items-center gap-2 px-3 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-full text-sm font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <BrainCircuit size={16} />
              Take Quiz
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Quiz Modal */}
      {showQuiz && <QuizComponent article={articleWithId} onClose={handleCloseQuiz} />}
    </>
  );
};

export default BookmarkCard; 