import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Bot, User as UserIcon, RefreshCw, Sparkles, HelpCircle } from 'lucide-react';
import { chatWithGemini, generateSummary, generatePerspectives } from '../../AiSummary/geminiApi';
import { motion, AnimatePresence } from 'framer-motion';

export default function AiAssistant() {
  const navigate = useNavigate();
  const [titleInput, setTitleInput] = useState('');
  const [descInput, setDescInput] = useState('');
  const [isGeneratingArticle, setIsGeneratingArticle] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [messages, setMessages] = useState([
    { type: 'bot', text: 'Hello! I am your AI news assistant. How can I help you with news or articles today?' }
  ]);
  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);

  const suggestions = [
    "Summarize a recent article about climate change",
    "Help me understand different perspectives on the Israel-Palestine conflict", 
    "What are the key points in today's top business news?",
    "Explain the impact of AI on journalism"
  ];

  // Typing animation effect
  useEffect(() => {
    if (isTyping) {
      const typingTimer = setTimeout(() => {
        setIsTyping(false);
      }, 1000 + Math.random() * 1000); // Random typing time for realism
      return () => clearTimeout(typingTimer);
    }
  }, [isTyping]);

  // Handlers for summary and perspectives
  const handleGenerateArticleSummary = async () => {
    if (!titleInput.trim() || !descInput.trim()) return;
    setIsGeneratingArticle(true);
    setShowSuggestions(false);
    setMessages(prev => [...prev, { 
      type: 'user', 
      text: `Please summarize this article:\nTitle: ${titleInput}\nContent: ${descInput}` 
    }]);
    setIsTyping(true);
    
    try {
      const summaryText = await generateSummary({ title: titleInput, description: descInput });
      setMessages(prev => [...prev, { 
        type: 'bot', 
        text: summaryText.trim(),
        isArticleSummary: true
      }]);
    } catch (err) {
      console.error('Error generating summary:', err);
      setMessages(prev => [...prev, { type: 'bot', text: 'Error: failed to generate summary.' }]);
    } finally {
      setIsGeneratingArticle(false);
      setTitleInput('');
      setDescInput('');
    }
  };

  const handleGenerateArticlePerspectives = async () => {
    if (!titleInput.trim() || !descInput.trim()) return;
    setIsGeneratingArticle(true);
    setShowSuggestions(false);
    setMessages(prev => [...prev, { 
      type: 'user', 
      text: `Please analyze different perspectives on this article:\nTitle: ${titleInput}\nContent: ${descInput}` 
    }]);
    setIsTyping(true);
    
    try {
      const persText = await generatePerspectives({ title: titleInput, description: descInput });
      setMessages(prev => [...prev, { 
        type: 'bot', 
        text: persText.trim(),
        isPerspectives: true
      }]);
    } catch (err) {
      console.error('Error generating perspectives:', err);
      setMessages(prev => [...prev, { type: 'bot', text: 'Error: failed to generate perspectives.' }]);
    } finally {
      setIsGeneratingArticle(false);
      setTitleInput('');
      setDescInput('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const question = input.trim();
    if (!question) return;
    
    setMessages((prev) => [...prev, { type: 'user', text: question }]);
    setInput('');
    setShowSuggestions(false);
    setIsTyping(true);
    
    try {
      const answer = await chatWithGemini(question);
      setIsTyping(false);
      setMessages((prev) => [...prev, { 
        type: 'bot', 
        text: answer.trim() || "Sorry, I couldn't get a response." 
      }]);
    } catch (err) {
      console.error('Gemini chat error:', err);
      setIsTyping(false);
      setMessages((prev) => [...prev, { 
        type: 'bot', 
        text: "I apologize, but I couldn't process your request at the moment. Please try again later." 
      }]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion);
    inputRef.current.focus();
  };

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    const container = chatContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages, isTyping]);

  // Format message with markdown-like styling
  const formatMessage = (text) => {
    // Replace ** text ** with bold
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Replace * text * with italic 
    text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
    // Replace URLs with links
    text = text.replace(
      /(https?:\/\/[^\s]+)/g, 
      '<a href="$1" target="_blank" class="text-blue-600 underline">$1</a>'
    );
    // Replace newlines with <br>
    text = text.replace(/\n/g, '<br>');
    
    return text;
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 overflow-hidden">
      {/* Header */}
      <div className="flex-none flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-b shadow-sm">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/profile')} 
            className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-600 transition-colors"
            aria-label="Back to profile"
            title="Back to profile"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold dark:text-white">AI News Assistant</h1>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                <span className="text-xs text-gray-500 dark:text-gray-400">Online</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 hidden sm:inline">Back to</span>
          <button 
            onClick={() => navigate('/profile')} 
            className="py-1.5 px-3 rounded-full bg-blue-50 text-blue-600 text-sm font-medium flex items-center hover:bg-blue-100 transition-colors"
          >
            <span>Profile</span>
            <ArrowLeft className="w-3.5 h-3.5 ml-1 transform rotate-180" />
          </button>
        </div>
      </div>
      
      {/* Form for article analysis */}
      <AnimatePresence>
        {isGeneratingArticle && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4"
          >
            <div className="flex items-center gap-2 mb-2 text-blue-600 dark:text-blue-400">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span className="text-sm font-medium">Processing your article...</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Chat Body */}
      <div 
        ref={chatContainerRef} 
        className="flex-1 overflow-auto p-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600"
      >
        <div className="max-w-4xl mx-auto space-y-6 pb-6">
          {messages.map((msg, idx) => (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className="flex gap-3 max-w-[85%] sm:max-w-[75%]">
                {msg.type === 'bot' && (
                  <div className="flex-none mt-1">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  </div>
                )}
                
                <div
                  className={`rounded-2xl px-4 py-3 ${
                    msg.type === 'user'
                      ? 'bg-blue-500 text-white rounded-tr-none shadow'
                      : msg.isArticleSummary 
                        ? 'bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 text-gray-800 dark:text-gray-100'
                        : msg.isPerspectives
                          ? 'bg-amber-50 dark:bg-amber-900/30 border border-amber-100 dark:border-amber-800 text-gray-800 dark:text-gray-100'
                          : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 rounded-tl-none shadow-sm'
                  }`}
                >
                  <div 
                    className="prose prose-sm dark:prose-invert max-w-none leading-relaxed break-words"
                    dangerouslySetInnerHTML={{ __html: formatMessage(msg.text) }}
                  />
                  
                  {msg.isArticleSummary && (
                    <div className="mt-3 pt-2 border-t border-indigo-100 dark:border-indigo-800 flex items-center">
                      <Sparkles className="w-3 h-3 text-indigo-500 mr-1" />
                      <span className="text-xs text-indigo-500 font-medium">AI Article Summary</span>
                    </div>
                  )}
                  
                  {msg.isPerspectives && (
                    <div className="mt-3 pt-2 border-t border-amber-100 dark:border-amber-800 flex items-center">
                      <Sparkles className="w-3 h-3 text-amber-500 mr-1" />
                      <span className="text-xs text-amber-500 font-medium">Multiple Perspectives Analysis</span>
                    </div>
                  )}
                </div>
                
                {msg.type === 'user' && (
                  <div className="flex-none mt-1">
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                      <UserIcon className="w-4 h-4 text-white" />
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
          
          {/* Typing indicator */}
          {isTyping && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="flex gap-3 max-w-[85%] sm:max-w-[75%]">
                <div className="flex-none mt-1">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div className="rounded-2xl px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 rounded-tl-none shadow-sm">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Suggestions */}
          {showSuggestions && messages.length < 2 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="mt-6"
            >
              <div className="mb-2 text-sm text-gray-500 dark:text-gray-400">Try asking:</div>
              <div className="grid grid-cols-1 gap-2">
                {suggestions.map((suggestion, i) => (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + i * 0.1 }}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="py-2 px-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
                  >
                    {suggestion}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
      
      {/* Article Analysis Tools */}
      <AnimatePresence>
        {!isGeneratingArticle && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4"
          >
            <div className="max-w-4xl mx-auto">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 mb-2">
                <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-2 flex items-center">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Article Analysis Tools
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={titleInput}
                    onChange={(e) => setTitleInput(e.target.value)}
                    placeholder="Article title..."
                    className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                  <textarea
                    value={descInput}
                    onChange={(e) => setDescInput(e.target.value)}
                    placeholder="Article content..."
                    rows="2"
                    className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 resize-y min-h-[60px]"
                  />
                </div>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={handleGenerateArticleSummary}
                    disabled={isGeneratingArticle || !titleInput.trim() || !descInput.trim()}
                    className="px-3 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 disabled:bg-gray-300 disabled:text-gray-500 text-sm font-medium flex-1"
                  >
                    Generate Summary
                  </button>
                  <button
                    onClick={handleGenerateArticlePerspectives}
                    disabled={isGeneratingArticle || !titleInput.trim() || !descInput.trim()}
                    className="px-3 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:bg-gray-300 disabled:text-gray-500 text-sm font-medium flex-1"
                  >
                    Analyze Perspectives
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Input Footer */}
      <div className="flex-none p-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-md">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto flex items-center gap-2">
          <div className="flex-grow relative">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Message AI Assistant..."
              className="w-full p-3 pl-4 pr-10 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              disabled={isGeneratingArticle || isTyping}
              autoFocus
            />
          </div>
          <button
            type="submit"
            disabled={!input.trim() || isGeneratingArticle || isTyping}
            className="w-12 h-12 flex items-center justify-center bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:bg-gray-300 disabled:text-gray-500 shadow-sm transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
} 