import React from 'react';
import { useNavigate } from 'react-router-dom';

const data = [
  { label: 'Articles per Day', value: 70 },
  { label: 'Sentiment Breakdown', value: 50 },
  { label: 'Controversy Hits', value: 30 },
];

export default function Analytics() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-6">
      <button onClick={() => navigate(-1)} className="text-indigo-600 dark:text-indigo-400 hover:underline mb-4">
        ← Back to Profile
      </button>
      <h1 className="text-3xl font-extrabold mb-6 text-gray-900 dark:text-gray-100">Analytics Dashboard</h1>
      <div className="max-w-3xl mx-auto space-y-8">
        {data.map((item, idx) => (
          <div key={idx} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg transition-transform transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-lg text-gray-800 dark:text-gray-100">{item.label}</h2>
              <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">{item.value}%</span>
            </div>
            <div
              className="w-full bg-gray-200 dark:bg-gray-700 h-4 rounded-full overflow-hidden cursor-pointer"
              onClick={() => alert(`Showing details for ${item.label}`)}
            >
              <div
                className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full"
                style={{ width: `${item.value}%` }}
              />
            </div>
          </div>
        ))}
        <div className="text-center mt-8">
          <button
            onClick={() => alert('Downloading report...')}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full shadow-lg hover:opacity-90 transition-opacity"
          >
            Download Report
          </button>
        </div>
      </div>
    </div>
  );
} 