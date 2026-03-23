import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Clock, TrendingUp, ShoppingBag, Target, Wallet, Receipt, Calendar, FileText, X } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { AppState } from '../types';

interface HistoryViewProps {
  state: AppState;
  onBack: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ state, onBack }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const chartData = useMemo(() => {
    const data = [
      { name: 'Activity', type: 'activity', value: state.activities.reduce((sum, a) => sum + (Number(a.expense) || 0), 0), color: '#3b82f6' },
      { name: 'Expense', type: 'expense', value: state.expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0), color: '#ef4444' },
      { name: 'Investment', type: 'investment', value: state.investments.reduce((sum, i) => sum + (Number(i.amount) || 0), 0), color: '#10b981' },
      { name: 'Purchase', type: 'purchase', value: state.purchases.reduce((sum, p) => sum + (Number(p.amount) || 0), 0), color: '#a855f7' },
      { name: 'Bill', type: 'bill', value: state.bills.reduce((sum, b) => sum + (Number(b.amount) || 0), 0), color: '#f97316' },
    ];
    return data.filter(d => d.value > 0);
  }, [state]);

  const allHistory = useMemo(() => {
    const history = [
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

    if (selectedCategory) {
      return history.filter(item => item.type === selectedCategory);
    }
    return history;
  }, [state, selectedCategory]);

  const handleBarClick = (data: any) => {
    if (data && data.type) {
      setSelectedCategory(prev => prev === data.type ? null : data.type);
    }
  };

  const selectedCategoryName = chartData.find(d => d.type === selectedCategory)?.name;

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <div className="p-6 flex items-center justify-between bg-white border-b border-slate-100">
        <button onClick={onBack} className="p-2 bg-slate-50 rounded-full text-slate-600"><ArrowLeft size={20} /></button>
        <h2 className="text-lg font-display font-bold text-slate-800">History</h2>
        <div className="w-10 h-10" />
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Chart Section */}
        {chartData.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-bold text-slate-800 flex items-center space-x-2">
                <TrendingUp size={16} className="text-blue-500" />
                <span>Expense Breakdown</span>
              </h3>
              {selectedCategory && (
                <button 
                  onClick={() => setSelectedCategory(null)}
                  className="text-[10px] font-bold text-blue-500 bg-blue-50 px-2 py-1 rounded-lg flex items-center space-x-1"
                >
                  <span>Clear Filter</span>
                  <X size={10} />
                </button>
              )}
            </div>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }}
                  />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ 
                      borderRadius: '16px', 
                      border: 'none', 
                      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}
                  />
                  <Bar 
                    dataKey="value" 
                    radius={[6, 6, 0, 0]} 
                    barSize={30}
                    onClick={handleBarClick}
                    style={{ cursor: 'pointer' }}
                  >
                    {chartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.color} 
                        fillOpacity={selectedCategory ? (selectedCategory === entry.type ? 1 : 0.3) : 1}
                        stroke={selectedCategory === entry.type ? entry.color : 'none'}
                        strokeWidth={2}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-[10px] text-slate-400 text-center mt-4 font-medium italic">
              Tip: Tap a bar to filter history by category
            </p>
          </motion.div>
        )}

        <div className="space-y-4">
          <div className="flex items-center justify-between ml-1">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              {selectedCategory ? `${selectedCategoryName} History` : 'Recent Activities'}
            </h3>
            {selectedCategory && (
              <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                {allHistory.length} items
              </span>
            )}
          </div>
          
          <AnimatePresence mode="popLayout">
            {allHistory.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-12 text-slate-400 space-y-2"
              >
                <Clock size={48} className="opacity-20" />
                <p className="font-medium">No entries found</p>
              </motion.div>
            ) : (
              allHistory.map((item: any) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  key={item.id} 
                  className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4"
                >
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
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
