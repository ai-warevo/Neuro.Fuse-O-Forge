'use client';

import { UniversalForge } from '@/components/forge';
import { ForgeAudioVisualizer } from './components/ForgeAudioVisualizer';

export default function SonicForge() {
  return (
    <UniversalForge 
      forgeType="SOUND" 
      placeholder="Describe the sonic atmosphere..."
      defaults={{
        prompt: 'lo-fi hip hop beat, calm and relaxing',
        negativePrompt: 'low quality, noisy, static, speech, vocals'
      }}
      headerInfo={{ 
        title: "Sonic Forge", 
        unit: "forge-worker-sound-1", 
        color: "border-purple-500",
      }}
      visualizer={ForgeAudioVisualizer} 
    />
  );
}
