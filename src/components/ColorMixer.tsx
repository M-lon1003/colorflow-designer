
import React, { useState } from 'react';
import { ColorCode } from '../types/color-game';
import { mixColors, getColorName, getAllAvailableColors } from '../utils/color-utils';
import ColorBlock from './ColorBlock';
import PlayerCircle from './PlayerCircle';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { ArrowRight } from 'lucide-react';

interface ColorMixerProps {
  initialColor: ColorCode | string;
  availableColors: (ColorCode | string)[];
  onMix?: (result: ColorCode | string) => void;
}

const ColorMixer: React.FC<ColorMixerProps> = ({
  initialColor,
  availableColors,
  onMix,
}) => {
  const [currentColor, setCurrentColor] = useState<ColorCode | string>(initialColor);
  const [selectedColor, setSelectedColor] = useState<ColorCode | string | null>(null);
  const [mixResult, setMixResult] = useState<ColorCode | string | null>(null);
  const [useSimpleMixing, setUseSimpleMixing] = useState(false);
  const [showAllHexColors, setShowAllHexColors] = useState(false);
  const [blendRatio, setBlendRatio] = useState(0.5);

  // Determine which colors to display based on the showAllHexColors setting
  const displayColors = showAllHexColors 
    ? availableColors 
    : availableColors.filter(color => typeof color === 'string' && !color.startsWith('#'));

  const handleColorSelect = (color: ColorCode | string) => {
    setSelectedColor(color);
    const result = mixColors(currentColor, color, blendRatio, useSimpleMixing);
    setMixResult(result);
  };

  const handleMixConfirm = () => {
    if (mixResult && onMix) {
      setCurrentColor(mixResult);
      onMix(mixResult);
      setSelectedColor(null);
      setMixResult(null);
    }
  };

  const handleRatioChange = (value: number[]) => {
    const newRatio = value[0] / 100;
    setBlendRatio(newRatio);
    if (selectedColor) {
      const result = mixColors(currentColor, selectedColor, newRatio, useSimpleMixing);
      setMixResult(result);
    }
  };

  const handleMixingModeChange = (checked: boolean) => {
    setUseSimpleMixing(checked);
    if (selectedColor) {
      const result = mixColors(currentColor, selectedColor, blendRatio, checked);
      setMixResult(result);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <h3 className="text-lg font-medium mb-4">Color Mixer</h3>
      
      <div className="space-y-4 mb-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="show-all-colors" className="text-sm">Show Only Standard Colors</Label>
          <Switch
            id="show-all-colors"
            checked={!showAllHexColors}
            onCheckedChange={(checked) => setShowAllHexColors(!checked)}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="use-simple-mixing" className="text-sm">Use Standard Color Mixing</Label>
          <Switch
            id="use-simple-mixing"
            checked={useSimpleMixing}
            onCheckedChange={handleMixingModeChange}
          />
        </div>
      </div>
      
      <div className="flex items-center justify-center gap-4 mb-6 flex-wrap">
        <div className="text-center">
          <p className="text-sm text-gray-500 mb-1">Current</p>
          <PlayerCircle color={currentColor} size="lg" />
          <p className="text-xs mt-1">{getColorName(currentColor)}</p>
        </div>
        
        {selectedColor && (
          <>
            <ArrowRight className="text-gray-400" />
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-1">Mix with</p>
              <ColorBlock color={selectedColor} size="lg" showLabel />
              <p className="text-xs mt-1">{getColorName(selectedColor)}</p>
            </div>
            
            <ArrowRight className="text-gray-400" />
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-1">Result</p>
              <PlayerCircle color={mixResult!} size="lg" />
              <p className="text-xs mt-1">{getColorName(mixResult!)}</p>
            </div>
          </>
        )}
      </div>
      
      {selectedColor && (
        <div className="mb-4">
          <Label className="text-sm mb-1 block">Blend Ratio: {blendRatio.toFixed(2)}</Label>
          <Slider
            value={[blendRatio * 100]}
            min={0}
            max={100}
            step={1}
            onValueChange={handleRatioChange}
            className="mb-4"
          />
        </div>
      )}
      
      <div className="mb-4">
        <p className="text-sm font-medium mb-2">Available Colors</p>
        <div className="flex flex-wrap gap-2">
          {displayColors.map((color) => (
            <ColorBlock
              key={color}
              color={color}
              isSelected={selectedColor === color}
              onClick={() => handleColorSelect(color)}
              showLabel
            />
          ))}
        </div>
      </div>
      
      {selectedColor && (
        <Button 
          className="w-full" 
          onClick={handleMixConfirm}
        >
          Apply Mix
        </Button>
      )}
    </div>
  );
};

export default ColorMixer;
