
import React, { useState } from 'react';
import { ColorCode } from '../types/color-game';
import { mixColors, getColorName } from '../utils/color-utils';
import ColorBlock from './ColorBlock';
import PlayerCircle from './PlayerCircle';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface ColorMixerProps {
  initialColor: ColorCode;
  availableColors: ColorCode[];
  onMix?: (result: ColorCode) => void;
}

const ColorMixer: React.FC<ColorMixerProps> = ({
  initialColor,
  availableColors,
  onMix,
}) => {
  const [currentColor, setCurrentColor] = useState<ColorCode>(initialColor);
  const [selectedColor, setSelectedColor] = useState<ColorCode | null>(null);
  const [mixResult, setMixResult] = useState<ColorCode | null>(null);

  const handleColorSelect = (color: ColorCode) => {
    setSelectedColor(color);
    const result = mixColors(currentColor, color);
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

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <h3 className="text-lg font-medium mb-4">Color Mixer</h3>
      
      <div className="flex items-center justify-center gap-4 mb-6">
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
      
      <div className="mb-4">
        <p className="text-sm font-medium mb-2">Available Colors</p>
        <div className="flex flex-wrap gap-2">
          {availableColors.map((color) => (
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
