import React, { useState, useRef } from 'react';
import { Complaint, ComplaintCategory, ComplaintStatus, Department, StudentRecord } from '../types';
import { Send, Clock, CheckCircle2, Plus, User, ImagePlus, X, Image as ImageIcon, Camera } from 'lucide-react';

interface StudentViewProps {
  complaints: Complaint[];
  student: StudentRecord;
  onSubmit: (complaint: Complaint) => void;
}

const StudentView: React.FC<StudentViewProps> = ({ complaints, student, onSubmit }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    category: ComplaintCategory.MESS,
    department: Department.GENERAL,
    subject: '',
    description: '',
    imageUrl: ''
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const requiresDepartment = formData.category === ComplaintCategory.FACULTY || formData.category === ComplaintCategory.FACILITIES;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File is too large. Please select an image under 5MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, imageUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData({ ...formData, imageUrl: '' });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newComplaint: Complaint = {
      id: Math.random().toString(36).substr(2, 9),
      studentName: student.name,
      studentId: student.rollNo,
      category: formData.category,
      department: requiresDepartment ? formData.department : Department.GENERAL,
      subject: formData.subject,
      description: formData.description,
      timestamp: new Date().toISOString(),
      status: ComplaintStatus.PENDING,
      imageUrl: formData.imageUrl
    };
    onSubmit(newComplaint);
    setFormData({ category: ComplaintCategory.MESS, department: Department.GENERAL, subject: '', description: '', imageUrl: '' });
    setIsFormOpen(false);
  };

  const getCategoryColor = (category: ComplaintCategory) => {
    switch (category) {
      case ComplaintCategory.MESS: return 'bg-orange-100 text-orange-700';
      case ComplaintCategory.HOSTEL: return 'bg-indigo-100 text-indigo-700';
      case ComplaintCategory.FACULTY: return 'bg-purple-100 text-purple-700';
      case ComplaintCategory.FACILITIES: return 'bg-blue-100 text-blue-700';
      case ComplaintCategory.INFRASTRUCTURE: return 'bg-emerald-100 text-emerald-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
            <User size={24} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">{student.name}</h2>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <p className="text-xs text-slate-500 font-medium uppercase tracking-widest">
                Roll No: {student.rollNo} • Section: {student.section}
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button 
            onClick={() => setIsFormOpen(true)}
            className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-100 transition-all hover:scale-105 active:scale-95 font-bold text-sm"
          >
            <Plus size={18} />
            Lodge New Complaint
          </button>
        </div>
      </div>

      {isFormOpen && (
        <div className="bg-white rounded-2xl p-8 shadow-2xl border border-slate-200 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-slate-800">Formal Grievance Form</h3>
            <button onClick={() => setIsFormOpen(false)} className="text-slate-400 hover:text-slate-600">
              <X size={24} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className={`grid grid-cols-1 ${requiresDepartment ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-6 transition-all duration-300`}>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Issue Category</label>
                <select 
                  className="w-full rounded-xl border-slate-200 text-sm text-slate-900 focus:ring-blue-500 focus:border-blue-500 h-11 px-4 bg-slate-50"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value as ComplaintCategory})}
                >
                  {Object.values(ComplaintCategory).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {requiresDepartment && (
                <div className="animate-in fade-in zoom-in-95 duration-200">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Department</label>
                  <select 
                    className="w-full rounded-xl border-slate-200 text-sm text-slate-900 focus:ring-blue-500 focus:border-blue-500 h-11 px-4 bg-slate-50"
                    value={formData.department}
                    onChange={(e) => setFormData({...formData, department: e.target.value as Department})}
                  >
                    {Object.values(Department).filter(d => d !== Department.GENERAL).map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className={requiresDepartment ? "" : "md:col-span-1"}>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Subject</label>
                <input 
                  type="text" 
                  required
                  className="w-full rounded-xl border-slate-200 text-sm text-slate-900 focus:ring-blue-500 focus:border-blue-500 h-11 px-4 bg-slate-50"
                  placeholder="e.g., Water leakage in Room 204"
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Description</label>
              <textarea 
                required
                className="w-full rounded-xl border-slate-200 text-sm text-slate-900 focus:ring-blue-500 focus:border-blue-500 min-h-[120px] p-4 bg-slate-50"
                placeholder="Provide specific details about the problem..."
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>

            <div className="space-y-3">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Photo Evidence</label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                {!formData.imageUrl ? (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full sm:w-48 h-32 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-blue-400 hover:bg-blue-50 transition-all text-slate-400 hover:text-blue-600 group"
                  >
                    <div className="bg-slate-50 p-3 rounded-full group-hover:bg-blue-100 transition-colors">
                      <Camera size={24} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest">Attach Proof</span>
                  </button>
                ) : (
                  <div className="relative w-full sm:w-48 h-32 rounded-xl overflow-hidden border-2 border-blue-100 shadow-md">
                    <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-lg shadow-lg hover:bg-red-600 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />
                <div className="flex-1">
                  <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                    Capture or upload a clear photo of the issue. Visual proof helps authorities resolve complaints faster.
                  </p>
                  <p className="text-[9px] text-slate-400 mt-1 uppercase font-bold">Formats: JPG, PNG • Max: 5MB</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-6 border-t border-slate-100">
              <button 
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-6 py-2.5 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-widest"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="bg-blue-600 text-white px-10 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 flex items-center gap-2 shadow-xl shadow-blue-100 transition-all hover:translate-y-[-1px]"
              >
                <Send size={14} />
                Submit Complaint
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {complaints.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <ImageIcon size={48} className="text-slate-100 mx-auto mb-4" />
            <p className="text-slate-400 font-medium italic">Your complaint history is currently empty.</p>
          </div>
        ) : (
          complaints.map((c) => (
            <div key={c.id} className="bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-lg hover:border-blue-200 transition-all group">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${getCategoryColor(c.category)}`}>
                      {c.category}
                    </span>
                    {c.department && c.department !== Department.GENERAL && (
                      <span className="text-[10px] font-black text-slate-500 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg uppercase tracking-widest">
                        {c.department}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{c.subject}</h3>
                </div>
                <div className="flex-shrink-0">
                  <span className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full border ${
                    c.status === ComplaintStatus.RESOLVED 
                      ? 'bg-green-50 text-green-700 border-green-200' 
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}>
                    {c.status === ComplaintStatus.RESOLVED ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                    {c.status}
                  </span>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-6 mb-6">
                <div className="flex-1">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <p className="text-sm text-slate-600 leading-relaxed font-medium">
                      {c.description}
                    </p>
                  </div>
                </div>
                {c.imageUrl && (
                  <div className="flex-shrink-0 w-full md:w-32 h-32 rounded-xl overflow-hidden border border-slate-200 relative group/img">
                    <img src={c.imageUrl} alt="Attached Evidence" className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-110" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity">
                      <ImageIcon size={20} className="text-white" />
                    </div>
                  </div>
                )}
              </div>
              
              {c.resolutionNote && (
                <div className="bg-green-50 p-5 rounded-2xl border border-green-100 mb-6 animate-in slide-in-from-bottom-2 duration-300">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 size={14} className="text-green-600" />
                    <p className="text-[10px] text-green-700 font-black uppercase tracking-widest">Official Resolution Note</p>
                  </div>
                  <p className="text-sm text-green-900 font-semibold leading-relaxed">{c.resolutionNote}</p>
                </div>
              )}
              
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                  Reference: #{c.id}
                </div>
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                  Filed: {new Date(c.timestamp).toLocaleString()}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default StudentView;