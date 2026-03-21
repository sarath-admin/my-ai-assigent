import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, User, Camera, Trash2, Check, Upload } from 'lucide-react';
import { UserProfile } from '../types';

interface ProfileViewProps {
  profile: UserProfile;
  onUpdate: (profile: UserProfile) => void;
  onBack: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ profile, onUpdate, onBack }) => {
  const [name, setName] = useState(profile.name);
  const [avatar, setAvatar] = useState(profile.avatar);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const avatars = [
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Mahmud',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Saimon',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Nova',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Casey',
  ];

  const handleSave = () => {
    onUpdate({ name, avatar });
    onBack();
  };

  const handleRemove = () => {
    onUpdate({ name: 'Guest User', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Guest' });
    onBack();
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <div className="p-6 flex items-center justify-between bg-white border-b border-slate-100">
        <button onClick={onBack} className="p-2 bg-slate-50 rounded-full text-slate-600"><ArrowLeft size={20} /></button>
        <h2 className="text-lg font-display font-bold text-slate-800">Edit Profile</h2>
        <button onClick={handleSave} className="p-2 bg-blue-50 text-blue-600 rounded-full"><Check size={20} /></button>
      </div>

      <div className="p-8 flex flex-col items-center space-y-8 overflow-y-auto">
        <div className="relative">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl bg-slate-100">
            <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
          </div>
          <button 
            onClick={triggerFileInput}
            className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full shadow-lg active:scale-90 transition-transform"
          >
            <Camera size={16} />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
        </div>

        <div className="w-full space-y-6">
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Choose Avatar</label>
            <div className="grid grid-cols-3 gap-4">
              {avatars.map((av) => (
                <button
                  key={av}
                  onClick={() => setAvatar(av)}
                  className={`relative rounded-2xl overflow-hidden border-2 transition-all aspect-square ${avatar === av ? 'border-blue-500 scale-105 shadow-md' : 'border-transparent bg-white'}`}
                >
                  <img src={av} alt="Option" className="w-full h-full object-cover" />
                  {avatar === av && (
                    <div className="absolute inset-0 bg-blue-500/10 flex items-center justify-center">
                      <div className="bg-blue-500 text-white rounded-full p-1">
                        <Check size={12} />
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full p-4 bg-white rounded-2xl border border-slate-100 focus:ring-2 focus:ring-blue-100 outline-none transition-all font-medium"
            />
          </div>
        </div>

        <button
          onClick={handleRemove}
          className="flex items-center space-x-2 text-red-500 font-semibold p-4 hover:bg-red-50 rounded-2xl transition-colors w-full justify-center mt-4"
        >
          <Trash2 size={20} />
          <span>Remove Profile Info</span>
        </button>
      </div>
    </div>
  );
};
