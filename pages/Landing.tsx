
import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Zap, BarChart3, Users2, ArrowRight, Settings2, CheckCircle } from 'lucide-react';

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-blue-500/30 overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-white shadow-lg shadow-blue-600/20">G</div>
            <span className="text-2xl font-black tracking-tighter">GEARGUARD</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="bg-white text-black px-6 py-2.5 rounded-full text-sm font-bold hover:bg-gray-200 transition-all shadow-lg shadow-white/10">Enterprise Login</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 animate-in slide-in-from-left duration-700">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider">
              <Zap size={14} /> Next Gen CMMS
            </div>
            <h1 className="text-6xl md:text-7xl font-black tracking-tighter leading-[0.9]">
              ELIMINATE <span className="text-blue-600">DOWNTIME</span> BEFORE IT HAPPENS.
            </h1>
            <p className="text-xl text-gray-400 max-w-lg leading-relaxed">
              GearGuard is the professional maintenance management system built for teams that demand precision. Track assets, manage personnel, and optimize your lifecycle.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/login" className="group bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-xl shadow-blue-600/20">
                Access Workspace <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/login" className="bg-white/5 hover:bg-white/10 border border-white/10 px-8 py-4 rounded-2xl font-bold flex items-center justify-center transition-all">
                Live Demo
              </Link>
            </div>
          </div>
          <div className="relative animate-in zoom-in duration-1000">
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-[2rem] blur-3xl opacity-20"></div>
            <div className="relative bg-[#1a1a1a] border border-white/10 rounded-[2rem] p-4 shadow-2xl overflow-hidden aspect-video flex items-center justify-center">
               <div className="w-full h-full bg-gradient-to-br from-[#2a2a2a] to-[#111] rounded-xl border border-white/5 flex flex-col p-6 space-y-6">
                 <div className="flex justify-between items-center">
                    <div className="h-4 w-32 bg-white/10 rounded-full"></div>
                    <div className="h-8 w-8 bg-blue-600/20 rounded-lg"></div>
                 </div>
                 <div className="grid grid-cols-3 gap-4">
                    {[1,2,3].map(i => <div key={i} className="h-20 bg-white/5 rounded-xl border border-white/5"></div>)}
                 </div>
                 <div className="h-40 bg-white/5 rounded-xl border border-white/5 w-full"></div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 bg-[#0c0c0c]">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <h2 className="text-4xl font-black tracking-tight text-white">ENGINEERED FOR SCALE</h2>
            <p className="text-gray-400">Everything you need to keep your facility running at peak efficiency.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <Settings2 className="text-blue-500" />, title: "Asset Lifecycle", desc: "Complete health monitoring and predictive maintenance scheduling for every piece of gear." },
              { icon: <Users2 className="text-purple-500" />, title: "Team Coordination", desc: "Manage specialized maintenance teams and assign technicians based on workload and skill." },
              { icon: <BarChart3 className="text-green-500" />, title: "Real-time Analytics", desc: "Gain instant insights into repair cycles, downtime costs, and organizational performance." }
            ].map((f, i) => (
              <div key={i} className="bg-[#151515] border border-white/5 p-8 rounded-[2rem] hover:bg-[#1a1a1a] hover:border-blue-500/20 transition-all group">
                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                <p className="text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center gap-12 md:gap-24 opacity-40 grayscale contrast-125">
           <span className="text-2xl font-black italic">MAERSK</span>
           <span className="text-2xl font-black italic">TOYOTA</span>
           <span className="text-2xl font-black italic">CAT</span>
           <span className="text-2xl font-black italic">SANY</span>
           <span className="text-2xl font-black italic">SIEMENS</span>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/5 text-center text-gray-500 text-sm">
        <p>© 2025 GearGuard CMMS. Built for professionals.</p>
      </footer>
    </div>
  );
};

export default Landing;
