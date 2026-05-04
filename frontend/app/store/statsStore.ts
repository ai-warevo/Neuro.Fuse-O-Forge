import { create } from 'zustand';

export interface StatsStateActions {
  setGpuLoad: (gpuLoad: number) => void;
  setWorkersAvailable: (workersAvailable: boolean) => void;
}

export interface StatsState {
  gpuLoad: number;
  workersAvailable: boolean;
  actions: StatsStateActions;
}

export const useStatsStore = create<StatsState>((set) => ({
  gpuLoad: 0,
  workersAvailable: true,
  actions: {
    setGpuLoad: (gpuLoad: number) => set({ gpuLoad }),
    setWorkersAvailable: (workersAvailable: boolean) => set({ workersAvailable }),
  }
}));
