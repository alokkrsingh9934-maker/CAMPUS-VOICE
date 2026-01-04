
import React, { useState } from 'react';
import { Complaint, ComplaintCategory, UserRole, ComplaintStatus } from '../types';
import { 
  Settings, 
  Users, 
  Database, 
  ShieldAlert, 
  CheckCircle2, 
  AlertCircle,
  Activity,
  Cpu,
  Lock,
  Globe
} from 'lucide-react';

interface AdminViewProps {
  complaints: Complaint[];
}

const AdminView: React.FC<AdminViewProps> = ({ complaints }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'roles' | 'settings'>('overview');

  const getCategoryStats = (category: ComplaintCategory) => {
    const filtered = complaints.filter(c => c.category === category);
    return {
      total: filtered.length,
      pending: filtered.filter(c => c.status === ComplaintStatus.PENDING).length
    };
  };

  const systemModules = [
    { name: 'AI Reasoning Engine', status: 'Operational', icon: Cpu, color: 'text-green-500' },
    { name: 'Grievance Routing API', status: 'Operational', icon: Activity, color: 'text-green-500' },
    { name: 'User Authentication', status: 'Operational', icon: Lock, color: 'text-green-500' },
    { name: 'Notification Service', status: 'Operational', icon: Globe, color: 'text-green-500' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">System Administration</h1>
          <p className="text-slate-500">Root level control and institutional infrastructure management.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${activeTab === 'overview' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
          >
            <Database size={16} className="inline mr-2" /> Overview
          </button>
          <button 
            onClick={() => setActiveTab('roles')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${activeTab === 'roles' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
          >
            <Users size={16} className="inline mr-2" /> User Roles
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${activeTab === 'settings' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
          >
            <Settings size={16} className="inline mr-2" /> Settings
          </button>
        </div>
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.values(ComplaintCategory).map(cat => {
                const stats = getCategoryStats(cat);
                return (
                  <div key={cat} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex justify-between items-center">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{cat} Health</p>
                      <h4 className="text-xl font-bold text-slate-800">{stats.total} Total</h4>
                      <p className="text-xs text-amber-600 font-medium">{stats.pending} Pending Action</p>
                    </div>
                    <div className={`p-3 rounded-xl bg-slate-50`}>
                      <Activity size={20} className="text-slate-400" />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
                <ShieldAlert className="text-indigo-600" size={18} />
                <h3 className="font-bold text-slate-800">Critical System Modules</h3>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                {systemModules.map(mod => (
                  <div key={mod.name} className="flex items-center gap-4 p-4 rounded-xl border border-slate-100">
                    <div className="p-2 bg-slate-50 rounded-lg">
                      <mod.icon size={20} className={mod.color} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-700">{mod.name}</p>
                      <p className="text-[10px] font-medium text-green-600 uppercase tracking-tighter flex items-center gap-1">
                        <CheckCircle2 size={10} /> {mod.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-indigo-600 rounded-2xl p-6 text-white shadow-lg shadow-indigo-100">
              <h3 className="font-bold text-lg mb-2">Global System Info</h3>
              <div className="space-y-3 opacity-90">
                <div className="flex justify-between text-xs">
                  <span>Version</span>
                  <span className="font-mono">v4.2.0-stable</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Last AI Sync</span>
                  <span>{new Date().toLocaleTimeString()}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Database Load</span>
                  <span className="text-green-300">Normal (12%)</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-sm font-bold text-slate-800 mb-4">Institutional Summary</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">Active Roles</span>
                  <span className="text-xs font-bold text-slate-800">{Object.keys(UserRole).length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">Departments</span>
                  <span className="text-xs font-bold text-slate-800">7 Sub-Depts</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">Daily Traffic</span>
                  <span className="text-xs font-bold text-indigo-600">+12% vs yesterday</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'roles' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
            <h3 className="font-bold text-slate-800">Access Control & Permissions</h3>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                <th className="px-6 py-3">User Role</th>
                <th className="px-6 py-3">Access Level</th>
                <th className="px-6 py-3">Scope</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {Object.entries(UserRole).map(([key, value]) => (
                <tr key={key} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-bold text-slate-700">{value}</td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      value.includes('Admin') ? 'bg-red-100 text-red-700' :
                      value.includes('VC') ? 'bg-indigo-100 text-indigo-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {value.includes('Admin') ? 'Full Access' : value.includes('VC') ? 'Global Read' : 'Standard'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500 font-medium">
                    {value.includes('HOD') ? 'Department Specific' : 
                     value.includes('Incharge') ? 'Category Specific' : 'Global Institution'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-green-600 text-[10px] font-bold">
                      <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></div>
                      ACTIVE
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 max-w-2xl animate-in fade-in duration-500">
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Globe size={18} className="text-indigo-600" /> Institution Configuration
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-xl">
                  <div>
                    <p className="text-sm font-bold text-slate-700">Maintenance Mode</p>
                    <p className="text-xs text-slate-500">Suspend complaint submission globally.</p>
                  </div>
                  <div className="w-10 h-5 bg-slate-200 rounded-full relative cursor-pointer">
                    <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-xl">
                  <div>
                    <p className="text-sm font-bold text-slate-700">AI Auto-Summary Frequency</p>
                    <p className="text-xs text-slate-500">Set how often VC reports are refreshed.</p>
                  </div>
                  <select className="text-xs border-slate-200 rounded-lg">
                    <option>Every 6 hours</option>
                    <option selected>Daily</option>
                    <option>Weekly</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <ShieldAlert size={18} className="text-red-500" /> Dangerous Actions
              </h3>
              <button className="w-full py-3 bg-red-50 text-red-600 rounded-xl text-sm font-bold hover:bg-red-100 transition-colors border border-red-100">
                Purge Resolved Tickets History
              </button>
              <p className="mt-2 text-[10px] text-slate-400 text-center uppercase tracking-widest font-bold">
                Actions are logged and irreversible
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminView;
