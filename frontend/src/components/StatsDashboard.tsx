'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useStatsStore } from '@/store/statsStore';

export const StatsDashboard: React.FC = () => {
  const gpuLoad = useStatsStore(s => s.gpuLoad);
  const workersAvailable = useStatsStore(s => s.workersAvailable);

  return (
    <div className="flex flex-col gap-8 animate-in fade-in zoom-in-95 duration-700">
      
      {/* 🧠 Core Processing Unit (GPU) */}
      <div className="flex flex-col items-center gap-4 py-4">
        <div className="relative flex items-center justify-center">
          {/* Background Track */}
          <svg className="w-32 h-32 transform -rotate-90">
            <circle
              cx="64" cy="64" r="58"
              stroke="currentColor"
              strokeWidth="6"
              fill="transparent"
              className="text-zinc-100 dark:text-zinc-800"
            />
            {/* Dynamic Progress */}
            <motion.circle
              cx="64" cy="64" r="58"
              stroke="currentColor"
              strokeWidth="6"
              fill="transparent"
              strokeDasharray="364.4"
              initial={{ strokeDashoffset: 364.4 }}
              animate={{ strokeDashoffset: 364.4 - (364.4 * gpuLoad) / 100 }}
              strokeLinecap="round"
              className={`${gpuLoad > 80 ? 'text-red-500' : 'text-blue-500'} transition-colors duration-500`}
            />
          </svg>
          
          <div className="absolute flex flex-col items-center">
            <span className="text-3xl font-black tracking-tighter">{gpuLoad}%</span>
            <span className="text-[8px] font-black uppercase text-zinc-400 tracking-widest">GPU_LOAD</span>
          </div>
        </div>
      </div>

      {/* 🛠 Worker & Environment Grid */}
      <div className="grid grid-cols-1 gap-3">
        {/* Workers Status */}
        <div className="flex justify-between items-center p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-100 dark:border-zinc-800/50">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-tight">Worker Status</span>
            <span className="text-xs font-black font-mono">NEURAL_CLUSTER_04</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
              workersAvailable 
                ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                : 'bg-red-500/10 text-red-500 border-red-500/20'
            }`}>
              {workersAvailable ? 'READY' : 'OFFLINE'}
            </span>
          </div>
        </div>

        {/* Node Latency (Mock/Static for UI) */}
        <div className="flex justify-between items-center p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-100 dark:border-zinc-800/50">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-tight">Response Time</span>
            <span className="text-xs font-black font-mono">SYNAPTIC_DELAY</span>
          </div>
          <span className="text-xs font-bold font-mono text-blue-500">12ms</span>
        </div>
      </div>

      {/* 📉 Micro Trend Line (Decorative) */}
      <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
        <div className="flex justify-between items-end h-8 gap-0.5">
          {[40, 70, 45, 90, 65, 80, 30, 50, 40, 60, 85].map((h, i) => (
            <div 
              key={i} 
              className="flex-1 bg-blue-500/20 dark:bg-blue-500/10 rounded-t-sm relative group overflow-hidden"
              style={{ height: `${h}%` }}
            >
               <div className="absolute inset-0 bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>
        <p className="text-[8px] text-zinc-400 mt-2 font-mono uppercase text-center tracking-widest">
          Flux_Capacity_Monitor
        </p>
      </div>
    </div>
  );
};
