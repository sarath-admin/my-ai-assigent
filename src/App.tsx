import { useState, useEffect, useRef, useCallback } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Onboarding } from './components/Onboarding';
import { HomeView } from './components/HomeView';
import { ChatView } from './components/ChatView';
import { ProfileView } from './components/ProfileView';
import { SettingsView } from './components/SettingsView';
import { HistoryView } from './components/HistoryView';
import { ReminderAlert } from './components/ReminderAlert';
import { Screen, AppState, UserProfile, Reminder } from './types';
import { useTextToSpeech } from './hooks/useTextToSpeech';

export default function App() {
  const [screen, setScreen] = useState<Screen>('onboarding');
  const [activeReminder, setActiveReminder] = useState<Reminder | null>(null);
  const alarmAudioRef = useRef<HTMLAudioElement | null>(null);
  const { speak, stop: stopTTS } = useTextToSpeech();
  const [state, setState] = useState<AppState>(() => {
    const savedState = localStorage.getItem('nova_app_state');
    if (savedState) {
      try {
        return JSON.parse(savedState);
      } catch (e) {
        console.error('Failed to parse saved state:', e);
      }
    }
    return {
      profile: {
        name: 'Mahmud Saimon',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mahmud'
      },
      theme: 'light',
      onboardingVideo: 'https://assets.mixkit.co/videos/preview/mixkit-abstract-technology-blue-lines-4432-large.mp4',
      onboardingImage: 'https://picsum.photos/seed/skinfotech-solutions/800/800',
      activities: [],
      expenses: [],
      investments: [],
      purchases: [],
      incomes: [],
      bills: [],
      reminders: [],
      notes: []
    };
  });

  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('nova_app_language') || 'English';
  });

  const [initialChatMessage, setInitialChatMessage] = useState<string | null>(null);

  // Save state to localStorage
  useEffect(() => {
    localStorage.setItem('nova_app_state', JSON.stringify(state));
  }, [state]);

  // Save language to localStorage
  useEffect(() => {
    localStorage.setItem('nova_app_language', language);
  }, [language]);

  const handleUpdateProfile = (profile: UserProfile) => {
    setState(prev => ({ ...prev, profile }));
  };

  const handleThemeChange = (theme: 'light' | 'dark' | 'blue') => {
    setState(prev => ({ ...prev, theme }));
  };

  const handleUpdateOnboarding = (video: string, image: string) => {
    setState(prev => ({ ...prev, onboardingVideo: video, onboardingImage: image }));
  };

  const addActivity = (data: any) => {
    setState(prev => ({ ...prev, activities: [{ id: Date.now().toString(), ...data }, ...prev.activities] }));
  };

  const addExpense = (data: any) => {
    setState(prev => ({ ...prev, expenses: [{ id: Date.now().toString(), ...data }, ...prev.expenses] }));
  };

  const addInvestment = (data: any) => {
    setState(prev => ({ ...prev, investments: [{ id: Date.now().toString(), ...data }, ...prev.investments] }));
  };

  const addPurchase = (data: any) => {
    setState(prev => ({ ...prev, purchases: [{ id: Date.now().toString(), ...data }, ...prev.purchases] }));
  };

  const addIncome = (data: any) => {
    setState(prev => ({ ...prev, incomes: [{ id: Date.now().toString(), ...data }, ...prev.incomes] }));
  };

  const addBill = (data: any) => {
    setState(prev => ({ ...prev, bills: [{ id: Date.now().toString(), ...data }, ...prev.bills] }));
  };

  const addReminder = (data: any) => {
    setState(prev => ({ ...prev, reminders: [{ id: Date.now().toString(), ...data }, ...prev.reminders] }));
  };

  const addNote = (data: any) => {
    setState(prev => ({ ...prev, notes: [{ id: Date.now().toString(), ...data }, ...prev.notes] }));
  };

  // Notification system for reminders
  useEffect(() => {
    // Setup alarm audio
    if (!alarmAudioRef.current) {
      // Simple beep base64
      const beepBase64 = "data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YV9vT18A";
      // Actually, let's use a more pleasant alarm sound URL
      alarmAudioRef.current = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3');
      alarmAudioRef.current.loop = true;
    }

    if (!("Notification" in window)) return;

    if (Notification.permission !== "granted" && Notification.permission !== "denied") {
      Notification.requestPermission();
    }

    const checkReminders = () => {
      const now = new Date();
      const nowStr = now.toISOString().split('T')[0]; // YYYY-MM-DD
      const nowTime = now.toTimeString().split(' ')[0].substring(0, 5); // HH:mm

      let updated = false;
      const newReminders = state.reminders.map(reminder => {
        if (reminder.notified) return reminder;

        // Check if date and time match
        if (reminder.date === nowStr && reminder.time === nowTime) {
          // Trigger Notification
          if (Notification.permission === "granted") {
            new Notification("Nova Reminder", {
              body: `${reminder.title}${reminder.description ? ': ' + reminder.description : ''}`,
              icon: '/favicon.ico'
            });
          }

          // Trigger Alarm and Modal
          setActiveReminder(reminder);
          if (alarmAudioRef.current) {
            alarmAudioRef.current.play().catch(e => console.error('Alarm failed:', e));
          }

          updated = true;
          return { ...reminder, notified: true };
        }
        return reminder;
      });

      if (updated) {
        setState(prev => ({ ...prev, reminders: newReminders }));
      }
    };

    const interval = setInterval(checkReminders, 10000); // Check every 10 seconds
    return () => clearInterval(interval);
  }, [state.reminders]);

  const handleStopAlarm = useCallback(() => {
    if (alarmAudioRef.current) {
      alarmAudioRef.current.pause();
      alarmAudioRef.current.currentTime = 0;
    }
    if (activeReminder) {
      const text = `Hey ${state.profile.name}, here is your reminder: ${activeReminder.title}. ${activeReminder.description || ''}`;
      speak(text, language);
    }
  }, [activeReminder, state.profile.name, language, speak]);

  const handleCloseReminder = useCallback(() => {
    if (alarmAudioRef.current) {
      alarmAudioRef.current.pause();
      alarmAudioRef.current.currentTime = 0;
    }
    stopTTS();
    setActiveReminder(null);
  }, [stopTTS]);

  useEffect(() => {
    const root = document.documentElement;
    if (state.theme === 'dark') {
      root.classList.add('dark');
      root.style.setProperty('--bg-color', '#0f172a');
    } else if (state.theme === 'blue') {
      root.classList.remove('dark');
      root.style.setProperty('--bg-color', '#f0f9ff');
    } else {
      root.classList.remove('dark');
      root.style.setProperty('--bg-color', '#f8fafc');
    }
  }, [state.theme]);

  return (
    <div className={`flex items-center justify-center min-h-screen p-4 transition-colors duration-500`} style={{ backgroundColor: state.theme === 'dark' ? '#1e293b' : '#e2e8f0' }}>
      {/* Mobile Frame Container */}
      <div className="relative w-full max-w-[400px] h-[800px] bg-white rounded-[3rem] shadow-2xl overflow-hidden border-[8px] border-slate-900">
        {/* Status Bar Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-2xl z-50" />
        
        <div className="h-full w-full relative">
          <AnimatePresence mode="wait">
            {screen === 'onboarding' && (
              <motion.div key="onboarding" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ x: -100, opacity: 0 }} className="h-full w-full">
                <Onboarding 
                  videoUrl={state.onboardingVideo}
                  imageUrl={state.onboardingImage}
                  onStart={() => setScreen('home')} 
                />
              </motion.div>
            )}

            {screen === 'home' && (
              <motion.div key="home" initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -100, opacity: 0 }} className="h-full w-full">
                <HomeView 
                  profile={state.profile} 
                  language={language}
                  onNavigate={setScreen}
                  onAddActivity={addActivity}
                  onAddExpense={addExpense}
                  onAddInvestment={addInvestment}
                  onAddPurchase={addPurchase}
                  onAddIncome={addIncome}
                  onAddBill={addBill}
                  onAddReminder={addReminder}
                  onAddNote={addNote}
                  onVoiceMessage={(msg) => {
                    setInitialChatMessage(msg);
                    setScreen('chat');
                  }}
                />
              </motion.div>
            )}

            {screen === 'chat' && (
              <motion.div key="chat" initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 100, opacity: 0 }} className="h-full w-full">
                <ChatView 
                  profile={state.profile}
                  language={language}
                  setLanguage={setLanguage}
                  initialMessage={initialChatMessage}
                  onBack={() => {
                    setInitialChatMessage(null);
                    setScreen('home');
                  }} 
                />
              </motion.div>
            )}

            {screen === 'profile' && (
              <motion.div key="profile" initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }} className="h-full w-full">
                <ProfileView profile={state.profile} onUpdate={handleUpdateProfile} onBack={() => setScreen('home')} />
              </motion.div>
            )}

            {screen === 'settings' && (
              <motion.div key="settings" initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }} className="h-full w-full">
                <SettingsView 
                  theme={state.theme} 
                  language={language}
                  onboardingVideo={state.onboardingVideo}
                  onboardingImage={state.onboardingImage}
                  onThemeChange={handleThemeChange} 
                  onLanguageChange={setLanguage}
                  onUpdateOnboarding={handleUpdateOnboarding}
                  onBack={() => setScreen('home')} 
                />
              </motion.div>
            )}

            {screen === 'history' && (
              <motion.div key="history" initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }} className="h-full w-full">
                <HistoryView state={state} onBack={() => setScreen('home')} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <ReminderAlert 
          reminder={activeReminder}
          onClose={handleCloseReminder}
          onStopAlarm={handleStopAlarm}
        />

        {/* Home Indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-slate-200 rounded-full z-50" />
      </div>
    </div>
  );
}

