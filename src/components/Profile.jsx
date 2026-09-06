import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Bookmark, 
  Settings, 
  LogOut, 
  Edit2, 
  Bell, 
  Shield,
  History,
  MessageSquare,
  Bot
} from 'lucide-react';
import { motion } from 'framer-motion';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    joinDate: 'January 2024',
    bookmarks: 12,
    discussions: 5
  });

  const menuItems = [
    { icon: Bot, label: 'AI Assistant', path: '/ai-assistant', highlight: true },
    { icon: Bookmark, label: 'My Bookmarks', path: '/bookmarks' },
    { icon: MessageSquare, label: 'My Discussions', path: '/discussions' },
    { icon: History, label: 'Reading History', path: '/history' },
    { icon: Bell, label: 'Notifications', path: '/notifications' },
    { icon: Settings, label: 'Settings', path: '/settings' },
    { icon: Shield, label: 'Privacy', path: '/privacy' },
  ];

  const handleLogout = () => {
    // Add logout logic here
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="relative h-32 bg-gradient-to-r from-blue-600 to-indigo-600">
            <div className="absolute -bottom-16 left-8">
              <div className="relative">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
                />
                <button className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md hover:bg-gray-50 transition-colors">
                  <Edit2 className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
          
          <div className="pt-20 pb-6 px-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                <p className="text-gray-500">{user.email}</p>
                <p className="text-sm text-gray-400 mt-1">Member since {user.joinDate}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-blue-50 rounded-xl p-4">
                <div className="flex items-center gap-2">
                  <Bookmark className="w-5 h-5 text-blue-600" />
                  <span className="text-blue-600 font-medium">Bookmarks</span>
                </div>
                <p className="text-2xl font-bold text-blue-700 mt-1">{user.bookmarks}</p>
              </div>
              <div className="bg-indigo-50 rounded-xl p-4">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-indigo-600" />
                  <span className="text-indigo-600 font-medium">Discussions</span>
                </div>
                <p className="text-2xl font-bold text-indigo-700 mt-1">{user.discussions}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="mt-8 grid gap-4">
          {menuItems.map((item, index) => (
            <motion.button
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => navigate(item.path)}
              className={`flex items-center gap-4 ${item.highlight ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white' : 'bg-white text-gray-700'} p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow`}
            >
              <div className={`w-10 h-10 rounded-full ${item.highlight ? 'bg-white/20' : 'bg-gray-100'} flex items-center justify-center`}>
                <item.icon className={`w-5 h-5 ${item.highlight ? 'text-white' : 'text-gray-600'}`} />
              </div>
              <span className={`${item.highlight ? 'text-white' : 'text-gray-700'} font-medium`}>{item.label}</span>
              {item.highlight && (
                <div className="ml-auto bg-white/20 px-2 py-1 rounded-full text-xs font-medium text-white">
                  New
                </div>
              )}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile; 