'use client';

import { useState } from 'react';
import axios from 'axios';
import { PromptForm } from '../components/PromptForm';
import ForgeTerminal from '../components/ForgeTerminal';

const AUDIO_MODELS = [
  { id: 'cvssp/audioldm2-music', name: 'AudioLDM2 Music' },
  { id: 'facebook/musicgen-small', name: 'MusicGen Small' }
];

const SAMPLE_RATES = [
  { value: 16000, label: '16 kHz (Native)' },
  { value: 24000, label: '24 kHz' },
  { value: 44100, label: '44.1 kHz (Studio)' },
  { value: 48000, label: '48 kHz (Pro)' }
];


export default function SonicForge() {
  const [steps, setSteps] = useState(200);
  const [duration, setDuration] = useState(5);
  const [guidance, setGuidance] = useState(3.5);
  const [seed, setSeed] = useState(() => Math.floor(Math.random() * 4294967295));
  const [sampleRate, setSampleRate] = useState(SAMPLE_RATES[0].value);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleGenerate = async (prompt: string, negativePrompt: string, modelId: string) => {
    const payload = {
      prompt,
      type: 'SOUND',
      params: { 
        model_id: modelId,
        negative_prompt: negativePrompt,
        num_inference_steps: steps, 
        audio_length_in_s: duration, 
        guidance_scale: guidance,
        seed: seed,
        sample_rate: sampleRate
      }
    };

    try {
      // При запуске новой генерации можно сбрасывать старый taskId или вешать лоадер
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/tasks`, payload);
      setTaskId(response.data.id);
      console.info("Task Created:", response.data.id);
    } catch (error) {
      console.error('Sonic Error:', error);
    }
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-700">
      
      {/* 🎚️ Left Column: Form (4 cols) */}
      <div className="lg:col-span-4 space-y-6">
        <header className="space-y-1 border-l-4 border-purple-500 pl-4">
          <h1 className="text-2xl font-black uppercase tracking-tighter text-white">Sonic Forge</h1>
          <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Unit: AudioGen-L-04</p>
        </header>

        <div className="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm">
          <PromptForm
            defaults={{prompt: 'lo-fi hip hop beat, calm and relaxing', negativePrompt: 'low quality, noisy, static, speech, vocals'}}
            models={AUDIO_MODELS}
            onGenerate={handleGenerate}
            placeholder="Describe the sonic atmosphere...">

            <div className="space-y-2 bg-zinc-950/20 p-3 rounded-xl border border-zinc-800/50"
                title="Target sample rate for the output audio. Higher values provide better frequency response.">
              <div className="flex justify-between text-[9px] font-bold uppercase">
                <span className="text-zinc-500">Sample Rate</span>
                <span className="text-orange-500">{sampleRate / 1000} kHz</span>
              </div>
              <select 
                value={sampleRate}
                onChange={(e) => setSampleRate(Number(e.target.value))}
                className="w-full bg-transparent text-[10px] font-mono text-zinc-300 outline-hidden cursor-pointer focus:text-orange-500 transition-colors py-1"
              >
                {SAMPLE_RATES.map(rate => (
                  <option key={rate.value} value={rate.value} className="bg-zinc-900">
                    {rate.label}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Твои слайдеры здесь */}
            <div className="space-y-2 bg-zinc-950/20 p-3 rounded-xl border border-zinc-800/50">
                <div className="flex justify-between text-[9px] font-bold uppercase">
                    <span className="text-zinc-500">Steps</span>
                    <span className="text-blue-500">{steps}</span>
                </div>
                <input type="range" min="10" max="500" step="10" value={steps} onChange={(e) => setSteps(Number(e.target.value))} className="w-full h-1 accent-blue-500 appearance-none bg-zinc-800 rounded-lg" />
            </div>

            <div className="space-y-2 bg-zinc-950/20 p-3 rounded-xl border border-zinc-800/50">
                <div className="flex justify-between text-[9px] font-bold uppercase">
                    <span className="text-zinc-500">Duration</span>
                    <span className="text-purple-500">{duration}s</span>
                </div>
                <input type="range" min="1" max="60" step="1" value={duration} onChange={(e) => setDuration(Number(e.target.value))} className="w-full h-1 accent-purple-500 appearance-none bg-zinc-800 rounded-lg" />
            </div>

          {/* Слайдер: Guidance */}
          <div className="space-y-2 bg-zinc-950/20 p-3 rounded-xl border border-zinc-800/50"
               title="Adherence to the prompt. Range: 1.0–20.0. Recommended: 3.0–5.0. (Above 7.0 may cause artifacts).">
            <div className="flex justify-between text-[9px] font-bold uppercase">
              <span className="text-zinc-500">Guidance</span>
              <span className="text-pink-500">{guidance}</span>
            </div>
            <input type="range" min="1" max="20" step="0.5" value={guidance} onChange={(e) => setGuidance(Number(e.target.value))} className="w-full h-1 accent-pink-500 appearance-none bg-zinc-800 rounded-lg" />
          </div>

          {/* Инпут: Seed */}
          <div className="space-y-2 bg-zinc-950/20 p-3 rounded-xl border border-zinc-800/50 group/seed"
              title="Random seed for reproducibility. Range: 0–4294967295. Ensures identical output across runs.">
            <div className="flex justify-between items-center text-[9px] font-bold uppercase">
              <span className="text-zinc-500">Seed</span>
              <button 
                onClick={() => setSeed(Math.floor(Math.random() * 4294967295))}
                className="cursor-pointer text-emerald-500 hover:text-emerald-400 flex items-center gap-1 transition-colors"
              >
                <span>RANDOMIZE</span>
                <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
            <input 
              type="number" 
              value={seed} 
              onChange={(e) => setSeed(Number(e.target.value))} 
              className="w-full bg-transparent text-[10px] font-mono border-b border-zinc-800 focus:border-emerald-500 outline-hidden py-1 transition-colors"
            />
          </div>

          </PromptForm>
        </div>
      </div>

      {/* 🔊 Right Column: Waveform & Player (8 cols) — ВОЗВРАЩЕНО */}
      <div className="lg:col-span-8 space-y-6">
        <div className="relative h-64 bg-zinc-950 rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl flex items-center justify-center group">
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
                className="w-16 h-16 bg-white text-black rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(168,85,247,0.4)] hover:scale-105 transition-transform cursor-pointer"
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

        <div className="rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-lg bg-zinc-950">
          <ForgeTerminal />
        </div>
      </div>
    </div>
  );
}
