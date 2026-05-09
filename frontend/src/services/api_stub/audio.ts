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