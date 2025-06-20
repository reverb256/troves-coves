import React from 'react';

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 hover:shadow-2xl transition"
          >
            <h2 className="text-2xl font-semibold text-white mb-2">Card {i}</h2>
            <p className="text-white/70">Dynamic content for your Vite app.</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
