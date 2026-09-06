import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const BookmarkContext = createContext();

export const useBookmarks = () => {
  return useContext(BookmarkContext);
};

export const BookmarkProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [bookmarks, setBookmarks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [quizzes, setQuizzes] = useState({});
  const [quizScores, setQuizScores] = useState({});

  // Load bookmarks from localStorage when user changes
  useEffect(() => {
    if (currentUser) {
      const savedBookmarks = localStorage.getItem(`bookmarks_${currentUser.uid}`);
      if (savedBookmarks) {
        setBookmarks(JSON.parse(savedBookmarks));
      }

      // Load quizzes and scores
      const savedQuizzes = localStorage.getItem(`quizzes_${currentUser.uid}`);
      if (savedQuizzes) {
        setQuizzes(JSON.parse(savedQuizzes));
      }

      const savedScores = localStorage.getItem(`quizScores_${currentUser.uid}`);
      if (savedScores) {
        setQuizScores(JSON.parse(savedScores));
      }
    }
    setIsLoading(false);
  }, [currentUser]);

  // Save bookmarks to localStorage whenever they change
  useEffect(() => {
    if (currentUser && !isLoading) {
      localStorage.setItem(`bookmarks_${currentUser.uid}`, JSON.stringify(bookmarks));
    }
  }, [bookmarks, currentUser, isLoading]);

  // Save quizzes and scores to localStorage whenever they change
  useEffect(() => {
    if (currentUser && !isLoading) {
      localStorage.setItem(`quizzes_${currentUser.uid}`, JSON.stringify(quizzes));
      localStorage.setItem(`quizScores_${currentUser.uid}`, JSON.stringify(quizScores));
    }
  }, [quizzes, quizScores, currentUser, isLoading]);

  const addBookmark = (article) => {
    setBookmarks(prev => {
      // Check if article is already bookmarked
      if (prev.some(bookmark => bookmark.id === article.id)) {
        return prev;
      }
      return [...prev, article];
    });
  };

  const removeBookmark = (articleId) => {
    setBookmarks(prev => prev.filter(article => article.id !== articleId));
    
    // Also remove any quizzes and scores for this article
    if (quizzes[articleId]) {
      const newQuizzes = { ...quizzes };
      delete newQuizzes[articleId];
      setQuizzes(newQuizzes);
      
      const newScores = { ...quizScores };
      delete newScores[articleId];
      setQuizScores(newScores);
    }
  };

  const isBookmarked = (articleId) => {
    return bookmarks.some(article => article.id === articleId);
  };

  // Generate quiz questions based on article content
  const generateQuiz = (article) => {
    // Make sure the article has an ID - use URL as a fallback
    const articleId = article?.id || article?.url;
    
    // If no valid ID, we can't generate a quiz
    if (!articleId) {
      console.error("Cannot generate quiz: Article has no ID or URL");
      return null;
    }
    
    console.log("Generating quiz for article ID:", articleId);
    
    // In a real application, you would use NLP/AI to generate questions
    // For this example, we'll create some mock questions related to news articles
    
    if (quizzes[articleId]) {
      console.log("Returning existing quiz for:", articleId);
      return quizzes[articleId]; // Return existing quiz if it exists
    }
    
    const topics = ['politics', 'technology', 'sports', 'entertainment', 'health', 'business'];
    const randomTopic = topics[Math.floor(Math.random() * topics.length)];
    
    // Create simple quiz questions based on article title and description
    const title = article.title || '';
    const description = article.description || '';
    const content = title + ' ' + description;
    const words = content.split(' ').filter(word => word.length > 4);
    
    // Create mock questions
    const questions = [
      {
        question: `Which of the following best describes the main topic of this article?`,
        options: [
          { text: randomTopic.charAt(0).toUpperCase() + randomTopic.slice(1), correct: Math.random() > 0.75 },
          { text: topics[(topics.indexOf(randomTopic) + 1) % topics.length].charAt(0).toUpperCase() + topics[(topics.indexOf(randomTopic) + 1) % topics.length].slice(1), correct: false },
          { text: topics[(topics.indexOf(randomTopic) + 2) % topics.length].charAt(0).toUpperCase() + topics[(topics.indexOf(randomTopic) + 2) % topics.length].slice(1), correct: false },
          { text: topics[(topics.indexOf(randomTopic) + 3) % topics.length].charAt(0).toUpperCase() + topics[(topics.indexOf(randomTopic) + 3) % topics.length].slice(1), correct: Math.random() <= 0.75 }
        ]
      },
      {
        question: `According to the article, what is the significance of "${words[Math.floor(Math.random() * words.length)] || 'this topic'}"?`,
        options: [
          { text: "It represents a key concept in the article", correct: true },
          { text: "It's not mentioned in the article", correct: false },
          { text: "It's a misquote", correct: false },
          { text: "It's a product name", correct: false }
        ]
      },
      {
        question: `When was this article published?`,
        options: [
          { text: "Today", correct: Math.random() > 0.5 },
          { text: "Last week", correct: Math.random() <= 0.5 },
          { text: "Last month", correct: false },
          { text: "Last year", correct: false }
        ]
      },
      {
        question: `What is the likely target audience for this article?`,
        options: [
          { text: "General public", correct: true },
          { text: "Academic researchers", correct: false },
          { text: "Children", correct: false },
          { text: "Senior citizens only", correct: false }
        ]
      },
      {
        question: `Which of these keywords is most relevant to the article?`,
        options: [
          { text: words[0] || "News", correct: Math.random() > 0.75 },
          { text: words[Math.floor(words.length / 3)] || "Current", correct: Math.random() > 0.5 && Math.random() <= 0.75 },
          { text: words[Math.floor(words.length / 2)] || "Events", correct: Math.random() > 0.25 && Math.random() <= 0.5 },
          { text: words[Math.floor(words.length * 2 / 3)] || "Today", correct: Math.random() <= 0.25 }
        ]
      }
    ];
    
    // Ensure each question has exactly one correct answer
    questions.forEach(q => {
      if (!q.options.some(o => o.correct)) {
        q.options[Math.floor(Math.random() * q.options.length)].correct = true;
      }
      
      if (q.options.filter(o => o.correct).length > 1) {
        const correctOptions = q.options.filter(o => o.correct);
        correctOptions.slice(1).forEach(o => o.correct = false);
      }
    });
    
    const newQuiz = {
      id: `quiz-${articleId}`,
      articleId: articleId,
      title: `Quiz on: ${article.title}`,
      questions
    };
    
    // Save the quiz
    setQuizzes(prev => ({
      ...prev,
      [articleId]: newQuiz
    }));
    
    return newQuiz;
  };

  // Submit quiz answers and calculate score
  const submitQuiz = (articleId, selectedAnswers) => {
    // If articleId is falsy, log an error and return null
    if (!articleId) {
      console.error("Cannot submit quiz: Invalid article ID");
      return null;
    }
    
    const quiz = quizzes[articleId];
    if (!quiz) {
      console.error("Cannot submit quiz: No quiz found for article ID:", articleId);
      return null;
    }

    let score = 0;
    selectedAnswers.forEach((selectedOption, questionIndex) => {
      const question = quiz.questions[questionIndex];
      if (question.options[selectedOption].correct) {
        score += 2; // Each question is worth 2 marks
      }
    });

    const totalPossible = quiz.questions.length * 2;
    // Update passing threshold from > 5 to >= 6
    const passed = score >= 6;

    // Save the quiz result
    setQuizScores(prev => ({
      ...prev,
      [articleId]: { score, totalPossible, passed }
    }));

    return { score, totalPossible, passed };
  };

  // Get quiz for an article
  const getQuiz = (articleId) => {
    return articleId ? quizzes[articleId] : null;
  };

  // Get score for an article quiz
  const getQuizScore = (articleId) => {
    return articleId ? (quizScores[articleId] || null) : null;
  };

  // Check if a quiz exists for an article
  const hasQuiz = (articleId) => {
    return articleId ? !!quizzes[articleId] : false;
  };

  const value = {
    bookmarks,
    addBookmark,
    removeBookmark,
    isBookmarked,
    isLoading,
    generateQuiz,
    getQuiz,
    submitQuiz,
    getQuizScore,
    hasQuiz
  };

  return (
    <BookmarkContext.Provider value={value}>
      {children}
    </BookmarkContext.Provider>
  );
}; 