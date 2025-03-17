
import React, { useState, useEffect } from 'react';
import { LevelData, ColorCode, PlayerState } from '../types/color-game';
import { mixColors } from '../utils/color-utils';
import LevelGrid from './LevelGrid';
import ColorMixer from './ColorMixer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

interface LevelTesterProps {
  level: LevelData;
  onBack: () => void;
}

const LevelTester: React.FC<LevelTesterProps> = ({ level, onBack }) => {
  const [player, setPlayer] = useState<PlayerState>({
    x: level.startPosition.x,
    y: level.startPosition.y,
    currentColor: level.startColor,
  });
  
  const [steps, setSteps] = useState<number>(0);
  const [completed, setCompleted] = useState<boolean>(false);
  const [stepHistory, setStepHistory] = useState<(ColorCode | string)[]>([level.startColor]);
  
  useEffect(() => {
    // Check win condition
    if (player.currentColor === level.targetColor && !completed) {
      setCompleted(true);
      toast.success("Challenge completed!");
    }
  }, [player.currentColor, level.targetColor, completed]);
  
  const handleMix = (result: ColorCode | string) => {
    setSteps(steps + 1);
    setPlayer({
      ...player,
      currentColor: result,
    });
    setStepHistory([...stepHistory, result]);
    
    if (steps + 1 >= level.maxSteps && player.currentColor !== level.targetColor) {
      toast.error("Maximum steps reached!");
    }
  };
  
  const handleReset = () => {
    setPlayer({
      x: level.startPosition.x,
      y: level.startPosition.y,
      currentColor: level.startColor,
    });
    setSteps(0);
    setCompleted(false);
    setStepHistory([level.startColor]);
  };
  
  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Editor
        </Button>
        <div className="flex items-center gap-2">
          <Badge variant={completed ? "default" : "outline"}>
            {completed ? "Completed!" : `Steps: ${steps}/${level.maxSteps}`}
          </Badge>
          <Button variant="outline" size="sm" onClick={handleReset}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-2">{level.name}</h3>
            <LevelGrid
              level={level}
              playerPosition={player}
              playerColor={player.currentColor}
            />
          </div>
          
          <div className="p-3 bg-muted rounded-lg">
            <h4 className="text-sm font-medium mb-2">Color Path</h4>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {stepHistory.map((color, index) => (
                <div key={index} className="flex items-center">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ 
                      backgroundColor: typeof color === 'string' && color.startsWith('#') 
                        ? color 
                        : `var(--game-${color === 'r' ? 'red' : color === 'g' ? 'green' : color === 'b' ? 'blue' : color === 'c' ? 'cyan' : color === 'm' ? 'magenta' : color === 'y' ? 'yellow' : color === 'k' ? 'black' : 'white'})`
                    }}
                  >
                    {typeof color === 'string' && !color.startsWith('#') ? color.toUpperCase() : ''}
                  </div>
                  {index < stepHistory.length - 1 && (
                    <div className="mx-1">→</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div>
          <div className="mb-4">
            <ColorMixer
              initialColor={player.currentColor}
              availableColors={level.allowedColors}
              onMix={handleMix}
            />
          </div>
          
          <div className="p-3 bg-muted rounded-lg">
            <h4 className="text-sm font-medium mb-2">Challenge Info</h4>
            <p className="text-sm mb-1">
              <span className="font-medium">Target Color:</span>{" "}
              {typeof level.targetColor === 'string' && !level.targetColor.startsWith('#') 
                ? level.targetColor.toUpperCase() 
                : level.targetColor}
            </p>
            <p className="text-sm mb-1">
              <span className="font-medium">Max Steps:</span> {level.maxSteps}
            </p>
            <p className="text-sm">
              <span className="font-medium">Challenge Type:</span>{" "}
              {level.challengeType === "colorPath"
                ? "Color Path"
                : level.challengeType === "minimalSteps"
                ? "Minimal Steps"
                : level.challengeType === "colorRestriction"
                ? "Color Restriction"
                : level.challengeType === "targetMatching"
                ? "Target Matching"
                : "Color Mixing"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LevelTester;
