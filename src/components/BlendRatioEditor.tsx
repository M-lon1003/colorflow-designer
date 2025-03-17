
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ColorCode } from '../types/color-game';
import ColorBlock from './ColorBlock';
import PlayerCircle from './PlayerCircle';
import { mixColors } from '../utils/color-utils';

interface BlendRatioEditorProps {
  color1: ColorCode | string;
  color2: ColorCode | string;
  ratio: number;
  onRatioChange: (ratio: number) => void;
  useSimpleMixing?: boolean;
  onMixingModeChange?: (useSimple: boolean) => void;
}

const BlendRatioEditor: React.FC<BlendRatioEditorProps> = ({
  color1,
  color2,
  ratio,
  onRatioChange,
  useSimpleMixing = false,
  onMixingModeChange,
}) => {
  const result = mixColors(color1, color2, ratio, useSimpleMixing);
  
  const handleSliderChange = (value: number[]) => {
    onRatioChange(value[0] / 100);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    if (!isNaN(newValue) && newValue >= 0 && newValue <= 1) {
      onRatioChange(newValue);
    }
  };

  const handleMixingModeChange = (checked: boolean) => {
    if (onMixingModeChange) {
      onMixingModeChange(checked);
    }
  };
  
  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <h3 className="text-base font-medium">Blend Ratio Editor</h3>
      
      <div className="flex items-center justify-between space-x-4">
        <div className="text-center">
          <ColorBlock color={color1 as ColorCode | string} size="md" />
          <p className="text-xs mt-1">Color 1</p>
        </div>
        
        <div className="flex-1">
          <Slider
            value={[ratio * 100]}
            min={0}
            max={100}
            step={1}
            onValueChange={handleSliderChange}
          />
        </div>
        
        <div className="text-center">
          <ColorBlock color={color2 as ColorCode | string} size="md" />
          <p className="text-xs mt-1">Color 2</p>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="w-1/3">
          <Label htmlFor="ratio-input" className="text-xs">Ratio</Label>
          <Input
            id="ratio-input"
            type="number"
            min={0}
            max={1}
            step={0.01}
            value={ratio}
            onChange={handleInputChange}
            className="h-8 text-xs"
          />
        </div>
        
        <div className="text-center">
          <p className="text-xs mb-1">Result</p>
          <PlayerCircle color={result} size="md" />
        </div>
      </div>
      
      {onMixingModeChange && (
        <div className="flex items-center justify-between pt-2 border-t">
          <Label htmlFor="use-simple-mixing" className="text-xs">Use Standard Color Mixing</Label>
          <Switch
            id="use-simple-mixing"
            checked={useSimpleMixing}
            onCheckedChange={handleMixingModeChange}
          />
        </div>
      )}
    </div>
  );
};

export default BlendRatioEditor;
