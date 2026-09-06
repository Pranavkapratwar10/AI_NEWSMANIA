import React, { useState, useEffect, useRef, useCallback, Component } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBookmarks } from '../../context/BookmarkContext';
import { Award, Check, X, Sparkles, Brain, BookOpen, RefreshCw, ChevronRight, ChevronLeft, ExternalLink, Trophy, Star, RotateCw, Flame, PartyPopper, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import Confetti from 'react-confetti';

// Error Boundary component to catch and handle errors
class QuizErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Quiz component error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 max-w-lg w-full mx-4 relative">
            <button 
              onClick={this.props.onClose}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <X size={24} />
            </button>
            
            <div className="flex flex-col items-center justify-center py-10">
              <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-full mb-4">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-red-600 mb-2">Quiz Error</h3>
              <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
                Sorry, there was a problem loading the quiz. Please try again later.
              </p>
              <button
                onClick={this.props.onClose}
                className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const QuizComponent = ({ article, onClose }) => {
  const { generateQuiz, submitQuiz, getQuizScore, hasQuiz } = useBookmarks();
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizResult, setQuizResult] = useState(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Make sure the article has an ID - if not, use URL as a fallback
  const articleId = article?.id || article?.url || null;

  useEffect(() => {
    if (article && articleId) {
      console.log("Generating quiz for article:", articleId);
      try {
        // Ensure the article has an ID property if it doesn't already
        const articleWithId = article.id ? article : { ...article, id: articleId };
        
        // Generate or fetch quiz for the article
        const quizData = generateQuiz(articleWithId);
        console.log("Raw quiz data received:", quizData);
        
        if (quizData && quizData.questions && quizData.questions.length > 0) {
          // Validate quiz data structure
          const hasValidStructure = quizData.questions.every(q => 
            q.options && Array.isArray(q.options) && q.options.length > 0
          );
          
          if (!hasValidStructure) {
            console.error("Invalid quiz data structure:", quizData);
            toast.error("Quiz data is not properly formatted");
            setIsLoading(false);
            return;
          }
          
          // Check if at least one option is marked as correct for each question
          const quizWithCorrectMarkers = {
            ...quizData,
            questions: quizData.questions.map(q => {
              // Check if any option is already marked as correct
              const hasCorrectOption = q.options.some(opt => opt.correct === true);
              const correctOptionIndex = q.correctOptionIndex !== undefined ? q.correctOptionIndex : 0;
              
              return {
                ...q,
                options: q.options.map((opt, i) => ({
                  ...opt,
                  // Ensure at least one option is marked as correct
                  correct: hasCorrectOption ? opt.correct : (correctOptionIndex === i)
                }))
              };
            })
          };
          
          setQuiz(quizWithCorrectMarkers);
          console.log("Processed quiz with correct markers:", quizWithCorrectMarkers);
          
          // Verify that each question has one correct answer
          quizWithCorrectMarkers.questions.forEach((q, idx) => {
            const correctOptions = q.options.filter(opt => opt.correct);
            console.log(`Question ${idx + 1} has ${correctOptions.length} correct options:`, correctOptions);
            
            if (correctOptions.length !== 1) {
              console.warn(`Question ${idx + 1} has ${correctOptions.length} correct answers, should be 1.`);
            }
          });
        } else {
          console.error("No valid quiz data received");
          toast.error("Could not generate quiz for this article");
        }
        
        setIsLoading(false);
        
        // Reset state when article changes
        setCurrentQuestion(0);
        setSelectedAnswers({});
        setQuizCompleted(false);
        setQuizResult(null);
        setShowCelebration(false);
      } catch (error) {
        console.error("Error generating quiz:", error);
        toast.error("Error generating quiz: " + (error.message || "Unknown error"));
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, [article, articleId, generateQuiz]);

  // Debug effect to log state changes
  useEffect(() => {
    console.log("Quiz state updated:", { quizCompleted, quizResult });
  }, [quizCompleted, quizResult]);

  const handleSelectAnswer = (questionIndex, optionIndex) => {
    if (quizCompleted) return;
    
    const newAnswers = { ...selectedAnswers };
    newAnswers[questionIndex] = optionIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      handleSubmitQuiz();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    console.log("Quiz submission triggered");
    
    // Check if all questions are answered
    const unansweredQuestions = quiz.questions.filter((_, index) => 
      selectedAnswers[index] === undefined
    );
    
    if (unansweredQuestions.length > 0) {
      toast.error(`Please answer all questions. You have ${unansweredQuestions.length} unanswered question(s).`);
      return;
    }
    
    try {
      // Calculate score
      let score = 0;
      quiz.questions.forEach((question, qIndex) => {
        const selectedOption = selectedAnswers[qIndex];
        const correctOption = question.options.findIndex(opt => opt.correct === true);
        
        if (selectedOption === correctOption) {
          score++;
        }
      });
      
      const totalPossible = quiz.questions.length;
      const passed = score >= (totalPossible * 0.6); // Pass threshold is 60%
      
      // Set the result
      const result = {
        score,
        totalPossible,
        passed
      };
      
      setQuizResult(result);
      
      // Mark quiz as completed and trigger celebration if passed
      setQuizCompleted(true);
      
      console.log("Quiz completed with score:", score, "/", totalPossible, "Quiz completed state:", true);
      
      // Show celebration after a slight delay if passed
      if (passed) {
        setTimeout(() => setShowCelebration(true), 500);
      }
      
      // Show success toast
      toast.success('Quiz submitted successfully!');
    } catch (error) {
      console.error("Error submitting quiz:", error);
      toast.error("Error submitting quiz. Please try again.");
    }
  };

  // Simplify the submit button section in the render
  const renderSubmitButton = () => {
    return (
      <motion.button
        onClick={currentQuestion < quiz.questions.length - 1 ? handleNext : handleSubmitQuiz}
        disabled={selectedAnswers[currentQuestion] === undefined}
        className={`flex items-center px-4 py-2 rounded-lg ${
          selectedAnswers[currentQuestion] === undefined
            ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
            : 'bg-indigo-500 text-white hover:bg-indigo-600'
        }`}
        whileHover={selectedAnswers[currentQuestion] !== undefined ? { scale: 1.05 } : {}}
        whileTap={selectedAnswers[currentQuestion] !== undefined ? { scale: 0.95 } : {}}
      >
        {currentQuestion < quiz.questions.length - 1 ? (
          <>
            Next
            <ChevronRight size={16} className="ml-1" />
          </>
        ) : (
          'Submit Quiz'
        )}
      </motion.button>
    );
  };

  // Add a default fallback in case quizResult is unexpectedly null
  const getQuizResultWithFallback = () => {
    // If quizResult is null for some reason, return a default object with reasonable values
    return quizResult || { score: 0, totalPossible: 10, passed: false };
  };

  const handleRetakeQuiz = () => {
    setSelectedAnswers({});
    setCurrentQuestion(0);
    setQuizCompleted(false);
    setQuizResult(null);
    setShowCelebration(false);
  };

  const handleReadArticle = () => {
    if (article && article.url) {
      window.open(article.url, '_blank');
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 max-w-lg w-full mx-4 relative">
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <p className="ml-4 text-gray-600 dark:text-gray-300">Loading quiz...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 max-w-lg w-full mx-4 relative">
          <div className="flex justify-center items-center h-40">
            <p className="text-red-500">Failed to load quiz.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <QuizErrorBoundary onClose={onClose}>
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 max-w-lg w-full mx-4 relative overflow-hidden">
          <button 
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <X size={24} />
          </button>
          
          {!quizCompleted ? (
            <>
              <div className="quiz-header mb-6">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Test Your Knowledge</h3>
                <div className="flex items-center">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-indigo-500 h-full rounded-full" 
                      style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
                    ></div>
                  </div>
                  <span className="ml-3 text-sm text-gray-600 dark:text-gray-300">
                    {currentQuestion + 1}/{quiz.questions.length}
                  </span>
                </div>
              </div>
              
              <div className="question-container mb-8">
                <p className="text-lg font-medium mb-4 text-gray-800 dark:text-gray-100">
                  {quiz.questions[currentQuestion].question}
                </p>
                
                <div className="options-list space-y-3">
                  {quiz.questions[currentQuestion].options.map((option, optionIndex) => (
                    <motion.div
                      key={optionIndex}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSelectAnswer(currentQuestion, optionIndex)}
                      className={`p-4 rounded-lg cursor-pointer border-2 transition-all ${
                        selectedAnswers[currentQuestion] === optionIndex
                          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <div className="flex items-center">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                          selectedAnswers[currentQuestion] === optionIndex
                            ? 'bg-indigo-500 text-white'
                            : 'bg-gray-200 dark:bg-gray-700'
                        }`}>
                          {selectedAnswers[currentQuestion] === optionIndex ? 
                            <Check size={14} /> : 
                            <span className="text-xs">{String.fromCharCode(65 + optionIndex)}</span>
                          }
                        </div>
                        <span className="text-gray-800 dark:text-gray-200">{option.text}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-between mt-4">
                <motion.button
                  onClick={handlePrevious}
                  disabled={currentQuestion === 0}
                  className={`flex items-center px-4 py-2 rounded-lg ${
                    currentQuestion === 0
                      ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                  whileHover={currentQuestion !== 0 ? { scale: 1.05 } : {}}
                  whileTap={currentQuestion !== 0 ? { scale: 0.95 } : {}}
                >
                  <ChevronLeft size={16} className="mr-1" />
                  Previous
                </motion.button>
                
                {renderSubmitButton()}
              </div>
            </>
          ) : (
            <AnimatePresence>
              <motion.div 
                className="flex flex-col items-center justify-center py-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {quizResult?.passed && showCelebration && (
                  <Confetti
                    width={window.innerWidth}
                    height={window.innerHeight}
                    recycle={false}
                    numberOfPieces={200}
                  />
                )}
                
                <div className={`relative w-32 h-32 rounded-full flex items-center justify-center mb-6 ${
                  quizResult?.passed ? 'bg-green-100 dark:bg-green-900/30' : 'bg-amber-100 dark:bg-amber-900/30'
                }`}>
                  {quizResult?.passed ? (
                    <Trophy className="h-16 w-16 text-green-500" />
                  ) : (
                    <RefreshCw className="h-16 w-16 text-amber-500" />
                  )}
                  
                  <div className="absolute -right-2 -top-2 bg-white dark:bg-gray-800 rounded-full shadow-lg p-2">
                    <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold">
                      {Math.round((quizResult?.score / quizResult?.totalPossible) * 100)}%
                    </div>
                  </div>
                </div>
                
                <h3 className={`text-2xl font-bold mb-3 ${
                  quizResult?.passed ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'
                }`}>
                  {quizResult?.passed ? 'Congratulations!' : 'Almost there!'}
                </h3>
                
                <div className="score-display text-4xl font-bold text-gray-800 dark:text-white mb-4">
                  <span>{quizResult?.score}</span>
                  <span className="text-gray-400 mx-2">/</span>
                  <span>{quizResult?.totalPossible}</span>
                </div>
                
                <p className="text-gray-600 dark:text-gray-300 text-center mb-8">
                  {quizResult?.passed 
                    ? 'Great job! You\'ve mastered this topic.' 
                    : 'Keep learning and try again to improve your score!'}
                </p>
                
                <div className="flex gap-4">
                  <motion.button
                    onClick={handleRetakeQuiz}
                    className="px-5 py-2.5 bg-indigo-500 text-white rounded-lg flex items-center font-medium hover:bg-indigo-600 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <RotateCw size={16} className="mr-2" />
                    Retake Quiz
                  </motion.button>
                  
                  <motion.button
                    onClick={onClose}
                    className="px-5 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Close
                  </motion.button>
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </QuizErrorBoundary>
  );
};

export default QuizComponent; 