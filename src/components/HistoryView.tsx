import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Clock, TrendingUp, ShoppingBag, Target, Wallet, Receipt, Calendar, FileText, X, Search, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { AppState } from '../types';

interface HistoryViewProps {
  state: AppState;
  onBack: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ state, onBack }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter States
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');

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

    let filteredHistory = history;

    // 1. Category Filter
    if (selectedCategory) {
      filteredHistory = filteredHistory.filter(item => item.type === selectedCategory);
    }

    // 2. Search Query Filter (Title, Content, Type)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filteredHistory = filteredHistory.filter(item => 
        (item.title?.toLowerCase().includes(q)) || 
        (item.content?.toLowerCase().includes(q)) ||
        (item.type.toLowerCase().includes(q))
      );
    }

    // 3. Date Range Filter
    if (startDate) {
      filteredHistory = filteredHistory.filter(item => item.date >= startDate);
    }
    if (endDate) {
      filteredHistory = filteredHistory.filter(item => item.date <= endDate);
    }

    // 4. Amount Range Filter
    if (minAmount) {
      filteredHistory = filteredHistory.filter(item => {
        const amt = Number(item.amount || item.expense || 0);
        return amt >= Number(minAmount);
      });
    }
    if (maxAmount) {
      filteredHistory = filteredHistory.filter(item => {
        const amt = Number(item.amount || item.expense || 0);
        return amt <= Number(maxAmount);
      });
    }

    return filteredHistory;
  }, [state, selectedCategory, searchQuery, startDate, endDate, minAmount, maxAmount]);

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
        {/* Search and Filters */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text"
              placeholder="Search history..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all shadow-sm"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="w-full px-4 py-3 flex items-center justify-between text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center space-x-2">
                <Filter size={16} className="text-blue-500" />
                <span>Advanced Filters</span>
                {(startDate || endDate || minAmount || maxAmount) && (
                  <span className="w-2 h-2 bg-blue-500 rounded-full" />
                )}
              </div>
              {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-4 pb-4 space-y-4"
                >
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Start Date</label>
                      <input 
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full p-2 bg-slate-50 border border-slate-100 rounded-xl text-xs focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">End Date</label>
                      <input 
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full p-2 bg-slate-50 border border-slate-100 rounded-xl text-xs focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Min Amount</label>
                      <input 
                        type="number"
                        placeholder="₹ Min"
                        value={minAmount}
                        onChange={(e) => setMinAmount(e.target.value)}
                        className="w-full p-2 bg-slate-50 border border-slate-100 rounded-xl text-xs focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Max Amount</label>
                      <input 
                        type="number"
                        placeholder="₹ Max"
                        value={maxAmount}
                        onChange={(e) => setMaxAmount(e.target.value)}
                        className="w-full p-2 bg-slate-50 border border-slate-100 rounded-xl text-xs focus:outline-none"
                      />
                    </div>
                  </div>

                  <button 
                    onClick={() => {
                      setStartDate('');
                      setEndDate('');
                      setMinAmount('');
                      setMaxAmount('');
                    }}
                    className="w-full py-2 text-[10px] font-bold text-red-500 bg-red-50 rounded-xl hover:bg-red-100 transition-colors"
                  >
                    Reset Filters
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

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
