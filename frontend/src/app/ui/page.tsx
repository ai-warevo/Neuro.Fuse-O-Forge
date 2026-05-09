'use client';

import { UniversalForge } from '@/components/forge';
import { ForgeLayoutVisualizer } from './components/ForgeLayoutVisualizer';

export default function LayoutForge() {
  return (
    <UniversalForge 
      forgeType="UI" 
      placeholder="Describe the UI/UX architecture..."
      defaults={{
        prompt: 'Futuristic trading dashboard, glassmorphism, cyan and dark theme',
        negativePrompt: 'blurry, low quality, text, logos, distorted, real life photos'
      }}
      headerInfo={{ 
        title: "Layout Forge", 
        unit: "ux-architect-v2", 
        color: "border-sky-500",
      }}
      visualizer={ForgeLayoutVisualizer} 
    />
  );
}
