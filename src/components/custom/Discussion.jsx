import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Share,
  Flag,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Filter,
  Award,
  BarChart2,
  User,
  MessageCircle,
  Clock,
  AlertTriangle,
  Trash2,
  Heart,
  Telescope,
  CheckCircle2,
  Send,
  ArrowLeft,
  Star,
  Sparkles,
  Smile,
  ThumbsUp as ThumbsUpIcon,
  MessageCircle as MessageCircleIcon,
  Award as AwardIcon,
  Zap,
  Shield,
  Globe,
  BookOpen,
  Users,
  TrendingUp,
  Search,
  X,
  Plus,
  Share2,
} from "lucide-react";
import { db } from "../../../firebase";
import { collection, addDoc, serverTimestamp, onSnapshot, query, orderBy, deleteDoc, doc, updateDoc, arrayUnion, arrayRemove, increment, where, limit } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

const Discussion = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [discussions, setDiscussions] = useState([]);
  const [filteredDiscussions, setFilteredDiscussions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newDiscussion, setNewDiscussion] = useState({
    title: "",
    content: "",
    tags: [],
  });
  const [showNewDiscussionForm, setShowNewDiscussionForm] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [sortBy, setSortBy] = useState("latest");
  const [selectedDiscussion, setSelectedDiscussion] = useState(null);
  const [showDiscussionDetail, setShowDiscussionDetail] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [rating, setRating] = useState(5);
  const [reviewType, setReviewType] = useState("general");
  const [comments, setComments] = useState([]);
  const [replies, setReplies] = useState([]);

  // Available tags for discussions
  const availableTags = [
    "Technology",
    "Politics",
    "Science",
    "Business",
    "Entertainment",
    "Sports",
    "Health",
    "Education",
  ];

  // Perspective colors for different review types
  const perspectiveColors = {
    Economic: {
      bg: "bg-emerald-100",
      text: "text-emerald-800",
      border: "border-emerald-200",
    },
    Political: {
      bg: "bg-blue-100",
      text: "text-blue-800",
      border: "border-blue-200",
    },
    International: {
      bg: "bg-purple-100",
      text: "text-purple-800",
      border: "border-purple-200",
    },
    Scientific: {
      bg: "bg-rose-100",
      text: "text-rose-800",
      border: "border-rose-200",
    },
    General: {
      bg: "bg-gray-100",
      text: "text-gray-800",
      border: "border-gray-200",
    },
  };

  // Subscribe to real-time discussion updates
  useEffect(() => {
    setIsLoading(true);
    let discussionsQuery = collection(db, "discussions");

    // Apply filters based on active tab
    switch (activeTab) {
      case "trending":
        discussionsQuery = query(
          discussionsQuery,
          orderBy("views", "desc"),
          limit(10)
        );
        break;
      case "latest":
        discussionsQuery = query(
          discussionsQuery,
          orderBy("timestamp", "desc"),
          limit(20)
        );
        break;
      case "top":
        discussionsQuery = query(
          discussionsQuery,
          orderBy("rating", "desc"),
          limit(10)
        );
        break;
      default:
        discussionsQuery = query(
          discussionsQuery,
          orderBy("timestamp", "desc"),
          limit(20)
        );
    }

    const unsubscribe = onSnapshot(
      discussionsQuery,
      (snapshot) => {
        const fetched = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp?.toDate().toISOString(),
        }));
        setDiscussions(fetched);
        setFilteredDiscussions(fetched);
        setIsLoading(false);
      },
      (err) => {
        console.error("Error fetching discussions:", err);
        setError("Failed to load discussions");
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [activeTab]);

  // Filter discussions based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredDiscussions(discussions);
      return;
    }

    const filtered = discussions.filter(discussion =>
      discussion.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      discussion.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      discussion.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    setFilteredDiscussions(filtered);
  }, [searchQuery, discussions]);

  // Handle creating a new discussion
  const handleCreateDiscussion = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      navigate("/login");
      return;
    }

    try {
      const discussionData = {
        title: newDiscussion.title,
        content: newDiscussion.content,
        tags: selectedTags,
        author: {
          id: currentUser.uid,
          name: currentUser.displayName || currentUser.email,
          avatar: currentUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.uid}`,
        },
        timestamp: serverTimestamp(),
        rating: 0,
        views: 0,
        likes: 0,
        commentCount: 0,
      };

      await addDoc(collection(db, "discussions"), discussionData);
      
      // Reset form
      setNewDiscussion({ title: "", content: "", tags: [] });
      setSelectedTags([]);
      setShowNewDiscussionForm(false);
      
      // Refresh discussions
      const snapshot = await getDocs(query(collection(db, "discussions"), orderBy("timestamp", "desc"), limit(20)));
      const fetchedDiscussions = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate().toISOString(),
      }));
      setDiscussions(fetchedDiscussions);
      setFilteredDiscussions(fetchedDiscussions);
    } catch (err) {
      console.error("Error creating discussion:", err);
      setError("Failed to create discussion");
    }
  };

  // Handle liking a discussion
  const handleLikeDiscussion = async (discussionId) => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    try {
      const discussionRef = doc(db, "discussions", discussionId);
      await updateDoc(discussionRef, {
        likes: increment(1),
        likedBy: arrayUnion(currentUser.uid),
      });
    } catch (err) {
      console.error("Error liking discussion:", err);
      setError("Failed to like discussion");
    }
  };

  // Handle unliking a discussion
  const handleUnlikeDiscussion = async (discussionId) => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    try {
      const discussionRef = doc(db, "discussions", discussionId);
      await updateDoc(discussionRef, {
        likes: increment(-1),
        likedBy: arrayRemove(currentUser.uid),
      });
    } catch (err) {
      console.error("Error unliking discussion:", err);
      setError("Failed to unlike discussion");
    }
  };

  // Handle submitting a comment
  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      navigate("/login");
      return;
    }

    if (newComment.trim() === "") return;

    try {
      const commentData = {
      content: newComment,
        userId: currentUser.uid,
        userEmail: currentUser.email,
        userName: currentUser.displayName || currentUser.email.split("@")[0],
        userAvatar: currentUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.uid}`,
        timestamp: serverTimestamp(),
      likes: 0,
      dislikes: 0,
        likedBy: [],
        dislikedBy: [],
      sentiment: "neutral",
        perspective: reviewType,
        rating: rating,
        discussionId: selectedDiscussion.id,
      };

      // Add comment to Firestore
      await addDoc(collection(db, "comments"), commentData);
      
      // Update discussion comment count
      const discussionRef = doc(db, "discussions", selectedDiscussion.id);
      await updateDoc(discussionRef, {
        commentCount: increment(1),
      });
      
      // Clear the comment input
    setNewComment("");
      setRating(5);
      setReviewType("general");
    } catch (err) {
      console.error("Error posting comment:", err);
      setError("Failed to post comment. Please try again.");
    }
  };

  // Handle submitting a reply
  const handleSubmitReply = async (commentId) => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    if (replyText.trim() === "") return;

    try {
      const replyData = {
          content: replyText,
        userId: currentUser.uid,
        userEmail: currentUser.email,
        userName: currentUser.displayName || currentUser.email.split("@")[0],
        userAvatar: currentUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.uid}`,
        timestamp: serverTimestamp(),
          likes: 0,
          dislikes: 0,
        likedBy: [],
        dislikedBy: [],
        commentId: commentId,
        discussionId: selectedDiscussion.id,
      };

      // Add reply to Firestore
      await addDoc(collection(db, "replies"), replyData);
      
      // Clear the reply input
      setReplyTo(null);
      setReplyText("");
    } catch (err) {
      console.error("Error posting reply:", err);
      setError("Failed to post reply. Please try again.");
    }
  };

  // Handle liking a comment
  const handleLikeComment = async (commentId) => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    
    try {
      const commentRef = doc(db, "comments", commentId);
      
      // Add the user's ID to the likedBy array
      await updateDoc(commentRef, {
        likedBy: arrayUnion(currentUser.uid),
        likes: increment(1)
      });
      
      // If user previously disliked, remove from dislikedBy
      const comment = await getDocs(query(collection(db, "comments"), where("id", "==", commentId)));
      if (comment.docs[0]?.data()?.dislikedBy?.includes(currentUser.uid)) {
        await updateDoc(commentRef, {
          dislikedBy: arrayRemove(currentUser.uid),
          dislikes: increment(-1)
        });
      }
    } catch (err) {
      console.error("Error liking comment:", err);
      setError("Failed to like comment. Please try again.");
    }
  };

  // Handle disliking a comment
  const handleDislikeComment = async (commentId) => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    
    try {
      const commentRef = doc(db, "comments", commentId);
      
      // Add the user's ID to the dislikedBy array
      await updateDoc(commentRef, {
        dislikedBy: arrayUnion(currentUser.uid),
        dislikes: increment(1)
      });
      
      // If user previously liked, remove from likedBy
      const comment = await getDocs(query(collection(db, "comments"), where("id", "==", commentId)));
      if (comment.docs[0]?.data()?.likedBy?.includes(currentUser.uid)) {
        await updateDoc(commentRef, {
          likedBy: arrayRemove(currentUser.uid),
          likes: increment(-1)
        });
      }
    } catch (err) {
      console.error("Error disliking comment:", err);
      setError("Failed to dislike comment. Please try again.");
    }
  };

  // Handle unliking a comment
  const handleUnlikeComment = async (commentId) => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    
    try {
      const commentRef = doc(db, "comments", commentId);
      
      // Remove the user's ID from the likedBy array
      await updateDoc(commentRef, {
        likedBy: arrayRemove(currentUser.uid),
        likes: increment(-1)
      });
    } catch (err) {
      console.error("Error unliking comment:", err);
      setError("Failed to unlike comment. Please try again.");
    }
  };

  // Handle undisliking a comment
  const handleUndislikeComment = async (commentId) => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    
    try {
      const commentRef = doc(db, "comments", commentId);
      
      // Remove the user's ID from the dislikedBy array
      await updateDoc(commentRef, {
        dislikedBy: arrayRemove(currentUser.uid),
        dislikes: increment(-1)
      });
    } catch (err) {
      console.error("Error undisliking comment:", err);
      setError("Failed to undislike comment. Please try again.");
    }
  };

  // Check if a comment is liked by the current user
  const isCommentLiked = (comment) => {
    return currentUser && comment.likedBy && comment.likedBy.includes(currentUser.uid);
  };

  // Check if a comment is disliked by the current user
  const isCommentDisliked = (comment) => {
    return currentUser && comment.dislikedBy && comment.dislikedBy.includes(currentUser.uid);
  };

  // Check if a discussion is liked by the current user
  const isDiscussionLiked = (discussion) => {
    return currentUser && discussion.likedBy && discussion.likedBy.includes(currentUser.uid);
  };

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "Just now";
    
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return "Just now";
  };

  // Handle viewing discussion details
  const handleViewDiscussion = async (discussion) => {
    setSelectedDiscussion(discussion);
    setShowDiscussionDetail(true);
    
    // Increment view count
    try {
      const discussionRef = doc(db, "discussions", discussion.id);
      await updateDoc(discussionRef, {
        views: increment(1),
      });
    } catch (err) {
      console.error("Error updating view count:", err);
    }
  };

  // Handle going back to discussions list
  const handleBackToDiscussions = () => {
    setShowDiscussionDetail(false);
    setSelectedDiscussion(null);
  };

  // Delete a discussion
  const handleDeleteDiscussion = async (discussionId) => {
    try {
      await deleteDoc(doc(db, "discussions", discussionId));
      setDiscussions(prev => prev.filter(d => d.id !== discussionId));
      setFilteredDiscussions(prev => prev.filter(d => d.id !== discussionId));
      toast.success("Discussion deleted successfully");
    } catch (err) {
      console.error("Error deleting discussion:", err);
      toast.error("Failed to delete discussion");
    }
  };

  // Subscribe to comments and replies when viewing details
  useEffect(() => {
    if (!showDiscussionDetail || !selectedDiscussion) return;
    const commentsQ = query(
      collection(db, "comments"),
      where("discussionId", "==", selectedDiscussion.id),
      orderBy("timestamp", "asc")
    );
    const unsubscribeComments = onSnapshot(commentsQ, (snap) => {
      setComments(
        snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
          timestamp: d.data().timestamp?.toDate().toISOString(),
        }))
      );
    });
    const repliesQ = query(
      collection(db, "replies"),
      where("discussionId", "==", selectedDiscussion.id),
      orderBy("timestamp", "asc")
    );
    const unsubscribeReplies = onSnapshot(repliesQ, (snap) => {
      setReplies(
        snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
          timestamp: d.data().timestamp?.toDate().toISOString(),
        }))
      );
    });
    return () => {
      unsubscribeComments();
      unsubscribeReplies();
    };
  }, [showDiscussionDetail, selectedDiscussion]);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-purple-500"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 my-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertTriangle className="h-5 w-5 text-red-500" />
          </div>
          <div className="ml-3">
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  // Discussion Detail View
  if (showDiscussionDetail && selectedDiscussion) {
  return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <button
            onClick={handleBackToDiscussions}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Discussions
          </button>

          {/* Discussion Header */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex items-start gap-4 mb-4">
              <img
                src={selectedDiscussion.author.avatar}
                alt={selectedDiscussion.author.name}
                className="w-12 h-12 rounded-full"
              />
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">
                  {selectedDiscussion.title}
                </h1>
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <span>{selectedDiscussion.author.name}</span>
                  <span className="mx-2">•</span>
                  <span>{formatTimestamp(selectedDiscussion.timestamp)}</span>
        </div>
                <div className="flex flex-wrap gap-2">
                  {selectedDiscussion.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="prose max-w-none mb-6">
              <p className="text-gray-700 whitespace-pre-line">
                {selectedDiscussion.content}
              </p>
            </div>
            <div className="flex items-center justify-between border-t border-gray-100 pt-4">
              <div className="flex items-center gap-4">
                  <button
                  onClick={() => isDiscussionLiked(selectedDiscussion) 
                    ? handleUnlikeDiscussion(selectedDiscussion.id) 
                    : handleLikeDiscussion(selectedDiscussion.id)}
                  className={`flex items-center gap-1 ${
                    isDiscussionLiked(selectedDiscussion)
                      ? "text-purple-600"
                      : "text-gray-500 hover:text-purple-600"
                  }`}
                >
                  <ThumbsUp className="w-5 h-5" />
                  <span>{selectedDiscussion.likes || 0}</span>
                  </button>
                <div className="flex items-center gap-1 text-gray-500">
                  <MessageCircle className="w-5 h-5" />
                  <span>{selectedDiscussion.commentCount || 0}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-500">
                  <BarChart2 className="w-5 h-5" />
                  <span>{selectedDiscussion.views || 0}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="text-gray-500 hover:text-gray-700">
                  <Share2 className="w-5 h-5" />
                </button>
                <button className="text-gray-500 hover:text-gray-700">
                  <Flag className="w-5 h-5" />
                </button>
            </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-6">Comments</h2>
            
            {/* New Comment Form */}
            <div className="bg-gray-50 p-4 rounded-lg mb-8 border border-gray-200">
              <h3 className="text-lg font-medium mb-2">Add a Comment</h3>
              <form onSubmit={handleSubmitComment} className="space-y-4">
                <div className="mb-4">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    rows="3"
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>
                <div className="flex flex-wrap gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Rating:</span>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="text-yellow-400 hover:text-yellow-500"
                        >
                          <Star className={`w-5 h-5 ${star <= rating ? "fill-current" : ""}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Perspective:</span>
                    <select
                      value={reviewType}
                      onChange={(e) => setReviewType(e.target.value)}
                      className="px-2 py-1 rounded border border-gray-200 text-sm"
                    >
                      <option value="General">General</option>
                      <option value="Economic">Economic</option>
                      <option value="Political">Political</option>
                      <option value="International">International</option>
                      <option value="Scientific">Scientific</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Post Comment
                  </button>
                </div>
              </form>
            </div>

            {/* Comments List */}
            <div className="space-y-6">
              {comments.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No comments yet. Be the first to comment!</p>
                </div>
              ) : (
                comments.map((comment) => {
                  const commentReplies = replies.filter(r => r.commentId === comment.id);
                  return (
                    <div key={comment.id} className="mb-6 p-4 bg-white rounded-lg shadow">
                      <div className="flex items-start gap-3">
                        <img
                          src={comment.userAvatar}
                          alt={comment.userName}
                          className="w-10 h-10 rounded-full"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-2">
                            <div>
                              <p className="font-semibold text-gray-800">{comment.userName}</p>
                              <p className="text-xs text-gray-500">
                                {formatTimestamp(comment.timestamp)}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() =>
                                  isCommentLiked(comment)
                                    ? handleUnlikeComment(comment.id)
                                    : handleLikeComment(comment.id)
                                }
                                className={`text-$
                                  {isCommentLiked(comment) ? 'purple' : 'gray'}-500`}
                              >
                                <ThumbsUpIcon className="w-5 h-5" />
                              </button>
                              <span className="text-sm text-gray-600">{comment.likes || 0}</span>
                              <button
                                onClick={() =>
                                  isCommentDisliked(comment)
                                    ? handleUndislikeComment(comment.id)
                                    : handleDislikeComment(comment.id)
                                }
                                className={`text-$
                                  {isCommentDisliked(comment) ? 'red' : 'gray'}-500`}
                              >
                                <ThumbsDown className="w-5 h-5" />
                              </button>
                              <span className="text-sm text-gray-600">{comment.dislikes || 0}</span>
                              <button
                                onClick={() => setReplyTo(comment.id)}
                                className="text-sm text-indigo-600 hover:underline"
                              >
                                Reply
                              </button>
                            </div>
                          </div>
                          {/* Rating and Perspective */}
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex items-center gap-1 text-yellow-500">
                              <Star className="w-4 h-4" />
                              <span>{comment.rating}</span>
                            </div>
                            <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${perspectiveColors[comment.perspective].bg} ${perspectiveColors[comment.perspective].text} ${perspectiveColors[comment.perspective].border}`}>
                              {comment.perspective}
                            </span>
                          </div>
                          <p className="text-gray-700">{comment.content}</p>
                          {replyTo === comment.id && (
                            <form
                              onSubmit={(e) => {
                                e.preventDefault();
                                handleSubmitReply(comment.id);
                              }}
                              className="mt-3 space-y-2"
                            >
                              <textarea
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder="Write a reply..."
                                rows={2}
                                className="w-full px-3 py-2 border rounded"
                                required
                              />
                              <button
                                type="submit"
                                className="px-4 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                              >
                                Post Reply
                              </button>
                            </form>
                          )}
                          {commentReplies.map((reply) => (
                            <div
                              key={reply.id}
                              className="mt-4 flex items-start gap-3 pl-12 border-l border-gray-200"
                            >
                              <img
                                src={reply.userAvatar}
                                alt={reply.userName}
                                className="w-8 h-8 rounded-full"
                              />
                              <div>
                                <p className="text-sm font-semibold text-gray-800">
                                  {reply.userName}{' '}
                                  <span className="text-xs text-gray-500">
                                    {formatTimestamp(reply.timestamp)}
                                  </span>
                                </p>
                                <p className="text-gray-700 text-sm mt-1">
                                  {reply.content}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
                    </div>
    );
  }

  // Main Discussions List View
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Community Discussions
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join the conversation, share your insights, and engage with other readers on trending topics.
                    </p>
                  </div>

        {/* Search and Filter Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-xl">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search discussions..."
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-4 py-2 rounded-lg bg-white text-gray-700 hover:bg-gray-50 transition-colors border border-gray-200 shadow-sm"
              >
                <Filter className="w-5 h-5 mr-2" />
                Filters
              </button>
              <button
                onClick={() => setShowNewDiscussionForm(true)}
                className="flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 transition-colors shadow-md"
              >
                <Plus className="w-5 h-5 mr-2" />
                New Discussion
              </button>
            </div>
                  </div>
                </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto gap-4 mb-8 pb-2 scrollbar-hide">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-6 py-2.5 rounded-lg whitespace-nowrap transition-all ${
              activeTab === "all"
                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md"
                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            All Discussions
                  </button>
          <button
            onClick={() => setActiveTab("trending")}
            className={`px-6 py-2.5 rounded-lg whitespace-nowrap transition-all ${
              activeTab === "trending"
                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md"
                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            Trending
                  </button>
                  <button
            onClick={() => setActiveTab("latest")}
            className={`px-6 py-2.5 rounded-lg whitespace-nowrap transition-all ${
              activeTab === "latest"
                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md"
                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            Latest
                  </button>
          <button
            onClick={() => setActiveTab("top")}
            className={`px-6 py-2.5 rounded-lg whitespace-nowrap transition-all ${
              activeTab === "top"
                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md"
                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            Top Rated
                  </button>
                </div>

        {/* New Discussion Form */}
        <AnimatePresence>
          {showNewDiscussionForm && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Create New Discussion</h2>
                      <button
                  onClick={() => setShowNewDiscussionForm(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                      >
                  <X className="w-5 h-5" />
                      </button>
              </div>
              <form onSubmit={handleCreateDiscussion}>
                <div className="mb-4">
                  <input
                    type="text"
                    value={newDiscussion.title}
                    onChange={(e) => setNewDiscussion({ ...newDiscussion, title: e.target.value })}
                    placeholder="Discussion Title"
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm"
                    required
                  />
                </div>
                <div className="mb-4">
                  <textarea
                    value={newDiscussion.content}
                    onChange={(e) => setNewDiscussion({ ...newDiscussion, content: e.target.value })}
                    placeholder="Discussion Content"
                    rows="4"
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm"
                    required
                  />
                </div>
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {availableTags.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => {
                          setSelectedTags(prev =>
                            prev.includes(tag)
                              ? prev.filter(t => t !== tag)
                              : [...prev, tag]
                          );
                        }}
                        className={`px-3 py-1 rounded-full text-sm transition-all ${
                          selectedTags.includes(tag)
                            ? "bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border border-purple-200"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-colors shadow-md"
                >
                  Create Discussion
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Discussion Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDiscussions.map((discussion) => (
            <motion.div
              key={discussion.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden cursor-pointer border border-gray-100 hover:border-purple-200"
              onClick={() => handleViewDiscussion(discussion)}
            >
              {/* Delete button */}
              <button
                onClick={(e) => { e.stopPropagation(); handleDeleteDiscussion(discussion.id); }}
                className="absolute top-2 right-2 p-1 bg-white rounded-full shadow hover:bg-gray-100 text-red-500"
                title="Delete Discussion"
              >
                <Trash2 className="w-5 h-5" />
              </button>
              <div className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <img
                    src={discussion.author.avatar}
                    alt={discussion.author.name}
                    className="w-12 h-12 rounded-full border-2 border-purple-100"
                          />
                          <div>
                    <h3 className="font-semibold text-gray-900 hover:text-purple-600 transition-colors">{discussion.title}</h3>
                    <p className="text-sm text-gray-500">{discussion.author.name}</p>
                          </div>
                        </div>
                <p className="text-gray-600 mb-4 line-clamp-2">{discussion.content}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {discussion.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-sm hover:bg-purple-50 hover:text-purple-600 transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                        </div>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 mr-1" />
                      {discussion.rating?.toFixed(1) || "0.0"}
                    </span>
                    <span className="flex items-center">
                      <MessageCircle className="w-4 h-4 mr-1" />
                      {discussion.commentCount || 0}
                    </span>
                  </div>
                  <span className="text-gray-400">{formatTimestamp(discussion.timestamp)}</span>
                </div>
              </div>
            </motion.div>
            ))}
          </div>
      </div>
    </div>
  );
};

export default Discussion;
