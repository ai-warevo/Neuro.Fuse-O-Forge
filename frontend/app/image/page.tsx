'use client';

import { useState } from 'react';
import { PromptForm } from '../components/PromptForm';
import ForgeTerminal from '../components/ForgeTerminal';
import axios from 'axios';

const VisualForge = () => {
  const [taskId, setTaskId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async (prompt: string, steps: number, guidance: number) => {
    setIsGenerating(true);
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/tasks`, {
        prompt,
        type: 'IMAGE',
        params: { steps, guidance },
      });
      setTaskId(response.data.id);
    } catch (error) {
      console.error('Forge Error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-700">
      
      {/* 🛠 Left Column: Configuration */}
      <div className="lg:col-span-4 space-y-6">
        <header className="space-y-1 border-l-4 border-blue-500 pl-4">
          <h1 className="text-2xl font-black uppercase tracking-tighter">Visual Forge</h1>
          <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Unit: SDXL-Turbo-01</p>
        </header>

        <div className="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm">
          <PromptForm onGenerate={handleGenerate} />
        </div>

        {/* Status Card */}
        <div className="bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 flex items-center justify-between font-mono text-[10px]">
          <span className="text-zinc-500 italic">VRAM_TARGET: WARM</span>
          <span className="text-emerald-500 font-bold uppercase">Ready</span>
        </div>
      </div>

      {/* 🖼 Right Column: Output & Logs */}
      <div className="lg:col-span-8 space-y-6">
        
        {/* Result Preview Area */}
        <div className="relative aspect-square md:aspect-video bg-zinc-200 dark:bg-zinc-950 rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-2xl flex items-center justify-center group">
          {/* Grid Background Pattern */}
          <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://transparenttextures.com')]" />
          
          {taskId ? (
            <div className="relative z-10 w-full h-full flex items-center justify-center">
               <span className="text-zinc-500 font-mono text-xs animate-pulse tracking-widest">
                 [ STREAMING_TASK_{taskId.slice(0,8)} ]
               </span>
               {/* Здесь будет <img> с результатом */}
            </div>
          ) : (
            <div className="text-center space-y-2 opacity-20 group-hover:opacity-40 transition-opacity">
              <div className="w-12 h-12 border-2 border-dashed border-zinc-500 rounded-full mx-auto animate-[spin_10s_linear_infinite]" />
              <p className="text-[10px] font-black uppercase tracking-[0.3em]">Awaiting Neural Input</p>
            </div>
          )}

          {/* Glass Overlay for Controls */}
          {taskId && (
            <div className="absolute bottom-4 right-4 flex gap-2">
              <button className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-white/20 transition-all">
                Download
              </button>
            </div>
          )}
        </div>

        {/* Mini Terminal for Local Feedback */}
        <div className="rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-lg bg-zinc-950">
          <ForgeTerminal />
        </div>
      </div>
    </div>
  );
};

export default VisualForge;
