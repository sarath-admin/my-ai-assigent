import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus,
  Mic, 
  Home,
  History,
  User,
  Settings,
  Bell,
  Target,
  TrendingUp,
  ShoppingBag,
  Clock,
  MessageSquare,
  Wallet,
  Receipt,
  Calendar,
  FileText,
  X,
  Check,
  MicOff
} from 'lucide-react';
import { UserProfile, Screen } from '../types';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';

interface HomeProps {
  profile: UserProfile;
  language: string;
  onNavigate: (screen: Screen) => void;
  onAddActivity: (data: any) => void;
  onAddExpense: (data: any) => void;
  onAddInvestment: (data: any) => void;
  onAddPurchase: (data: any) => void;
  onAddIncome: (data: any) => void;
  onAddBill: (data: any) => void;
  onAddReminder: (data: any) => void;
  onAddNote: (data: any) => void;
  onVoiceMessage: (msg: string) => void;
}

export const HomeView: React.FC<HomeProps> = ({ 
  profile, 
  language,
  onNavigate,
  onAddActivity,
  onAddExpense,
  onAddInvestment,
  onAddPurchase,
  onAddIncome,
  onAddBill,
  onAddReminder,
  onAddNote,
  onVoiceMessage
}) => {
  const [isPlusOpen, setIsPlusOpen] = useState(false);
  const [activeService, setActiveService] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});

  const handleVoiceResult = React.useCallback((text: string) => {
    onVoiceMessage(text);
  }, [onVoiceMessage]);

  const { isListening, startListening, stopListening } = useSpeechRecognition({
    language,
    onResult: handleVoiceResult
  });

  const handleVoiceSupport = React.useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  const getCurrentDateTime = React.useCallback(() => {
    const now = new Date();
    return {
      date: now.toLocaleDateString(),
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  }, []);

  const quickActions = [
    { 
      id: 'activity', 
      name: 'Today Activity', 
      icon: Target, 
      color: 'bg-blue-50 text-blue-500',
      fields: [
        { name: 'target', label: 'Target/Goal', type: 'text', placeholder: 'e.g. 5km Run' },
        { name: 'expense', label: 'Expense (₹)', type: 'number', placeholder: '0' },
        { name: 'targetDate', label: 'Target Date', type: 'date' }
      ],
      onSubmit: (data: any) => onAddActivity({ ...getCurrentDateTime(), ...data })
    },
    { 
      id: 'expense', 
      name: 'Today Expense', 
      icon: Clock, 
      color: 'bg-red-50 text-red-500',
      fields: [
        { name: 'description', label: 'Description', type: 'text', placeholder: 'e.g. Lunch' },
        { name: 'amount', label: 'Amount (₹)', type: 'number', placeholder: '0' },
        { name: 'targetDate', label: 'Target Date', type: 'date' }
      ],
      onSubmit: (data: any) => onAddExpense({ ...getCurrentDateTime(), ...data })
    },
    { 
      id: 'investment', 
      name: 'Investment', 
      icon: TrendingUp, 
      color: 'bg-emerald-50 text-emerald-500',
      fields: [
        { name: 'type', label: 'Investment Type', type: 'text', placeholder: 'e.g. Stocks, Gold' },
        { name: 'amount', label: 'Amount (₹)', type: 'number', placeholder: '0' },
        { name: 'targetDate', label: 'Target Date', type: 'date' }
      ],
      onSubmit: (data: any) => onAddInvestment({ ...getCurrentDateTime(), ...data })
    },
    { 
      id: 'purchase', 
      name: 'Purchase', 
      icon: ShoppingBag, 
      color: 'bg-purple-50 text-purple-500',
      fields: [
        { name: 'items', label: 'Items Purchased', type: 'text', placeholder: 'e.g. Groceries' },
        { name: 'amount', label: 'Total Amount (₹)', type: 'number', placeholder: '0' },
        { name: 'targetDate', label: 'Target Date', type: 'date' }
      ],
      onSubmit: (data: any) => onAddPurchase({ ...getCurrentDateTime(), ...data })
    },
    { 
      id: 'income', 
      name: 'Income', 
      icon: Wallet, 
      color: 'bg-cyan-50 text-cyan-500',
      fields: [
        { name: 'source', label: 'Income Source', type: 'text', placeholder: 'e.g. Salary' },
        { name: 'amount', label: 'Amount (₹)', type: 'number', placeholder: '0' },
        { name: 'targetDate', label: 'Target Date', type: 'date' }
      ],
      onSubmit: (data: any) => onAddIncome({ ...getCurrentDateTime(), ...data })
    },
    { 
      id: 'bill', 
      name: 'Bill Payment', 
      icon: Receipt, 
      color: 'bg-orange-50 text-orange-500',
      fields: [
        { name: 'name', label: 'Bill Name', type: 'text', placeholder: 'e.g. Electricity' },
        { name: 'amount', label: 'Amount (₹)', type: 'number', placeholder: '0' },
        { name: 'targetDate', label: 'Target Date', type: 'date' }
      ],
      onSubmit: (data: any) => onAddBill({ ...getCurrentDateTime(), ...data })
    },
    { 
      id: 'reminder', 
      name: 'Reminder', 
      icon: Calendar, 
      color: 'bg-pink-50 text-pink-500',
      fields: [
        { name: 'title', label: 'Reminder Title', type: 'text', placeholder: 'e.g. Doctor Appointment' },
        { name: 'priority', label: 'Priority', type: 'select', options: ['low', 'medium', 'high'] },
        { name: 'targetDate', label: 'Target Date', type: 'date' }
      ],
      onSubmit: (data: any) => onAddReminder({ ...getCurrentDateTime(), ...data })
    },
    { 
      id: 'note', 
      name: 'Note', 
      icon: FileText, 
      color: 'bg-slate-50 text-slate-500',
      fields: [
        { name: 'content', label: 'Note Content', type: 'textarea', placeholder: 'Type your note here...' },
        { name: 'targetDate', label: 'Target Date', type: 'date' }
      ],
      onSubmit: (data: any) => onAddNote({ ...getCurrentDateTime(), ...data })
    },
  ];

  const currentService = quickActions.find(a => a.id === activeService);

  const handleFormSubmit = () => {
    if (currentService) {
      currentService.onSubmit(formData);
      setActiveService(null);
      setFormData({});
      setIsPlusOpen(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 relative">
      {/* Header */}
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-100 overflow-hidden p-1.5">
            <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M25 35 L48 25 L48 48 L25 58 Z" stroke="#008080" strokeWidth="6" strokeLinejoin="round" />
              <path d="M52 25 L75 35 L75 58 L52 48 Z" fill="#FFC107" />
              <path d="M25 62 L48 52 L48 75 L25 85 Z" stroke="#FFC107" strokeWidth="6" strokeLinejoin="round" />
              <path d="M52 52 L75 62 L75 85 L52 75 Z" fill="#008080" />
            </svg>
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Hey Good Morning!</p>
            <h2 className="text-lg font-display font-bold text-slate-800">{profile.name}</h2>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-2 bg-white rounded-full shadow-sm text-slate-400">
            <Bell size={20} />
          </button>
          <button onClick={() => onNavigate('profile')} className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm">
            <img src={profile.avatar} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </button>
        </div>
      </div>

      {/* Hero / New Chat */}
      <div className="px-6 pb-6">
        <motion.div 
          whileTap={{ scale: 0.98 }}
          onClick={() => onNavigate('chat')}
          className="relative bg-white rounded-3xl p-8 shadow-sm border border-slate-100 overflow-hidden cursor-pointer"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 opacity-50" />
          <div className="relative z-10 flex flex-col items-center text-center space-y-6">
            <div className="relative w-32 h-32 bg-white rounded-[2rem] flex items-center justify-center shadow-xl shadow-slate-100 overflow-hidden p-6 border border-slate-50 group">
              <svg viewBox="0 0 100 100" className="w-full h-full transform group-hover:scale-110 transition-transform duration-500" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M25 35 L48 25 L48 48 L25 58 Z" stroke="#008080" strokeWidth="6" strokeLinejoin="round" />
                <path d="M52 25 L75 35 L75 58 L52 48 Z" fill="#FFC107" />
                <path d="M25 62 L48 52 L48 75 L25 85 Z" stroke="#FFC107" strokeWidth="6" strokeLinejoin="round" />
                <path d="M52 52 L75 62 L75 85 L52 75 Z" fill="#008080" />
              </svg>
            </div>
            <div>
              <h3 className="text-3xl font-display font-bold text-slate-800 leading-tight tracking-tight">Skinfotech AI<br/>Assistant</h3>
              <p className="text-sm text-slate-400 mt-2 font-medium">Your Personal Digital Companion</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Voice Support Button */}
      <div className="px-6 pb-6">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleVoiceSupport}
          className={`w-full p-4 rounded-2xl flex items-center justify-center space-x-3 shadow-lg transition-all ${isListening ? 'bg-red-500 shadow-red-100 animate-pulse' : 'bg-emerald-500 shadow-emerald-100'}`}
        >
          {isListening ? <MicOff size={24} /> : <Mic size={24} />}
          <span className="font-bold">{isListening ? "Listening..." : `Voice Support (${language})`}</span>
        </motion.button>
      </div>

      {/* Quick Actions Grid */}
      <div className="px-6 pb-6">
        <div className="grid grid-cols-2 gap-4">
          {quickActions.map((action) => (
            <motion.button
              key={action.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveService(action.id)}
              className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center text-center space-y-2"
            >
              <div className={`p-3 rounded-2xl ${action.color}`}>
                <action.icon size={24} />
              </div>
              <span className="text-xs font-bold text-slate-700">{action.name}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Plus Button & Scrollable Options */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 pb-24 relative">
        <AnimatePresence>
          {isPlusOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-24 left-6 right-6 bg-white rounded-3xl shadow-2xl border border-slate-100 p-4 z-30"
            >
              <div className="flex flex-col space-y-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                {quickActions.map((action) => (
                  <button
                    key={action.id}
                    onClick={() => {
                      setActiveService(action.id);
                    }}
                    className="flex items-center space-x-4 p-4 hover:bg-slate-50 rounded-2xl transition-colors text-left"
                  >
                    <div className={`p-3 rounded-xl ${action.color}`}>
                      <action.icon size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{action.name}</p>
                      <p className="text-[10px] text-slate-400">Add new entry</p>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Service Form Modal */}
        <AnimatePresence>
          {activeService && currentService && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-end justify-center sm:items-center p-4"
            >
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                className="bg-white w-full max-w-md rounded-t-[2.5rem] sm:rounded-[2.5rem] p-8 shadow-2xl"
              >
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-2xl ${currentService.color}`}>
                      <currentService.icon size={24} />
                    </div>
                    <h3 className="text-xl font-display font-bold text-slate-800">{currentService.name}</h3>
                  </div>
                  <button 
                    onClick={() => setActiveService(null)}
                    className="p-2 bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center space-x-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                    <Clock size={14} />
                    <span>{getCurrentDateTime().date} • {getCurrentDateTime().time}</span>
                  </div>

                  {currentService.fields.map((field: any) => (
                    <div key={field.name} className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                        {field.label}
                      </label>
                      {field.type === 'textarea' ? (
                        <textarea
                          className="w-full bg-slate-50 border-none rounded-2xl p-4 text-slate-800 focus:ring-2 focus:ring-blue-500 transition-all min-h-[120px]"
                          placeholder={field.placeholder}
                          value={formData[field.name] || ''}
                          onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                        />
                      ) : field.type === 'select' ? (
                        <select
                          className="w-full bg-slate-50 border-none rounded-2xl p-4 text-slate-800 focus:ring-2 focus:ring-blue-500 transition-all appearance-none"
                          value={formData[field.name] || ''}
                          onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                        >
                          <option value="">Select Priority</option>
                          {field.options.map((opt: string) => (
                            <option key={opt} value={opt}>{opt.toUpperCase()}</option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={field.type}
                          className="w-full bg-slate-50 border-none rounded-2xl p-4 text-slate-800 focus:ring-2 focus:ring-blue-500 transition-all"
                          placeholder={field.placeholder}
                          value={formData[field.name] || ''}
                          onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                        />
                      )}
                    </div>
                  ))}

                  <button
                    onClick={handleFormSubmit}
                    className="w-full bg-blue-600 text-white p-5 rounded-2xl font-bold flex items-center justify-center space-x-3 shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all mt-4"
                  >
                    <Check size={24} />
                    <span>Save Entry</span>
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsPlusOpen(!isPlusOpen)}
          className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all z-40 ${isPlusOpen ? 'bg-slate-800 text-white rotate-45' : 'bg-blue-600 text-white'}`}
        >
          <Plus size={32} />
        </motion.button>
        <p className="mt-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Daily Expense Tracker</p>
      </div>

      {/* Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-8 py-4 flex items-center justify-between z-20">
        <button className="text-blue-500 flex flex-col items-center space-y-1">
          <Home size={22} />
          <span className="text-[10px] font-bold">Home</span>
        </button>
        <button 
          onClick={() => onNavigate('history')}
          className="text-slate-300 flex flex-col items-center space-y-1"
        >
          <History size={22} />
          <span className="text-[10px] font-bold">History</span>
        </button>
        <button 
          onClick={() => onNavigate('profile')}
          className="text-slate-300 flex flex-col items-center space-y-1"
        >
          <User size={22} />
          <span className="text-[10px] font-bold">Profile</span>
        </button>
        <button 
          onClick={() => onNavigate('settings')}
          className="text-slate-300 flex flex-col items-center space-y-1"
        >
          <Settings size={22} />
          <span className="text-[10px] font-bold">Settings</span>
        </button>
      </div>
    </div>
  );
};
