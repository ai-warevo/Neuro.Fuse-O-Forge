'use client';

import { UniversalForge } from '@/components/forge';
import { ForgeImageVisualizer } from './components/ForgeImageVisualizer';

export default function VisualForge() {
  return (
    <UniversalForge 
      forgeType="IMAGE" 
      placeholder="Visualize the neural essence..."
      defaults={{
        prompt: 'Cyberpunk cityscape, neon rain, ultra detailed, 8k', 
        negativePrompt: 'blurry, low quality, distorted, text, watermark'
      }}
      headerInfo={{ 
        title: "Visual Forge", 
        unit: "forge-worker-image-1", 
        color: "border-blue-600",
      }}
      visualizer={ForgeImageVisualizer} 
    />
  );
}
