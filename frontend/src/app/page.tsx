import { ControlPanel } from '@/components/ControlPanel';
import { ForgeTerminal } from '@/components/ForgeTerminal';
import { StatsDashboard } from '@/components/StatsDashboard';

export default function Home() {
  return (
    <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 ease-out">
      
      {/* 🟢 Adaptive Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-l-4 border-blue-600 pl-6 py-1">
        <div className="space-y-1">
          <h2 className="text-4xl font-black tracking-tighter text-zinc-900 dark:text-white uppercase italic">
            Operational <span className="text-blue-600 dark:text-blue-400 not-italic">Overview</span>
          </h2>
          <div className="flex items-center gap-3 text-[10px] font-mono tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
              NODE: NEURO.FUSE_01
            </span>
            <span className="opacity-30">|</span>
            <span>LATENCY: <span className="text-emerald-500">12MS</span></span>
          </div>
        </div>
        
        {/* Connection Status Badge */}
        <div className="flex items-center gap-4 text-[10px] font-bold font-mono bg-white dark:bg-zinc-900/50 px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <span className="text-zinc-400 uppercase tracking-widest">Secure Link</span>
          <span className="text-blue-500 dark:text-blue-400 flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            ESTABLISHED
          </span>
        </div>
      </div>

      {/* 🏗️ Core Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* 1. Command Center (Task Control) */}
        <section className="lg:col-span-4 flex flex-col gap-3 group">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-sm bg-blue-600 rotate-45" />
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400">Command Center</h3>
            </div>
            <span className="text-[9px] font-mono text-blue-500 font-bold opacity-0 group-hover:opacity-100 transition-opacity">AUTH_READY</span>
          </div>
          
          <div className="flex-1 bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-2 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 hover:border-blue-500/30 group">
             <div className="h-full rounded-[1.25rem] bg-zinc-50 dark:bg-[#0c0c0e] p-5 border border-zinc-100 dark:border-zinc-800/50 shadow-inner overflow-hidden relative">
                {/* Subtle background glow for the active card */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl rounded-full" />
                <ControlPanel />
             </div>
          </div>
        </section>

        {/* 2. Neural Stream (Terminal) */}
        <section className="lg:col-span-5 flex flex-col gap-3 group">
          <div className="flex items-center gap-2 px-1">
            <div className="w-2.5 h-2.5 rounded-sm bg-zinc-400 rotate-45 animate-[spin_4s_linear_infinite]" />
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400">Neural Stream</h3>
          </div>
          <div className="flex-1 bg-zinc-950 rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl ring-1 ring-white/10 relative">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-linear-to-r from-transparent via-blue-500 to-transparent opacity-50" />
            <ForgeTerminal />
          </div>
        </section>

        {/* 3. Core Metrics (Stats) */}
        <section className="lg:col-span-3 flex flex-col gap-3 group">
          <div className="flex items-center gap-2 px-1">
            <div className="w-2.5 h-2.5 rounded-sm bg-emerald-500 rotate-45 shadow-[0_0_10px_rgba(16,185,129,0.4)]" />
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400">Core Metrics</h3>
          </div>
          <div className="flex-1 bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 relative overflow-hidden group-hover:border-emerald-500/30 transition-colors">
            {/* Grid Pattern Overlay */}
            <div className="absolute inset-0 opacity-[0.15] dark:opacity-[0.05] pointer-events-none" 
                 style={{backgroundImage: 'radial-gradient(#4f4f4f 0.5px, transparent 0.5px)', backgroundSize: '12px 12px'}} />
            <div className="relative z-10 h-full">
              <StatsDashboard />
            </div>
          </div>
        </section>

      </div>

      {/* 🛰️ Quick Action / Health Tiles */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-zinc-200 dark:border-zinc-800">
        {['Memory', 'CPU Load', 'Neural Net', 'IO Speed'].map((label, i) => (
          <div key={label} 
               className="group flex flex-col gap-1 px-4 py-3 bg-white dark:bg-zinc-900/20 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all cursor-crosshair">
            <div className="flex justify-between items-center">
              <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-tighter">{label}</span>
              <span className="text-[9px] font-bold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded leading-none">OK</span>
            </div>
            <div className="h-1 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full mt-2 overflow-hidden">
              <div className={`h-full bg-emerald-500 transition-all duration-1000 delay-${i*200}`} style={{width: `${70 + (i*5)}%`}} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
