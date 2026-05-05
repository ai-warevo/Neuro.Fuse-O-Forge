'use client';

import { useState } from 'react';

export const PromptForm = ({ onGenerate }: { onGenerate: (p: string, s: number, g: number) => void }) => {
  const [prompt, setPrompt] = useState('');
  const [steps, setSteps] = useState(25);
  const [guidance, setGuidance] = useState(7.5);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-top-2 duration-500">
      
      {/* 📝 Prompt Input Area */}
      <div className="group space-y-2">
        <div className="flex justify-between items-center px-1">
          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Neural Input</label>
          <span className="text-[9px] font-mono text-blue-500">READY_TO_FORGE</span>
        </div>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the visual essence..."
          rows={3}
          className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-4 rounded-2xl font-mono text-sm outline-hidden ring-blue-500/20 focus:ring-4 focus:border-blue-500/50 transition-all resize-none shadow-inner"
        />
      </div>

      {/* ⚙️ Parameters Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Steps Slider */}
        <div className="space-y-3 bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800/50">
          <div className="flex justify-between">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter">Steps</label>
            <span className="text-[10px] font-mono text-blue-500 font-bold">{steps}</span>
          </div>
          <input
            type="range"
            min="1"
            max="50"
            value={steps}
            onChange={(e) => setSteps(Number(e.target.value))}
            className="w-full h-1 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
        </div>

        {/* Guidance Slider */}
        <div className="space-y-3 bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800/50">
          <div className="flex justify-between">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter">Guidance</label>
            <span className="text-[10px] font-mono text-purple-500 font-bold">{guidance.toFixed(1)}</span>
          </div>
          <input
            type="range"
            min="0"
            max="20"
            step="0.5"
            value={guidance}
            onChange={(e) => setGuidance(Number(e.target.value))}
            className="w-full h-1 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />
        </div>
      </div>

      {/* 🔥 Generate Action */}
      <button
        onClick={() => onGenerate(prompt, steps, guidance)}
        className="group relative w-full overflow-hidden bg-zinc-900 dark:bg-white text-white dark:text-black py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all active:scale-[0.98]"
      >
        <div className="absolute inset-0 bg-linear-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <span className="relative z-10 flex items-center justify-center gap-3">
          Execute Generation
          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </span>
      </button>

      <div className="px-1 py-2 flex items-center gap-2 opacity-50">
        <div className="w-1 h-1 bg-zinc-400 rounded-full" />
        <span className="text-[9px] font-mono uppercase italic">Estimated compute time: ~4.2s</span>
      </div>
    </div>
  );
};
