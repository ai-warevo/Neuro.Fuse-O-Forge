export const ForgeSeedInput = ({ value, onChange }: { value: number, onChange: (val: number) => void }) => {
  const randomize = () => onChange(Math.floor(Math.random() * 4294967295));
  
  return (
    <div className="space-y-2 bg-zinc-950/20 p-3 rounded-xl border border-zinc-800/50 group/seed" title="Random seed for reproducibility. Ensures identical output across runs.">
      <div className="flex justify-between items-center text-[9px] font-bold uppercase">
        <span className="text-zinc-500">Seed</span>
        <button onClick={randomize} className="cursor-pointer text-emerald-500 hover:text-emerald-400 flex items-center gap-1 transition-colors text-[9px]">
          RANDOMIZE
        </button>
      </div>
      <input 
        type="number" value={value} onChange={(e) => onChange(Number(e.target.value))} 
        className="w-full bg-transparent text-[10px] font-mono border-b border-zinc-800 focus:border-emerald-500 outline-hidden py-1 transition-colors text-zinc-300"
      />
    </div>
  );
};
