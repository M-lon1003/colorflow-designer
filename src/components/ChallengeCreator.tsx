
import React, { useState } from 'react';
import { 
  ColorCode, 
  ChallengeSetting, 
  ChallengeType,
  LevelData
} from '../types/color-game';
import { findPathBetweenColors, getColorName, isHexColor } from '../utils/color-utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import ColorBlock from './ColorBlock';
import PlayerCircle from './PlayerCircle';
import { toast } from 'sonner';

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
  const [maxSteps, setMaxSteps] = useState(5);
  const [defaultBlendRatio, setDefaultBlendRatio] = useState(0.5);
  const [customStartColor, setCustomStartColor] = useState('#FFFFFF');
  const [customTargetColor, setCustomTargetColor] = useState('#5555FF');
  const [showCustomColors, setShowCustomColors] = useState(false);
  
  const availableColors: ColorCode[] = ['r', 'g', 'b', 'c', 'm', 'y', 'k', 'w'];
  
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
    
    const possiblePath = findPathBetweenColors(startColor, targetColor, selectedColors, maxSteps);
    
    if (!possiblePath && (activeTab === 'colorPath' || activeTab === 'minimalSteps')) {
      toast.error("No valid path exists with current settings. Try adding more colors or increasing steps.");
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
      defaultBlendRatio
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
          
          <div className="grid grid-cols-2 gap-4">
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
            <div className="flex flex-wrap gap-2">
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
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Maximum Steps: {maxSteps}</label>
              <Slider
                min={1}
                max={10}
                value={[maxSteps]}
                onValueChange={(value) => setMaxSteps(value[0])}
                className="w-full"
              />
            </div>
            
            <div>
              <Label className="text-sm font-medium mb-2 block">
                Default Blend Ratio: {defaultBlendRatio.toFixed(2)}
              </Label>
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
          
          <div className="bg-muted p-3 rounded-lg">
            <h4 className="font-medium mb-2">Challenge Summary</h4>
            <div className="flex items-center gap-2 mb-2">
              <PlayerCircle color={startColor} size="sm" />
              <span className="text-sm">→</span>
              <PlayerCircle color={targetColor} size="sm" />
              <span className="text-sm ml-2">in max {maxSteps} steps</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Using {selectedColors.length} colors: {selectedColors.map(c => 
                isHexColor(c) ? c : getColorName(c as ColorCode)
              ).join(', ')}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Default blend ratio: {defaultBlendRatio.toFixed(2)}
            </p>
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
