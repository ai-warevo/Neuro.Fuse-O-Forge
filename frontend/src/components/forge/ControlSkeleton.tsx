export const ControlSkeleton = () => (
  <div className="space-y-4 animate-pulse">
      <div className="space-y-2 bg-zinc-950/20 p-3 rounded-xl border border-zinc-800/50">
        <div className="flex justify-between">
          <div className="h-2 w-12 bg-zinc-800 rounded-full" />
          <div className="h-2 w-8 bg-zinc-800 rounded-full" />
        </div>
        <div className="h-1.5 w-full bg-zinc-900 rounded-lg" />
      </div>
    <div className="h-10 w-full bg-zinc-900/50 rounded-xl border border-zinc-800/50" />
  </div>
);
