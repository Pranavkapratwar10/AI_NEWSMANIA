import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Crown, Zap, Shield, Star, Gift } from 'lucide-react';

const features = [
  { icon: <Crown className="w-6 h-6 text-yellow-500" />, title: 'Ad-Free Experience', desc: 'Enjoy news without any interruptions or ads.' },
  { icon: <Zap className="w-6 h-6 text-purple-500" />, title: 'Exclusive Insights', desc: 'Access in-depth analysis and special reports.' },
  { icon: <Shield className="w-6 h-6 text-blue-500" />, title: 'Priority Support', desc: 'Get direct help and priority responses.' },
  { icon: <Star className="w-6 h-6 text-green-500" />, title: 'Custom Alerts', desc: 'Receive instant alerts on topics you care about.' },
  { icon: <Gift className="w-6 h-6 text-red-500" />, title: 'Monthly Newsletter', desc: 'Exclusive curated newsletter only for premium members.' }
];

export default function PremiumFeatures() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 p-6">
      <button onClick={() => navigate(-1)} className="text-purple-600 dark:text-pink-400 hover:underline mb-4">
        ← Back to Profile
      </button>
      <h1 className="text-4xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
        Premium Features
      </h1>
      <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 max-w-2xl">
        Elevate your NewsMania experience with exclusive features designed for power readers.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((f, idx) => (
          <div
            key={idx}
            onClick={() => alert(`Selected: ${f.title}`)}
            className="relative group bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl overflow-hidden cursor-pointer transform transition hover:scale-105 hover:shadow-2xl"
          >
            {/* Decorative gradient pulse */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-pink-300 opacity-20 rounded-full blur-3xl animate-pulse group-hover:opacity-30"></div>
            <div className="relative z-10 flex items-center justify-center mb-4">
              <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white text-2xl">
                {f.icon}
              </div>
            </div>
            <h3 className="relative z-10 text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 text-center">
              {f.title}
            </h3>
            <p className="relative z-10 text-center text-gray-700 dark:text-gray-300 text-sm">
              {f.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
} 