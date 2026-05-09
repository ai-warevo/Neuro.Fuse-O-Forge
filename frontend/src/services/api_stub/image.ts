export const IMAGE_MODELS = [
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