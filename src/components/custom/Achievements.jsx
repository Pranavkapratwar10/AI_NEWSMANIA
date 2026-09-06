import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ChevronLeft, Trophy, Flag, Award, ArrowUp, Crown, Star } from "lucide-react";
import { motion } from "framer-motion";

const Achievements = () => {
  const navigate = useNavigate();
  const [leaders, setLeaders] = useState([]);
  const { currentUser } = useAuth();
  const [maxPoints, setMaxPoints] = useState(1000);

  // Generate dummy leaderboard, placing current user first
  useEffect(() => {
    // Create 7 random users
    const dummy = Array.from({ length: 7 }).map((_, i) => ({
      id: `user${i+1}`,
      displayName: `User${i+1}`,
      photoURL: `/default-avatar.png`,
      points: Math.floor(Math.random() * 900) + 100, // 100-1000
    }));
    
    // If logged in, place currentUser at top with higher points
    let list = dummy;
    if (currentUser) {
      const topPoints = Math.max(...dummy.map(u => u.points));
      const me = {
        id: currentUser.uid,
        displayName: currentUser.displayName || 'You',
        photoURL: currentUser.photoURL || '/default-avatar.png',
        points: topPoints + 50,
      };
      list = [me, ...dummy];
    }
    
    // Sort by points
    list = list.sort((a, b) => b.points - a.points).slice(0, 8);
    
    // Set max points for scaling the graph
    setMaxPoints(Math.max(...list.map(u => u.points)) * 1.1);
    
    setLeaders(list);
  }, [currentUser]);

  // Generate a gradient color based on position
  const getGradient = (index) => {
    switch(index) {
      case 0: return 'from-yellow-400 to-yellow-500'; // Gold
      case 1: return 'from-slate-300 to-slate-400'; // Silver
      case 2: return 'from-amber-500 to-amber-600'; // Bronze
      default: return 'from-blue-400 to-indigo-500'; // Other
    }
  };

  // Get a badge icon for the top 3 positions
  const getBadgeIcon = (index) => {
    switch(index) {
      case 0: return <Crown className="text-yellow-500 w-6 h-6" />;
      case 1: return <Award className="text-slate-400 w-6 h-6" />;
      case 2: return <Trophy className="text-amber-600 w-6 h-6" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <motion.button
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            onClick={() => navigate('/profile')}
            className="flex items-center text-blue-500 hover:text-blue-600"
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Back to Profile
          </motion.button>
          
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center gap-2"
          >
            <Trophy className="text-yellow-500 w-6 h-6" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Leaderboard</h1>
          </motion.div>
        </div>
        
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700"
        >
          <div className="flex items-end mb-10 mt-4 h-80 relative">
            {/* Vertical axis labels */}
            <div className="absolute inset-y-0 left-0 flex flex-col justify-between pointer-events-none">
              <span className="text-xs text-gray-500 dark:text-gray-400">{maxPoints.toFixed(0)}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">{(maxPoints * 0.75).toFixed(0)}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">{(maxPoints * 0.5).toFixed(0)}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">{(maxPoints * 0.25).toFixed(0)}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">0</span>
            </div>
            
            {/* Grid lines */}
            <div className="absolute inset-0 pl-8 flex flex-col justify-between pointer-events-none">
              <div className="border-b border-gray-200 dark:border-gray-700 w-full"></div>
              <div className="border-b border-gray-200 dark:border-gray-700 w-full"></div>
              <div className="border-b border-gray-200 dark:border-gray-700 w-full"></div>
              <div className="border-b border-gray-200 dark:border-gray-700 w-full"></div>
              <div className="border-b border-gray-200 dark:border-gray-700 w-full"></div>
            </div>
            
            {/* Bar chart */}
            <div className="flex-1 flex justify-between items-end gap-2 pl-8">
              {leaders.map((user, index) => (
                <motion.div
                  key={user.id}
                  className="relative flex flex-col items-center"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ 
                    opacity: 1, 
                    height: `${(user.points / maxPoints) * 100}%` 
                  }}
                  transition={{ 
                    type: "spring",
                    stiffness: 150,
                    damping: 15,
                    delay: index * 0.1 + 0.3
                  }}
                >
                  {/* The bar */}
                  <div 
                    className={`w-12 rounded-t-lg bg-gradient-to-b ${getGradient(index)} shadow-lg relative group`}
                  >
                    {/* Points label */}
                    <motion.div 
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 + 0.8 }}
                      className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-700 px-2 py-1 rounded-md shadow text-xs font-bold"
                    >
                      {user.points}
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-white dark:bg-gray-700"></div>
                    </motion.div>
                    
                    {/* Trophy/medal position indicator - only for top 3 */}
                    {index < 3 && (
                      <motion.div 
                        initial={{ scale: 0, rotate: -20 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ 
                          type: "spring",
                          stiffness: 200,
                          delay: index * 0.1 + 1
                        }}
                        className="absolute -top-3 -right-3 bg-white dark:bg-gray-800 rounded-full p-1 shadow-md"
                      >
                        {getBadgeIcon(index)}
                      </motion.div>
                    )}
                    
                    {/* Shine animation effect */}
                    <motion.div 
                      className="absolute inset-0 overflow-hidden rounded-t-lg"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 0.6, 0] }}
                      transition={{ 
                        delay: index * 0.1 + 1,
                        duration: 1.5,
                        times: [0, 0.5, 1] 
                      }}
                    >
                      <div className="absolute -inset-full h-full w-1/2 transform -translate-x-full bg-white opacity-20 rotate-12 skew-x-12 transition-transform duration-1000 animate-shine" />
                    </motion.div>
                    
                    {/* Hover tooltip with more info */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -bottom-12 left-1/2 -translate-x-1/2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded w-max pointer-events-none z-20">
                      Rank #{index + 1}
                    </div>
                  </div>
                  
                  {/* User info below the bar */}
                  <div className="mt-2 flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full overflow-hidden mb-1">
                      <img
                        src={user.photoURL}
                        alt={user.displayName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-xs text-gray-700 dark:text-gray-300 font-medium whitespace-nowrap overflow-hidden max-w-[50px] text-ellipsis">{user.displayName}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* Legend */}
          <div className="mt-12 flex justify-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-sm bg-gradient-to-r from-yellow-400 to-yellow-500"></div>
              <span className="text-xs text-gray-600 dark:text-gray-400">Gold</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-sm bg-gradient-to-r from-slate-300 to-slate-400"></div>
              <span className="text-xs text-gray-600 dark:text-gray-400">Silver</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-sm bg-gradient-to-r from-amber-500 to-amber-600"></div>
              <span className="text-xs text-gray-600 dark:text-gray-400">Bronze</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-sm bg-gradient-to-r from-blue-400 to-indigo-500"></div>
              <span className="text-xs text-gray-600 dark:text-gray-400">Standard</span>
            </div>
          </div>
          
          {/* Recent achievers */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700"
          >
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
              <Star className="text-yellow-500 w-5 h-5" />
              Recent Achievements
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {leaders.slice(0,3).map((user, index) => (
                <motion.div
                  key={`achievement-${user.id}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.3 + index * 0.1 }}
                  className="flex items-center gap-3 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-750 p-3 rounded-lg shadow-sm"
                >
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900">
                    <img
                      src={user.photoURL}
                      alt={user.displayName}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{user.displayName}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Earned "Top Reader" badge</p>
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-500">1d ago</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Achievements; 