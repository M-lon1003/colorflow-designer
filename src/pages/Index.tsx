
import React, { useState, useEffect } from 'react';
import { LevelData, SavedLevel, ChallengeType } from '../types/color-game';
import { v4 as uuidv4 } from 'uuid';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, HelpCircle } from 'lucide-react';
import ChallengeCreator from '../components/ChallengeCreator';
import LevelEditor from '../components/LevelEditor';
import LevelTester from '../components/LevelTester';
import SavedLevels from '../components/SavedLevels';
import ColorChart from '../components/ColorChart';
import HowToUse from '../components/HowToUse';
import { toast } from 'sonner';

const Index = () => {
  const [activeTab, setActiveTab] = useState('designer');
  const [savedLevels, setSavedLevels] = useState<SavedLevel[]>([]);
  const [currentView, setCurrentView] = useState<'list' | 'create' | 'edit' | 'test' | 'guide'>('list');
  const [currentLevel, setCurrentLevel] = useState<LevelData | null>(null);
  
  useEffect(() => {
    const loadedLevels = localStorage.getItem('colorflow-levels');
    if (loadedLevels) {
      try {
        setSavedLevels(JSON.parse(loadedLevels));
      } catch (e) {
        console.error('Failed to load saved levels:', e);
      }
    }
  }, []);
  
  useEffect(() => {
    localStorage.setItem('colorflow-levels', JSON.stringify(savedLevels));
  }, [savedLevels]);
  
  const handleCreateChallenge = (challenge: Partial<LevelData>) => {
    setCurrentLevel(challenge as LevelData);
    setCurrentView('edit');
  };
  
  const handleSaveLevel = (level: LevelData) => {
    const now = new Date().toLocaleString();
    const existingLevelIndex = savedLevels.findIndex(l => l.id === level.id);
    
    if (existingLevelIndex >= 0) {
      const updatedLevels = [...savedLevels];
      updatedLevels[existingLevelIndex] = {
        id: level.id,
        name: level.name,
        lastEdited: now,
        data: level
      };
      setSavedLevels(updatedLevels);
    } else {
      setSavedLevels([
        ...savedLevels,
        {
          id: level.id,
          name: level.name,
          lastEdited: now,
          data: level
        }
      ]);
    }
    
    setCurrentView('list');
  };
  
  const handleEditLevel = (savedLevel: SavedLevel) => {
    setCurrentLevel(savedLevel.data);
    setCurrentView('edit');
  };
  
  const handlePlayLevel = (savedLevel: SavedLevel) => {
    setCurrentLevel(savedLevel.data);
    setCurrentView('test');
  };
  
  const handleDeleteLevel = (levelId: string) => {
    setSavedLevels(savedLevels.filter(level => level.id !== levelId));
    toast.success("Level deleted successfully");
  };
  
  const handleTestLevel = (level: LevelData) => {
    setCurrentLevel(level);
    setCurrentView('test');
  };
  
  return (
    <div className="container mx-auto py-8 px-4 md:px-8">
      <div className="flex flex-col gap-8">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">ColorFlow Designer</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Design levels for a color-blending puzzle game where players mix colors to reach targets
          </p>
          <div className="flex justify-center mt-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setCurrentView('guide')}
              className="flex items-center gap-1"
            >
              <HelpCircle className="h-4 w-4" />
              How to Use
            </Button>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto">
            <TabsTrigger value="designer">Level Designer</TabsTrigger>
            <TabsTrigger value="reference">Color Reference</TabsTrigger>
          </TabsList>
          
          <TabsContent value="designer" className="mt-6">
            {currentView === 'list' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <SavedLevels 
                    levels={savedLevels}
                    onEdit={handleEditLevel}
                    onPlay={handlePlayLevel}
                    onDelete={handleDeleteLevel}
                  />
                </div>
                
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>New Level</CardTitle>
                      <CardDescription>
                        Create a new color challenge from scratch
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button 
                        className="w-full" 
                        onClick={() => setCurrentView('create')}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Create New Challenge
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>About ColorFlow</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm">
                        ColorFlow is a puzzle game where players navigate through levels by blending colors to match targets.
                      </p>
                      <p className="text-sm">
                        As a designer, you can create challenges with different rules, color paths, and complexity levels.
                      </p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full mt-2"
                        onClick={() => setCurrentView('guide')}
                      >
                        View User Guide
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
            
            {currentView === 'guide' && (
              <div className="max-w-4xl mx-auto">
                <HowToUse />
              </div>
            )}
            
            {currentView === 'create' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <ChallengeCreator onCreateChallenge={handleCreateChallenge} />
                </div>
                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Challenge Types</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h3 className="font-medium">Color Path Challenge</h3>
                        <p className="text-sm text-muted-foreground">
                          Find a path from start color to target color using available colors
                        </p>
                      </div>
                      <div>
                        <h3 className="font-medium">Minimal Steps Challenge</h3>
                        <p className="text-sm text-muted-foreground">
                          Reach the target color in as few steps as possible
                        </p>
                      </div>
                      <div>
                        <h3 className="font-medium">Color Restriction Challenge</h3>
                        <p className="text-sm text-muted-foreground">
                          Limited color palette to reach the target
                        </p>
                      </div>
                      <div>
                        <h3 className="font-medium">Target Matching Challenge</h3>
                        <p className="text-sm text-muted-foreground">
                          Match multiple target colors throughout the level
                        </p>
                      </div>
                      <div>
                        <h3 className="font-medium">Color Mixing Puzzle</h3>
                        <p className="text-sm text-muted-foreground">
                          Complex mixing to create specific color sequences
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
            
            {currentView === 'edit' && currentLevel && (
              <LevelEditor 
                initialLevel={currentLevel} 
                onSave={handleSaveLevel}
                onTest={handleTestLevel}
              />
            )}
            
            {currentView === 'test' && currentLevel && (
              <LevelTester 
                level={currentLevel}
                onBack={() => setCurrentView('edit')}
              />
            )}
            
            {(currentView === 'create' || currentView === 'edit' || currentView === 'test' || currentView === 'guide') && (
              <div className="mt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setCurrentView('list')}
                >
                  Back to Levels
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="reference" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <ColorChart />
              </div>
              
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Color Mixing Rules</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm">
                      The game supports two color mixing modes:
                    </p>
                    
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Standard Mixing (Simple)</p>
                      <p className="text-sm">• Red (R) + Green (G) = Yellow (Y)</p>
                      <p className="text-sm">• Red (R) + Blue (B) = Magenta (M)</p>
                      <p className="text-sm">• Green (G) + Blue (B) = Cyan (C)</p>
                      <p className="text-sm">• Cyan (C) + Magenta (M) = Blue (B)</p>
                      <p className="text-sm">• Cyan (C) + Yellow (Y) = Green (G)</p>
                      <p className="text-sm">• Magenta (M) + Yellow (Y) = Red (R)</p>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Advanced Hex Blending</p>
                      <p className="text-sm">• Any hex color can blend with any other</p>
                      <p className="text-sm">• Adjustable blend ratio from 0.0 to 1.0</p>
                      <p className="text-sm">• RGB values are interpolated linearly</p>
                      <p className="text-sm">• Results in smooth color gradients</p>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Classic Color Theory</p>
                      <p className="text-sm">• Red + Yellow = Orange</p>
                      <p className="text-sm">• Yellow + Blue = Green</p>
                      <p className="text-sm">• Blue + Red = Purple</p>
                      <p className="text-sm">• White + Any Color = That Color (lightened)</p>
                      <p className="text-sm">• Black + Any Color = Black</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
