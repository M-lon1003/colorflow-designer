
import React, { useState, useEffect } from 'react';
import { 
  ColorCode, 
  ChallengeSetting, 
  ChallengeType,
  LevelData
} from '../types/color-game';
import { 
  findPathBetweenColors, 
  getColorName, 
  isHexColor, 
  calculateMinSteps,
  colorsMatch 
} from '../utils/color-utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import ColorBlock from './ColorBlock';
import PlayerCircle from './PlayerCircle';
import BlendRatioEditor from './BlendRatioEditor';
import { toast } from 'sonner';
import { Info } from 'lucide-react';

const CHALLENGE_SETTINGS: ChallengeSetting[] = [
  {
    type: 'colorPath',
    name: 'Color Path Challenge',
    description: 'Find a path from start color to target color using available colors'
  },
  {
    type: 'minimalSteps',
    name: 'Minimal Steps Challenge',
    description: 'Reach the target color in as few steps as possible'
  },
  {
    type: 'colorRestriction',
    name: 'Color Restriction Challenge',
    description: 'Limited color palette to reach the target'
  },
  {
    type: 'targetMatching',
    name: 'Target Matching Challenge',
    description: 'Match multiple target colors throughout the level'
  },
  {
    type: 'colorMixing',
    name: 'Color Mixing Puzzle',
    description: 'Complex mixing to create specific color sequences'
  }
];

interface ChallengeCreatorProps {
  onCreateChallenge: (challenge: Partial<LevelData>) => void;
}

const ChallengeCreator: React.FC<ChallengeCreatorProps> = ({ onCreateChallenge }) => {
  const [activeTab, setActiveTab] = useState<ChallengeType>('colorPath');
  const [startColor, setStartColor] = useState<ColorCode | string>('w'); // Default to white
  const [targetColor, setTargetColor] = useState<ColorCode | string>('b');
  const [selectedColors, setSelectedColors] = useState<(ColorCode | string)[]>(['r', 'g', 'b']);
  const [levelName, setLevelName] = useState('New Challenge');
  const [maxSteps, setMaxSteps] = useState(10);
  const [defaultBlendRatio, setDefaultBlendRatio] = useState(0.5);
  const [customStartColor, setCustomStartColor] = useState('#FFFFFF');
  const [customTargetColor, setCustomTargetColor] = useState('#5555FF');
  const [showCustomColors, setShowCustomColors] = useState(false);
  const [useSimpleMixing, setUseSimpleMixing] = useState(false);
  const [colorTolerance, setColorTolerance] = useState(0);
  const [calculatedMinSteps, setCalculatedMinSteps] = useState<number | null>(null);
  const [showBlendEditor, setShowBlendEditor] = useState(false);
  
  const availableColors: ColorCode[] = ['r', 'g', 'b', 'c', 'm', 'y', 'k', 'w'];
  
  // Recalculate the minimum steps whenever relevant parameters change
  useEffect(() => {
    if (!startColor || !targetColor || selectedColors.length === 0) {
      setCalculatedMinSteps(null);
      return;
    }
    
    const minSteps = calculateMinSteps(startColor, targetColor, selectedColors, colorTolerance);
    setCalculatedMinSteps(minSteps);
  }, [startColor, targetColor, selectedColors, colorTolerance, useSimpleMixing]);
  
  const toggleColorSelection = (color: ColorCode | string) => {
    if (selectedColors.includes(color)) {
      setSelectedColors(selectedColors.filter(c => c !== color));
    } else {
      setSelectedColors([...selectedColors, color]);
    }
  };
  
  const handleCreateChallenge = () => {
    if (startColor === targetColor) {
      toast.error("Start and target colors should be different");
      return;
    }
    
    if (selectedColors.length === 0) {
      toast.error("Please select at least one available color");
      return;
    }
    
    // Check if a path is possible with current settings
    const possiblePath = findPathBetweenColors(
      startColor, 
      targetColor, 
      selectedColors, 
      maxSteps,
      colorTolerance
    );
    
    if (!possiblePath && (activeTab === 'colorPath' || activeTab === 'minimalSteps')) {
      toast.error("No valid path exists with current settings. Try adding more colors, increasing steps, or adjusting tolerance.");
      return;
    }
    
    const challenge: Partial<LevelData> = {
      name: levelName,
      startColor,
      targetColor,
      allowedColors: selectedColors,
      maxSteps,
      challengeType: activeTab,
      width: 8,
      height: 8,
      startPosition: { x: 0, y: 0 },
      blocks: [],
      defaultBlendRatio,
      useSimpleMixing,
      colorTolerance,
      calculatedMinSteps: calculatedMinSteps || undefined
    };
    
    onCreateChallenge(challenge);
    toast.success("Challenge created successfully!");
  };
  
  const handleApplyCustomStartColor = () => {
    if (customStartColor && customStartColor.startsWith('#')) {
      setStartColor(customStartColor);
    }
  };
  
  const handleApplyCustomTargetColor = () => {
    if (customTargetColor && customTargetColor.startsWith('#')) {
      setTargetColor(customTargetColor);
    }
  };

  const handleAddCustomColor = (colorToAdd: string) => {
    if (colorToAdd && colorToAdd.startsWith('#')) {
      if (!selectedColors.includes(colorToAdd)) {
        setSelectedColors([...selectedColors, colorToAdd]);
      }
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Create Challenge</CardTitle>
        <CardDescription>
          Design a color challenge for your level
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Challenge Name</label>
            <Input
              value={levelName}
              onChange={(e) => setLevelName(e.target.value)}
              placeholder="Enter challenge name"
            />
          </div>
          
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as ChallengeType)}>
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="colorPath">Basic Challenges</TabsTrigger>
              <TabsTrigger value="colorMixing">Advanced Challenges</TabsTrigger>
            </TabsList>
            
            <TabsContent value="colorPath" className="space-y-4">
              {CHALLENGE_SETTINGS.slice(0, 3).map((challenge) => (
                <div 
                  key={challenge.type} 
                  className={`p-3 border rounded-lg cursor-pointer ${
                    activeTab === challenge.type ? 'border-primary bg-secondary' : 'border-border'
                  }`}
                  onClick={() => setActiveTab(challenge.type)}
                >
                  <h4 className="font-medium">{challenge.name}</h4>
                  <p className="text-sm text-muted-foreground">{challenge.description}</p>
                </div>
              ))}
            </TabsContent>
            
            <TabsContent value="colorMixing" className="space-y-4">
              {CHALLENGE_SETTINGS.slice(3).map((challenge) => (
                <div 
                  key={challenge.type} 
                  className={`p-3 border rounded-lg cursor-pointer ${
                    activeTab === challenge.type ? 'border-primary bg-secondary' : 'border-border'
                  }`}
                  onClick={() => setActiveTab(challenge.type)}
                >
                  <h4 className="font-medium">{challenge.name}</h4>
                  <p className="text-sm text-muted-foreground">{challenge.description}</p>
                </div>
              ))}
            </TabsContent>
          </Tabs>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium mb-2 block">Start Color</label>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 text-xs px-2"
                  onClick={() => setShowCustomColors(!showCustomColors)}
                >
                  {showCustomColors ? "Hide Custom" : "Custom Hex"}
                </Button>
              </div>
              
              {showCustomColors ? (
                <div className="flex gap-2 items-end">
                  <div className="flex-1">
                    <Input
                      value={customStartColor}
                      onChange={(e) => setCustomStartColor(e.target.value)}
                      placeholder="#RRGGBB"
                    />
                  </div>
                  <Button size="sm" onClick={handleApplyCustomStartColor}>
                    Apply
                  </Button>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {availableColors.map((color) => (
                    <ColorBlock
                      key={color}
                      color={color}
                      isSelected={startColor === color}
                      onClick={() => setStartColor(color)}
                      showLabel
                      size="sm"
                    />
                  ))}
                </div>
              )}
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Target Color</label>
              {showCustomColors ? (
                <div className="flex gap-2 items-end">
                  <div className="flex-1">
                    <Input
                      value={customTargetColor}
                      onChange={(e) => setCustomTargetColor(e.target.value)}
                      placeholder="#RRGGBB"
                    />
                  </div>
                  <Button size="sm" onClick={handleApplyCustomTargetColor}>
                    Apply
                  </Button>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {availableColors.map((color) => (
                    <ColorBlock
                      key={color}
                      color={color}
                      isSelected={targetColor === color}
                      onClick={() => setTargetColor(color)}
                      showLabel
                      size="sm"
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-2 block">Available Colors</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {availableColors.map((color) => (
                <ColorBlock
                  key={color}
                  color={color}
                  isSelected={selectedColors.includes(color)}
                  onClick={() => toggleColorSelection(color)}
                  showLabel
                />
              ))}
            </div>
            
            {showCustomColors && (
              <div className="mt-4">
                <div className="text-sm font-medium mb-2">Add Custom Hex Color</div>
                <div className="flex gap-2 items-end">
                  <div className="flex-1">
                    <Input
                      value={customStartColor}
                      onChange={(e) => setCustomStartColor(e.target.value)}
                      placeholder="#RRGGBB"
                    />
                  </div>
                  <Button size="sm" onClick={() => handleAddCustomColor(customStartColor)}>
                    Add to Palette
                  </Button>
                </div>
                
                <div className="mt-3">
                  <div className="text-sm font-medium mb-2">Custom Colors in Palette:</div>
                  <div className="flex flex-wrap gap-2">
                    {selectedColors
                      .filter(color => isHexColor(color))
                      .map((color, index) => (
                        <ColorBlock
                          key={`custom-${index}`}
                          color={color}
                          isSelected={true}
                          onClick={() => toggleColorSelection(color)}
                        />
                      ))}
                    {selectedColors.filter(color => isHexColor(color)).length === 0 && (
                      <p className="text-sm text-muted-foreground">No custom colors added yet</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between">
                <label className="text-sm font-medium mb-2 block">Maximum Steps: {maxSteps}</label>
              </div>
              <Slider
                min={1}
                max={50}
                value={[maxSteps]}
                onValueChange={(value) => setMaxSteps(value[0])}
                className="w-full"
              />
            </div>
            
            <div>
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium mb-2 block">
                  Default Blend Ratio: {defaultBlendRatio.toFixed(2)}
                </Label>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 text-xs px-2"
                  onClick={() => setShowBlendEditor(!showBlendEditor)}
                >
                  {showBlendEditor ? "Hide Editor" : "Show Editor"}
                </Button>
              </div>
              <Slider
                min={0}
                max={100}
                step={1}
                value={[defaultBlendRatio * 100]}
                onValueChange={(value) => setDefaultBlendRatio(value[0] / 100)}
                className="w-full"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium mb-2 block">
                Color Tolerance: {colorTolerance}
              </Label>
              <Slider
                min={0}
                max={50}
                value={[colorTolerance]}
                onValueChange={(value) => setColorTolerance(value[0])}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Higher tolerance allows colors to match even if they're not exactly the same
              </p>
            </div>
            
            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="use-simple-mixing" className="text-sm font-medium">Color Mixing Mode</Label>
                <Switch
                  id="use-simple-mixing"
                  checked={useSimpleMixing}
                  onCheckedChange={setUseSimpleMixing}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {useSimpleMixing 
                  ? "Using standard color mixing (R+G=Y, etc.)" 
                  : "Using advanced hex blending"}
              </p>
            </div>
          </div>
          
          {showBlendEditor && (
            <BlendRatioEditor
              color1={startColor}
              color2={targetColor}
              ratio={defaultBlendRatio}
              onRatioChange={setDefaultBlendRatio}
              useSimpleMixing={useSimpleMixing}
              onMixingModeChange={setUseSimpleMixing}
              tolerance={colorTolerance}
              onToleranceChange={setColorTolerance}
            />
          )}
          
          <div className="bg-muted p-3 rounded-lg">
            <h4 className="font-medium mb-2">Challenge Summary</h4>
            <div className="flex items-center gap-2 mb-2">
              <PlayerCircle color={startColor} size="sm" />
              <span className="text-sm">→</span>
              <PlayerCircle color={targetColor} size="sm" />
              <span className="text-sm ml-2">in max {maxSteps} steps</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <p className="text-sm text-muted-foreground">
                Using {selectedColors.length} colors: {selectedColors.slice(0, 3).map(c => 
                  isHexColor(c) ? c.substring(0, 7) : getColorName(c as ColorCode)
                ).join(', ')}
                {selectedColors.length > 3 ? ` and ${selectedColors.length - 3} more...` : ''}
              </p>
              
              <div className="text-sm text-muted-foreground">
                Default blend ratio: {defaultBlendRatio.toFixed(2)}
                <br />
                Color tolerance: {colorTolerance}
              </div>
            </div>
            
            {calculatedMinSteps !== null && (
              <div className="mt-2 p-2 bg-secondary rounded flex items-center gap-2">
                <Info size={16} />
                <p className="text-sm">
                  {calculatedMinSteps >= 0 
                    ? `Minimum steps required: ${calculatedMinSteps}` 
                    : "No valid path found with current settings"}
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleCreateChallenge} className="w-full">
          Create Challenge
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ChallengeCreator;
