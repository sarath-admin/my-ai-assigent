import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, X, Volume2, CheckCircle2 } from 'lucide-react';
import { Reminder } from '../types';

interface ReminderAlertProps {
  reminder: Reminder | null;
  onClose: () => void;
  onStopAlarm: () => void;
}

export const ReminderAlert: React.FC<ReminderAlertProps> = ({ reminder, onClose, onStopAlarm }) => {
  if (!reminder) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[100] flex items-center justify-center p-6"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl border border-slate-100 text-center relative overflow-hidden"
        >
          {/* Animated Background Rings */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 -mt-32">
            <div className="absolute inset-0 bg-blue-50 rounded-full animate-ping opacity-20" />
            <div className="absolute inset-0 bg-blue-100 rounded-full animate-pulse opacity-10 [animation-delay:0.5s]" />
          </div>

          <div className="relative z-10 space-y-6">
            <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-blue-200 animate-bounce">
              <Bell size={40} className="text-white" />
            </div>

            <div>
              <h2 className="text-2xl font-display font-bold text-slate-800 tracking-tight">Reminder Alert!</h2>
              <p className="text-sm text-slate-400 font-medium mt-1 uppercase tracking-widest">Nova Assistant</p>
            </div>

            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
              <h3 className="text-lg font-bold text-slate-800">{reminder.title}</h3>
              {reminder.description && (
                <p className="text-sm text-slate-500 mt-2 leading-relaxed">{reminder.description}</p>
              )}
              <div className="flex items-center justify-center space-x-2 mt-4">
                <div className={`w-2 h-2 rounded-full ${
                  reminder.priority === 'high' ? 'bg-red-500' : 
                  reminder.priority === 'medium' ? 'bg-orange-500' : 'bg-blue-500'
                }`} />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {reminder.priority} Priority
                </span>
              </div>
            </div>

            <div className="flex flex-col space-y-3">
              <button
                onClick={onStopAlarm}
                className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center space-x-2 shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95"
              >
                <Volume2 size={20} />
                <span>Stop Alarm & Listen</span>
              </button>
              
              <button
                onClick={onClose}
                className="w-full bg-slate-100 text-slate-600 py-4 rounded-2xl font-bold flex items-center justify-center space-x-2 hover:bg-slate-200 transition-all active:scale-95"
              >
                <CheckCircle2 size={20} />
                <span>Dismiss Reminder</span>
              </button>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-300 hover:text-slate-500 transition-colors"
          >
            <X size={24} />
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
