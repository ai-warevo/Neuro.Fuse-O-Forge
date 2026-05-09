import { useState } from "react";
import axios from 'axios';
import { ForgeHeader } from "./ForgeHeader";
import { PromptForm } from "./PromptForm";
import { ForgeSettingSlider } from "./ForgeSettingSlider";
import { ForgeControl } from "@/types";
import { ForgeSelect } from "./ForgeSelect";
import { ForgeSeedInput } from "./ForgeSeedInput";
import { ForgeTerminal } from "../ForgeTerminal";

export default function UniversalForge({ 
  forgeType,
  headerInfo, 
  controls, 
  visualizer: Visualizer,
  placeholder
}: any) {
  const [params, setParams] = useState(() => 
    controls.reduce((acc: any, ctrl: any) => ({ ...acc, [ctrl.id]: ctrl.defaultValue }), {})
  );
  const [taskId, setTaskId] = useState<string | null>(null);

  const handleUpdate = (id: string, value: any) => {
    setParams((prev: any) => ({ ...prev, [id]: value }));
  };

  const handleGenerate = async (prompt: string, negativePrompt: string, modelId: string) => {
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
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/tasks`, payload);
      setTaskId(response.data.id);
    } catch (error) { console.error('Forge Error:', error); }
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-4 space-y-6">
        <ForgeHeader title={headerInfo.title} unit={headerInfo.unit} borderColor={headerInfo.color} />
        
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-6 shadow-sm">
          <PromptForm placeholder={placeholder} onGenerate={handleGenerate} models={headerInfo.models} defaults={headerInfo.defaults}>
            {controls.map((ctrl: ForgeControl) => {
              if (ctrl.type === 'slider') return (
                <ForgeSettingSlider key={ctrl.id} label={ctrl.label} value={params[ctrl.id]} {...ctrl.config} 
                  onChange={(v) => handleUpdate(ctrl.id, v)} colorClass={ctrl.colorClass} title={ctrl.title} />
              );
              if (ctrl.type === 'select') return (
                <ForgeSelect key={ctrl.id} label={ctrl.label} value={params[ctrl.id]} {...ctrl.config} 
                  onChange={(v) => handleUpdate(ctrl.id, v)} colorClass={ctrl.colorClass} title={ctrl.title} />
              );
              if (ctrl.type === 'seed') return (
                <ForgeSeedInput key={ctrl.id} value={params[ctrl.id]} onChange={(v) => handleUpdate(ctrl.id, v)} />
              );
              return null;
            })}
          </PromptForm>
        </div>
      </div>

      <div className="lg:col-span-8 space-y-6">
        <Visualizer taskId={taskId} />
        <ForgeTerminal />
      </div>
    </div>
  );
}
