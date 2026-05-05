'use client';

import { useState } from 'react';
import { PromptForm } from '../components/PromptForm';
import ForgeTerminal from '../components/ForgeTerminal';
import axios from 'axios';

const SonicForge = () => {
  const [taskId, setTaskId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleGenerate = async (prompt: string, steps: number, duration: number) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/tasks`, {
        prompt,
        type: 'AUDIO',
        params: { steps, duration },
      });
      setTaskId(response.data.id);
    } catch (error) {
      console.error('Sonic Error:', error);
    }
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-700">
      
      {/* 🎚️ Left Column: Audio Config */}
      <div className="lg:col-span-4 space-y-6">
        <header className="space-y-1 border-l-4 border-purple-500 pl-4">
          <h1 className="text-2xl font-black uppercase tracking-tighter">Sonic Forge</h1>
          <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Unit: AudioGen-L-04</p>
        </header>

        <div className="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm">
          {/* We reuse PromptForm but the button will trigger Audio logic */}
          <PromptForm onGenerate={handleGenerate} />
        </div>

        {/* Audio Specific Meta */}
        <div className="bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-mono text-zinc-400">SAMPLE_RATE</span>
            <span className="text-[10px] font-bold text-purple-500">48kHz / 24-bit</span>
          </div>
          <div className="h-px bg-zinc-200 dark:bg-zinc-800 w-full" />
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-mono text-zinc-400">CHANNELS</span>
            <span className="text-[10px] font-bold">STEREO_SURROUND</span>
          </div>
        </div>
      </div>

      {/* 🔊 Right Column: Waveform & Player */}
      <div className="lg:col-span-8 space-y-6">
        
        {/* Waveform Visualization Area */}
        <div className="relative h-64 bg-zinc-950 rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl flex items-center justify-center group">
          
          {/* Animated Background Spectrum */}
          <div className="absolute inset-0 flex items-center justify-center gap-1 px-12 opacity-20">
            {Array.from({ length: 40 }).map((_, i) => (
              <div 
                key={i} 
                className={`w-1 bg-purple-500 rounded-full transition-all duration-500 ${isPlaying ? 'animate-pulse' : 'h-4'}`}
                style={{ height: isPlaying ? `${Math.random() * 80 + 10}%` : '8px' }}
              />
            ))}
          </div>

          {taskId ? (
            <div className="relative z-10 flex flex-col items-center gap-6">
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-16 h-16 bg-white text-black rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(168,85,247,0.4)] hover:scale-105 transition-transform"
              >
                {isPlaying ? '⏸' : '▶'}
              </button>
              <span className="text-[10px] font-mono text-purple-400 tracking-[0.4em] uppercase">
                {isPlaying ? 'Streaming_Signal...' : 'Signal_Ready'}
              </span>
            </div>
          ) : (
            <div className="text-center space-y-3">
              <div className="flex justify-center gap-1">
                {[1, 2, 3].map(i => <div key={i} className="w-1 h-4 bg-zinc-800 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.1}s` }} />)}
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-20">No Audio Signal Detected</p>
            </div>
          )}
        </div>

        {/* Console logs for audio buffers */}
        <div className="rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-lg bg-zinc-950">
          <ForgeTerminal />
        </div>
      </div>
    </div>
  );
};

export default SonicForge;
