import axios from 'axios';

export const AUDIO_MODELS = [
  { id: 'cvssp/audioldm2-music', name: 'AudioLDM2 Music' },
  { id: 'facebook/musicgen-small', name: 'MusicGen Small' }
];

export const SONIC_FORGE_CONTROLS = [
  {
    id: 'sample_rate',
    type: 'select',
    label: 'Sample Rate',
    defaultValue: 16000,
    colorClass: 'text-orange-500',
    title: 'Target frequency response. Higher values provide better frequency response.',
    config: { 
      options: [
        { value: 16000, label: '16 kHz (Native)' },
        { value: 24000, label: '24 kHz' },
        { value: 44100, label: '44.1 kHz (Studio)' },
        { value: 48000, label: '48 kHz (Pro)' }
      ],
      displayFormatter: (val: number) => `${val / 1000} kHz`
    }
  },
  {
    id: 'num_inference_steps',
    type: 'slider',
    label: 'Steps',
    defaultValue: 200,
    colorClass: 'accent-blue-500',
    title: 'Number of denoising steps. Higher values (200+) improve audio quality.',
    config: { min: 10, max: 500, step: 10 }
  },
  {
    id: 'audio_length_in_s',
    type: 'slider',
    label: 'Duration',
    defaultValue: 5,
    colorClass: 'accent-purple-500',
    title: 'Total length of the generated audio in seconds.',
    config: { min: 1, max: 60, step: 1, suffix: 's' }
  },
  {
    id: 'guidance_scale',
    type: 'slider',
    label: 'Guidance',
    defaultValue: 3.5,
    colorClass: 'accent-pink-500',
    title: 'Adherence to the prompt. Recommended: 3.0–5.0.',
    config: { min: 1, max: 20, step: 0.5 }
  },
  {
    id: 'seed',
    type: 'seed',
    label: 'Seed',
    defaultValue: Math.floor(Math.random() * 4294967295)
  }
];

const IMAGE_MODELS = [
  { id: 'segmind/tiny-sd', name: 'Tiny-SD (Ultra Fast)' },
  { id: 'runwayml/stable-diffusion-v1-5', name: 'SD v1.5 (Standard)' },
];

export const VISUAL_FORGE_CONTROLS = [
  { 
    id: 'width', 
    type: 'slider', 
    label: 'Width', 
    defaultValue: 512, 
    colorClass: 'accent-blue-500', 
    title: 'Horizontal resolution of the image. Higher values require more VRAM.',
    config: { min: 256, max: 768, step: 64 } 
  },
  { 
    id: 'height', 
    type: 'slider', 
    label: 'Height', 
    defaultValue: 512, 
    colorClass: 'accent-purple-500', 
    title: 'Vertical resolution of the image. Higher values require more VRAM.',
    config: { min: 256, max: 768, step: 64 } 
  },
  { 
    id: 'num_inference_steps', 
    type: 'slider', 
    label: 'Steps', 
    defaultValue: 10, 
    colorClass: 'accent-emerald-500', 
    title: 'Number of denoising iterations. More steps = more detail but slower generation.',
    config: { min: 1, max: 50, step: 1 } 
  },
  { 
    id: 'guidance_scale', 
    type: 'slider', 
    label: 'Guidance', 
    defaultValue: 7.0, 
    colorClass: 'accent-pink-500', 
    title: 'How strictly the model follows your prompt. Recommended range: 6.0-9.0.',
    config: { min: 1, max: 20, step: 0.5 } 
  },
  { 
    id: 'seed', 
    type: 'seed', 
    defaultValue: Math.floor(Math.random() * 4294967295),
    title: 'Random seed for reproducibility. Use the same seed to get the same result.'
  },
  {
    id: 'format',
    type: 'select',
    label: 'Format',
    defaultValue: 'png',
    colorClass: 'text-blue-400',
    title: 'Output file format. PNG is lossless, JPG is compressed.',
    config: {
      options: [
        { value: 'png', label: 'PNG' },
        { value: 'jpg', label: 'JPG' }
      ]
    }
  },
];

const api: any = {
  'IMAGE': { controls: VISUAL_FORGE_CONTROLS, models: IMAGE_MODELS },
  'SOUND': { controls: SONIC_FORGE_CONTROLS, models: AUDIO_MODELS },
}

export const fetchForgeConfig = async (type: string) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const config = api[type];
  if (config) return config;
  throw new Error("Unknown forge type");
};

export const createForgeTask = async (payload: any) => {
  try {
    return await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/tasks`, payload);
  } catch (error) {
    console.error('Forge Error:', error);
  }
};