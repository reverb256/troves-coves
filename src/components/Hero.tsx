import React from 'react';

const Hero: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-500 flex items-center justify-center">
      <div className="bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl p-8 shadow-xl max-w-md w-full">
        <h1 className="text-4xl font-bold text-white mb-4">Vite 2025 Vibecode</h1>
        <p className="text-white/80 text-lg">
          A cutting-edge website with glassmorphism and container layouts.
        </p>
        <button className="mt-6 bg-white/30 hover:bg-white/40 text-white py-2 px-4 rounded-lg transition">
          Explore Now
        </button>
      </div>
    </div>
  );
};

export default Hero;
