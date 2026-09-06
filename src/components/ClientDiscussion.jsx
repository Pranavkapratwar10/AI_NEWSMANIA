import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, ThumbsUp, Reply, X, ChevronDown, ChevronUp, User, Send, Clock, ArrowLeft } from 'lucide-react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const ClientDiscussion = () => {
  const { articleId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const articleData = location.state || {};
  const commentsEndRef = useRef(null);
  
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userName, setUserName] = useState('');
  const [showUserNamePrompt, setShowUserNamePrompt] = useState(false);
  const [expandedComments, setExpandedComments] = useState({});
  const [sortBy, setSortBy] = useState('recent'); // 'recent', 'popular'

  // Load comments from localStorage on component mount
  useEffect(() => {
    if (articleId) {
      loadComments();
      // Check if user has a name set
      const savedName = localStorage.getItem('newsmania_user_name');
      if (savedName) {
        setUserName(savedName);
      } else {
        setShowUserNamePrompt(true);
      }
    }
  }, [articleId]);

  // Scroll to bottom when new comments are added
  useEffect(() => {
    commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [comments]);

  // Load comments from localStorage
  const loadComments = () => {
    try {
      const savedComments = localStorage.getItem(`comments_${articleId}`);
      if (savedComments) {
        setComments(JSON.parse(savedComments));
      }
    } catch (error) {
      console.error('Failed to load comments:', error);
      toast.error('Failed to load comments');
    }
  };

  // Save comments to localStorage
  const saveComments = (updatedComments) => {
    try {
      localStorage.setItem(`comments_${articleId}`, JSON.stringify(updatedComments));
    } catch (error) {
      console.error('Failed to save comments:', error);
      toast.error('Failed to save comments');
    }
  };

  // Handle setting user name
  const handleSetUserName = (e) => {
    e.preventDefault();
    if (userName.trim()) {
      localStorage.setItem('newsmania_user_name', userName);
      setShowUserNamePrompt(false);
      toast.success('Username set successfully!');
    }
  };

  // Handle submitting a new comment
  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    if (!userName) {
      setShowUserNamePrompt(true);
      return;
    }

    const newCommentObj = {
      id: Date.now().toString(),
      content: newComment,
      author: userName,
      timestamp: new Date().toISOString(),
      likes: 0,
      likedBy: [],
      replies: [],
      articleId: articleId
    };

    const updatedComments = [...comments, newCommentObj];
    setComments(updatedComments);
    saveComments(updatedComments);
    setNewComment('');
    setReplyTo(null);
    toast.success('Comment posted successfully!');
  };

  // Handle submitting a reply
  const handleSubmitReply = (parentId) => {
    if (!replyTo.content.trim()) return;
    
    if (!userName) {
      setShowUserNamePrompt(true);
      return;
    }

    const newReply = {
      id: Date.now().toString(),
      content: replyTo.content,
      author: userName,
      timestamp: new Date().toISOString(),
      likes: 0,
      likedBy: [],
      parentId: parentId
    };

    const updatedComments = comments.map(comment => {
      if (comment.id === parentId) {
        return {
          ...comment,
          replies: [...comment.replies, newReply]
        };
      }
      return comment;
    });

    setComments(updatedComments);
    saveComments(updatedComments);
    setReplyTo(null);
    toast.success('Reply posted successfully!');
  };

  // Handle liking a comment
  const handleLike = (commentId, isReply = false, parentId = null) => {
    if (!userName) {
      setShowUserNamePrompt(true);
      return;
    }

    let updatedComments;
    
    if (isReply && parentId) {
      // Handle liking a reply
      updatedComments = comments.map(comment => {
        if (comment.id === parentId) {
          const updatedReplies = comment.replies.map(reply => {
            if (reply.id === commentId) {
              const isLiked = reply.likedBy.includes(userName);
              return {
                ...reply,
                likes: isLiked ? reply.likes - 1 : reply.likes + 1,
                likedBy: isLiked 
                  ? reply.likedBy.filter(name => name !== userName)
                  : [...reply.likedBy, userName]
              };
            }
            return reply;
          });
          return { ...comment, replies: updatedReplies };
        }
        return comment;
      });
    } else {
      // Handle liking a main comment
      updatedComments = comments.map(comment => {
        if (comment.id === commentId) {
          const isLiked = comment.likedBy.includes(userName);
          return {
            ...comment,
            likes: isLiked ? comment.likes - 1 : comment.likes + 1,
            likedBy: isLiked 
              ? comment.likedBy.filter(name => name !== userName)
              : [...comment.likedBy, userName]
          };
        }
        return comment;
      });
    }

    setComments(updatedComments);
    saveComments(updatedComments);
  };

  // Toggle expanded state of a comment
  const toggleExpanded = (commentId) => {
    setExpandedComments(prev => ({
      ...prev,
      [commentId]: !prev[commentId]
    }));
  };

  // Check if a comment is liked by the current user
  const isLiked = (comment, isReply = false) => {
    if (!userName) return false;
    return isReply 
      ? comment.likedBy.includes(userName)
      : comment.likedBy.includes(userName);
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Sort comments based on selected criteria
  const getSortedComments = () => {
    if (sortBy === 'recent') {
      return [...comments].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    } else {
      return [...comments].sort((a, b) => b.likes - a.likes);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-md z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
            <span>Back</span>
          </button>
          <h1 className="text-xl font-bold text-gray-800">Discussion</h1>
          <div className="w-20"></div> {/* Spacer for alignment */}
        </div>
      </div>

      {/* Article Context */}
      {articleData.articleTitle && (
        <div className="bg-white shadow-sm">
          <div className="max-w-4xl mx-auto px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={articleData.articleImage || '/placeholder-news.jpg'}
                  alt={articleData.articleTitle}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800 line-clamp-1">{articleData.articleTitle}</h2>
                {articleData.articleSource && (
                  <p className="text-sm text-gray-500">Source: {articleData.articleSource}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Username Prompt */}
      {showUserNamePrompt && (
        <div className="bg-white shadow-sm">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Set Your Display Name</h3>
              <p className="text-blue-700 mb-4">Please enter a name to use for your comments.</p>
              <form onSubmit={handleSetUserName} className="flex gap-2">
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Your name"
                  className="flex-1 p-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Set Name
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Sort Options */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">Comments</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setSortBy('recent')}
                className={`px-3 py-1 rounded-lg text-sm ${
                  sortBy === 'recent'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Most Recent
              </button>
              <button
                onClick={() => setSortBy('popular')}
                className={`px-3 py-1 rounded-lg text-sm ${
                  sortBy === 'popular'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Most Liked
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-4 space-y-4">
          {getSortedComments().map((comment) => (
            <div
              key={comment.id}
              className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-semibold">
                    {comment.author.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-800">{comment.author}</span>
                    <span className="text-xs text-gray-500 flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {formatDate(comment.timestamp)}
                    </span>
                  </div>
                  <p className="text-gray-700">{comment.content}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <button
                      onClick={() => handleLike(comment.id)}
                      className={`flex items-center gap-1 ${
                        isLiked(comment) ? 'text-blue-500' : 'text-gray-500 hover:text-blue-500'
                      }`}
                    >
                      <ThumbsUp className="w-4 h-4" />
                      <span className="text-sm">{comment.likes}</span>
                    </button>
                    <button
                      onClick={() => setReplyTo({ id: comment.id, content: '' })}
                      className="flex items-center gap-1 text-gray-500 hover:text-blue-500"
                    >
                      <Reply className="w-4 h-4" />
                      <span className="text-sm">Reply</span>
                    </button>
                  </div>

                  {/* Replies */}
                  {comment.replies.length > 0 && (
                    <div className="mt-4">
                      <button
                        onClick={() => toggleExpanded(comment.id)}
                        className="flex items-center gap-1 text-sm text-blue-500 hover:text-blue-700"
                      >
                        {expandedComments[comment.id] ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                        <span>
                          {expandedComments[comment.id] ? 'Hide' : 'Show'} {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
                        </span>
                      </button>

                      {expandedComments[comment.id] && (
                        <div className="mt-2 space-y-3 pl-4 border-l-2 border-gray-100">
                          {comment.replies.map((reply) => (
                            <div key={reply.id} className="bg-gray-50 rounded-lg p-3">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-sm text-gray-800">{reply.author}</span>
                                <span className="text-xs text-gray-500 flex items-center">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {formatDate(reply.timestamp)}
                                </span>
                              </div>
                              <p className="text-gray-700 text-sm">{reply.content}</p>
                              <div className="flex items-center gap-3 mt-2">
                                <button
                                  onClick={() => handleLike(reply.id, true, comment.id)}
                                  className={`flex items-center gap-1 text-xs ${
                                    isLiked(reply, true) ? 'text-blue-500' : 'text-gray-500 hover:text-blue-500'
                                  }`}
                                >
                                  <ThumbsUp className="w-3 h-3" />
                                  <span>{reply.likes}</span>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Reply Form */}
                  {replyTo && replyTo.id === comment.id && (
                    <div className="mt-4 bg-gray-50 rounded-lg p-3">
                      <textarea
                        value={replyTo.content}
                        onChange={(e) => setReplyTo({ ...replyTo, content: e.target.value })}
                        placeholder="Write a reply..."
                        className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        rows="2"
                      />
                      <div className="flex justify-end gap-2 mt-2">
                        <button
                          onClick={() => setReplyTo(null)}
                          className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSubmitReply(comment.id)}
                          className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                          Reply
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {comments.length === 0 && (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No comments yet</h3>
              <p className="text-gray-500">Be the first to start the discussion!</p>
            </div>
          )}
          
          <div ref={commentsEndRef} />
        </div>
      </div>

      {/* Comment Form */}
      <div className="bg-white shadow-md border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <form onSubmit={handleSubmitComment} className="flex gap-3">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-semibold">
                {userName ? userName.charAt(0).toUpperCase() : '?'}
              </div>
            </div>
            <div className="flex-1 relative">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={userName ? "Share your thoughts..." : "Please set your name to comment"}
                className="w-full p-3 pr-12 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows="2"
                disabled={!userName}
              />
              <button
                type="submit"
                className="absolute right-2 bottom-2 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!userName || !newComment.trim() || isLoading}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ClientDiscussion; 