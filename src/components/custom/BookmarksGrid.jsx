import React from 'react';
import { motion } from 'framer-motion';
import { useBookmarks } from '../../context/BookmarkContext';
import BookmarkCard from './BookmarkCard';
import { BookmarkX } from 'lucide-react';

const BookmarksGrid = () => {
  const { bookmarks } = useBookmarks();

  if (!bookmarks || bookmarks.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-12 px-4 text-center"
      >
        <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-4 mb-6">
          <BookmarkX className="w-12 h-12 text-gray-400 dark:text-gray-500" />
        </div>
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">No bookmarks yet</h3>
        <p className="text-gray-600 dark:text-gray-400 max-w-md">
          When you bookmark articles, they will appear here. Start exploring news to bookmark articles you'd like to read later.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {bookmarks.map((article, index) => (
        <motion.div
          key={article.id || index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <BookmarkCard article={article} />
        </motion.div>
      ))}
    </div>
  );
};

export default BookmarksGrid; 