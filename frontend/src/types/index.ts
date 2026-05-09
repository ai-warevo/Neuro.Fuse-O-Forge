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