import axios from 'axios';
import { AUDIO_MODELS, IMAGE_MODELS, LEXI_FORGE_CONTROLS, SONIC_FORGE_CONTROLS, TEXT_MODELS, VISUAL_FORGE_CONTROLS } from './api_stub';

const api: any = {
  'IMAGE': { controls: VISUAL_FORGE_CONTROLS, models: IMAGE_MODELS },
  'SOUND': { controls: SONIC_FORGE_CONTROLS, models: AUDIO_MODELS },
  'TEXT': { controls: LEXI_FORGE_CONTROLS, models: TEXT_MODELS },
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