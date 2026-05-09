import { ForgeTaskResult, ForgeTaskStatus } from "@/types";

export const ForgeImageVisualizer = ({ isGenerating, taskResult}: { isGenerating: boolean, taskResult: ForgeTaskResult}) => {
  const generatedImageUrl = taskResult?.status === ForgeTaskStatus.SUCCESS ? taskResult.result : null;
  const error = (taskResult?.status === ForgeTaskStatus.ERROR || taskResult?.status === ForgeTaskStatus.TIMEOUT)
    ? taskResult.error_message
    : null;

  return (
  <div className="relative aspect-square lg:h-[600px] bg-zinc-950 rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl flex items-center justify-center group">
      
      {/* Стилизованные углы Viewport */}
      <div className="absolute top-8 left-8 w-6 h-6 border-t border-l border-zinc-800 rounded-tl" />
      <div className="absolute top-8 right-8 w-6 h-6 border-t border-r border-zinc-800 rounded-tr" />
      <div className="absolute bottom-8 left-8 w-6 h-6 border-b border-l border-zinc-800 rounded-bl" />
      <div className="absolute bottom-8 right-8 w-6 h-6 border-b border-r border-zinc-800 rounded-br" />

      {error && !isGenerating && (
        <div className="absolute top-12 text-red-500 font-mono text-[10px] z-30 bg-red-500/5 px-3 py-1 border border-red-500/20 rounded">
          ERROR: {error}
        </div>
      )}

      {generatedImageUrl ? (
          <img src={generatedImageUrl} alt="Result" className="w-[85%] h-[85%] object-contain rounded-lg animate-in zoom-in-95 duration-500 shadow-2xl" />
      ) : (
          <div className="relative z-10 text-center space-y-6">
              <div className="w-20 h-20 border border-dashed border-zinc-800 rounded-2xl mx-auto flex items-center justify-center animate-[spin_15s_linear_infinite]">
                  <div className="w-10 h-10 border border-blue-500/10 rounded-full animate-pulse" />
              </div>
              <div className="space-y-1">
                  <p className="text-[9px] font-black uppercase tracking-[0.5em] text-zinc-700">Visual Signal Pending</p>
                  <p className="text-[7px] font-mono text-zinc-800 uppercase tracking-widest">Awaiting_Neural_Reconstruction</p>
              </div>
          </div>
      )}
      
      {/* Overlay генерации */}
      {isGenerating && (
          <div className="absolute inset-0 z-20 bg-zinc-950/80 backdrop-blur-md flex flex-col items-center justify-center gap-6">
              <div className="relative w-12 h-12">
                  <div className="absolute inset-0 border-2 border-blue-500/10 rounded-full" />
                  <div className="absolute inset-0 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              </div>
              <div className="flex flex-col items-center gap-3">
                  <span className="text-[9px] font-mono text-blue-400 animate-pulse tracking-[0.3em]">FORGING_IMAGE_DATA_v1.0</span>
                  <div className="w-40 h-[1px] bg-zinc-800 rounded-full overflow-hidden">
                      <div className="w-full h-full bg-blue-500 animate-[shimmer_2s_infinite]" />
                  </div>
              </div>
          </div>
      )}
  </div>
  );
};