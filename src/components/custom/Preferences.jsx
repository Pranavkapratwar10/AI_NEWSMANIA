import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const categories = [
  'Trending','Politics','Technology','Climate','Health','Economy','Sports','Entertainment'
];

export default function Preferences() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('preferences');
    if (saved) setSelected(JSON.parse(saved));
  }, []);

  const toggle = (cat) => {
    setSelected(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const handleSave = () => {
    localStorage.setItem('preferences', JSON.stringify(selected));
    toast.success('Preferences saved!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-6">
      <button onClick={() => navigate(-1)} className="text-blue-500 hover:underline mb-4">
        ← Back
      </button>
      <h1 className="text-3xl font-extrabold mb-4 text-gray-900 dark:text-gray-100">News Preferences</h1>
      <p className="text-gray-700 dark:text-gray-300 mb-6">Pick the categories you love:</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => toggle(cat)}
            className={`group p-4 text-center rounded-lg shadow-lg transition transform hover:scale-105
              ${selected.includes(cat)
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-transparent'
                : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700'}`}
          >
            <span className="font-semibold group-hover:text-white">{cat}</span>
          </button>
        ))}
      </div>
      <button
        onClick={handleSave}
        className="mt-4 px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full shadow-lg hover:opacity-90 transition-opacity"
      >
        Save Preferences
      </button>
    </div>
  );
} 