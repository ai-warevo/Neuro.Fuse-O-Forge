import { ForgeControl } from "@/types";
import { ForgeSeedInput } from "./ForgeSeedInput";
import { ForgeSelect } from "./ForgeSelect";
import { ForgeSettingSlider } from "./ForgeSettingSlider";

const CONTROL_MAP: Record<string, React.FC<any>> = {
  slider: ForgeSettingSlider,
  select: ForgeSelect,
  seed: ForgeSeedInput,
};

interface ControlRendererProps {
  ctrl: ForgeControl;
  value: any;
  onChange: (val: any) => void;
}

export const ControlRenderer = ({ ctrl, value, onChange }: ControlRendererProps) => {
  const Component = CONTROL_MAP[ctrl.type];

  if (!Component) {
    return (
      <div className="p-2 border border-dashed border-red-500/50 text-[10px] text-red-500 font-mono">
        UNKNOWN_CONTROL: {ctrl.type}
      </div>
    );
  }

  return (
    <Component
      label={ctrl.label}
      value={value}
      onChange={onChange}
      colorClass={ctrl.colorClass}
      title={ctrl.title}
      {...(ctrl.config || {})}
    />
  );
};
