import React, { useState, useEffect } from 'react';
import { ColorCode } from '../types/color-game';
import { 
  mixColors, 
  getColorName, 
  getAllAvailableColors, 
  findOptimalBlendRatio,
  colorsMatch 
} from '../utils/color-utils';
import ColorBlock from './ColorBlock';
import PlayerCircle from './PlayerCircle';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { ArrowRight, Wand2, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ColorMixerProps {
  initialColor: ColorCode | string;
  targetColor?: ColorCode | string;
  availableColors: (ColorCode | string)[];
  onMix?: (result: ColorCode | string) => void;
  tolerance?: number;
  maxSteps?: number;
}

const ColorMixer: React.FC<ColorMixerProps> = ({
  initialColor,
  targetColor,
  availableColors,
  onMix,
  tolerance = 0,
  maxSteps = 50
}) => {
  const [currentColor, setCurrentColor] = useState<ColorCode | string>(initialColor);
  const [selectedColor, setSelectedColor] = useState<ColorCode | string | null>(null);
  const [mixResult, setMixResult] = useState<ColorCode | string | null>(null);
  const [useSimpleMixing, setUseSimpleMixing] = useState(false);
  const [showAllHexColors, setShowAllHexColors] = useState(false);
  const [blendRatio, setBlendRatio] = useState(0.5);
  const [customColor, setCustomColor] = useState('#FF9E67');
  const [autoOptimize, setAutoOptimize] = useState(false);
  const [remainingSteps, setRemainingSteps] = useState(maxSteps);
  const [isTargetMatched, setIsTargetMatched] = useState(false);
  
  useEffect(() => {
    if (targetColor && colorsMatch(currentColor, targetColor, tolerance)) {
      setIsTargetMatched(true);
    } else {
      setIsTargetMatched(false);
    }
  }, [currentColor, targetColor, tolerance]);
  
  const displayColors = showAllHexColors 
    ? availableColors 
    : availableColors.filter(color => typeof color === 'string' && !color.startsWith('#'));

  const handleColorSelect = (color: ColorCode | string) => {
    setSelectedColor(color);
    
    let optimalRatio = blendRatio;
    if (autoOptimize && targetColor) {
      optimalRatio = findOptimalBlendRatio(currentColor, color, targetColor);
      setBlendRatio(optimalRatio);
    }
    
    const result = mixColors(currentColor, color, optimalRatio, useSimpleMixing);
    setMixResult(result);
  };

  const handleMixConfirm = () => {
    if (mixResult && onMix) {
      setCurrentColor(mixResult);
      onMix(mixResult);
      setSelectedColor(null);
      setMixResult(null);
      setRemainingSteps(remainingSteps - 1);
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
  
  const handleAddCustomColor = () => {
    if (customColor && customColor.startsWith('#') && customColor.length >= 4) {
      handleColorSelect(customColor);
    }
  };
  
  const optimizeRatio = () => {
    if (selectedColor && targetColor) {
      const optimalRatio = findOptimalBlendRatio(currentColor, selectedColor, targetColor);
      setBlendRatio(optimalRatio);
      const result = mixColors(currentColor, selectedColor, optimalRatio, useSimpleMixing);
      setMixResult(result);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Color Mixer</h3>
        {targetColor && (
          <Badge variant={isTargetMatched ? "default" : "outline"}>
            {isTargetMatched ? "Target Matched!" : `Steps left: ${remainingSteps}`}
          </Badge>
        )}
      </div>
      
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
        
        {targetColor && (
          <div className="flex items-center justify-between">
            <Label htmlFor="auto-optimize" className="text-sm">Auto-optimize Blend Ratio</Label>
            <Switch
              id="auto-optimize"
              checked={autoOptimize}
              onCheckedChange={setAutoOptimize}
            />
          </div>
        )}
      </div>
      
      <div className="flex items-center justify-center gap-4 mb-6 flex-wrap">
        <div className="text-center">
          <p className="text-sm text-gray-500 mb-1">Current</p>
          <PlayerCircle color={currentColor} size="lg" />
          <p className="text-xs mt-1">{getColorName(currentColor)}</p>
        </div>
        
        {targetColor && (
          <>
            <ArrowRight className="text-gray-400" />
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-1">Target</p>
              <PlayerCircle color={targetColor} size="lg" />
              <p className="text-xs mt-1">{getColorName(targetColor)}</p>
            </div>
          </>
        )}
        
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
          <div className="flex justify-between items-center">
            <Label className="text-sm mb-1 block">Blend Ratio: {blendRatio.toFixed(2)}</Label>
            {targetColor && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={optimizeRatio}
                className="h-7 px-2 flex items-center gap-1"
              >
                <Wand2 className="h-3 w-3" />
                <span className="text-xs">Optimize</span>
              </Button>
            )}
          </div>
          
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
      
      {showAllHexColors && (
        <div className="mb-4">
          <p className="text-sm font-medium mb-2">Custom Hex Color</p>
          <div className="flex gap-2">
            <Input
              value={customColor}
              onChange={(e) => setCustomColor(e.target.value)}
              placeholder="#RRGGBB"
              className="h-9"
            />
            <Button variant="outline" size="sm" className="h-9" onClick={handleAddCustomColor}>
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
        </div>
      )}
      
      {selectedColor && (
        <Button 
          className="w-full" 
          onClick={handleMixConfirm}
          disabled={remainingSteps <= 0}
        >
          Apply Mix
        </Button>
      )}
      
      {remainingSteps <= 0 && (
        <p className="text-xs text-center text-red-500 mt-2">
          Maximum steps reached! Unable to make more mixes.
        </p>
      )}
    </div>
  );
};

export default ColorMixer;
