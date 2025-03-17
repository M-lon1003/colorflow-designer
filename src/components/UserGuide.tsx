
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InfoIcon, PaletteIcon, LayersIcon, PlayIcon, SaveIcon } from 'lucide-react';

const UserGuide = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <InfoIcon className="h-5 w-5" />
          How to Use ColorFlow Designer
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="basic">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="basic">Getting Started</TabsTrigger>
            <TabsTrigger value="colors">Working with Colors</TabsTrigger>
            <TabsTrigger value="levels">Building Levels</TabsTrigger>
            <TabsTrigger value="testing">Testing & Sharing</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="bg-muted p-2 rounded-full">
                <PaletteIcon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-medium">Starting a New Challenge</h3>
                <p className="text-sm text-muted-foreground">
                  Click "Create New Challenge" on the Level Designer tab to begin. 
                  Choose a challenge type, set your start and target colors, and configure 
                  the available colors players can use to solve the puzzle.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="bg-muted p-2 rounded-full">
                <LayersIcon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-medium">Understanding Color Blending</h3>
                <p className="text-sm text-muted-foreground">
                  Players start with a color (usually white) and blend with blocks in the level.
                  The blend ratio determines how much of each color contributes to the result.
                  Use the Blend Ratio Editor to preview color combinations.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="bg-muted p-2 rounded-full">
                <PlayIcon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-medium">Core Gameplay</h3>
                <p className="text-sm text-muted-foreground">
                  Players must transform their starting color to match the target color
                  by strategically mixing with color blocks placed in the level.
                  They must complete the challenge within the maximum number of steps.
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="colors" className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Working with Hex Colors</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Any valid hex color can be used in your levels. Enter custom colors using the 
                color picker in the Color Palette. Hex colors blend using RGB interpolation 
                based on the blend ratio.
              </p>
              <div className="bg-muted p-3 rounded-lg">
                <p className="text-sm font-medium">Example:</p>
                <p className="text-xs text-muted-foreground">
                  Start color: #FFFFFF (white) <br />
                  Block color: #FF5555 (red) <br />
                  Blend ratio: 0.5 <br />
                  Result: #FFAAAA (light red)
                </p>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Blend Ratio Editor</h3>
              <p className="text-sm text-muted-foreground">
                Use the Blend Ratio Editor to adjust how colors mix. A ratio of 0 maintains 
                the original color, 1 changes completely to the new color, and values in between 
                create blends. Each block can have a custom blend ratio, or you can set a 
                default for the entire level.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="levels" className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Building Your Level</h3>
              <p className="text-sm text-muted-foreground">
                In the Level Editor, click on the grid to place color blocks. Select a color from 
                the palette first, then click to place. You can click existing blocks to select them, 
                then update or delete them using the tools panel.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Challenge Types</h3>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium">Color Path:</span> Find a sequence of color mixes to reach target color <br />
                <span className="font-medium">Minimal Steps:</span> Reach target color in fewest steps possible <br />
                <span className="font-medium">Color Restriction:</span> Limited color palette challenges <br />
                <span className="font-medium">Target Matching:</span> Match multiple target colors <br />
                <span className="font-medium">Color Mixing:</span> Advanced puzzles with multiple objectives
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="testing" className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Testing Your Level</h3>
              <p className="text-sm text-muted-foreground">
                Click the "Test" button in the Level Editor to try your level. You'll see the 
                player's perspective and can mix colors to see if your challenge works as intended. 
                Adjust difficulty by changing the maximum steps or available colors.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Saving & Sharing</h3>
              <p className="text-sm text-muted-foreground">
                All levels are automatically saved to your browser's local storage. To share levels, 
                you'd need to implement export/import functionality. Future versions may support 
                online sharing and community features.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Tips for Good Level Design</h3>
              <p className="text-sm text-muted-foreground">
                • Start with simple challenges and gradually increase complexity <br />
                • Test your levels thoroughly to ensure they're solvable <br />
                • Consider using custom hex colors for more nuanced puzzles <br />
                • Provide visual cues to guide players toward solutions
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default UserGuide;
