export type ControlType = 'slider' | 'select' | 'seed' | 'number';

export interface ForgeControl {
  id: string;
  type: ControlType;
  label: string;
  defaultValue: any;
  config: any;
  colorClass: string;
  title?: string;
}

interface IForgeTaskResult {
  error_message: string;
  status: string;
  result: string
  task_type: string;
}
export type ForgeTaskResult = IForgeTaskResult | null | undefined;

export enum ForgeTaskStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  SUCCESS = "SUCCESS",
  ERROR = "ERROR",
  TIMEOUT = "TIMEOUT"
}

export enum ForgeType {
  SOUND = "SOUND",
  IMAGE = "IMAGE",
  TEXT = "TEXT",
  UI = "UI"
}