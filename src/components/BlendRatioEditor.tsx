
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ColorCode } from '../types/color-game';
import ColorBlock from './ColorBlock';
import PlayerCircle from './PlayerCircle';
import { mixColors, hexToRgb, rgbToHex } from '../utils/color-utils';

interface BlendRatioEditorProps {
  color1: ColorCode | string;
  color2: ColorCode | string;
  ratio: number;
  onRatioChange: (ratio: number) => void;
  useSimpleMixing?: boolean;
  onMixingModeChange?: (useSimple: boolean) => void;
  tolerance?: number;
  onToleranceChange?: (tolerance: number) => void;
}

const BlendRatioEditor: React.FC<BlendRatioEditorProps> = ({
  color1,
  color2,
  ratio,
  onRatioChange,
  useSimpleMixing = false,
  onMixingModeChange,
  tolerance = 0,
  onToleranceChange,
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
  
  const handleToleranceChange = (value: number[]) => {
    if (onToleranceChange) {
      onToleranceChange(value[0]);
    }
  };

  // For tolerance visualization
  const getToleranceColor = (baseColor: string, toleranceValue: number, lighter: boolean): string => {
    if (toleranceValue === 0) return baseColor;
    
    const rgb = hexToRgb(baseColor);
    const adjustment = lighter ? toleranceValue : -toleranceValue;
    
    return rgbToHex(
      Math.min(255, Math.max(0, rgb.r + adjustment)),
      Math.min(255, Math.max(0, rgb.g + adjustment)),
      Math.min(255, Math.max(0, rgb.b + adjustment))
    );
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
      
      {onToleranceChange && (
        <div className="pt-2 border-t">
          <Label htmlFor="tolerance-slider" className="text-xs">Color Tolerance: {tolerance}</Label>
          <div className="flex items-center gap-2 mt-1">
            <Slider
              id="tolerance-slider"
              value={[tolerance]}
              min={0}
              max={50}
              step={1}
              onValueChange={handleToleranceChange}
            />
            <div className="flex-shrink-0 w-10 text-xs">{tolerance}</div>
          </div>
          
          {tolerance > 0 && (
            <div className="flex items-center justify-center mt-2 gap-1">
              <div 
                className="w-6 h-6 rounded-full" 
                style={{backgroundColor: getToleranceColor(typeof result === 'string' ? result : '#CCCCCC', tolerance, false)}}
              ></div>
              <div 
                className="w-6 h-6 rounded-full" 
                style={{backgroundColor: typeof result === 'string' ? result : '#CCCCCC'}}
              ></div>
              <div 
                className="w-6 h-6 rounded-full" 
                style={{backgroundColor: getToleranceColor(typeof result === 'string' ? result : '#CCCCCC', tolerance, true)}}
              ></div>
              <span className="text-xs ml-1">Acceptable range</span>
            </div>
          )}
        </div>
      )}
      
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
