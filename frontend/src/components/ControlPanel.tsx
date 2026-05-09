'use client';

import React from 'react';
import { useForgeStore } from '@/store/forgeStore';

export const ControlPanel: React.FC = () => {
  const taskId = useForgeStore(s => s.taskId);
  const { setTaskId } = useForgeStore(s => s.actions);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-500">
      {/* Input Module */}
      <div className="space-y-4">
        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
          <span className="w-1 h-3 bg-brand-blue" />
          Target Sequence ID
        </label>
        
        <div className="relative group">
          {/* Enhanced Glow: Stronger in dark, subtler in light */}
          <div className="absolute -inset-1 bg-linear-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-0 group-focus-within:opacity-20 dark:group-focus-within:opacity-30 transition duration-500" />
          
          <input 
            type="text" 
            value={taskId} 
            onChange={(e) => setTaskId(e.target.value)} 
            placeholder="0x_NEURAL_TASK_INIT..." 
            className="relative w-full bg-background dark:bg-zinc-950 border border-border-primary p-4 rounded-xl font-mono text-sm outline-none focus:ring-4 focus:ring-brand-blue/10 focus:border-brand-blue transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-600 uppercase tracking-widest"
          />
          
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-mono text-zinc-400 dark:text-zinc-500 pointer-events-none hidden sm:block">
            [WAITING_INPUT]
          </div>
        </div>
      </div>

      {/* Action Buttons Grid */}
      <div className="grid grid-cols-2 gap-3">
        <button className="relative overflow-hidden group px-4 py-3 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-xl font-black text-[11px] uppercase tracking-tighter shadow-lg shadow-black/5 dark:shadow-white/5 transition-transform active:scale-95">
          <div className="absolute inset-0 bg-linear-to-r from-blue-600 to-cyan-400 opacity-0 group-hover:opacity-10 transition-opacity" />
          <span className="relative z-10">Execute Task</span>
        </button>
        
        <button className="px-4 py-3 bg-card-bg dark:bg-zinc-800 border border-border-primary rounded-xl font-black text-[11px] uppercase tracking-tighter hover:bg-red-500/5 hover:text-red-600 dark:hover:text-red-400 hover:border-red-500/50 transition-all active:scale-95">
          Abort Forge
        </button>
      </div>

      {/* System Helper Text */}
      <p className="text-[9px] leading-relaxed text-zinc-500 dark:text-zinc-400 font-medium italic border-t border-border-primary pt-4">
        * Ensure Task ID is verified before execution. All forging processes are permanent within the current epoch.
      </p>
    </div>
  );
};
