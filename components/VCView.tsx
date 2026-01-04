import React, { useState, useEffect } from 'react';
import { Complaint, ComplaintStatus, ComplaintCategory, AISummary } from '../types';
import { getVCExecutiveSummary } from '../services/gemini';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { Sparkles, TrendingUp, AlertTriangle, RefreshCcw, FileText, ListChecks } from 'lucide-react';

interface VCViewProps {
  complaints: Complaint[];
}

const CATEGORY_COLORS: Record<string, string> = {
  [ComplaintCategory.MESS]: '#f97316', 
  [ComplaintCategory.HOSTEL]: '#6366f1', 
  [ComplaintCategory.FACULTY]: '#a855f7', 
  [ComplaintCategory.FACILITIES]: '#0ea5e9', 
  [ComplaintCategory.INFRASTRUCTURE]: '#10b981', 
};

const VCView: React.FC<VCViewProps> = ({ complaints }) => {
  const [summaryData, setSummaryData] = useState<AISummary | null>(null);
  const [loading, setLoading] = useState(false);

  const statsByCategory = Object.values(ComplaintCategory).map(cat => ({
    name: cat,
    total: complaints.filter(c => c.category === cat).length,
    pending: complaints.filter(c => c.category === cat && c.status === ComplaintStatus.PENDING).length
  }));

  const fetchSummary = async () => {
    setLoading(true);
    const data = await getVCExecutiveSummary(complaints);
    setSummaryData(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchSummary();
  }, [complaints.length]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 50) return 'text-amber-500';
    return 'text-red-600';
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Executive Dashboard</h1>
          <p className="text-slate-500 text-sm">Category health and concise AI insights.</p>
        </div>
        <button 
          onClick={fetchSummary}
          disabled={loading}
          className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-700 transition-all disabled:opacity-50 shadow-lg shadow-indigo-100"
        >
          {loading ? <RefreshCcw className="animate-spin" size={14} /> : <Sparkles size={14} />}
          {loading ? 'Analyzing...' : 'Refresh AI Summary'}
        </button>
      </div>

      {/* Sentiment Scorecard Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {summaryData?.categoryScores.map((item) => (
          <div key={item.name} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{item.name}</p>
            <div className="relative h-16 w-16 flex items-center justify-center">
              <svg className="absolute inset-0 h-16 w-16 -rotate-90">
                <circle cx="32" cy="32" r="28" fill="transparent" stroke="#f1f5f9" strokeWidth="6" />
                <circle 
                  cx="32" cy="32" r="28" fill="transparent" 
                  stroke={CATEGORY_COLORS[item.name as ComplaintCategory] || '#94a3b8'} 
                  strokeWidth="6" 
                  strokeDasharray={175.9} 
                  strokeDashoffset={175.9 - (175.9 * item.score) / 100}
                  strokeLinecap="round"
                />
              </svg>
              <span className={`text-lg font-black ${getScoreColor(item.score)}`}>{item.score}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Main Chart Section */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
            <TrendingUp size={14} className="text-blue-500" /> Volume by Category
          </h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statsByCategory}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '10px' }}
                  cursor={{ fill: '#f8fafc' }}
                />
                <Bar dataKey="total" radius={[4, 4, 0, 0]} name="Complaints">
                  {statsByCategory.map((entry, index) => (
                    <Cell key={`cell-total-${index}`} fill={CATEGORY_COLORS[entry.name as ComplaintCategory] || '#94a3b8'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Small AI Summary Section */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2">
              <FileText className="text-indigo-600" size={16} />
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">AI Executive Brief</h3>
            </div>
          </div>
          <div className="p-6 flex-1">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-full space-y-3">
                <div className="w-8 h-8 border-3 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Distilling data...</p>
              </div>
            ) : (
              <div className="text-sm text-slate-600 leading-relaxed font-medium italic">
                {summaryData?.report ? (
                  <div 
                    dangerouslySetInnerHTML={{ __html: summaryData.report.replace(/\n/g, '<br/>') }} 
                  />
                ) : (
                  <p className="text-slate-300 text-center py-8">Generate a brief to see insights.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Critical Items Footer Section */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
          <AlertTriangle size={14} className="text-amber-500" /> Immediate Attention Required
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {complaints.filter(c => c.status === ComplaintStatus.PENDING).slice(0, 3).length > 0 ? (
            complaints.filter(c => c.status === ComplaintStatus.PENDING).slice(0, 3).map(c => (
              <div key={c.id} className="p-4 bg-slate-50 border border-slate-100 rounded-xl hover:border-blue-200 transition-colors">
                <div className="flex justify-between items-start mb-1">
                  <p className="text-[10px] font-black text-indigo-600 uppercase tracking-tighter">{c.category}</p>
                  <span className="text-[9px] font-bold text-slate-400">ID: #{c.id}</span>
                </div>
                <p className="text-xs font-bold text-slate-800 line-clamp-1">{c.subject}</p>
                <p className="text-[10px] text-slate-500 font-medium mt-1 truncate">{c.description}</p>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-4 bg-green-50 rounded-xl border border-green-100">
               <p className="text-xs font-bold text-green-700">Zero Pending Critical Issues</p>
            </div>
          )}
        </div>
        {complaints.filter(c => c.status === ComplaintStatus.PENDING).length > 3 && (
          <div className="mt-4 flex justify-center">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <ListChecks size={12} /> + {complaints.filter(c => c.status === ComplaintStatus.PENDING).length - 3} more awaiting action
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default VCView;