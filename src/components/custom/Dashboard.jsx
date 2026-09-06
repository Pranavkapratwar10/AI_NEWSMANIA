import React, { useState } from 'react';
import SpinWheel from './SpinWheel';
import { Newspaper, Award, BookOpen, Star, BarChart3, Flame, Sparkles, Compass, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const [showSpinWheelEffects, setShowSpinWheelEffects] = useState(false);
  
  // Mock data for dashboard stats
  const stats = [
    { label: 'Articles Read', value: '42', icon: <BookOpen className="h-5 w-5" />, color: 'bg-blue-500' },
    { label: 'Favorite Topics', value: '7', icon: <Star className="h-5 w-5" />, color: 'bg-purple-500' },
    { label: 'News Alerts', value: '12', icon: <Newspaper className="h-5 w-5" />, color: 'bg-green-500' },
    { label: 'Points Earned', value: '280', icon: <Award className="h-5 w-5" />, color: 'bg-amber-500' },
  ];

  // Mock data for trending topics
  const trendingTopics = [
    { title: 'Global Climate Summit', views: '12.5K', category: 'Environment' },
    { title: 'New Tech Breakthrough', views: '8.7K', category: 'Technology' },
    { title: 'Major Economic Reforms', views: '6.2K', category: 'Business' },
  ];

  const handleSpinWheel = () => {
    setShowSpinWheelEffects(true);
    // Scroll to the spin wheel section
    setTimeout(() => {
      const element = document.getElementById('spin-wheel-section');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Your News Dashboard</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content area */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <div className="flex items-center mb-4">
              <BarChart3 className="h-6 w-6 text-indigo-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-800">Your News Activity</h2>
            </div>
            
            {/* Stats cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {stats.map((stat, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className={`inline-flex items-center justify-center p-3 ${stat.color} rounded-full text-white mb-3`}>
                    {stat.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </div>
              ))}
            </div>
            
            {/* Curiosity Wheel Call-to-Action */}
            <motion.div 
              className="mb-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl overflow-hidden shadow-lg"
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative">
                <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-20"></div>
                <div className="p-6 relative z-10">
                  <div className="flex items-center mb-3">
                    <div className="p-2 bg-white bg-opacity-20 rounded-full mr-3">
                      <Compass className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Discover Unique News</h3>
                  </div>
                  
                  <p className="text-white text-opacity-90 mb-4">
                    Feeling curious? Spin the wheel of fortune to discover unique, personalized news articles tailored just for you!
                  </p>
                  
                  <motion.button
                    onClick={handleSpinWheel}
                    className="mt-2 px-6 py-3 bg-white text-indigo-600 rounded-full font-bold shadow-lg flex items-center"
                    whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Sparkles className="h-5 w-5 mr-2 text-yellow-500" />
                    <span>Spin for Curiosity</span>
                    <ChevronRight className="h-5 w-5 ml-1" />
                  </motion.button>

                  {/* Decorative elements */}
                  <motion.div 
                    className="absolute top-3 right-6 w-16 h-16 text-white opacity-20"
                    animate={{ 
                      rotate: [0, 15, -15, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 5,
                      ease: "easeInOut"
                    }}
                  >
                    <Award className="w-full h-full" />
                  </motion.div>
                  
                  <motion.div 
                    className="absolute bottom-3 right-12 w-8 h-8 text-white opacity-20"
                    animate={{ 
                      rotate: [0, 360],
                    }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 10,
                      ease: "linear"
                    }}
                  >
                    <Sparkles className="w-full h-full" />
                  </motion.div>
                </div>
              </div>
            </motion.div>
            
            {/* Trending Topics Section */}
            <div className="mb-6">
              <div className="flex items-center mb-3">
                <Flame className="h-5 w-5 text-orange-500 mr-2" />
                <h3 className="text-lg font-semibold text-gray-700">Trending Topics</h3>
              </div>
              <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg p-4">
                <div className="space-y-3">
                  {trendingTopics.map((topic, index) => (
                    <div key={index} className="flex items-center justify-between bg-white rounded-lg p-3 shadow-sm">
                      <div className="flex items-center">
                        <div className="bg-orange-100 p-2 rounded-full mr-3">
                          <Flame className="h-4 w-4 text-orange-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">{topic.title}</p>
                          <p className="text-xs text-gray-500">{topic.category}</p>
                        </div>
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <span className="font-medium">{topic.views}</span>
                        <span className="ml-1">views</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Recent activity */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex items-start p-3 bg-gray-50 rounded-lg">
                  <div className="bg-blue-100 p-2 rounded-full mr-3">
                    <BookOpen className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">You read an article about climate change</p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                </div>
                
                <div className="flex items-start p-3 bg-gray-50 rounded-lg">
                  <div className="bg-purple-100 p-2 rounded-full mr-3">
                    <Star className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">You added Technology to your favorite topics</p>
                    <p className="text-xs text-gray-500">Yesterday</p>
                  </div>
                </div>
                
                <div className="flex items-start p-3 bg-gray-50 rounded-lg">
                  <div className="bg-green-100 p-2 rounded-full mr-3">
                    <Award className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">You earned the "News Explorer" badge</p>
                    <p className="text-xs text-gray-500">3 days ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Sidebar with game elements */}
        <div className="lg:col-span-1" id="spin-wheel-section">
          <div className="bg-indigo-50 p-4 rounded-xl mb-4">
            <h3 className="text-xl font-bold text-indigo-800 mb-2 text-center">Spin The Wheel</h3>
            <p className="text-gray-600 text-center mb-3">Discover unique articles from random categories!</p>
          </div>
          
          <motion.div 
            className={`relative rounded-xl overflow-hidden ${showSpinWheelEffects ? 'ring-4 ring-indigo-500 ring-opacity-50' : 'border-2 border-indigo-100'}`}
            animate={showSpinWheelEffects ? {
              boxShadow: ['0px 0px 0px rgba(79, 70, 229, 0)', '0px 0px 20px rgba(79, 70, 229, 0.6)', '0px 0px 0px rgba(79, 70, 229, 0)'],
            } : {}}
            transition={showSpinWheelEffects ? {
              repeat: Infinity,
              duration: 2,
            } : {}}
          >
            <SpinWheel />
            
            {/* Floating particles effect when wheel is active */}
            {showSpinWheelEffects && (
              <>
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-4 h-4 rounded-full bg-yellow-400 opacity-70"
                    initial={{
                      x: Math.random() * 100 - 50 + '%',
                      y: '100%',
                    }}
                    animate={{
                      y: '-100%',
                      opacity: [0, 0.8, 0],
                      scale: [0, 1, 0.5],
                    }}
                    transition={{
                      duration: 2 + Math.random() * 3,
                      repeat: Infinity,
                      delay: Math.random() * 5,
                    }}
                  />
                ))}
              </>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 