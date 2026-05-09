import { ForgeTaskResult } from "@/types";
import { useState } from "react";

export const ForgeAudioVisualizer = ({ isGenerating, taskResult }: { isGenerating: boolean, result: ForgeTaskResult }) => {
  const [isPlaying, setPlaying] = useState(false); 
  return (
    <div className="relative h-64 bg-zinc-950 rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl flex items-center justify-center group">
      {/* Анимация волн */}
      <div className="absolute inset-0 flex items-center justify-center gap-1 px-12 opacity-20">
        {Array.from({ length: 40 }).map((_, i) => (
          <div key={i} className={`w-1 bg-purple-500 rounded-full transition-all duration-500 ${isPlaying ? 'animate-pulse' : 'h-4'}`}
              style={{ height: isPlaying ? `${Math.random() * 80 + 10}%` : '8px' }} />
        ))}
      </div>

      {isGenerating || !result ? (
        <div className="text-center space-y-3 opacity-20">
          <p className="text-[10px] font-black uppercase tracking-[0.3em]">No Audio Signal Detected</p>
        </div>
      ) : (
        <div className="relative z-10 flex flex-col items-center gap-6">
          <button onClick={() => setPlaying(!isPlaying)} className="w-16 h-16 bg-white text-black rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(168,85,247,0.4)] hover:scale-105 transition-transform cursor-pointer">
            {isPlaying ? '⏸' : '▶'}
          </button>
          <span className="text-[10px] font-mono text-purple-400 tracking-[0.4em] uppercase">
            {isPlaying ? 'Streaming_Signal...' : 'Signal_Ready'}
          </span>
        </div>
      )}
    </div>
  )
};
