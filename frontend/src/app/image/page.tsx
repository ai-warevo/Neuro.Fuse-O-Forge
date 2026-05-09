'use client';

import { useState } from 'react';
import axios from 'axios';
import { PromptForm } from '@/components/forge/PromptForm';
import { ForgeTerminal } from '@/components/ForgeTerminal';

const IMAGE_MODELS = [
  { id: 'segmind/tiny-sd', name: 'Tiny-SD (Ultra Fast)' },
  { id: 'runwayml/stable-diffusion-v1-5', name: 'SD v1.5 (Standard)' },
];

const FORMAT_OPTIONS = [
  { value: 'png', label: 'PNG' },
  { value: 'jpg', label: 'JPG' },
];

export default function VisualForge() {
  const [steps, setSteps] = useState(10);
  const [guidance, setGuidance] = useState(7.0);
  const [width, setWidth] = useState(512);
  const [height, setHeight] = useState(512);
  const [seed, setSeed] = useState(() => Math.floor(Math.random() * 4294967295));
  const [format, setFormat] = useState('png');
  const [taskId, setTaskId] = useState<string | null>(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async (prompt: string, negativePrompt: string, modelId: string) => {
    setIsGenerating(true);
    setGeneratedImageUrl(null);
    const payload = {
      prompt,
      type: 'IMAGE',
      params: { 
        model_id: modelId,
        negative_prompt: negativePrompt,
        num_inference_steps: steps, 
        guidance_scale: guidance,
        width, height, seed, format
      }
    };
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/tasks`, payload);
      setTaskId(response.data.id);
    } catch (error) {
      console.error('Visual Forge Error:', error);
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-700">
      <div className="lg:col-span-4 space-y-6">
        <header className="space-y-1 border-l-4 border-blue-600 pl-4">
          <h1 className="text-2xl font-black uppercase tracking-tighter text-white">Visual Forge</h1>
          <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Unit: Vision-X-01</p>
        </header>

        <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-6 shadow-xl backdrop-blur-md">
          <PromptForm
            defaults={{
                prompt: 'Cyberpunk cityscape, neon rain, ultra detailed, 8k', 
                negativePrompt: 'blurry, low quality, distorted, text, watermark'
            }}
            models={IMAGE_MODELS}
            onGenerate={handleGenerate}
            placeholder="Visualize the neural essence...">

            <div className="col-span-2 flex items-center gap-2 py-2">
                <div className="h-[1px] flex-1 bg-zinc-800" />
                <span className="text-[8px] font-mono text-zinc-600 uppercase tracking-widest">Geometry</span>
                <div className="h-[1px] flex-1 bg-zinc-800" />
            </div>

            <div className="space-y-2 bg-zinc-950/40 p-3 rounded-xl border border-zinc-800/50">
                <div className="flex justify-between text-[9px] font-bold uppercase">
                    <span className="text-zinc-500">Width</span>
                    <span className="text-blue-500">{width}PX</span>
                </div>
                <input type="range" min="256" max="768" step="64" value={width} onChange={(e) => setWidth(Number(e.target.value))} className="w-full h-1 accent-blue-500 appearance-none bg-zinc-800 rounded-lg cursor-pointer" />
            </div>

            <div className="space-y-2 bg-zinc-950/40 p-3 rounded-xl border border-zinc-800/50">
                <div className="flex justify-between text-[9px] font-bold uppercase">
                    <span className="text-zinc-500">Height</span>
                    <span className="text-purple-500">{height}PX</span>
                </div>
                <input type="range" min="256" max="768" step="64" value={height} onChange={(e) => setHeight(Number(e.target.value))} className="w-full h-1 accent-purple-500 appearance-none bg-zinc-800 rounded-lg cursor-pointer" />
            </div>

            <div className="col-span-2 flex items-center gap-2 py-2">
                <div className="h-[1px] flex-1 bg-zinc-800" />
                <span className="text-[8px] font-mono text-zinc-600 uppercase tracking-widest">Physics</span>
                <div className="h-[1px] flex-1 bg-zinc-800" />
            </div>

            {/* Steps & Guidance в ряд */}
            <div className="space-y-2 bg-zinc-950/40 p-3 rounded-xl border border-zinc-800/50">
                <div className="flex justify-between text-[9px] font-bold uppercase">
                    <span className="text-zinc-500">Steps</span>
                    <span className="text-emerald-500">{steps}</span>
                </div>
                <input type="range" min="1" max="50" step="1" value={steps} onChange={(e) => setSteps(Number(e.target.value))} className="w-full h-1 accent-emerald-500 appearance-none bg-zinc-800 rounded-lg cursor-pointer" />
            </div>

            <div className="space-y-2 bg-zinc-950/40 p-3 rounded-xl border border-zinc-800/50">
                <div className="flex justify-between text-[9px] font-bold uppercase">
                    <span className="text-zinc-500">Guidance</span>
                    <span className="text-pink-500">{guidance}</span>
                </div>
                <input type="range" min="1" max="20" step="0.5" value={guidance} onChange={(e) => setGuidance(Number(e.target.value))} className="w-full h-1 accent-pink-500 appearance-none bg-zinc-800 rounded-lg cursor-pointer" />
            </div>
            
            {/* Seed & Format в следующем сообщении */}
            {/* Продолжение PromptForm */}
            <div className="space-y-2 bg-zinc-950/40 p-3 rounded-xl border border-zinc-800/50">
              <div className="flex justify-between text-[9px] font-bold uppercase mb-1">
                <span className="text-zinc-500">Format</span>
                <span className="text-blue-400">{format}</span>
              </div>
              <div className="flex gap-1">
                {FORMAT_OPTIONS.map(opt => (
                  <button key={opt.value} onClick={(e) => {e.preventDefault(); setFormat(opt.value)}} 
                    className={`flex-1 py-1 text-[8px] font-mono rounded border transition-all ${format === opt.value ? 'bg-blue-500/20 border-blue-500 text-blue-400' : 'border-zinc-800 text-zinc-600 hover:border-zinc-700'}`}>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 bg-zinc-950/40 p-3 rounded-xl border border-zinc-800/50 group/seed">
                <div className="flex justify-between items-center text-[9px] font-bold uppercase">
                    <span className="text-zinc-500">Seed</span>
                    <button onClick={(e) => { e.preventDefault(); setSeed(Math.floor(Math.random() * 4294967295)) }} 
                      className="cursor-pointer text-emerald-500 hover:text-emerald-400 flex items-center gap-1 transition-colors text-[8px]">
                        RANDOMIZE
                    </button>
                </div>
                <input type="number" value={seed} onChange={(e) => setSeed(Number(e.target.value))} 
                  className="w-full bg-transparent text-[10px] font-mono border-b border-zinc-800 focus:border-emerald-500 outline-hidden py-1 text-white" />
            </div>

          </PromptForm>
        </div>
      </div>

      {/* 🖼️ RIGHT COLUMN: Viewport & Terminal */}
      <div className="lg:col-span-8 flex flex-col gap-6">
        <div className="relative aspect-square lg:h-[600px] bg-zinc-950 rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl flex items-center justify-center group">
            
            {/* Стилизованные углы Viewport */}
            <div className="absolute top-8 left-8 w-6 h-6 border-t border-l border-zinc-800 rounded-tl" />
            <div className="absolute top-8 right-8 w-6 h-6 border-t border-r border-zinc-800 rounded-tr" />
            <div className="absolute bottom-8 left-8 w-6 h-6 border-b border-l border-zinc-800 rounded-bl" />
            <div className="absolute bottom-8 right-8 w-6 h-6 border-b border-r border-zinc-800 rounded-br" />

            {generatedImageUrl ? (
                <img src={generatedImageUrl} alt="Result" className="w-[85%] h-[85%] object-contain rounded-lg animate-in zoom-in-95 duration-500 shadow-2xl" />
            ) : (
                <div className="relative z-10 text-center space-y-6">
                    <div className="w-20 h-20 border border-dashed border-zinc-800 rounded-2xl mx-auto flex items-center justify-center animate-[spin_15s_linear_infinite]">
                        <div className="w-10 h-10 border border-blue-500/10 rounded-full animate-pulse" />
                    </div>
                    <div className="space-y-1">
                        <p className="text-[9px] font-black uppercase tracking-[0.5em] text-zinc-700">Visual Signal Pending</p>
                        <p className="text-[7px] font-mono text-zinc-800 uppercase tracking-widest">Awaiting_Neural_Reconstruction</p>
                    </div>
                </div>
            )}
            
            {/* Overlay генерации */}
            {isGenerating && (
                <div className="absolute inset-0 z-20 bg-zinc-950/80 backdrop-blur-md flex flex-col items-center justify-center gap-6">
                    <div className="relative w-12 h-12">
                        <div className="absolute inset-0 border-2 border-blue-500/10 rounded-full" />
                        <div className="absolute inset-0 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                    <div className="flex flex-col items-center gap-3">
                        <span className="text-[9px] font-mono text-blue-400 animate-pulse tracking-[0.3em]">FORGING_IMAGE_DATA_v1.0</span>
                        <div className="w-40 h-[1px] bg-zinc-800 rounded-full overflow-hidden">
                            <div className="w-full h-full bg-blue-500 animate-[shimmer_2s_infinite]" />
                        </div>
                    </div>
                </div>
            )}
        </div>

        {/* Terminal Area */}
        <div className="bg-zinc-950 rounded-3xl border border-zinc-800 overflow-hidden shadow-xl">
          <ForgeTerminal />
        </div>
      </div>
    </div>
  );
}
