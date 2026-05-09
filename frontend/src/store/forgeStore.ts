import { ForgeTaskResult } from '@/types';
import { create } from 'zustand';

export interface ForgeStateActions {
  setTaskId: (taskId: string) => void;
  setTaskStatus: (taskStatus: string) => void;
  setTaskResult: (taskResult: ForgeTaskResult) => void;
  addLog: (log: string) => void;
}

export interface ForgeState {
  taskId: string;
  taskStatus: string;
  taskResult: ForgeTaskResult;
  logs: string[];
  actions: ForgeStateActions
}

export const useForgeStore = create<ForgeState>((set) => ({
  taskId: '',
  taskStatus: '',
  taskResult: null,
  logs: [],
  actions: {
    setTaskId: (taskId: string) => set({ taskId }),
    setTaskStatus: (taskStatus: string) => set({ taskStatus }),
    setTaskResult: (taskResult: ForgeTaskResult) => set({ taskResult }),
    addLog: (log: string) => set((state) => ({ logs: [...state.logs, log] })),
  }
}));
