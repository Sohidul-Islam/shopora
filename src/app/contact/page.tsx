'use client';

import { useState } from 'react';
import { Mail, Phone, Clock, Send, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setForm({ name: '', email: '', message: '' });
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#05060b] via-[#090b11] to-[#040508] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h1 className="text-4xl font-black font-display text-white tracking-tight leading-none">Get In Touch</h1>
          <p className="text-sm text-slate-400">Have questions about products, shipping, or custom pricing? Our support team is here to assist you 24/7.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-start">
          {/* Info Details */}
          <div className="md:col-span-2 space-y-6">
            <div className="glass border border-slate-800/40 rounded-3xl p-8 space-y-6 shadow-lg shadow-black/10">
              <h2 className="text-xl font-bold font-display text-white border-b border-slate-900 pb-3">Contact Information</h2>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3.5">
                  <div className="p-2.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-black block">Email Support</span>
                    <a href="mailto:support@shopora.com" className="text-sm text-slate-350 hover:text-white transition font-semibold">support@shopora.com</a>
                  </div>
                </div>

                <div className="flex items-center space-x-3.5">
                  <div className="p-2.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-black block">Phone Hotline</span>
                    <span className="text-sm text-slate-350 font-semibold">+1 (800) 555-0199</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3.5">
                  <div className="p-2.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-black block">Business Hours</span>
                    <span className="text-sm text-slate-355 text-slate-350 font-semibold">Mon - Fri: 9:00 AM - 6:00 PM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Form */}
          <div className="md:col-span-3">
            <div className="glass border border-slate-800/40 rounded-3xl p-8 sm:p-10 shadow-lg shadow-black/10">
              <h2 className="text-xl font-bold font-display text-white border-b border-slate-900 pb-3 mb-6">Send Us a Message</h2>
              
              {submitted ? (
                <div className="py-12 text-center space-y-4">
                  <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
                  <h3 className="text-lg font-bold text-white font-display">Message Sent Successfully!</h3>
                  <p className="text-xs text-slate-400">Thank you for reaching out. We will respond within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Full Name</label>
                      <input 
                        type="text" 
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="John Doe" 
                        className="w-full bg-[#0a0c14] border border-slate-800 rounded-xl py-2.5 px-4 text-xs text-white placeholder-slate-650 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Email Address</label>
                      <input 
                        type="email" 
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="john@example.com" 
                        className="w-full bg-[#0a0c14] border border-slate-800 rounded-xl py-2.5 px-4 text-xs text-white placeholder-slate-650 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Your Message</label>
                    <textarea 
                      required
                      rows={5}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Type your questions or comments here..." 
                      className="w-full bg-[#0a0c14] border border-slate-800 rounded-xl py-2.5 px-4 text-xs text-white placeholder-slate-650 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition flex items-center justify-center space-x-2 text-xs uppercase tracking-wider shadow-lg shadow-blue-900/20"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Message</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
