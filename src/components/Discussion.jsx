import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageCircle, ThumbsUp, Reply, X } from 'lucide-react';
import toast from 'react-hot-toast';

const Discussion = () => {
  const location = useLocation();
  const articleContext = location.state || null;
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load comments for the specific article
  useEffect(() => {
    if (articleContext?.articleId) {
      loadComments(articleContext.articleId);
    }
  }, [articleContext?.articleId]);

  const loadComments = async (articleId) => {
    setIsLoading(true);
    try {
      // Replace with your actual API call
      const response = await fetch(`/api/comments?articleId=${articleId}`);
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error('Failed to load comments:', error);
      toast.error('Failed to load comments');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      // Replace with your actual API call
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newComment,
          articleId: articleContext?.articleId,
          parentId: replyTo?.id,
        }),
      });

      if (!response.ok) throw new Error('Failed to post comment');

      const comment = await response.json();
      setComments(prev => [...prev, comment]);
      setNewComment('');
      setReplyTo(null);
      toast.success('Comment posted successfully!');
    } catch (error) {
      console.error('Failed to post comment:', error);
      toast.error('Failed to post comment');
    }
  };

  const handleLike = async (commentId) => {
    try {
      // Replace with your actual API call
      const response = await fetch(`/api/comments/${commentId}/like`, {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Failed to like comment');

      setComments(prev =>
        prev.map(comment =>
          comment.id === commentId
            ? { ...comment, likes: comment.likes + 1 }
            : comment
        )
      );
    } catch (error) {
      console.error('Failed to like comment:', error);
      toast.error('Failed to like comment');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Article Context */}
      {articleContext && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden mb-6"
        >
          <div className="relative h-48">
            <img
              src={articleContext.articleImage || '/placeholder-news.jpg'}
              alt={articleContext.articleTitle}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
              <h2 className="text-xl font-bold mb-2">{articleContext.articleTitle}</h2>
              {articleContext.articleSource && (
                <p className="text-sm opacity-80">Source: {articleContext.articleSource}</p>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Comment Form */}
      <form onSubmit={handleSubmitComment} className="mb-6">
        <div className="bg-white rounded-xl shadow-lg p-4">
          {replyTo && (
            <div className="flex items-center justify-between mb-2 p-2 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">
                Replying to: {replyTo.content.substring(0, 50)}...
              </span>
              <button
                type="button"
                onClick={() => setReplyTo(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts..."
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows="3"
          />
          <div className="flex justify-end mt-2">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              disabled={isLoading}
            >
              {isLoading ? 'Posting...' : 'Post Comment'}
            </button>
          </div>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <motion.div
            key={comment.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-4"
          >
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold">{comment.author}</span>
                  <span className="text-sm text-gray-500">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-700">{comment.content}</p>
                <div className="flex items-center gap-4 mt-2">
                  <button
                    onClick={() => handleLike(comment.id)}
                    className="flex items-center gap-1 text-gray-500 hover:text-blue-500"
                  >
                    <ThumbsUp className="w-4 h-4" />
                    <span>{comment.likes}</span>
                  </button>
                  <button
                    onClick={() => setReplyTo(comment)}
                    className="flex items-center gap-1 text-gray-500 hover:text-blue-500"
                  >
                    <Reply className="w-4 h-4" />
                    <span>Reply</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Discussion; 