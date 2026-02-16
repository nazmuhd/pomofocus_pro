
import React, { useMemo, useState } from 'react';
import { FocusSession, ReportData } from '../types';
import { X, Calendar, Flame, Timer as TimerIcon, BarChart3, Download, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface ReportsModalProps {
  sessions: FocusSession[];
  onClose: () => void;
}

const ReportsModal: React.FC<ReportsModalProps> = ({ sessions, onClose }) => {
  const [view, setView] = useState<'weekly' | 'monthly'>('weekly');

  const chartData = useMemo(() => {
    const dailyMap: Record<string, number> = {};
    const count = view === 'weekly' ? 7 : 30;
    
    const labels = Array.from({ length: count }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString([], view === 'weekly' ? { weekday: 'short' } : { day: 'numeric', month: 'short' });
      return dateStr;
    }).reverse();

    sessions.forEach(s => {
      const dateStr = new Date(s.timestamp).toLocaleDateString([], view === 'weekly' ? { weekday: 'short' } : { day: 'numeric', month: 'short' });
      dailyMap[dateStr] = (dailyMap[dateStr] || 0) + s.duration;
    });

    return labels.map(label => ({
      date: label,
      minutes: dailyMap[label] || 0
    }));
  }, [sessions, view]);

  const stats = useMemo(() => {
    const totalMinutes = sessions.reduce((acc, s) => acc + s.duration, 0);
    const totalInterruptions = sessions.reduce((acc, s) => acc + (s.interruptions || 0), 0);
    
    return {
      totalHours: (totalMinutes / 60).toFixed(1),
      focusCount: sessions.length,
      totalInterruptions,
      avgInterruptions: sessions.length ? (totalInterruptions / sessions.length).toFixed(1) : 0
    };
  }, [sessions]);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[2.5rem] w-full max-w-2xl overflow-hidden flex flex-col shadow-2xl animate-in fade-in slide-in-from-bottom-10">
        <div className="px-8 py-6 flex justify-between items-center border-b border-gray-100">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-6 h-6 text-gray-800" />
            <h2 className="text-2xl font-black text-gray-800">Focus Insights</h2>
          </div>
          <button onClick={onClose} className="p-2.5 hover:bg-gray-50 rounded-xl transition-colors"><X className="w-5 h-5 text-gray-400" /></button>
        </div>

        <div className="p-8 flex flex-col gap-8 overflow-y-auto max-h-[80vh] scrollbar-hide">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100 flex flex-col">
              <span className="text-2xl font-black text-blue-900">{stats.totalHours}</span>
              <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Total Hours</span>
            </div>
            <div className="bg-orange-50/50 p-4 rounded-2xl border border-orange-100 flex flex-col">
              <span className="text-2xl font-black text-orange-900">{stats.focusCount}</span>
              <span className="text-[9px] font-black text-orange-400 uppercase tracking-widest">Sessions</span>
            </div>
            <div className="bg-red-50/50 p-4 rounded-2xl border border-red-100 flex flex-col">
              <span className="text-2xl font-black text-red-900">{stats.totalInterruptions}</span>
              <span className="text-[9px] font-black text-red-400 uppercase tracking-widest">Interruptions</span>
            </div>
            <div className="bg-teal-50/50 p-4 rounded-2xl border border-teal-100 flex flex-col">
              <span className="text-2xl font-black text-teal-900">{stats.avgInterruptions}</span>
              <span className="text-[9px] font-black text-teal-400 uppercase tracking-widest">Avg Distract</span>
            </div>
          </div>

          <div className="bg-gray-50 p-6 sm:p-8 rounded-[2rem] border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-black text-gray-800 flex items-center gap-2">Focus Activity</h3>
              <div className="flex bg-white rounded-xl p-1 shadow-sm border border-gray-200">
                <button onClick={() => setView('weekly')} className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all ${view === 'weekly' ? 'bg-gray-800 text-white' : 'text-gray-400'}`}>Weekly</button>
                <button onClick={() => setView('monthly')} className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all ${view === 'monthly' ? 'bg-gray-800 text-white' : 'text-gray-400'}`}>Monthly</button>
              </div>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 10, fontWeight: 800}} />
                  <Tooltip cursor={{fill: 'rgba(0,0,0,0.03)'}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', fontWeight: 'bold'}} />
                  <Bar dataKey="minutes" radius={[6, 6, 6, 6]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.minutes > 0 ? '#1f2937' : '#e5e7eb'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsModal;
