import React from 'react';
import { motion } from 'motion/react';

interface OnboardingProps {
  videoUrl: string;
  imageUrl: string;
  onStart: () => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ videoUrl, imageUrl, onStart }) => {
  return (
    <div className="flex flex-col items-center justify-between h-full p-8 bg-gradient-to-b from-blue-50 to-white">
      <div className="flex-1 flex flex-col items-center justify-center space-y-12">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative w-80 h-80 flex items-center justify-center"
        >
          {/* Animated Background Glow */}
          <div className="absolute inset-0 bg-blue-400/20 rounded-full blur-[100px] animate-pulse" />
          
          {/* Video/Image Container */}
          <div className="relative z-10 w-full h-full rounded-[3rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.2)] border-4 border-white bg-white group">
            <video
              key={videoUrl}
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay"
            >
              <source src={videoUrl} type="video/mp4" />
            </video>
            
            <div className="absolute inset-0 flex items-center justify-center p-8">
              <img
                src={imageUrl}
                alt="Skinfotech Solutions Logo"
                className="w-full h-full object-contain drop-shadow-2xl transform group-hover:scale-110 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </motion.div>

        <div className="text-center space-y-4">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-display font-bold text-slate-900"
          >
            Skinfotech <span className="text-blue-600">AI</span><br />Assistant
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-slate-500 max-w-xs mx-auto"
          >
            Empowering your business with Skinfotech Solutions' intuitive AI companion.
          </motion.p>
        </div>
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="w-full pb-8"
      >
        <button
          onClick={onStart}
          className="w-full py-4 bg-gradient-to-r from-emerald-400 to-blue-500 text-white font-semibold rounded-2xl shadow-lg shadow-blue-200 active:scale-95 transition-transform"
        >
          Get Started
        </button>
      </motion.div>
    </div>
  );
};
