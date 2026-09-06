import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Bookmark, Share2, ExternalLink, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useBookmarks } from '../context/BookmarkContext';

const NewsCard = ({ article, category }) => {
  const { addBookmark, removeBookmark, isBookmarked } = useBookmarks();
  const [isShared, setIsShared] = useState(false);
  const navigate = useNavigate();

  const handleBookmarkClick = () => {
    if (isBookmarked(article.url)) {
      removeBookmark(article.url);
      toast.success('Article removed from bookmarks');
    } else {
      addBookmark({
        id: article.url,
        title: article.title,
        description: article.description,
        image: article.urlToImage,
        date: new Date().toISOString(),
        category: category || 'General',
        readTime: '5 min read',
        source: article.source?.name || 'Unknown Source',
        url: article.url
      });
      toast.success('Article added to bookmarks');
    }
  };

  const handleDiscussionClick = () => {
    // Navigate to client-side discussion page
    navigate(`/article-discussion/${encodeURIComponent(article.url)}`, {
      state: {
        articleId: article.url,
        articleTitle: article.title,
        articleImage: article.urlToImage,
        articleSource: article.source?.name
      }
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden relative"
    >
      {/* @ Tag Link */}
      <motion.div
        onClick={handleDiscussionClick}
        className="absolute top-2 right-2 z-50 cursor-pointer"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="bg-white/95 backdrop-blur-sm rounded-full p-2.5 shadow-xl border border-blue-100">
          <span className="text-2xl font-bold text-blue-600">@</span>
        </div>
      </motion.div>

      {/* Article Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={article.urlToImage || '/placeholder-news.jpg'}
          alt={article.title}
          className="w-full h-full object-cover"
        />
        {article.source?.name && (
          <div className="absolute top-2 left-2">
            <div className="bg-black/50 text-white px-2 py-1 rounded text-sm">
              {article.source.name}
            </div>
          </div>
        )}
      </div>

      {/* Article Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2 line-clamp-2">
          {article.title}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {article.description}
        </p>

        {/* Read Full Article Link */}
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center text-blue-500 hover:text-blue-600 transition-colors text-sm mb-4"
        >
          Read Full Article
          <ExternalLink className="w-4 h-4 ml-2 text-current" />
        </a>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.button
              onClick={handleBookmarkClick}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              animate={isBookmarked(article.url) ? { scale: [1, 1.2, 1] } : { scale: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 15 }}
              className={`p-2 rounded-full transition-colors ${
                isBookmarked(article.url) ? 'text-blue-500' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Bookmark className="w-5 h-5" />
            </motion.button>
            <motion.button
              onClick={() => {
                setIsShared(true);
                navigator.share?.({
                  title: article.title,
                  text: article.description,
                  url: article.url,
                }).catch(() => {
                  // Fallback for browsers that don't support Web Share API
                  navigator.clipboard.writeText(article.url);
                  toast.success('Link copied to clipboard!');
                });
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Share2 className="w-5 h-5" />
            </motion.button>
            <motion.button
              onClick={handleDiscussionClick}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-full text-violet-500 hover:text-violet-600 transition-colors"
              title="Join the discussion"
            >
              <MessageCircle className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default NewsCard; 