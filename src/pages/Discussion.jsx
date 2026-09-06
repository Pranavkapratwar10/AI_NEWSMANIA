import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, ThumbsUp, MessageCircle, Users, Sparkles, Globe, ArrowRight, MessageSquare, Clock, Zap, Shield, Award, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const Discussion = () => {
  const [activeTab, setActiveTab] = useState('reviews');
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [reviews, setReviews] = useState([]);
  const [discussions, setDiscussions] = useState([]);
  const [discussionText, setDiscussionText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadReviews();
    loadDiscussions();
  }, []);

  const loadReviews = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/reviews');
      const data = await response.json();
      setReviews(data);
    } catch (error) {
      toast.error('Failed to load reviews');
    } finally {
      setIsLoading(false);
    }
  };

  const loadDiscussions = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/discussions');
      const data = await response.json();
      setDiscussions(data);
    } catch (error) {
      toast.error('Failed to load discussions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewText.trim() || rating === 0) {
      toast.error('Please provide both rating and review text');
      return;
    }

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: reviewText,
          rating: rating,
          userId: 'user123', // Replace with actual user ID
        }),
      });

      if (!response.ok) throw new Error('Failed to post review');

      toast.success('Review posted successfully!');
      setReviewText('');
      setRating(0);
      loadReviews();
    } catch (error) {
      toast.error('Failed to post review');
    }
  };

  const handleSubmitDiscussion = async (e) => {
    e.preventDefault();
    if (!discussionText.trim()) {
      toast.error('Please enter your discussion topic');
      return;
    }

    try {
      const response = await fetch('/api/discussions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: discussionText,
          userId: 'user123', // Replace with actual user ID
        }),
      });

      if (!response.ok) throw new Error('Failed to post discussion');

      toast.success('Discussion posted successfully!');
      setDiscussionText('');
      loadDiscussions();
    } catch (error) {
      toast.error('Failed to post discussion');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50 pt-24 pb-12">
      {/* Hero Section */}
      <motion.div 
        className="max-w-6xl mx-auto px-6 mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 rounded-2xl shadow-xl overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTAwIDAlTDEwMCAyMDBNMCAxMDBMMjAwIDEwMCIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIxIiBzdHJva2Utb3BhY2l0eT0iMC4xIi8+PC9zdmc+')] opacity-20"></div>
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-10 right-10 w-60 h-60 bg-purple-500/20 rounded-full blur-3xl"></div>
          </div>

          <div className="relative p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-2/3">
              <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
                <Users className="w-4 h-4 mr-2 text-indigo-200" />
                <span className="text-sm font-medium text-white">Community Hub</span>
                <span className="ml-2 px-2 py-0.5 bg-indigo-500 text-white text-xs font-bold rounded-full animate-pulse">ACTIVE</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Join Our Vibrant Community Discussions</h1>
              <p className="text-lg text-indigo-100 mb-6">
                Connect with other readers, share your thoughts, and discover new perspectives on the latest news topics.
              </p>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                  <Sparkles className="w-4 h-4 mr-2 text-yellow-300" />
                  <span className="text-sm text-white">Active Community</span>
                </div>
                <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                  <Globe className="w-4 h-4 mr-2 text-yellow-300" />
                  <span className="text-sm text-white">Global Perspectives</span>
                </div>
                <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                  <Zap className="w-4 h-4 mr-2 text-yellow-300" />
                  <span className="text-sm text-white">Real-time Updates</span>
                </div>
              </div>
            </div>
            <div className="md:w-1/3 flex justify-center">
              <div className="w-48 h-48 relative">
                <div className="absolute inset-0 bg-indigo-500 rounded-full opacity-20 animate-pulse"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <MessageCircle className="w-24 h-24 text-white" />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-lg animate-pulse">
                  <span className="w-2 h-2 bg-white rounded-full"></span>
                  LIVE
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-6xl mx-auto px-6">
        {/* Community Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10"
        >
          <div className="bg-white rounded-xl shadow-md p-4 border border-indigo-100 flex items-center">
            <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mr-4">
              <Users className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Active Members</p>
              <p className="text-xl font-bold text-gray-800">10,248</p>
            </div>
            <div className="ml-auto">
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">+12% ↑</span>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 border border-indigo-100 flex items-center">
            <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mr-4">
              <MessageSquare className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Discussions</p>
              <p className="text-xl font-bold text-gray-800">5,392</p>
            </div>
            <div className="ml-auto">
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">+8% ↑</span>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 border border-indigo-100 flex items-center">
            <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mr-4">
              <Star className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Average Rating</p>
              <p className="text-xl font-bold text-gray-800">4.8/5.0</p>
            </div>
            <div className="ml-auto">
              <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full font-medium">Top Tier</span>
            </div>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div 
          className="flex justify-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="bg-white p-2 rounded-xl shadow-md flex gap-2">
            <button
              onClick={() => setActiveTab('reviews')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'reviews'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Star className={`w-5 h-5 ${activeTab === 'reviews' ? '' : 'text-yellow-500'}`} />
              Platform Reviews
              {activeTab !== 'reviews' && (
                <span className="ml-2 w-2 h-2 bg-yellow-400 rounded-full"></span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('discussions')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'discussions'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
            >
              <MessageSquare className={`w-5 h-5 ${activeTab === 'discussions' ? '' : 'text-indigo-500'}`} />
              General Discussions
              {activeTab !== 'discussions' && (
                <span className="ml-2 w-2 h-2 bg-indigo-500 rounded-full"></span>
              )}
            </button>
          </div>
        </motion.div>

        {activeTab === 'reviews' ? (
          <div className="space-y-8">
            {/* Review Form */}
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              onSubmit={handleSubmitReview}
              className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">Write a Platform Review</h3>
                  <p className="text-gray-500">Share your experience with NewsMania to help us improve.</p>
                </div>
                <div className="bg-indigo-100 px-3 py-1.5 rounded-lg flex items-center">
                  <Shield className="w-4 h-4 text-indigo-600 mr-1.5" />
                  <span className="text-xs font-semibold text-indigo-700">Verified Reviews</span>
                </div>
              </div>
              
              {/* Star Rating */}
              <div className="flex items-center mb-4">
                <span className="text-sm font-medium text-gray-700 mr-3">Your Rating:</span>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`${
                        star <= rating ? 'text-yellow-400' : 'text-gray-300'
                      } hover:text-yellow-400 transition-colors`}
                    >
                      <Star className="w-8 h-8 fill-current" />
                    </button>
                  ))}
                </div>
                {rating > 0 && (
                  <span className="ml-2 text-sm font-medium text-indigo-600">
                    {rating === 5 ? 'Excellent!' : 
                     rating === 4 ? 'Very Good' : 
                     rating === 3 ? 'Good' : 
                     rating === 2 ? 'Fair' : 'Poor'}
                  </span>
                )}
              </div>

              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Share your experience with our platform..."
                className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition-all"
                rows="4"
              />
              <button
                type="submit"
                className="mt-4 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md flex items-center justify-center gap-2 font-medium"
                disabled={isLoading}
              >
                Submit Review
                {isLoading ? (
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                ) : (
                  <ArrowRight className="w-4 h-4" />
                )}
              </button>
            </motion.form>

            {/* Reviews List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <h3 className="text-xl font-semibold text-gray-800 mr-3">Recent Reviews</h3>
                  <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-1 rounded-full">Verified</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="w-4 h-4 mr-1" />
                  Updated recently
                </div>
              </div>
              
              {reviews.length === 0 ? (
                <div className="bg-white rounded-xl shadow p-8 text-center">
                  <div className="inline-block p-3 bg-indigo-50 rounded-full mb-4">
                    <Star className="w-8 h-8 text-indigo-500" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">No reviews yet</h3>
                  <p className="text-gray-500 mb-4">Be the first to share your experience!</p>
                </div>
              ) : (
                reviews.map((review) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {review.userName ? review.userName[0] : 'U'}
                        </div>
                        <div>
                          <div className="flex items-center">
                            <h4 className="font-semibold text-gray-800 mr-2">{review.userName}</h4>
                            <Award className="w-3.5 h-3.5 text-yellow-500" />
                          </div>
                          <div className="flex items-center">
                            <div className="flex mr-2">
                              {[...Array(5)].map((_, index) => (
                                <Star
                                  key={index}
                                  className={`w-4 h-4 ${
                                    index < review.rating
                                      ? 'text-yellow-400 fill-current'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            {review.rating >= 4 && (
                              <span className="text-xs bg-green-100 text-green-800 px-1.5 py-0.5 rounded font-medium">
                                Recommended
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500 flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-700 bg-gray-50 p-4 rounded-lg border border-gray-100">{review.content}</p>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Discussion Form */}
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              onSubmit={handleSubmitDiscussion}
              className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">Start a Discussion</h3>
                  <p className="text-gray-500">Share your thoughts, ask questions, or discuss recent news events.</p>
                </div>
                <div className="bg-green-100 px-3 py-1.5 rounded-lg flex items-center">
                  <AlertCircle className="w-4 h-4 text-green-600 mr-1.5" />
                  <span className="text-xs font-semibold text-green-700">Community Active</span>
                </div>
              </div>
              
              <textarea
                value={discussionText}
                onChange={(e) => setDiscussionText(e.target.value)}
                placeholder="What's on your mind?"
                className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition-all"
                rows="4"
              />
              <button
                type="submit"
                className="mt-4 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md flex items-center justify-center gap-2 font-medium"
                disabled={isLoading}
              >
                Post Discussion
                {isLoading ? (
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                ) : (
                  <ArrowRight className="w-4 h-4" />
                )}
              </button>
            </motion.form>

            {/* Discussions List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <h3 className="text-xl font-semibold text-gray-800 mr-3">Active Discussions</h3>
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-1 rounded-full flex items-center">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1 animate-pulse"></span>
                    Live
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="w-4 h-4 mr-1" />
                  Updated recently
                </div>
              </div>
              
              {discussions.length === 0 ? (
                <div className="bg-white rounded-xl shadow p-8 text-center">
                  <div className="inline-block p-3 bg-indigo-50 rounded-full mb-4">
                    <MessageSquare className="w-8 h-8 text-indigo-500" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">No discussions yet</h3>
                  <p className="text-gray-500 mb-4">Start the conversation!</p>
                </div>
              ) : (
                discussions.map((discussion) => (
                  <motion.div
                    key={discussion.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {discussion.userName ? discussion.userName[0] : 'U'}
                        </div>
                        <div>
                          <div className="flex items-center">
                            <h4 className="font-semibold text-gray-800 mr-2">{discussion.userName}</h4>
                            <span className="bg-blue-100 text-blue-700 text-xs px-1.5 py-0.5 rounded">
                              Top Contributor
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full">
                              Community Member
                            </span>
                            <span className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full flex items-center">
                              <Sparkles className="w-3 h-3 mr-1" /> Active
                            </span>
                          </div>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500 flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {new Date(discussion.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-700 bg-gray-50 p-4 rounded-lg border border-gray-100 mb-4">{discussion.content}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-sm">
                        <button className="flex items-center gap-1 text-gray-500 hover:text-indigo-600 transition-colors">
                          <ThumbsUp className="w-4 h-4" />
                          <span>{Math.floor(Math.random() * 50)}</span>
                        </button>
                        <button className="flex items-center gap-1 text-gray-500 hover:text-indigo-600 transition-colors">
                          <MessageCircle className="w-4 h-4" />
                          <span>Reply</span>
                        </button>
                      </div>
                      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                        {Math.floor(Math.random() * 200)} views
                      </span>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Discussion;