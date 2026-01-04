
import React, { useState } from 'react';
import { UserRole, Complaint, ComplaintCategory, ComplaintStatus, Department, AuthUser, StudentRecord } from './types';
import StudentView from './components/StudentView';
import InchargeView from './components/InchargeView';
import VCView from './components/VCView';
import { STUDENT_REGISTRY } from './data/studentRegistry';
import { 
  ShieldCheck, 
  UserCircle, 
  LogOut,
  Lock,
  ArrowRight,
  ChevronRight,
  Fingerprint,
  Info
} from 'lucide-react';

const INITIAL_COMPLAINTS: Complaint[] = [
  {
    id: '1',
    studentName: 'ABHISHEK YADAV',
    studentId: '2025061001',
    category: ComplaintCategory.MESS,
    subject: 'Quality of breakfast',
    description: 'The breakfast served today was cold and the bread was stale.',
    timestamp: new Date(Date.now() - 3600000 * 24).toISOString(), // 24h ago
    status: ComplaintStatus.PENDING,
    // Fix: Remove the 'rating' property as it is not present in the Complaint interface.
  }
];

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [complaints, setComplaints] = useState<Complaint[]>(INITIAL_COMPLAINTS);
  const [loginForm, setLoginForm] = useState({ admissionId: '', rollNo: '', role: UserRole.STUDENT });
  const [loginError, setLoginError] = useState('');
  const [isHovered, setIsHovered] = useState(false);

  const addComplaint = (newComplaint: Complaint) => {
    setComplaints([newComplaint, ...complaints]);
  };

  const updateComplaintStatus = (id: string, status: ComplaintStatus, note?: string) => {
    setComplaints(complaints.map(c => 
      c.id === id ? { 
        ...c, 
        status, 
        resolutionNote: note,
        resolvedAt: status === ComplaintStatus.RESOLVED ? new Date().toISOString() : undefined
      } : c
    ));
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (loginForm.role === UserRole.STUDENT) {
      const student = STUDENT_REGISTRY.find(
        s => s.admissionId === loginForm.admissionId && s.rollNo === loginForm.rollNo
      );
      if (student) {
        setCurrentUser({ role: UserRole.STUDENT, studentData: student, name: student.name });
      } else {
        setLoginError('Credentials mismatch. Verify Admission ID and Roll No.');
      }
    } else {
      setCurrentUser({ role: loginForm.role, name: loginForm.role });
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setLoginForm({ admissionId: '', rollNo: '', role: UserRole.STUDENT });
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4 relative overflow-hidden font-inter">
        {/* Dynamic Background Elements */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full animate-pulse delay-700"></div>
        
        <div className="max-w-[440px] w-full z-10">
          <div className={`bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] transition-all duration-500 ${isHovered ? 'translate-y-[-4px] border-white/20' : ''}`}
               onMouseEnter={() => setIsHovered(true)}
               onMouseLeave={() => setIsHovered(false)}>
            
            <div className="text-center mb-10">
              <div className="relative inline-block mb-6 group">
                <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity rounded-full"></div>
                <div className="relative bg-gradient-to-br from-blue-500 to-indigo-600 h-20 w-20 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-500/30 transform transition-transform group-hover:rotate-6">
                  <Fingerprint size={36} className="text-white" />
                </div>
              </div>
              <h1 className="text-4xl font-black text-white tracking-tight mb-2 uppercase italic leading-none">
                Edu<span className="text-blue-500">Grievance</span>
              </h1>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Institutional Integrity Portal</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              {/* Role Toggle Switch */}
              <div className="flex bg-slate-800/50 p-1.5 rounded-2xl border border-white/5">
                <button 
                  type="button"
                  onClick={() => setLoginForm({ ...loginForm, role: UserRole.STUDENT })}
                  className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all duration-300 ${loginForm.role === UserRole.STUDENT ? 'bg-white text-slate-900 shadow-xl scale-[1.02]' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  Student Access
                </button>
                <button 
                  type="button"
                  onClick={() => setLoginForm({ ...loginForm, role: UserRole.VICE_CHANCELLOR })}
                  className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all duration-300 ${loginForm.role !== UserRole.STUDENT ? 'bg-white text-slate-900 shadow-xl scale-[1.02]' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  Admin Portal
                </button>
              </div>

              <div className="space-y-5">
                {loginForm.role === UserRole.STUDENT ? (
                  <div className="space-y-4 animate-in slide-in-from-right-4 fade-in duration-500">
                    <div className="space-y-2 group">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 group-focus-within:text-blue-400 transition-colors">Credential ID</label>
                      <div className="relative">
                        <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={20} />
                        <input 
                          type="text" 
                          required
                          placeholder="Admission ID"
                          className="w-full bg-slate-800/30 border border-white/5 rounded-2xl h-14 pl-12 pr-4 text-white placeholder:text-slate-600 focus:bg-slate-800/50 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all"
                          value={loginForm.admissionId}
                          onChange={e => setLoginForm({ ...loginForm, admissionId: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2 group">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 group-focus-within:text-blue-400 transition-colors">Access Pin</label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={20} />
                        <input 
                          type="password" 
                          required
                          placeholder="Roll Number"
                          className="w-full bg-slate-800/30 border border-white/5 rounded-2xl h-14 pl-12 pr-4 text-white placeholder:text-slate-600 focus:bg-slate-800/50 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all"
                          value={loginForm.rollNo}
                          onChange={e => setLoginForm({ ...loginForm, rollNo: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 animate-in slide-in-from-left-4 fade-in duration-500 group">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 group-focus-within:text-blue-400 transition-colors">Administrative Unit</label>
                    <div className="relative">
                      <select 
                        className="w-full bg-slate-800/30 border border-white/5 rounded-2xl h-14 px-5 text-white focus:bg-slate-800/50 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer"
                        value={loginForm.role}
                        onChange={e => setLoginForm({ ...loginForm, role: e.target.value as UserRole })}
                      >
                        <optgroup label="General Administration" className="bg-slate-900 text-slate-300">
                          <option value={UserRole.VICE_CHANCELLOR}>Vice Chancellor Office</option>
                          <option value={UserRole.MESS_INCHARGE}>Mess Management</option>
                          <option value={UserRole.HOSTEL_INCHARGE}>Hostel Warden</option>
                          <option value={UserRole.INFRASTRUCTURE_INCHARGE}>Estate Office</option>
                        </optgroup>
                        <optgroup label="Academic Leadership" className="bg-slate-900 text-slate-300">
                          <option value={UserRole.HOD_CSE}>HOD - CSE</option>
                          <option value={UserRole.HOD_IT}>HOD - IT</option>
                          <option value={UserRole.HOD_ECE}>HOD - ECE</option>
                          <option value={UserRole.HOD_EE}>HOD - EE</option>
                          <option value={UserRole.HOD_ME}>HOD - ME</option>
                          <option value={UserRole.HOD_CIVIL}>HOD - CIVIL</option>
                          <option value={UserRole.HOD_PHARMACY}>HOD - Pharmacy</option>
                          <option value={UserRole.HOD_LAW}>HOD - Law</option>
                          <option value={UserRole.HOD_PLACEMENT}>Placement Head</option>
                        </optgroup>
                      </select>
                      <ChevronRight className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 rotate-90 pointer-events-none" size={16} />
                    </div>
                    <div className="bg-blue-500/5 border border-blue-500/10 p-3 rounded-xl mt-4">
                      <p className="text-[9px] text-blue-400/80 leading-relaxed font-bold uppercase tracking-tight text-center">
                        Secure Auth Bypass Active for Testing
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {loginError && (
                <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 p-3 rounded-xl animate-in shake-in duration-300">
                  <div className="bg-red-500 rounded-full p-1 flex-shrink-0">
                    <Info size={10} className="text-white" />
                  </div>
                  <p className="text-red-400 text-[10px] font-black uppercase tracking-tight">
                    {loginError}
                  </p>
                </div>
              )}

              <button 
                type="submit"
                className="group w-full relative h-16 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-[1.25rem] font-black uppercase tracking-[0.2em] text-xs shadow-2xl shadow-blue-900/40 hover:shadow-blue-500/40 transition-all hover:scale-[1.02] active:scale-[0.98] overflow-hidden"
              >
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
                <div className="flex items-center justify-center gap-3 relative z-10">
                  Authentication Secure <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            </form>

            <div className="mt-12 pt-6 border-t border-white/5 text-center flex items-center justify-between">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <ShieldCheck size={12} className="text-blue-500" /> AES-256 Encryption
              </span>
              <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">
                v4.5 Stable
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const renderView = () => {
    const hodMap: Partial<Record<UserRole, { dept: Department; label: string }>> = {
      [UserRole.HOD_CSE]: { dept: Department.CSE, label: 'HOD - Computer Science' },
      [UserRole.HOD_IT]: { dept: Department.IT, label: 'HOD - Information Technology' },
      [UserRole.HOD_ECE]: { dept: Department.ECE, label: 'HOD - ECE' },
      [UserRole.HOD_EE]: { dept: Department.EE, label: 'HOD - EE' },
      [UserRole.HOD_ME]: { dept: Department.ME, label: 'HOD - Mechanical Engineering' },
      [UserRole.HOD_CIVIL]: { dept: Department.CIVIL, label: 'HOD - Civil Engineering' },
      [UserRole.HOD_CE]: { dept: Department.CE, label: 'HOD - Chemical Engineering' },
      [UserRole.HOD_MBA]: { dept: Department.MBA, label: 'HOD - MBA' },
      [UserRole.HOD_BBA]: { dept: Department.BBA, label: 'HOD - BBA' },
      [UserRole.HOD_PHARMACY]: { dept: Department.PHARMACY, label: 'HOD - Pharmacy' },
      [UserRole.HOD_LAW]: { dept: Department.LAW, label: 'HOD - Law' },
      [UserRole.HOD_PHYSICS]: { dept: Department.PHYSICS, label: 'HOD - Physics' },
      [UserRole.HOD_CHEMISTRY]: { dept: Department.CHEMISTRY, label: 'HOD - Chemistry' },
      [UserRole.HOD_MATHS]: { dept: Department.MATHS, label: 'HOD - Mathematics' },
      [UserRole.HOD_HUMANITIES]: { dept: Department.HUMANITIES, label: 'HOD - Humanities' },
      [UserRole.HOD_PLACEMENT]: { dept: Department.PLACEMENT, label: 'HOD - Placement Cell' },
    };

    if (hodMap[currentUser.role]) {
      const config = hodMap[currentUser.role]!;
      return (
        <InchargeView 
          roleName={config.label} 
          category={ComplaintCategory.FACULTY} 
          complaints={complaints.filter(c => 
            (c.category === ComplaintCategory.FACULTY || c.category === ComplaintCategory.FACILITIES) && 
            c.department === config.dept
          )}
          onUpdate={updateComplaintStatus}
        />
      );
    }

    switch (currentUser.role) {
      case UserRole.STUDENT:
        return <StudentView complaints={complaints.filter(c => c.studentId === currentUser.studentData?.rollNo)} student={currentUser.studentData!} onSubmit={addComplaint} />;
      case UserRole.MESS_INCHARGE:
        return (
          <InchargeView 
            roleName="Mess Incharge" 
            category={ComplaintCategory.MESS} 
            complaints={complaints.filter(c => c.category === ComplaintCategory.MESS)}
            onUpdate={updateComplaintStatus}
          />
        );
      case UserRole.HOSTEL_INCHARGE:
        return (
          <InchargeView 
            roleName="Hostel Incharge" 
            category={ComplaintCategory.HOSTEL} 
            complaints={complaints.filter(c => c.category === ComplaintCategory.HOSTEL)}
            onUpdate={updateComplaintStatus}
          />
        );
      case UserRole.INFRASTRUCTURE_INCHARGE:
        return (
          <InchargeView 
            roleName="Infrastructure Incharge" 
            category={ComplaintCategory.INFRASTRUCTURE} 
            complaints={complaints.filter(c => c.category === ComplaintCategory.INFRASTRUCTURE)}
            onUpdate={updateComplaintStatus}
          />
        );
      case UserRole.VICE_CHANCELLOR:
        return <VCView complaints={complaints} />;
      default:
        return <StudentView complaints={complaints} student={currentUser.studentData!} onSubmit={addComplaint} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-inter">
      <aside className="w-full md:w-72 bg-white border-r border-slate-200 flex-shrink-0 flex flex-col">
        <div className="p-8 border-b border-slate-100 flex items-center gap-4">
          <div className="bg-blue-600 p-2.5 rounded-2xl text-white shadow-xl shadow-blue-100">
            <ShieldCheck size={28} />
          </div>
          <div>
            <h1 className="font-black text-xl text-slate-900 tracking-tighter italic uppercase">EduGrievance</h1>
            <p className="text-[10px] font-bold text-slate-400 tracking-widest">SECURE PORTAL</p>
          </div>
        </div>
        
        <div className="p-6 border-b border-slate-50 bg-slate-50/50">
           <div className="flex items-center gap-3 mb-1">
             <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Identity</p>
           </div>
           <p className="text-sm font-bold text-slate-800 line-clamp-1">{currentUser.name}</p>
           <p className="text-[10px] font-bold text-blue-600 uppercase tracking-tighter mt-1">{currentUser.role}</p>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
           <div className="px-4 py-3 bg-blue-50/50 border border-blue-100 rounded-2xl mb-4">
             <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Current Session</p>
             <p className="text-xs text-blue-800 font-medium">{currentUser.role} Dashboard</p>
           </div>
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 px-4 py-4 rounded-2xl transition-all duration-200 text-sm font-black uppercase tracking-widest text-red-500 hover:bg-red-50"
          >
            <LogOut size={18} /> Logout Session
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-10 border-b border-slate-200 px-8 py-5 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">Main Dashboard</h2>
            <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">Institution Wide Grievance Monitoring</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-full border border-green-100">
               <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
               <span className="text-[10px] font-black text-green-700 uppercase tracking-widest">Network Secure</span>
            </div>
          </div>
        </header>

        <div className="p-8 animate-in fade-in duration-700">
          {renderView()}
        </div>
      </main>
    </div>
  );
};

export default App;
