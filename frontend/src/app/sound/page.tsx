'use client';

import { useState } from 'react';
import axios from 'axios';
import { PromptForm } from '@/components/PromptForm';
import { ForgeTerminal } from '@/components/ForgeTerminal';
import { ForgeAudioVisualizer } from './components/ForgeAudioVisualizer';
import { ForgeHeader } from '@/components/forge/ForgeHeader';
import { ForgeSettingSlider } from '@/components/forge/ForgeSettingSlider';
import { ForgeSeedInput } from '@/components/forge/ForgeSeedInput';
import { ForgeSelect } from '@/components/forge/ForgeSelect';

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
      <div className="lg:col-span-4 space-y-6">
        <ForgeHeader title="Sonic Forge" unit="AudioGen-L-04" />
        
        <div className="bg-white dark:bg-zinc-900/40 border border-zinc-800 rounded-3xl p-6 shadow-sm">
          <PromptForm
            defaults={{prompt: 'lo-fi hip hop beat, calm and relaxing', negativePrompt: 'low quality, noisy, static, speech, vocals'}}
            models={AUDIO_MODELS}
            onGenerate={handleGenerate}
            placeholder="Describe the sonic atmosphere...">
            <ForgeSelect 
              label="Sample Rate"
              value={sampleRate}
              displayValue={`${sampleRate / 1000} kHz`}
              options={SAMPLE_RATES}
              onChange={(val) => setSampleRate(Number(val))}
              colorClass="text-orange-500"
              title="Target sample rate for the output audio. Higher values provide better frequency response."
            />

            <ForgeSettingSlider label="Steps" value={steps} min={10} max={500} step={10} onChange={setSteps} colorClass="accent-blue-500" title="Number of denoising steps. Higher values (200+) improve audio quality and detail but increase generation time." />

            <ForgeSettingSlider label="Duration" value={duration} min={1} max={60} step={1} onChange={setDuration} colorClass="accent-purple-500" suffix="s" title="Total length of the generated audio in seconds. Maximum duration is 60s."/>

            <ForgeSettingSlider label="Guidance" value={guidance} min={1} max={20} step={0.5} onChange={setGuidance} colorClass="accent-pink-500" title="Adherence to the prompt. Range: 1.0–20.0. Recommended: 3.0–5.0. (Above 7.0 may cause artifacts)."/>

            <ForgeSeedInput value={seed} onChange={setSeed} />
          </PromptForm>
        </div>
      </div>

      <div className="lg:col-span-8 space-y-6">
        <ForgeAudioVisualizer isPlaying={isPlaying} taskId={taskId} onTogglePlay={() => setIsPlaying(!isPlaying)} />
        <ForgeTerminal />
      </div>
    </div>
  );
}
