'use client';

import { useState, ReactNode, useEffect } from 'react';
import { ForgeSelect } from './ForgeSelect';
import { ControlSkeleton } from './ControlSkeleton';

interface PromptFormProps {
  onGenerate: (prompt: string, negativePrompt: string, modelId: string) => void;
  children?: ReactNode;
  placeholder?: string;
  models: AIModel[] | null;
  defaults: Record<string, string>;
}

export interface AIModel {
  id: string;
  name: string;
}

export const PromptForm = ({ defaults, onGenerate, models, children, placeholder }: PromptFormProps) => {
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [selectedModel, setSelectedModel] = useState('');

  useEffect(() => {
    if (defaults?.prompt) setPrompt(defaults.prompt);
    if (defaults?.negativePrompt) setNegativePrompt(defaults.negativePrompt);
  }, [defaults]);

  useEffect(() => {
    if (!selectedModel && models?.length) {
      setSelectedModel(models[0].id);
    }
  }, [models]);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-top-2 duration-500">
      {/* 📝 Main Prompt */}
      <div className="group space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-1">Neural Input</label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={placeholder || "Describe the essence..."}
          rows={3}
          className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-4 rounded-2xl font-mono text-sm outline-hidden ring-blue-500/20 focus:ring-4 focus:border-blue-500/50 transition-all resize-none shadow-inner"
        />
      </div>

      {/* 🚫 Negative Prompt (Общий для всех воркеров) */}
      <div className="group space-y-2">
        <div className="flex items-center gap-2 px-1" title="What to exclude from the output. Helps remove noise or unwanted artifacts.">
          <label className="text-[10px] font-black uppercase tracking-widest text-red-500/60">Negative Shield</label>
          <span className="text-[8px] border border-red-500/20 text-red-500/50 px-1 rounded">FILTER</span>
        </div>
        <input
          type="text"
          value={negativePrompt}
          onChange={(e) => setNegativePrompt(e.target.value)}
          placeholder="low quality, noise, distortion..."
          className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 px-4 py-3 rounded-xl font-mono text-[11px] outline-hidden focus:border-red-500/30 transition-all"
        />
      </div>

      {/* 🤖 Model Selector (Общий компонент) */}
      ai={selectedModel}
      {models && (<ForgeSelect
        value={selectedModel}
        onChange={(val) => setSelectedModel(val)}
        options={models.map(m => ({label: m.name, value: m.id}))}
        label="Neural Core Selection"
        colorClass="text-zinc-400 "
      />) || <ControlSkeleton />}

      {/* ⚙️ Сюда вставятся специфичные слайдеры (Steps, Duration, etc.) */}
      <div className="grid grid-cols-2 gap-4">
        {children}
      </div>

      {/* 🔥 Кнопка запуска */}
      <button
        onClick={() => onGenerate(prompt, negativePrompt, selectedModel)}
        className="cursor-pointer group relative w-full overflow-hidden bg-zinc-900 dark:bg-white text-white dark:text-black py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all active:scale-[0.98]"
      >
        <div className="absolute inset-0 bg-linear-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <span className="relative z-10 flex items-center justify-center gap-3">
          Execute Generation
          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </span>
      </button>
    </div>
  );
};
