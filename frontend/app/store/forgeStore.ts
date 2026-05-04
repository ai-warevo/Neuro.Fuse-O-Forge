import { create } from 'zustand';

export interface ForgeStateActions {
  setTaskId: (taskId: string) => void;
  setTaskStatus: (taskStatus: string) => void;
  addLog: (log: string) => void;
}

export interface ForgeState {
  taskId: string;
  taskStatus: string;
  logs: string[];
  actions: ForgeStateActions
}

export const useForgeStore = create<ForgeState>((set) => ({
  taskId: '',
  taskStatus: '',
  logs: [],
  actions: {
    setTaskId: (taskId: string) => set({ taskId }),
    setTaskStatus: (taskStatus: string) => set({ taskStatus }),
    addLog: (log: string) => set((state) => ({ logs: [...state.logs, log] })),
  }
}));
