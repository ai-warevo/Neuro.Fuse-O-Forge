'use client';

import { useState } from 'react';
import { PromptForm } from '../components/PromptForm';
import ForgeTerminal from '../components/ForgeTerminal';
import axios from 'axios';

const LexiForge = () => {
  const [taskId, setTaskId] = useState<string | null>(null);
  const [streamedText, setStreamedText] = useState('');

  const handleGenerate = async (prompt: string, steps: number, guidance: number) => {
    setStreamedText(''); // Clear previous stream
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/tasks`, {
        prompt,
        type: 'TEXT',
        params: { steps, guidance },
      });
      setTaskId(response.data.id);
      // In a real app, WebSocket would fill setStreamedText here
    } catch (error) {
      console.error('Lexi Error:', error);
    }
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-700">
      
      {/* 📜 Left Column: Linguistic Parameters */}
      <div className="lg:col-span-4 space-y-6">
        <div className="space-y-1 border-l-4 border-amber-500 pl-4">
          <h1 className="text-2xl font-black uppercase tracking-tighter text-zinc-900 dark:text-white">Lexi Forge</h1>
          <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Unit: LLM-Core-Alpha-7</p>
        </div>

        <div className="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm">
          TODO....
          {/* <PromptForm onGenerate={handleGenerate} /> */}
        </div>

        {/* Semantic Context Panel */}
        <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-5 space-y-4">
          <h4 className="text-[10px] font-black uppercase text-amber-600 tracking-widest">Semantic Context</h4>
          <div className="space-y-2">
            {['Inference', 'Tokenization', 'Context_Window'].map(stat => (
              <div key={stat} className="flex justify-between items-center font-mono text-[9px]">
                <span className="text-zinc-500 uppercase">{stat}</span>
                <span className="text-amber-600 font-bold tracking-tighter">OPTIMIZED</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 📑 Right Column: Text Streamer */}
      <div className="lg:col-span-8 space-y-6">
        
        {/* Document Viewport */}
        <div className="relative min-h-[500px] bg-white dark:bg-[#050505] rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl p-8 overflow-hidden group">
          {/* Subtle line numbers for the "Editor" feel */}
          <div className="absolute top-8 left-4 bottom-8 w-px bg-zinc-200 dark:bg-zinc-800 hidden md:block" />
          
          <div className="relative z-10 max-w-2xl mx-auto md:ml-8 font-mono text-sm leading-relaxed">
            {taskId ? (
              <div className="space-y-4">
                <span className="inline-block px-2 py-1 bg-amber-500/10 text-amber-600 text-[10px] font-bold rounded mb-4 animate-pulse">
                  STREAMING_FROM_NODE_07...
                </span>
                <div className="text-zinc-800 dark:text-zinc-300 transition-all duration-300">
                  {streamedText || "Initializing neural weights for text synthesis..."}
                  <span className="inline-block w-2 h-4 bg-amber-500 ml-1 animate-pulse" />
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center opacity-20 py-20 italic space-y-4">
                <p className="tracking-widest uppercase text-[10px] font-black">Awaiting Linguistic Directive</p>
                <div className="w-1/2 h-px bg-linear-to-r from-transparent via-amber-500 to-transparent" />
              </div>
            )}
          </div>
        </div>

        {/* System Logs */}
        <div className="rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-lg bg-zinc-950">
          <ForgeTerminal />
        </div>
      </div>
    </div>
  );
};

export default LexiForge;
