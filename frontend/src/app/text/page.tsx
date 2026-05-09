'use client';

import { UniversalForge } from '@/components/forge';
import { ForgeTextVisualizer } from './components/ForgeTextVisualizer';

export default function LexiForge() {
  return (
    <UniversalForge 
      forgeType="TEXT" 
      placeholder="Enter your prompt for text generation..."
      defaults={{
        prompt: 'The future of artificial intelligence is',
        negativePrompt: 'boring, repetitive, nonsensical'
      }}
      headerInfo={{ 
        title: "Lexi Forge", 
        unit: "forge-worker-text-1", 
        color: "border-emerald-500",
      }}
      visualizer={ForgeTextVisualizer} 
    />
  );
}
