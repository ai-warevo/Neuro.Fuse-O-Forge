'use client';

import React, { useEffect, useRef } from 'react';
import { useForgeStore } from '../store/forgeStore';

const ForgeTerminal: React.FC = () => {
  const logs = useForgeStore(s => s.logs);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    /* 🛠 Enhanced Outer Container: Adds a heavy shadow in Light Mode to ground the dark terminal */
    <div className="relative flex flex-col h-[350px] bg-zinc-950 font-mono text-[11px] leading-relaxed group rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl dark:shadow-none ring-1 ring-white/5">
      
      {/* 🟢 Terminal Header: Darker for better contrast */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800 bg-zinc-900">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/40" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500/20 border border-amber-500/40" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/20 border border-emerald-500/40" />
        </div>
        <div className="flex items-center gap-2">
           <span className="text-[8px] text-zinc-600 font-bold uppercase tracking-[0.3em]">Neural_Console_v.4</span>
           <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
        </div>
      </div>

      {/* 📜 Logs Area: Custom Scrollbar colors */}
      <div 
        ref={scrollRef} 
        className="flex-1 overflow-y-auto p-5 space-y-2 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent scroll-smooth selection:bg-blue-500/30"
      >
        {logs.length === 0 && (
          <div className="text-zinc-600 italic animate-pulse font-medium">
            &gt; Initializing neural link via NODE_01...
          </div>
        )}

        {logs.map((log, index) => (
          <div key={index} className="flex gap-3 group/line animate-in fade-in slide-in-from-left-2 duration-300">
            <span className="text-zinc-600 shrink-0 select-none opacity-50 font-bold">
              {new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
            <span className="text-zinc-300 group-hover/line:text-white transition-colors flex gap-2">
              <span className="text-blue-500 font-black shrink-0 opacity-80 select-none">»</span>
              <span className="break-all">{log}</span>
            </span>
          </div>
        ))}
        
        {/* Blinking Block Cursor */}
        <div className="inline-block w-1.5 h-3.5 bg-blue-500/60 animate-pulse align-middle ml-1 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
      </div>

      {/* 🛰️ CRT/Scanline Overlay: Reduced opacity for Light Theme comfort */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-5 dark:opacity-10 z-10">
        <div className="w-full h-full bg-linear-to-b from-transparent via-white/10 to-transparent animate-scanline" />
      </div>

      {/* Static grid overlay: Makes it feel like an old CRT monitor */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(rgba(18,18,18,0)_50%,rgba(0,0,0,0.4)_100%)] z-20" />
    </div>
  );
};

export default ForgeTerminal;
