import { Shield, Target, Eye, Users, Sparkles } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fafafa] via-[#fafafa] to-purple-50/20 dark:from-[#05060b] dark:via-[#090b11] dark:to-[#040508] py-16 px-4 sm:px-6 lg:px-8 space-y-16 transition-colors duration-300">
      {/* Hero Header */}
      <div className="max-w-4xl mx-auto text-center space-y-4">
        <span className="inline-flex items-center space-x-2 py-1 px-3 bg-blue-500/10 border border-blue-500/25 rounded-full text-blue-650 dark:text-blue-400 text-xs font-semibold tracking-wider uppercase">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Our Story</span>
        </span>
        <h1 className="text-4xl sm:text-6xl font-black font-display tracking-tight text-slate-900 dark:text-white leading-tight">
          Pioneering the Next Generation of <br />
          <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">Digital Commerce.</span>
        </h1>
        <p className="max-w-2xl mx-auto text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
          Shopora was founded with a single, clear objective: to design and build an e-commerce ecosystem capable of scaling to enterprise volumes without sacrificing premium aesthetics or fast loading times.
        </p>
      </div>

      {/* Core Mission & Vision */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-[#0c0d15] border border-black/5 dark:border-slate-800/40 rounded-3xl p-8 space-y-4 shadow-xl dark:shadow-2xl">
          <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-2xl w-fit text-blue-600 dark:text-blue-400">
            <Target className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black font-display text-slate-900 dark:text-white">Our Mission</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            To empower digital creators and brands worldwide by delivering high-fidelity storefronts, robust data normalization schemas, and payment integrations in a single unified system.
          </p>
        </div>

        <div className="bg-white dark:bg-[#0c0d15] border border-black/5 dark:border-slate-800/40 rounded-3xl p-8 space-y-4 shadow-xl dark:shadow-2xl">
          <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-2xl w-fit text-purple-650 dark:text-purple-400">
            <Eye className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black font-display text-slate-900 dark:text-white">Our Vision</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            To define the standard for production-ready full-stack layouts where high visual design meets enterprise-grade backend infrastructure.
          </p>
        </div>
      </div>

      {/* Values Section */}
      <div className="max-w-5xl mx-auto space-y-8">
        <h2 className="text-3xl font-black font-display text-slate-900 dark:text-white text-center">Core Company Values</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { icon: <Shield className="w-5 h-5" />, title: 'Security First', desc: 'Secure session policies, hash encryption, and robust transaction auditing layers.' },
            { icon: <Sparkles className="w-5 h-5" />, title: 'Premium Aesthetics', desc: 'Sleek dark modes, fine border parameters, and smooth animations at first glance.' },
            { icon: <Users className="w-5 h-5" />, title: 'Customer Centric', desc: 'Intuitive checkouts, coupon frameworks, and custom landing page templates.' }
          ].map((val, idx) => (
            <div key={idx} className="bg-white dark:bg-[#0c0d15] border border-black/5 dark:border-slate-800/40 rounded-2xl p-6 space-y-3 shadow-md">
              <div className="text-blue-600 dark:text-blue-400">{val.icon}</div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">{val.title}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{val.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
