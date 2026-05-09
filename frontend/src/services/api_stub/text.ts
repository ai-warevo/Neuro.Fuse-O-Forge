export const TEXT_MODELS = [
  { id: 'gpt2-medium', name: 'GPT-2 Medium (Fast)' },
  { id: 'meta-llama/Llama-2-7b-hf', name: 'Llama 2 7B' },
  { id: 'mistralai/Mistral-7B-v0.1', name: 'Mistral 7B Neural' }
];

export const LEXI_FORGE_CONTROLS = [
  {
    id: 'max_new_tokens',
    type: 'slider',
    label: 'Length',
    defaultValue: 128,
    colorClass: 'accent-emerald-500',
    title: 'Maximum number of tokens to generate.',
    config: { min: 10, max: 1024, step: 10, suffix: ' tkn' }
  },
  {
    id: 'temperature',
    type: 'slider',
    label: 'Creativity',
    defaultValue: 0.7,
    colorClass: 'accent-amber-500',
    title: 'Higher values make output more random, lower more deterministic.',
    config: { min: 0.1, max: 2.0, step: 0.1 }
  },
  {
    id: 'top_p',
    type: 'slider',
    label: 'Top-P',
    defaultValue: 0.9,
    colorClass: 'accent-cyan-500',
    title: 'Nucleus sampling: only considers tokens with top-P cumulative probability.',
    config: { min: 0.1, max: 1.0, step: 0.05 }
  },
  {
    id: 'repetition_penalty',
    type: 'slider',
    label: 'Penalty',
    defaultValue: 1.1,
    colorClass: 'accent-rose-500',
    title: 'Prevents the model from repeating the same phrases.',
    config: { min: 1.0, max: 2.0, step: 0.1 }
  },
  {
    id: 'seed',
    type: 'seed',
    label: 'Seed',
    defaultValue: Math.floor(Math.random() * 4294967295)
  }
];