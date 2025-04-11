import { PostStyle } from "../types";
import { Label } from "./ui/label";
import { stylePresets } from "../styles/presets";

interface StyleSelectorProps {
  currentStyle: PostStyle;
  onStyleChange: (style: PostStyle) => void;
}

export default function StyleSelector({
  currentStyle,
  onStyleChange,
}: StyleSelectorProps) {
  return (
    <div className="space-y-2">
      <Label>Style prédéfini</Label>
      <select
        className="w-full h-9 rounded-md border px-3 py-1 text-sm"
        value={currentStyle.name}
        onChange={(e) => {
          const selectedStyle = stylePresets.find(
            (style) => style.name === e.target.value
          );
          if (selectedStyle) onStyleChange(selectedStyle);
        }}
      >
        {stylePresets.map((style) => (
          <option key={style.name} value={style.name}>
            {style.name}
          </option>
        ))}
      </select>
    </div>
  );
}
