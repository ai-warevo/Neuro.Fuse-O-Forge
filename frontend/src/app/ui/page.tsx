'use client';

import { useState } from 'react';
import { PromptForm } from '@/components/PromptForm';
import { ForgeTerminal } from '@/components/ForgeTerminal';
import axios from 'axios';

export default function LayoutForge () {
  const [taskId, setTaskId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');

  const handleGenerate = async (prompt: string, steps: number, complexity: number) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/tasks`, {
        prompt,
        type: 'LAYOUT',
        params: { steps, complexity },
      });
      setTaskId(response.data.id);
    } catch (error) {
      console.error('Layout Error:', error);
    }
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-700">
      
      {/* 📏 Left Column: Structure Config */}
      <div className="lg:col-span-4 space-y-6">
        <div className="space-y-1 border-l-4 border-cyan-500 pl-4">
          <h1 className="text-2xl font-black uppercase tracking-tighter">Layout Forge</h1>
          <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Unit: UX-Architect-V2</p>
        </div>

        <div className="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm">
        TODO....
          {/* <PromptForm onGenerate={handleGenerate} /> */}
        </div>

        {/* Layout Specs */}
        <div className="grid grid-cols-2 gap-2">
          {['Responsive', 'Interactions', 'CSS-in-JS', 'Accessibility'].map((tag) => (
            <div key={tag} className="px-3 py-2 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-[9px] font-bold text-zinc-500 uppercase tracking-tighter flex items-center gap-2">
              <div className="w-1 h-1 bg-cyan-500 rounded-full" />
              {tag}
            </div>
          ))}
        </div>
      </div>

      {/* 🖼️ Right Column: Blueprint Viewport */}
      <div className="lg:col-span-8 space-y-6">
        
        {/* Viewport Header */}
        <div className="flex items-center justify-between px-2">
          <div className="flex gap-2">
            {['desktop', 'mobile'].map((mode) => (
              <button 
                key={mode}
                onClick={() => setViewMode(mode as any)}
                className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-md transition-all ${
                  viewMode === mode 
                  ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20' 
                  : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
          <span className="text-[9px] font-mono text-zinc-400">FRAME_RESOLUTION: 1440x900</span>
        </div>

        {/* Blueprint Canvas */}
        <div className="relative min-h-[500px] bg-zinc-50 dark:bg-[#050505] rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-2xl flex items-center justify-center transition-all duration-500">
          
          {/* Schematic Grid Overlay */}
          <div className="absolute inset-0 opacity-[0.2] dark:opacity-[0.1] pointer-events-none" 
               style={{backgroundImage: 'linear-gradient(#22d3ee 0.5px, transparent 0.5px), linear-gradient(90deg, #22d3ee 0.5px, transparent 0.5px)', backgroundSize: '40px 40px'}} />
          
          {taskId ? (
            <div className={`relative z-10 transition-all duration-700 bg-white dark:bg-zinc-900 border-4 border-cyan-500/30 rounded-xl shadow-2xl ${
              viewMode === 'mobile' ? 'w-[320px] h-[480px]' : 'w-[90%] h-[80%]'
            }`}>
              <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex justify-between">
                <div className="w-12 h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
                <div className="w-4 h-4 bg-cyan-500/20 rounded-sm" />
              </div>
              <div className="p-8 space-y-4">
                <div className="w-full h-32 bg-zinc-100 dark:bg-zinc-800 rounded-lg animate-pulse" />
                <div className="space-y-2">
                  <div className="w-3/4 h-3 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
                  <div className="w-1/2 h-3 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
                </div>
              </div>
              <div className="absolute top-2 right-2 text-[8px] font-mono text-cyan-500">DRAFT_V1</div>
            </div>
          ) : (
            <div className="relative text-center space-y-4">
              <div className="w-24 h-24 border border-cyan-500/20 rounded-full flex items-center justify-center animate-[spin_12s_linear_infinite]">
                <div className="w-16 h-16 border border-cyan-500/40 rounded-full flex items-center justify-center animate-[spin_8s_linear_reverse_infinite]">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full" />
                </div>
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-500/40 italic">Initialize_Frame_Buffer</p>
            </div>
          )}
        </div>

        {/* Architectural Logs */}
        <div className="rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-lg bg-zinc-950">
          <ForgeTerminal />
        </div>
      </div>
    </div>
  );
};
