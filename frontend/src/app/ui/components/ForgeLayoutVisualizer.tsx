'use client';

import { ForgeTaskResult, ForgeTaskStatus } from "@/types";
import { useState } from "react";

export const ForgeLayoutVisualizer = ({ isGenerating, taskResult }: { isGenerating: boolean, taskResult: ForgeTaskResult }) => {
  const [activeTab, setActiveTab] = useState<'desktop' | 'mobile'>('desktop');
  const basePath = taskResult?.status === ForgeTaskStatus.SUCCESS ? taskResult.result : null;
  const desktopUrl = basePath ? basePath.replace(".png", "_desktop.png") : null;
  const mobileUrl = basePath ? basePath.replace(".png", "_mobile.png") : null;

  return (
    /* Убираем items-center и justify-center отсюда */
    <div className="flex flex-col h-full w-full">
      
      {/* 1. Навигация (кнопки) — теперь они сверху */}
      <div className="flex gap-2 p-1 bg-zinc-900/50 rounded-lg w-fit border border-zinc-800 mb-6">
        {(['desktop', 'mobile'] as const).map((mode) => (
          <button 
            key={mode} 
            onClick={() => setActiveTab(mode)}
            className={`px-6 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded transition-all ${
              activeTab === mode ? 'bg-sky-500 text-white' : 'text-zinc-500'
            }`}
          >
            {mode}
          </button>
        ))}
      </div>

      {/* 2. Контейнер результата — меняем justify-center на justify-start */}
      <div className="relative flex-1 bg-zinc-950 rounded-3xl border border-zinc-800/50 overflow-hidden flex flex-col items-center justify-start p-0 group">
        
        {/* Сетка */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px]" />
        
        {basePath ? (
          /* Обертка для картинки с небольшим отступом сверху */
          <div className={`relative z-10 transition-all duration-700 mt-10 ${
            activeTab === 'desktop' ? 'w-[90%]' : 'w-[300px]'
          }`}>
            <img 
              src={activeTab === 'desktop' ? desktopUrl! : mobileUrl!} 
              className="w-full h-auto object-contain rounded-xl border border-white/5 shadow-[0_0_60px_rgba(14,165,233,0.15)]"
              alt="UI Preview"
            />
          </div>
        ) : (
          /* Центрируем только лоадер или пустой стейт */
          <div className="flex-1 flex items-center justify-center">
             <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-800">Awaiting_Signal</p>
          </div>
        )}
      </div>
    </div>
  );
};
