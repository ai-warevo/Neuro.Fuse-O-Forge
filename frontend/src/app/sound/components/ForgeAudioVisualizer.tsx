import { ForgeTaskResult, ForgeTaskStatus } from "@/types";
import { useEffect, useRef, useState } from "react";

export const ForgeAudioVisualizer = ({ isGenerating, taskResult }: { isGenerating: boolean, taskResult: ForgeTaskResult }) => {
  const [isPlaying, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const generatedAudioUrl = taskResult?.status === ForgeTaskStatus.SUCCESS ? taskResult.result : null;
  const error = (taskResult?.status === ForgeTaskStatus.ERROR || taskResult?.status === ForgeTaskStatus.TIMEOUT)
    ? taskResult.error_message
    : null;

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    setPlaying(false);
  }, [generatedAudioUrl]);
    
  return (
    <div className="relative h-64 bg-zinc-950 rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl flex items-center justify-center group">
      
      {/* Скрытый тег аудио */}
      {generatedAudioUrl && (
        <audio 
          ref={audioRef} 
          src={generatedAudioUrl} 
          onEnded={() => setPlaying(false)} 
          className="hidden" 
        />
      )}

      {/* Анимация волн */}
      <div className="absolute inset-0 flex items-center justify-center gap-1 px-12 opacity-20">
        {Array.from({ length: 40 }).map((_, i) => (
          <div 
            key={i} 
            className={`w-1 bg-purple-500 rounded-full transition-all duration-300 ${isPlaying ? 'animate-pulse' : 'h-2'}`}
            style={{ 
              height: isPlaying ? `${Math.floor(Math.random() * 60 + 20)}%` : '8px',
              transitionDelay: `${i * 50}ms` 
            }} 
          />
        ))}
      </div>

      {/* Состояние загрузки или отсутствия результата */}
      {isGenerating || !generatedAudioUrl ? (
        <div className="relative z-10 text-center space-y-3">
            {isGenerating ? (
                <div className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 border-2 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
                    <p className="text-[9px] font-mono text-purple-400 animate-pulse uppercase tracking-widest">Synthesizing_Audio</p>
                </div>
            ) : (
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-700">No Audio Signal Detected</p>
            )}
        </div>
      ) : (
        /* Контент плеера */
        <div className="relative z-10 flex flex-col items-center gap-6">
          <button 
            onClick={togglePlay} 
            className="w-16 h-16 bg-white text-black rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(168,85,247,0.4)] hover:scale-105 active:scale-95 transition-transform cursor-pointer"
          >
            {isPlaying ? (
              <span className="text-xl">⏸</span>
            ) : (
              <span className="text-xl translate-x-0.5">▶</span>
            )}
          </button>
          <div className="flex flex-col items-center gap-1">
            <span className="text-[10px] font-mono text-purple-400 tracking-[0.4em] uppercase">
              {isPlaying ? 'Streaming_Signal...' : 'Signal_Ready'}
            </span>
            {error && <span className="text-[8px] text-red-500 font-mono">{error}</span>}
          </div>
        </div>
      )}
    </div>
  );
};
