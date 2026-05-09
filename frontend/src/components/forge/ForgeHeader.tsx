interface ForgeHeaderProps {
  title: string;
  unit: string;
  borderColor?: string;
}

export const ForgeHeader = ({ title, unit, borderColor = 'border-purple-500' }: ForgeHeaderProps) => (
  <div className={`space-y-1 border-l-4 ${borderColor} pl-4`}>
    <h1 className="text-2xl font-black uppercase tracking-tighter text-white">{title}</h1>
    <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Unit: {unit}</p>
  </div>
);
