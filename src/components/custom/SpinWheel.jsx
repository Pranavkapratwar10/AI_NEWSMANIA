import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, X, ExternalLink, ChevronRight, Sparkles, Landmark, Globe, Cpu, Activity, Heart, Briefcase, Award, MapPin, Star, RotateCw } from 'lucide-react';
import { fetchNews } from '../../AiSummary/newsApi';

const SpinWheel = () => {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [showTreasure, setShowTreasure] = useState(false);
  const [treasureOpened, setTreasureOpened] = useState(false);
  const [surprise, setSurprise] = useState(null);
  const [loading, setLoading] = useState(false);
  const [spinDisabled, setSpinDisabled] = useState(false);
  const [winningCategory, setWinningCategory] = useState(null);
  const [showWinIndicator, setShowWinIndicator] = useState(false);
  const spinButtonRef = useRef(null);
  const spinTimeoutRef = useRef(null);
  const wheelRef = useRef(null);

  // Categories for the wheel segments with brighter colors
  const categories = [
    { name: "Politics", color: "linear-gradient(135deg, #FF6B88, #FF9079)", query: "politics", icon: <Landmark size={22} /> },
    { name: "Technology", color: "linear-gradient(135deg, #00F5D4, #18FFFF)", query: "technology", icon: <Cpu size={22} /> },
    { name: "Sports", color: "linear-gradient(135deg, #FFEA00, #FFBB00)", query: "sports", icon: <Activity size={22} /> },
    { name: "Health", color: "linear-gradient(135deg, #69F0AE, #B9F6CA)", query: "health", icon: <Heart size={22} /> },
    { name: "Business", color: "linear-gradient(135deg, #B388FF, #D1C4E9)", query: "business", icon: <Briefcase size={22} /> },
    { name: "Entertainment", color: "linear-gradient(135deg, #FF80AB, #FF9E80)", query: "entertainment", icon: <Award size={22} /> },
    { name: "Science", color: "linear-gradient(135deg, #FFD180, #FFFF8D)", query: "science", icon: <Globe size={22} /> },
    { name: "Travel", color: "linear-gradient(135deg, #B39DDB, #8C9EFF)", query: "travel", icon: <MapPin size={22} /> }
  ];

  // Calculate the angle for each segment
  const segmentAngle = 360 / categories.length;

  // Load a random news article from the selected category
  const loadSurpriseNews = async (category) => {
    try {
      setLoading(true);
      // Use the query from the winning category
      const news = await fetchNews(category.query + " interesting");
      
      // Filter to find articles with images
      const articlesWithImages = news.filter(article => 
        article.urlToImage && 
        !article.urlToImage.includes('unavailable') &&
        article.title && 
        article.description
      );
      
      // Select a random article from the filtered list
      if (articlesWithImages.length > 0) {
        const randomIndex = Math.floor(Math.random() * Math.min(5, articlesWithImages.length));
        setSurprise(articlesWithImages[randomIndex]);
      } else if (news.length > 0) {
        // Fallback to any article if none have images
        const randomIndex = Math.floor(Math.random() * Math.min(5, news.length));
        setSurprise(news[randomIndex]);
      } else {
        console.error("No news found for category:", category.name);
      }
    } catch (error) {
      console.error("Error loading surprise news:", error);
    } finally {
      setLoading(false);
    }
  };

  // Spin the wheel
  const handleSpin = () => {
    if (spinning || spinDisabled) return;
    
    // Disable spinning temporarily
    setSpinDisabled(true);
    
    // Hide treasure box if it's currently shown
    setShowTreasure(false);
    setTreasureOpened(false);
    setSurprise(null);
    setShowWinIndicator(false);
    
    // Start spinning animation
    setSpinning(true);
    
    // Generate a random number of full rotations (4-8) plus a random angle
    const minRotations = 4;
    const maxRotations = 8;
    const randomRotations = Math.floor(Math.random() * (maxRotations - minRotations + 1)) + minRotations;
    
    // Calculate the random final position
    const randomAngle = Math.floor(Math.random() * 360);
    const newRotation = rotation + (randomRotations * 360) + randomAngle;
    
    setRotation(newRotation);
    
    // Calculate which segment will be selected
    const normalizedRotation = newRotation % 360;
    const winningSegmentIndex = Math.floor((360 - (normalizedRotation % 360)) / segmentAngle) % categories.length;
    
    // Clear any existing timeout
    if (spinTimeoutRef.current) {
      clearTimeout(spinTimeoutRef.current);
    }
    
    // Set a timeout to stop spinning and show result
    spinTimeoutRef.current = setTimeout(() => {
      setSpinning(false);
      setWinningCategory(categories[winningSegmentIndex]);
      setShowWinIndicator(true);
      
      // Show winning animation before showing treasure
      setTimeout(() => {
        setShowWinIndicator(false);
        // Load the surprise news from the winning category
        loadSurpriseNews(categories[winningSegmentIndex]);
        // Show the treasure box after spinning is complete
        setShowTreasure(true);
        
        // Re-enable spinning after a cooldown period
        setTimeout(() => {
          setSpinDisabled(false);
        }, 2000);
      }, 2000);
    }, 5000); // Match this duration with the CSS animation duration
  };

  // Open the treasure box to reveal the surprise
  const openTreasure = () => {
    setTreasureOpened(true);
  };

  // Close the surprise
  const closeSurprise = () => {
    setShowTreasure(false);
    setTreasureOpened(false);
    setSurprise(null);
  };

  // Format publication date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { month: "short", day: "numeric", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  useEffect(() => {
    // Clean up any timeouts when component unmounts
    return () => {
      if (spinTimeoutRef.current) {
        clearTimeout(spinTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-indigo-800 via-purple-900 to-indigo-900 rounded-xl shadow-2xl">
      <h2 className="text-2xl font-bold text-white mb-2 drop-shadow-glow">Wheel of Fortune</h2>
      <p className="text-purple-200 text-center mb-6">Spin the wheel to discover unique articles from random categories!</p>
      
      {/* Wheel container with enhanced glow */}
      <div className="relative w-80 h-80 mb-8">
        {/* Stronger pulsing glow effect */}
        <motion.div 
          className="absolute inset-0 rounded-full bg-gradient-radial from-purple-400 to-transparent -m-4 blur-xl"
          animate={{ 
            opacity: [0.5, 0.8, 0.5],
            scale: [0.95, 1.05, 0.95]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Outer light ring with shimmering effect */}
        <motion.div 
          className="absolute inset-0 rounded-full border-[10px] border-purple-300 border-opacity-30 -m-1 shadow-[inset_0_0_20px_rgba(255,255,255,0.3),0_0_10px_rgba(167,139,250,0.5)] z-10"
          animate={{
            boxShadow: [
              "inset 0 0 20px rgba(255,255,255,0.3), 0 0 10px rgba(167,139,250,0.5)",
              "inset 0 0 30px rgba(255,255,255,0.5), 0 0 20px rgba(167,139,250,0.8)",
              "inset 0 0 20px rgba(255,255,255,0.3), 0 0 10px rgba(167,139,250,0.5)"
            ]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Brighter metallic pins around the wheel */}
        {[...Array(24)].map((_, index) => (
          <motion.div
            key={`pin-${index}`}
            className="absolute w-2 h-2 rounded-full bg-gradient-to-br from-white to-yellow-300 shadow-[0_0_3px_rgba(255,255,255,0.8)] z-20"
            initial={{
              filter: "brightness(1)"
            }}
            animate={{
              filter: [
                "brightness(1)",
                "brightness(1.5)",
                "brightness(1)"
              ]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: index * 0.1 % 1
            }}
            style={{
              top: '2px',
              left: 'calc(50% - 3px)',
              transform: `rotate(${index * 15}deg) translateY(-40px)`,
              transformOrigin: 'center calc(100% + 40px)',
            }}
          />
        ))}
        
        {/* Spin segments dividers with shimmer */}
        <div className="absolute inset-3 rounded-full border-4 border-white border-opacity-30 pointer-events-none z-10">
          <div className="absolute inset-0 animate-spin-slow rounded-full overflow-hidden opacity-10">
            <div className="w-full h-full bg-gradient-to-t from-white via-transparent to-transparent"></div>
          </div>
        </div>
        <div className="absolute inset-0 pointer-events-none">
          {categories.map((_, index) => (
            <motion.div
              key={`marker-${index}`}
              className="absolute h-full w-0.5 left-1/2 top-0 transform -translate-x-1/2"
              initial={{ opacity: 0.3 }}
              animate={{ 
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                delay: index * 0.25 % 2
              }}
              style={{
                transform: `rotate(${index * segmentAngle}deg)`,
                background: 'rgba(255, 255, 255, 0.4)',
                boxShadow: '0 0 5px rgba(255,255,255,0.6)'
              }}
            />
          ))}
        </div>
        
        {/* Wheel of fortune with enhanced effects */}
        <motion.div
          ref={wheelRef}
          className="w-full h-full rounded-full overflow-hidden border-8 border-white border-opacity-20 shadow-[0_0_20px_rgba(147,51,234,0.6)] relative"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: spinning ? "transform 5s cubic-bezier(0.2, 0.9, 0.1, 1)" : "none",
            boxShadow: "0 0 20px rgba(147,51,234,0.6), inset 0 0 15px rgba(255,255,255,0.3)"
          }}
          animate={
            spinning 
              ? { 
                  boxShadow: [
                    "0 0 20px rgba(147,51,234,0.6), inset 0 0 15px rgba(255,255,255,0.3)",
                    "0 0 35px rgba(147,51,234,0.9), inset 0 0 25px rgba(255,255,255,0.5)",
                    "0 0 20px rgba(147,51,234,0.6), inset 0 0 15px rgba(255,255,255,0.3)"
                  ]
                } 
              : {}
          }
          transition={
            spinning 
              ? { repeat: Infinity, duration: 0.5 } 
              : {}
          }
        >
          {/* Light flash effect during spin */}
          {spinning && (
            <motion.div 
              className="absolute inset-0 bg-white z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.7, 0] }}
              transition={{ duration: 0.5, delay: 0.2 }}
            />
          )}

          {/* Wheel segments with enhanced glow */}
          {categories.map((category, index) => (
            <div
              key={index}
              className="absolute top-0 left-0 w-full h-full flex items-center justify-end origin-center"
              style={{
                transform: `rotate(${index * segmentAngle}deg)`,
                clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos(Math.PI / categories.length)}% ${50 - 50 * Math.sin(Math.PI / categories.length)}%)`
              }}
            >
              <div 
                className="absolute inset-0" 
                style={{ 
                  background: category.color,
                  boxShadow: "inset 0px 0px 20px rgba(255,255,255,0.2)"
                }}
              />
              
              {/* Bright icon for each category with stronger glow */}
              <div
                className="absolute"
                style={{
                  top: '22%',
                  left: '50%',
                  transform: `rotate(${90 - index * segmentAngle - segmentAngle / 2}deg) translateX(-50%)`,
                }}
              >
                <motion.div 
                  className="bg-white p-2.5 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.9)] flex items-center justify-center"
                  initial={{ y: 0 }}
                  animate={{ 
                    boxShadow: [
                      "0 0 15px rgba(255,255,255,0.9)",
                      "0 0 25px rgba(255,255,255,1)",
                      "0 0 15px rgba(255,255,255,0.9)"
                    ],
                    y: spinning ? [0, -2, 0] : 0
                  }}
                  transition={{ 
                    repeat: Infinity,
                    duration: 2,
                    y: { repeat: Infinity, duration: 0.3 }
                  }}
                >
                  <span className="text-indigo-900">{category.icon}</span>
                </motion.div>
              </div>
            </div>
          ))}
          
          <div className="absolute inset-0 rounded-full border-2 border-white border-opacity-30"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div 
              className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-700 shadow-[inset_0_0_15px_rgba(255,255,255,0.5)] flex items-center justify-center"
              animate={{ 
                boxShadow: [
                  "inset 0 0 15px rgba(255,255,255,0.5)",
                  "inset 0 0 25px rgba(255,255,255,0.8)",
                  "inset 0 0 15px rgba(255,255,255,0.5)"
                ]
              }}
              transition={{ 
                repeat: Infinity,
                duration: 2
              }}
            >
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-300 to-indigo-600 shadow-sm flex items-center justify-center">
                <motion.div
                  animate={{ 
                    rotate: 360,
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ 
                    rotate: { repeat: Infinity, duration: spinning ? 3 : 8, ease: "linear" },
                    scale: { repeat: Infinity, duration: 1.5 }
                  }}
                >
                  <Sparkles className="w-7 h-7 text-yellow-200 drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>
        
        {/* Brighter pointer with enhanced effects */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1 z-30">
          <motion.div 
            className="w-12 h-12 bg-gradient-to-br from-yellow-300 to-amber-500 transform rotate-45 shadow-lg flex items-center justify-center overflow-hidden"
            animate={
              spinning 
                ? { 
                    boxShadow: [
                      "0 0 10px rgba(255,255,255,0.7)",
                      "0 0 25px rgba(255,215,0,0.9)",
                      "0 0 10px rgba(255,255,255,0.7)"
                    ],
                    scale: [1, 1.1, 1]
                  } 
                : {
                    boxShadow: [
                      "0 0 5px rgba(255,255,255,0.4)",
                      "0 0 15px rgba(255,215,0,0.6)",
                      "0 0 5px rgba(255,255,255,0.4)"
                    ]
                  }
            }
            transition={
              spinning 
                ? { 
                    repeat: Infinity, 
                    duration: 0.3,
                    scale: { repeat: Infinity, duration: 0.2 }
                  } 
                : { repeat: Infinity, duration: 2 }
            }
          >
            <div className="absolute inset-0 flex items-center justify-center -rotate-45">
              <motion.div
                animate={{ 
                  scale: [1, 1.3, 1],
                  rotate: [0, 180, 360],
                  opacity: spinning ? [1, 0.8, 1] : 1
                }}
                transition={{ 
                  scale: { repeat: Infinity, duration: 1.5 },
                  rotate: { repeat: Infinity, duration: 5, ease: "linear" },
                  opacity: { repeat: Infinity, duration: 0.5 }
                }}
              >
                <Star className="w-6 h-6 text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.9)]" />
              </motion.div>
            </div>
          </motion.div>
        </div>
        
        {/* Win indicator overlay with enhanced brightness */}
        <AnimatePresence>
          {showWinIndicator && winningCategory && (
            <motion.div 
              className="absolute inset-0 z-20 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div 
                className="bg-black bg-opacity-60 backdrop-blur-md rounded-full w-full h-full flex items-center justify-center flex-col"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ type: "spring", damping: 15 }}
              >
                {/* Circular light ray effect */}
                <motion.div
                  className="absolute w-full h-full rounded-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, rotate: 360 }}
                  transition={{ opacity: { duration: 0.3 }, rotate: { duration: 20, repeat: Infinity, ease: "linear" } }}
                >
                  {[...Array(12)].map((_, i) => (
                    <motion.div
                      key={`ray-${i}`}
                      className="absolute top-1/2 left-1/2 w-1 h-40 bg-gradient-to-t from-transparent via-yellow-200 to-transparent opacity-50"
                      style={{ 
                        transformOrigin: "center bottom", 
                        transform: `rotate(${i * 30}deg)` 
                      }}
                    />
                  ))}
                </motion.div>
              
                <motion.div 
                  className="text-white font-bold text-4xl mb-3 drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ 
                    scale: [0.5, 1.3, 1],
                    opacity: 1,
                    y: [20, -10, 0]
                  }}
                  transition={{ duration: 0.6 }}
                >
                  {winningCategory.name}!
                </motion.div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ 
                    scale: [0, 1.3, 1],
                    rotate: [0, -10, 10, 0]
                  }}
                  transition={{ delay: 0.3, duration: 0.7 }}
                  className="relative"
                >
                  <motion.div 
                    className="absolute inset-0 rounded-full bg-white opacity-30 blur-xl transform scale-150"
                    animate={{ scale: [1.5, 2, 1.5], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  />
                  <div 
                    className="bg-white p-5 rounded-full mb-4 relative z-10"
                    style={{ 
                      background: winningCategory.color,
                      boxShadow: "0 0 30px rgba(255,255,255,0.8)"
                    }}
                  >
                    <span className="text-white drop-shadow-[0_0_2px_rgba(0,0,0,0.3)]">{winningCategory.icon}</span>
                  </div>
                </motion.div>
                <motion.div 
                  className="text-yellow-200 text-lg font-medium"
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: [0, 1, 0.7, 1],
                    y: [10, 0]
                  }}
                  transition={{ 
                    opacity: { repeat: Infinity, duration: 1.5 },
                    y: { duration: 0.5 }
                  }}
                >
                  <span className="drop-shadow-[0_0_8px_rgba(255,215,0,0.7)]">
                    Preparing your treasure...
                  </span>
                </motion.div>
                
                {/* Enhanced particle effects with more brightness */}
                {[...Array(40)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute rounded-full bg-gradient-to-r from-yellow-200 to-yellow-400"
                    style={{
                      width: Math.random() * 12 + 4,
                      height: Math.random() * 12 + 4,
                      boxShadow: "0 0 15px rgba(255,215,0,0.9)"
                    }}
                    initial={{
                      x: 0,
                      y: 0,
                      opacity: 0,
                      scale: 0
                    }}
                    animate={{
                      x: (Math.random() - 0.5) * 300,
                      y: (Math.random() - 0.5) * 300,
                      opacity: [0, 1, 0],
                      scale: [0, 1, 0.5],
                      rotate: Math.random() * 360
                    }}
                    transition={{ 
                      duration: 1.5 + Math.random() * 2, 
                      repeat: Infinity,
                      delay: Math.random() * 0.5,
                      repeatType: "loop" 
                    }}
                  />
                ))}
                
                {/* Brighter stars bursting outward */}
                {[...Array(15)].map((_, i) => (
                  <motion.div
                    key={`star-${i}`}
                    className="absolute text-yellow-300"
                    initial={{
                      x: 0,
                      y: 0,
                      scale: 0,
                      opacity: 0
                    }}
                    animate={{
                      x: (Math.random() - 0.5) * 280,
                      y: (Math.random() - 0.5) * 280,
                      scale: [0, 1, 0.5],
                      opacity: [0, 1, 0],
                      rotate: Math.random() * 360
                    }}
                    transition={{ 
                      duration: 2 + Math.random(), 
                      repeat: Infinity,
                      delay: Math.random(),
                      repeatType: "loop"
                    }}
                  >
                    <Star className="w-5 h-5 filter drop-shadow-[0_0_8px_rgba(255,215,0,0.9)]" />
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Spin button with brighter effects */}
      <motion.button
        ref={spinButtonRef}
        onClick={handleSpin}
        disabled={spinning || spinDisabled}
        className={`px-8 py-3 bg-gradient-to-r from-yellow-300 to-amber-400 text-indigo-900 font-extrabold text-lg rounded-full shadow-lg flex items-center gap-2 ${
          (spinning || spinDisabled) ? 'opacity-70 cursor-not-allowed' : 'hover:from-yellow-200 hover:to-amber-300'
        }`}
        whileHover={!(spinning || spinDisabled) ? { 
          scale: 1.05,
          boxShadow: "0 0 25px rgba(255,215,0,0.6)"
        } : {}}
        whileTap={!(spinning || spinDisabled) ? { scale: 0.95 } : {}}
      >
        {spinning ? (
          <>
            <motion.div 
              className="w-5 h-5 border-3 border-indigo-900 rounded-full border-t-transparent"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
            ></motion.div>
            <span>Spinning...</span>
          </>
        ) : (
          <>
            <motion.div
              animate={{ 
                rotate: 360,
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 2,
                ease: "linear" 
              }}
            >
              <RotateCw className="w-5 h-5 mr-1 text-indigo-900" />
            </motion.div>
            <span>Spin the Wheel!</span>
          </>
        )}
      </motion.button>
      
      {/* Treasure chest modal */}
      {showTreasure && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="bg-gradient-to-br from-amber-50 to-yellow-100 p-8 rounded-xl shadow-2xl max-w-md w-full mx-4"
            initial={{ scale: 0.8, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            transition={{ type: "spring", damping: 15 }}
          >
            <div className="flex justify-end">
              <button 
                onClick={closeSurprise}
                className="p-1 text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            
            {!treasureOpened ? (
              // Closed treasure chest
              <div className="flex flex-col items-center">
                <h3 className="text-2xl font-bold text-amber-800 mb-4 text-center">You've Earned a Treasure!</h3>
                <motion.div
                  className="w-40 h-40 my-6"
                  animate={{ 
                    y: [0, -10, 0],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "mirror"
                  }}
                >
                  <Gift className="w-full h-full text-amber-600" />
                </motion.div>
                <p className="text-amber-700 mb-6 text-center">
                  Click to reveal a unique news article just for you!
                </p>
                <motion.button
                  onClick={openTreasure}
                  className="px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-full font-bold shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Open Treasure
                </motion.button>
              </div>
            ) : (
              // Opened treasure with news article
              <div>
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-10">
                    <div className="animate-spin h-10 w-10 border-4 border-amber-500 rounded-full border-t-transparent"></div>
                    <p className="text-amber-700 mt-4">Revealing your special article...</p>
                  </div>
                ) : surprise ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h3 className="text-xl font-bold text-amber-800 mb-2">Your Special Discovery</h3>
                    
                    {surprise.urlToImage && (
                      <div className="relative w-full h-40 mb-4 overflow-hidden rounded-lg">
                        <img 
                          src={surprise.urlToImage} 
                          alt={surprise.title}
                          className="w-full h-full object-cover" 
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/news_homecard.webp"; // Fallback image
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      </div>
                    )}
                    
                    <div className="mb-2 flex justify-between items-center">
                      <span className="text-xs font-medium text-amber-600">
                        {surprise.source?.name || "News Source"}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatDate(surprise.publishedAt)}
                      </span>
                    </div>
                    
                    <h4 className="text-lg font-bold text-gray-800 mb-2">{surprise.title}</h4>
                    <p className="text-gray-600 text-sm mb-4">{surprise.description}</p>
                    
                    <div className="flex justify-between items-center">
                      <motion.a
                        href={surprise.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-indigo-600 font-medium hover:text-indigo-800"
                        whileHover={{ x: 3 }}
                      >
                        Read Full Article
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </motion.a>
                      
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-yellow-500" />
                        <span className="text-xs font-medium text-yellow-500">Discovery Bonus!</span>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-amber-700">Oops! We couldn't find a surprise for you right now. Please try again later.</p>
                    <button
                      onClick={closeSurprise}
                      className="mt-4 px-6 py-2 bg-amber-500 text-white rounded-full font-medium"
                    >
                      Close
                    </button>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default SpinWheel; 