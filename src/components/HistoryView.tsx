import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Clock, TrendingUp, ShoppingBag, Target, Wallet, Receipt, Calendar, FileText } from 'lucide-react';
import { AppState } from '../types';

interface HistoryViewProps {
  state: AppState;
  onBack: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ state, onBack }) => {
  const allHistory = [
    ...state.activities.map(a => ({ ...a, type: 'activity', icon: Target, color: 'text-blue-500 bg-blue-50' })),
    ...state.expenses.map(e => ({ ...e, type: 'expense', icon: Clock, color: 'text-red-500 bg-red-50' })),
    ...state.investments.map(i => ({ ...i, type: 'investment', icon: TrendingUp, color: 'text-emerald-500 bg-emerald-50' })),
    ...state.purchases.map(p => ({ ...p, type: 'purchase', icon: ShoppingBag, color: 'text-purple-500 bg-purple-50' })),
    ...state.incomes.map(i => ({ ...i, type: 'income', icon: Wallet, color: 'text-cyan-500 bg-cyan-50' })),
    ...state.bills.map(b => ({ ...b, type: 'bill', icon: Receipt, color: 'text-orange-500 bg-orange-50' })),
    ...state.reminders.map(r => ({ ...r, type: 'reminder', icon: Calendar, color: 'text-pink-500 bg-pink-50' })),
    ...state.notes.map(n => ({ ...n, type: 'note', icon: FileText, color: 'text-slate-500 bg-slate-50' })),
  ].sort((a, b) => {
    try {
      return new Date(b.date + ' ' + b.time).getTime() - new Date(a.date + ' ' + a.time).getTime();
    } catch (e) {
      return 0;
    }
  });

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <div className="p-6 flex items-center justify-between bg-white border-b border-slate-100">
        <button onClick={onBack} className="p-2 bg-slate-50 rounded-full text-slate-600"><ArrowLeft size={20} /></button>
        <h2 className="text-lg font-display font-bold text-slate-800">History</h2>
        <div className="w-10 h-10" />
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {allHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-2">
            <Clock size={48} className="opacity-20" />
            <p className="font-medium">No history yet</p>
          </div>
        ) : (
          allHistory.map((item: any) => (
            <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
              <div className={`p-3 rounded-xl ${item.color}`}>
                <item.icon size={20} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-slate-800 capitalize">{item.type}</p>
                <p className="text-[10px] text-slate-400">{item.date} • {item.time}</p>
                {item.content && <p className="text-[10px] text-slate-500 mt-1 line-clamp-1">{item.content}</p>}
                {item.title && <p className="text-[10px] text-slate-500 mt-1">{item.title}</p>}
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-slate-800">
                  {item.amount !== undefined ? `₹${item.amount}` : item.expense !== undefined ? `₹${item.expense}` : item.target || item.priority || ''}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
