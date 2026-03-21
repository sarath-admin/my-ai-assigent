import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Palette, Moon, Sun, Cloud, Video, Image as ImageIcon, Save } from 'lucide-react';

interface SettingsViewProps {
  theme: 'light' | 'dark' | 'blue';
  onboardingVideo: string;
  onboardingImage: string;
  onThemeChange: (theme: 'light' | 'dark' | 'blue') => void;
  onUpdateOnboarding: (video: string, image: string) => void;
  onBack: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ 
  theme, 
  onboardingVideo, 
  onboardingImage, 
  onThemeChange, 
  onUpdateOnboarding,
  onBack 
}) => {
  const [video, setVideo] = useState(onboardingVideo);
  const [image, setImage] = useState(onboardingImage);

  const handleSave = () => {
    onUpdateOnboarding(video, image);
    // Optional: show a success message
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <div className="p-6 flex items-center justify-between bg-white border-b border-slate-100">
        <button onClick={onBack} className="p-2 bg-slate-50 rounded-full text-slate-600"><ArrowLeft size={20} /></button>
        <h2 className="text-lg font-display font-bold text-slate-800">Settings</h2>
        <button onClick={handleSave} className="p-2 bg-blue-500 rounded-full text-white shadow-lg shadow-blue-200 active:scale-95 transition-transform">
          <Save size={20} />
        </button>
      </div>

      <div className="p-6 space-y-8 overflow-y-auto">
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-slate-400">
            <Palette size={18} />
            <h3 className="text-xs font-bold uppercase tracking-wider">Theme Appearance</h3>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <button
              onClick={() => onThemeChange('light')}
              className={`flex flex-col items-center p-4 rounded-2xl border-2 transition-all ${theme === 'light' ? 'border-blue-500 bg-blue-50' : 'border-transparent bg-white'}`}
            >
              <Sun className={theme === 'light' ? 'text-blue-500' : 'text-slate-400'} />
              <span className="text-xs font-bold mt-2">Light</span>
            </button>
            <button
              onClick={() => onThemeChange('dark')}
              className={`flex flex-col items-center p-4 rounded-2xl border-2 transition-all ${theme === 'dark' ? 'border-blue-500 bg-blue-50' : 'border-transparent bg-white'}`}
            >
              <Moon className={theme === 'dark' ? 'text-blue-500' : 'text-slate-400'} />
              <span className="text-xs font-bold mt-2">Dark</span>
            </button>
            <button
              onClick={() => onThemeChange('blue')}
              className={`flex flex-col items-center p-4 rounded-2xl border-2 transition-all ${theme === 'blue' ? 'border-blue-500 bg-blue-50' : 'border-transparent bg-white'}`}
            >
              <Cloud className={theme === 'blue' ? 'text-blue-500' : 'text-slate-400'} />
              <span className="text-xs font-bold mt-2">Ocean</span>
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-slate-400">
            <Video size={18} />
            <h3 className="text-xs font-bold uppercase tracking-wider">Onboarding Media</h3>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-500 px-1">Video URL (MP4)</label>
              <div className="flex items-center space-x-2 p-3 bg-white rounded-2xl border border-slate-100">
                <Video size={16} className="text-slate-400" />
                <input 
                  type="text" 
                  value={video} 
                  onChange={(e) => setVideo(e.target.value)}
                  placeholder="Enter video URL..."
                  className="flex-1 text-sm bg-transparent outline-none text-slate-600"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-500 px-1">Logo Image URL</label>
              <div className="flex items-center space-x-2 p-3 bg-white rounded-2xl border border-slate-100">
                <ImageIcon size={16} className="text-slate-400" />
                <input 
                  type="text" 
                  value={image} 
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="Enter image URL..."
                  className="flex-1 text-sm bg-transparent outline-none text-slate-600"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
