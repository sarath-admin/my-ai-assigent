import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Send, Mic, Sparkles, Globe, BrainCircuit, MicOff, Volume2 } from 'lucide-react';
import { getChatResponse } from '../services/gemini';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useTextToSpeech } from '../hooks/useTextToSpeech';

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
}

interface ChatViewProps {
  language: string;
  setLanguage: (lang: string) => void;
  initialMessage: string | null;
  onBack: () => void;
}

const languages = ['English', 'Tamil', 'Malayalam', 'Hindi', 'Kannada', 'Telugu'];

export const ChatView: React.FC<ChatViewProps> = ({ language, setLanguage, initialMessage, onBack }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [modelType, setModelType] = useState<'gemini' | 'gpt'>('gemini');
  const [isLangOpen, setIsLangOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasProcessedInitial = useRef(false);

  const { speak, stop: stopTTS } = useTextToSpeech();

  const handleSend = useCallback(async (text: string = input) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: text.trim(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    stopTTS();

    try {
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const response = await getChatResponse(text, history, modelType, language);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: response || "I'm sorry, I couldn't process that.",
      };

      setMessages(prev => [...prev, aiMessage]);
      
      // Automatically speak the AI response
      if (response) {
        speak(response, language);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages, modelType, language, speak, stopTTS]);

  const handleVoiceResult = useCallback((text: string) => {
    setInput(text);
    handleSend(text);
  }, [handleSend]);

  const { isListening, startListening, stopListening } = useSpeechRecognition({
    language,
    onResult: handleVoiceResult
  });

  useEffect(() => {
    if (initialMessage && !hasProcessedInitial.current) {
      hasProcessedInitial.current = true;
      handleSend(initialMessage);
    }
  }, [initialMessage, handleSend]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const toggleVoiceInput = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Header */}
      <div className="p-6 flex items-center justify-between bg-white border-b border-slate-100">
        <button onClick={onBack} className="p-2 bg-slate-50 rounded-full text-slate-600"><ArrowLeft size={20} /></button>
        <div className="flex flex-col items-center">
          <h2 className="text-sm font-display font-bold text-slate-800">Nova AI</h2>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setModelType(modelType === 'gemini' ? 'gpt' : 'gemini')}
              className="text-[10px] font-bold text-blue-500 flex items-center space-x-1"
            >
              <BrainCircuit size={10} />
              <span>{modelType === 'gemini' ? 'Gemini AI' : 'ChatGPT'}</span>
            </button>
          </div>
        </div>
        <button 
          onClick={() => setIsLangOpen(!isLangOpen)}
          className="p-2 bg-slate-50 rounded-full text-slate-600 flex items-center space-x-1"
        >
          <Globe size={18} />
          <span className="text-[10px] font-bold">{language.substring(0, 3)}</span>
        </button>
      </div>

      {/* Language Selector */}
      <AnimatePresence>
        {isLangOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-white border-b border-slate-100 overflow-hidden"
          >
            <div className="p-4 grid grid-cols-3 gap-2">
              {languages.map(lang => (
                <button
                  key={lang}
                  onClick={() => { setLanguage(lang); setIsLangOpen(false); }}
                  className={`py-2 px-3 rounded-xl text-[10px] font-bold transition-all ${language === lang ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-600'}`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full space-y-4 opacity-50">
            <BrainCircuit size={64} className="text-blue-200" />
            <p className="text-sm font-medium text-slate-400">Start chatting in {language}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((m) => (
              <motion.div
                key={m.id}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] p-4 rounded-2xl shadow-sm relative group ${
                  m.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'
                }`}>
                  <p className="text-sm leading-relaxed">{m.text}</p>
                  {m.role === 'model' && (
                    <div className="mt-3 flex flex-wrap gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => speak(m.text, language)}
                        className="flex items-center space-x-1 px-2 py-1 bg-blue-50 text-blue-600 rounded-lg text-[9px] font-bold hover:bg-blue-100 transition-colors"
                        title="Replay in current language"
                      >
                        <Volume2 size={10} />
                        <span>REPLAY</span>
                      </button>
                      <div className="h-4 w-[1px] bg-slate-100 mx-0.5" />
                      {languages.map(lang => (
                        <button
                          key={lang}
                          onClick={() => speak(m.text, lang)}
                          className={`px-2 py-1 rounded-lg text-[9px] font-bold transition-all ${
                            language === lang 
                              ? 'bg-blue-600 text-white' 
                              : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                          }`}
                        >
                          {lang.substring(0, 3).toUpperCase()}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-6 bg-white border-t border-slate-100">
        <div className="relative flex items-center">
          <div className="absolute left-4 text-slate-400">
            <Sparkles size={18} />
          </div>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder={isListening ? "Listening..." : `Type in ${language}...`}
            className={`w-full pl-12 pr-24 py-4 bg-slate-50 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all ${isListening ? 'ring-2 ring-blue-500' : ''}`}
          />
          <div className="absolute right-2 flex items-center space-x-2">
            <button 
              onClick={toggleVoiceInput}
              className={`p-2 transition-colors ${isListening ? 'text-blue-600 animate-pulse' : 'text-slate-400 hover:text-blue-500'}`}
            >
              {isListening ? <MicOff size={20} /> : <Mic size={20} />}
            </button>
            <button 
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              className="p-2 bg-blue-600 text-white rounded-xl shadow-md shadow-blue-100 disabled:opacity-50 active:scale-90 transition-transform"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
