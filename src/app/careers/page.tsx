'use client';

import { useState } from 'react';
import { Briefcase, MapPin, DollarSign, Calendar, CheckCircle2, Send } from 'lucide-react';

export default function CareersPage() {
  const [selectedJob, setSelectedJob] = useState<any | null>(null);
  const [form, setForm] = useState({ name: '', email: '', resume: '', coverLetter: '' });
  const [applied, setApplied] = useState(false);

  const jobsList = [
    { id: '1', title: 'Senior Full-Stack Engineer (Next.js & Node)', department: 'Engineering', location: 'San Francisco, CA (Hybrid)', salary: '$140k - $170k', type: 'Full-time' },
    { id: '2', title: 'Senior Product Designer (UI/UX)', department: 'Design', location: 'Remote (US/Canada)', salary: '$120k - $150k', type: 'Full-time' },
    { id: '3', title: 'Growth Marketing Manager', department: 'Marketing', location: 'Remote (Global)', salary: '$90k - $110k', type: 'Full-time' }
  ];

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.resume) return;
    setApplied(true);
    setTimeout(() => {
      setApplied(false);
      setSelectedJob(null);
      setForm({ name: '', email: '', resume: '', coverLetter: '' });
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fafafa] via-[#fafafa] to-purple-50/20 dark:from-[#05060b] dark:via-[#090b11] dark:to-[#040508] py-16 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="inline-flex items-center space-x-2 py-1 px-3 bg-blue-500/10 border border-blue-500/25 rounded-full text-blue-650 dark:text-blue-400 text-xs font-semibold tracking-wider uppercase">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Join Our Team</span>
          </span>
          <h1 className="text-4xl font-black font-display text-slate-900 dark:text-white tracking-tight leading-none">Careers at Shopora</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">Help us design, scale, and deliver the standard for production-ready full-stack e-commerce software. Build things that matter with a world-class team.</p>
        </div>

        {/* Jobs List */}
        <div className="space-y-4">
          {jobsList.map((job) => (
            <div key={job.id} className="bg-white dark:bg-[#0c0d15] border border-black/5 dark:border-slate-800/40 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 shadow-xl dark:shadow-2xl hover:border-black/10 dark:hover:border-slate-800 transition duration-300">
              <div className="space-y-3">
                <span className="text-[10px] bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 rounded-full py-1 px-2.5 font-black uppercase tracking-wider">{job.department}</span>
                <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white">{job.title}</h3>
                
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500 dark:text-slate-400 font-semibold">
                  <span className="flex items-center space-x-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{job.location}</span>
                  </span>
                  <span className="flex items-center space-x-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                    <span>{job.salary}</span>
                  </span>
                  <span className="flex items-center space-x-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{job.type}</span>
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedJob(job)}
                className="py-2.5 px-5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-md shadow-blue-900/20 whitespace-nowrap h-fit"
              >
                Apply Now
              </button>
            </div>
          ))}
        </div>

        {/* Application Modal Popup */}
        {selectedJob && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-[#0c0d15] border border-black/5 dark:border-slate-800/50 rounded-3xl p-6 sm:p-10 max-w-xl w-full relative shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
              <button 
                onClick={() => setSelectedJob(null)}
                className="absolute top-4 right-4 text-slate-400 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white font-bold text-lg p-2"
              >
                &times;
              </button>

              <div className="space-y-1.5 border-b border-slate-105 dark:border-slate-900 pb-3">
                <span className="text-[10px] text-blue-600 dark:text-blue-400 font-black uppercase tracking-wider">{selectedJob.department}</span>
                <h3 className="text-2xl font-black font-display text-slate-900 dark:text-white leading-none">{selectedJob.title}</h3>
                <p className="text-xs text-slate-500">Apply for position in {selectedJob.location}</p>
              </div>

              {applied ? (
                <div className="py-12 text-center space-y-4">
                  <CheckCircle2 className="w-14 h-14 text-emerald-550 dark:text-emerald-400 mx-auto animate-bounce" />
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">Application Received!</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Our HR recruitment team will review your profile and contact you shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleApplySubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-black text-slate-500 dark:text-slate-400 tracking-wider">Full Name</label>
                      <input 
                        type="text" 
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="John Doe" 
                        className="w-full bg-slate-50 dark:bg-[#0a0c14] border border-slate-205 dark:border-slate-800 rounded-xl py-2.5 px-4 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-650 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-black text-slate-500 dark:text-slate-400 tracking-wider">Email Address</label>
                      <input 
                        type="email" 
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="john@example.com" 
                        className="w-full bg-slate-50 dark:bg-[#0a0c14] border border-slate-205 dark:border-slate-800 rounded-xl py-2.5 px-4 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-650 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-black text-slate-500 dark:text-slate-400 tracking-wider">Resume Link</label>
                    <input 
                      type="url" 
                      required
                      value={form.resume}
                      onChange={(e) => setForm({ ...form, resume: e.target.value })}
                      placeholder="https://drive.google.com/..." 
                      className="w-full bg-slate-50 dark:bg-[#0a0c14] border border-slate-205 dark:border-slate-800 rounded-xl py-2.5 px-4 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-650 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-black text-slate-505 dark:text-slate-400 tracking-wider">Cover Letter (Optional)</label>
                    <textarea 
                      rows={4}
                      value={form.coverLetter}
                      onChange={(e) => setForm({ ...form, coverLetter: e.target.value })}
                      placeholder="Why do you want to join Shopora..." 
                      className="w-full bg-slate-50 dark:bg-[#0a0c14] border border-slate-205 dark:border-slate-800 rounded-xl py-2.5 px-4 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-650 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition flex items-center justify-center space-x-2 text-xs uppercase tracking-wider shadow-lg shadow-blue-900/20"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Application</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
