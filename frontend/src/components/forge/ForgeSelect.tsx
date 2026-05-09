interface SelectOption {
  value: string | number;
  label: string;
}

interface ForgeSelectProps {
  label: string;
  value: string | number;
  options: SelectOption[];
  onChange: (val: any) => void;
  colorClass?: string;
  title?: string;
  displayValue?: string;
}

export const ForgeSelect = ({ 
  label, 
  value, 
  options, 
  onChange, 
  colorClass = 'text-orange-500', 
  title,
  displayValue 
}: ForgeSelectProps) => (
  <div className="space-y-2 bg-zinc-950/20 p-3 rounded-xl border border-zinc-800/50" title={title}>
    <div className="flex justify-between text-[9px] font-bold uppercase">
      <span className="text-zinc-500">{label}</span>
      <span className={colorClass}>{displayValue || value}</span>
    </div>
    <select 
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full bg-transparent text-[10px] font-mono text-zinc-300 outline-none cursor-pointer focus:${colorClass} transition-colors py-1`}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value} className="bg-zinc-900">
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);
