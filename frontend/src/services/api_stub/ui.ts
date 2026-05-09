export const UI_MODELS = [
  { id: 'stabilityai/stable-diffusion-xl-base-1.0', name: 'SDXL Architecture' },
  { id: 'runwayml/stable-diffusion-v1-5', name: 'SD 1.5 Legacy' }
];

export const LAYOUT_FORGE_CONTROLS = [
  {
    id: 'num_inference_steps',
    type: 'slider',
    label: 'Steps',
    defaultValue: 30,
    colorClass: 'accent-sky-500',
    title: 'Number of denoising steps. Higher values (30-50) improve detail.',
    config: { min: 10, max: 100, step: 1 }
  },
  {
    id: 'guidance_scale',
    type: 'slider',
    label: 'Guidance',
    defaultValue: 7.5,
    colorClass: 'accent-indigo-500',
    title: 'How closely the model follows your prompt. Recommended: 7.0–9.0.',
    config: { min: 1, max: 20, step: 0.5 }
  },
  {
    id: 'sampler',
    type: 'select',
    label: 'Sampler',
    defaultValue: 'euler_a',
    colorClass: 'text-sky-400',
    title: 'The algorithm used for the diffusion process.',
    config: { 
      options: [
        { value: 'euler_a', label: 'Euler Ancestral' },
        { value: 'dpmpp_2m', label: 'DPM++ 2M Karras' },
        { value: 'ddim', label: 'DDIM' }
      ]
    }
  },
  {
    id: 'seed',
    type: 'seed',
    label: 'Seed',
    defaultValue: Math.floor(Math.random() * 4294967295)
  }
];