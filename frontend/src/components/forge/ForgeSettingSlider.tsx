interface ForgeSettingSliderProps {
  label: string;
  value: number | string;
  min: number;
  max: number;
  step: number;
  onChange: (val: number) => void;
  colorClass: string;
  suffix?: string;
  title?: string;
}

export const ForgeSettingSlider = ({ label, value, min, max, step, onChange, colorClass, suffix = '', title }: ForgeSettingSliderProps) => (
  <div className="space-y-2 bg-zinc-950/20 p-3 rounded-xl border border-zinc-800/50" title={title}>
    <div className="flex justify-between text-[9px] font-bold uppercase">
      <span className="text-zinc-500">{label}</span>
      <span className={colorClass.replace('accent-', 'text-')}>{value}{suffix}</span>
    </div>
    <input 
      type="range" min={min} max={max} step={step} value={value} 
      onChange={(e) => onChange(Number(e.target.value))} 
      className={`w-full h-1 ${colorClass} appearance-none bg-zinc-800 rounded-lg cursor-pointer`} 
    />
  </div>
);
