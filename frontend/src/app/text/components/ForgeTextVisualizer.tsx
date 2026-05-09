'use client';

import { ForgeTaskResult, ForgeTaskStatus } from "@/types";
import { useEffect, useState } from "react";

export const ForgeTextVisualizer = ({ isGenerating, taskResult }: { isGenerating: boolean, taskResult: ForgeTaskResult }) => {
  const [displayText, setDisplayText] = useState("");
  const [isLoadingFile, setIsLoadingFile] = useState(false);

  const fileUrl = taskResult?.status === ForgeTaskStatus.SUCCESS ? taskResult.result : null;

  useEffect(() => {
    if (fileUrl) {
      setIsLoadingFile(true);
      fetch(fileUrl)
        .then(res => res.text())
        .then(text => {
          setDisplayText(text);
          setIsLoadingFile(false);
        })
        .catch(err => {
          console.error("Failed to load text:", err);
          setDisplayText("Error loading generated text.");
          setIsLoadingFile(false);
        });
    } else {
      setDisplayText("");
    }
  }, [fileUrl]);

  return (
    <div className="relative h-64 bg-zinc-950 rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl flex flex-col group font-mono">
      <div className="flex items-center gap-2 px-4 py-2 border-b border-zinc-900 bg-zinc-900/50">
        <div className="flex gap-1.5">
          <div className="w-2 h-2 rounded-full bg-red-500/50" />
          <div className="w-2 h-2 rounded-full bg-orange-500/50" />
          <div className="w-2 h-2 rounded-full bg-emerald-500/50" />
        </div>
        <span className="text-[9px] text-zinc-500 uppercase tracking-tighter">Neural_Output_Terminal</span>
      </div>

      <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
        {(isGenerating || isLoadingFile) ? (
          <div className="flex items-center gap-3">
            <div className="w-1 h-4 bg-emerald-500 animate-pulse" />
            <p className="text-[10px] text-emerald-500/70 uppercase tracking-widest animate-pulse">
              {isGenerating ? "Synthesizing_Thought..." : "Downloading_Buffer..."}
            </p>
          </div>
        ) : displayText ? (
          <div className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap animate-in fade-in duration-700">
            <span className="text-emerald-500 mr-2 opacity-50">&gt;</span>
            {displayText}
            <span className="inline-block w-2 h-4 ml-1 bg-emerald-500 animate-bounce" />
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-800">
              Awaiting Lexical Input
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
