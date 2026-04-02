import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Terminal, Shield, Cpu, Activity } from 'lucide-react';

const DashboardPreview = () => {
  const containerRef = useRef(null);

  useGSAP(() => {
    // Animate data bars
    gsap.to('.bar', {
      height: (i) => `${30 + Math.random() * 60}%`,
      duration: 1,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut',
      stagger: { each: 0.1, from: 'center' }
    });

    // Scanner beam effect
    gsap.to('.scanner', {
      top: '100%',
      duration: 3,
      repeat: -1,
      ease: 'none'
    });

    // Mock terminal text
    const lines = gsap.utils.toArray('.term-line');
    gsap.from(lines, {
      opacity: 0,
      x: -10,
      stagger: 0.2,
      duration: 0.5,
      repeat: -1,
      repeatDelay: 2
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="relative w-full aspect-[16/9] rounded-[2.5rem] border border-white/10 bg-[#0a0f1e]/80 backdrop-blur-3xl shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden group">
      {/* Scanner Beam */}
      <div className="scanner absolute top-0 left-0 w-full h-[20%] bg-gradient-to-b from-transparent via-primary/10 to-transparent pointer-events-none z-10" />
      
      {/* Header */}
      <div className="absolute top-0 w-full h-14 border-b border-white/[0.05] flex items-center justify-between px-8 bg-white/[0.02]">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/50" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
          <div className="w-3 h-3 rounded-full bg-green-500/50" />
        </div>
        <div className="flex gap-6 items-center">
           <div className="flex items-center gap-2 text-[10px] font-black font-mono text-primary/50 tracking-widest">
              <Activity size={12} /> SYSTEM_STABLE
           </div>
           <div className="w-px h-4 bg-white/10" />
           <div className="text-[10px] font-black font-mono text-white/30 tracking-widest uppercase">Node_Alpha_7</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="absolute inset-0 pt-14 p-8 flex gap-8">
        {/* Sidebar / Stats */}
        <div className="w-1/4 flex flex-col gap-4">
           {[...Array(3)].map((_, i) => (
             <div key={i} className="flex-1 bg-white/[0.03] rounded-2xl border border-white/[0.05] p-5 flex flex-col justify-center gap-2">
                <div className="w-1/3 h-1 bg-white/10 rounded" />
                <div className="w-2/3 h-3 bg-primary/20 rounded" />
             </div>
           ))}
        </div>

        {/* Center / Chart */}
        <div className="flex-1 flex flex-col gap-6">
           <div className="flex-1 bg-white/[0.02] rounded-3xl border border-white/[0.05] relative p-8">
              <div className="absolute top-6 left-6 flex items-center gap-3">
                 <Terminal size={14} className="text-primary" />
                 <span className="text-[10px] font-mono font-bold text-white/40 tracking-wider">LIVE_PORTFOLIO_DRIFT</span>
              </div>
              <div className="absolute bottom-8 left-8 right-8 top-20 flex items-end gap-3 px-4">
                 {[...Array(24)].map((_, i) => (
                   <div key={i} className="bar flex-1 bg-gradient-to-t from-primary/30 via-primary/10 to-transparent rounded-t-lg transition-colors group-hover:from-primary/50" />
                 ))}
              </div>
           </div>
           
           <div className="h-1/3 flex gap-6">
              <div className="flex-1 bg-white/[0.02] rounded-3xl border border-white/[0.05] p-6 flex flex-col justify-center gap-3">
                 <Shield size={20} className="text-secondary opacity-50" />
                 <div className="w-1/2 h-2 bg-white/10 rounded" />
                 <div className="w-3/4 h-2 bg-white/5 rounded" />
              </div>
              <div className="flex-1 bg-white/[0.02] rounded-3xl border border-white/[0.05] p-6 overflow-hidden">
                 <div className="space-y-2">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="term-line flex gap-3">
                        <span className="text-[8px] font-mono text-primary/30">{`> 0x${Math.random().toString(16).slice(2, 6)}`}</span>
                        <div className="h-1.5 w-full bg-white/5 rounded" />
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>

        {/* Right / Activity */}
        <div className="w-[5%] flex flex-col gap-2 items-center py-4">
           {[...Array(12)].map((_, i) => (
             <div key={i} className="w-1 h-1 rounded-full bg-white/10" />
           ))}
           <Cpu size={14} className="text-white/20 my-4" />
           {[...Array(12)].map((_, i) => (
             <div key={i} className="w-1 h-1 rounded-full bg-white/10" />
           ))}
        </div>
      </div>
    </div>
  );
};


export default DashboardPreview;
