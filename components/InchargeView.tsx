import React, { useState, useEffect } from 'react';
import { Complaint, ComplaintCategory, ComplaintStatus } from '../types';
import { CheckCircle, AlertCircle, MessageSquare, Info, Bell, BellRing, X, Filter, Timer, TrendingUp, TrendingDown, UserCircle, Image as ImageIcon } from 'lucide-react';

interface InchargeViewProps {
  roleName: string;
  category: ComplaintCategory;
  complaints: Complaint[];
  onUpdate: (id: string, status: ComplaintStatus, note: string) => void;
}

const TARGET_HOURS: Record<string, number> = {
  [ComplaintCategory.MESS]: 12,
  [ComplaintCategory.HOSTEL]: 24,
  [ComplaintCategory.FACULTY]: 48,
  [ComplaintCategory.FACILITIES]: 24,
  [ComplaintCategory.INFRASTRUCTURE]: 72,
};

const InchargeView: React.FC<InchargeViewProps> = ({ roleName, category, complaints, onUpdate }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [seenIds, setSeenIds] = useState<Set<string>>(new Set());
  const [showNotificationAlert, setShowNotificationAlert] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'All' | ComplaintStatus>('All');
  const [fullImage, setFullImage] = useState<string | null>(null);

  const unreadComplaints = complaints.filter(c => !seenIds.has(c.id));
  const pendingCount = complaints.filter(c => c.status === ComplaintStatus.PENDING).length;
  const resolvedCount = complaints.filter(c => c.status === ComplaintStatus.RESOLVED).length;

  const resolvedComplaints = complaints.filter(c => c.status === ComplaintStatus.RESOLVED && c.resolvedAt);
  
  const calculateAvgResolutionTime = () => {
    if (resolvedComplaints.length === 0) return 0;
    const totalMs = resolvedComplaints.reduce((acc, c) => {
      const start = new Date(c.timestamp).getTime();
      const end = new Date(c.resolvedAt!).getTime();
      return acc + (end - start);
    }, 0);
    return totalMs / resolvedComplaints.length / 3600000; // in hours
  };

  const avgTime = calculateAvgResolutionTime();
  const targetTime = TARGET_HOURS[category] || 24;
  const isMeetingTarget = avgTime <= targetTime;

  const filteredComplaints = complaints.filter(c => 
    statusFilter === 'All' ? true : c.status === statusFilter
  );

  useEffect(() => {
    if (unreadComplaints.length > 0) {
      setShowNotificationAlert(true);
      const timer = setTimeout(() => setShowNotificationAlert(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [complaints.length]);

  const handleResolve = (id: string) => {
    if (!note.trim()) return alert('Please provide a resolution note.');
    onUpdate(id, ComplaintStatus.RESOLVED, note);
    setSelectedId(null);
    setNote('');
    markAsSeen(id);
  };

  const markAsSeen = (id: string) => {
    setSeenIds(prev => new Set([...prev, id]));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Full Image Modal */}
      {fullImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 animate-in fade-in duration-200" onClick={() => setFullImage(null)}>
          <div className="relative max-w-4xl w-full">
            <img src={fullImage} className="w-full h-auto rounded-xl shadow-2xl" alt="Full view" />
            <button className="absolute top-[-40px] right-0 text-white hover:text-red-400 font-black uppercase text-xs tracking-widest flex items-center gap-2">
              <X size={20} /> Close
            </button>
          </div>
        </div>
      )}

      {showNotificationAlert && unreadComplaints.length > 0 && (
        <div className="bg-blue-600 text-white px-6 py-4 rounded-2xl shadow-lg flex items-center justify-between animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <BellRing size={20} className="animate-bounce" />
            </div>
            <div>
              <p className="font-bold text-sm">Action Required</p>
              <p className="text-xs text-blue-100">You have {unreadComplaints.length} new assignments in your queue.</p>
            </div>
          </div>
          <button onClick={() => setShowNotificationAlert(false)}>
            <X size={20} className="text-blue-200 hover:text-white" />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div onClick={() => setStatusFilter('All')} className={`cursor-pointer p-5 rounded-2xl border shadow-sm transition-all ${statusFilter === 'All' ? 'bg-blue-50 border-blue-200 ring-2 ring-blue-100' : 'bg-white border-slate-200 hover:border-blue-100'}`}>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Active</p>
          <h4 className="text-2xl font-black text-slate-800 mt-1">{complaints.length}</h4>
        </div>
        <div onClick={() => setStatusFilter(ComplaintStatus.PENDING)} className={`cursor-pointer p-5 rounded-2xl border shadow-sm transition-all ${statusFilter === ComplaintStatus.PENDING ? 'bg-amber-50 border-amber-200 ring-2 ring-amber-100' : 'bg-white border-slate-200 hover:border-amber-100'}`}>
          <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Awaiting Action</p>
          <h4 className="text-2xl font-black text-amber-700 mt-1">{pendingCount}</h4>
        </div>
        <div onClick={() => setStatusFilter(ComplaintStatus.RESOLVED)} className={`cursor-pointer p-5 rounded-2xl border shadow-sm transition-all ${statusFilter === ComplaintStatus.RESOLVED ? 'bg-green-50 border-green-200 ring-2 ring-green-100' : 'bg-white border-slate-200 hover:border-green-100'}`}>
          <p className="text-[10px] font-black text-green-500 uppercase tracking-widest">Resolved</p>
          <h4 className="text-2xl font-black text-green-700 mt-1">{resolvedCount}</h4>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Avg. Response</p>
          <div className="flex items-baseline gap-1 mt-1">
            <h4 className={`text-2xl font-black ${isMeetingTarget ? 'text-green-700' : 'text-red-700'}`}>{avgTime.toFixed(1)}h</h4>
            <span className="text-[10px] font-bold text-slate-400">/ {targetTime}h target</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h3 className="font-bold text-slate-800">{roleName} Portfolio</h3>
          </div>
          
          <div className="flex bg-slate-200/50 p-1 rounded-xl">
            {['All', ComplaintStatus.PENDING, ComplaintStatus.RESOLVED].map(tab => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab as any)}
                className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${statusFilter === tab ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredComplaints.length === 0 ? (
            <div className="p-20 text-center">
              <Filter size={24} className="text-slate-300 mx-auto mb-4" />
              <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">No matching grievances in records</p>
            </div>
          ) : (
            filteredComplaints.map(c => {
              const isUnread = !seenIds.has(c.id);
              return (
                <div 
                  key={c.id} 
                  className={`p-6 transition-all duration-300 border-l-4 ${isUnread ? 'bg-blue-50/30 border-blue-600' : 'bg-white border-transparent'}`}
                  onMouseEnter={() => isUnread && markAsSeen(c.id)}
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1 space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-black text-slate-900 text-lg tracking-tight">{c.subject}</h4>
                        <span className={`text-[10px] px-2.5 py-1 rounded-lg uppercase font-black tracking-widest border ${
                          c.status === ComplaintStatus.PENDING ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-green-50 text-green-700 border-green-200'
                        }`}>
                          {c.status}
                        </span>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-4">
                        <p className="flex-1 text-sm text-slate-600 leading-relaxed font-medium bg-slate-50/50 p-4 rounded-xl italic">
                          "{c.description}"
                        </p>
                        {c.imageUrl && (
                          <div 
                            className="w-24 h-24 rounded-lg overflow-hidden border border-slate-200 cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all flex-shrink-0 relative group"
                            onClick={() => setFullImage(c.imageUrl!)}
                          >
                            <img src={c.imageUrl} alt="evidence" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <ImageIcon size={14} className="text-white" />
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <span className="flex items-center gap-1.5"><UserCircle size={14} /> {c.studentName} ({c.studentId})</span>
                        <span className="flex items-center gap-1.5"><Timer size={14} /> Logged {new Date(c.timestamp).toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="flex-shrink-0 self-center">
                      {c.status === ComplaintStatus.PENDING ? (
                        selectedId === c.id ? (
                          <div className="flex flex-col gap-3 w-full md:w-80 animate-in fade-in zoom-in-95 duration-200 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                            <textarea 
                              className="text-xs font-medium text-slate-900 p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none min-h-[100px]"
                              placeholder="Describe actions taken to resolve this..."
                              value={note}
                              onChange={(e) => setNote(e.target.value)}
                            />
                            <div className="flex gap-2">
                              <button 
                                onClick={() => handleResolve(c.id)}
                                className="flex-1 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest py-3 rounded-xl hover:bg-black transition-all shadow-lg"
                              >
                                Finalize & Resolve
                              </button>
                              <button onClick={() => setSelectedId(null)} className="px-4 text-slate-400 hover:text-slate-600">
                                <X size={20} />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button 
                            onClick={() => setSelectedId(c.id)}
                            className="bg-blue-600 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 flex items-center gap-2 shadow-xl shadow-blue-100 transition-all hover:scale-105 active:scale-95"
                          >
                            <CheckCircle size={16} /> Process Grievance
                          </button>
                        )
                      ) : (
                        <div className="bg-green-50 p-4 rounded-2xl border border-green-100 max-w-xs">
                          <p className="text-[10px] font-black text-green-700 mb-1 uppercase tracking-widest">Closed with Note</p>
                          <p className="text-xs text-green-900 font-bold leading-snug">"{c.resolutionNote}"</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default InchargeView;