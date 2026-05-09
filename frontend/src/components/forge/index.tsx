import { useEffect, useState } from "react";
import { createForgeTask, fetchForgeConfig } from "@/services/api";
import { ForgeControl } from "@/types";
import { ForgeHeader } from "./ForgeHeader";
import { AIModel, PromptForm } from "./PromptForm";
import { ForgeTerminal } from "../ForgeTerminal";
import { ControlRenderer } from "./ControlRenderer";
import { ControlSkeleton } from "./ControlSkeleton";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useForgeStore } from "@/store";

interface UniversalForgeProps
{
  forgeType: string;
  defaults: Record<string, string>;
  headerInfo: Record<string, string>;
  placeholder: string
  visualizer: any;
}

export const UniversalForge = ({ 
  forgeType,
  defaults,
  headerInfo, 
  placeholder,
  visualizer: Visualizer,
}: UniversalForgeProps) => {
  const [data, setData] = useState<{controls: ForgeControl[], models: AIModel[]} | null>(null);
  const [params, setParams] = useState<any>({});
  const [taskId, setTaskId] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const taskResult = useForgeStore(s => s.taskResult);
  useWebSocket(taskId);

  useEffect(() => {
    fetchForgeConfig(forgeType).then((res: any) => {
      setData(res);
      setParams(res.controls.reduce((acc: any, c: any) => ({ ...acc, [c.id]: c.defaultValue }), {}));
    });
  }, [forgeType]);

  const handleUpdate = (id: string, value: any) => {
    setParams((prev: any) => ({ ...prev, [id]: value }));
  };

  const handleGenerate = async (prompt: string, negativePrompt: string, modelId: string) => {
    setIsGenerating(true);
    const payload = {
      prompt,
      type: forgeType,
      params: { 
        ...params, 
        model_id: modelId, 
        negative_prompt: negativePrompt 
      }
    };
    
    try {
      const response = await createForgeTask(payload);
      setTaskId(response?.data.id);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-4 space-y-6">
        <ForgeHeader title={headerInfo.title} unit={headerInfo.unit} borderColor={headerInfo.color} />
        
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-6 shadow-sm">
          <PromptForm key={data ? 'loaded' : 'loading'} 
           placeholder={placeholder} onGenerate={handleGenerate} models={data?.models || null} defaults={defaults}>
              {data?.controls.map((ctrl) => (
                <ControlRenderer
                  key={ctrl.id}
                  ctrl={ctrl}
                  value={params[ctrl.id] ?? ctrl.defaultValue}
                  onChange={(val) => handleUpdate(ctrl.id, val)}
                />
              )) || [1, 2, 3, 4].map((i) => (<ControlSkeleton key={i} />))}
          </PromptForm>
        </div>
      </div>

      <div className="lg:col-span-8 space-y-6">
        <Visualizer taskResult={taskResult} isGenerating={isGenerating}/>
        <ForgeTerminal />
      </div>
    </div>
  );
}
