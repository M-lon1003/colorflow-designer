
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Link } from 'lucide-react';

const HowToUse: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>How to Use ColorFlow Designer</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-2">What is ColorFlow?</h3>
          <p className="text-sm text-muted-foreground">
            ColorFlow is a color blending puzzle game where you start with one color and need to reach a target color
            by strategically mixing with other colors. This designer tool lets you create custom challenges
            with different difficulty levels and color mixing rules.
          </p>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Getting Started</h3>
          
          <div>
            <h4 className="text-base font-medium">1. Create a Challenge</h4>
            <p className="text-sm text-muted-foreground">
              Click "Create New Challenge" and follow these steps:
            </p>
            <ul className="list-disc list-inside text-sm mt-1 ml-2 text-muted-foreground">
              <li>Name your challenge</li>
              <li>Select a challenge type (Color Path, Minimal Steps, etc.)</li>
              <li>Choose start and target colors (standard colors or custom hex)</li>
              <li>Select which colors will be available for mixing</li>
              <li>Set maximum steps, blend ratio, and color tolerance</li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-base font-medium">2. Design the Level</h4>
            <p className="text-sm text-muted-foreground">
              In the level editor, you can:
            </p>
            <ul className="list-disc list-inside text-sm mt-1 ml-2 text-muted-foreground">
              <li>Place color blocks on the grid</li>
              <li>Set the starting position</li>
              <li>Adjust color mixing settings (standard or advanced hex)</li>
              <li>Set blend ratios for individual blocks</li>
              <li>Test your level as you build it</li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-base font-medium">3. Test Your Level</h4>
            <p className="text-sm text-muted-foreground">
              Click "Test" to try your level and make sure it's solvable:
            </p>
            <ul className="list-disc list-inside text-sm mt-1 ml-2 text-muted-foreground">
              <li>The ColorMixer shows your current color and available colors</li>
              <li>Select colors to blend with your current color</li>
              <li>Adjust the blend ratio to get different results</li>
              <li>Match the target color before running out of steps</li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-base font-medium">4. Save and Share</h4>
            <p className="text-sm text-muted-foreground">
              Once you're happy with your level:
            </p>
            <ul className="list-disc list-inside text-sm mt-1 ml-2 text-muted-foreground">
              <li>Save it to your library</li>
              <li>Share it with friends using the share button</li>
              <li>Create multiple levels with different challenges</li>
            </ul>
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Color Mixing Explained</h3>
          
          <div>
            <h4 className="text-base font-medium">Standard Color Mixing</h4>
            <p className="text-sm text-muted-foreground">
              When "Use Standard Color Mixing" is enabled, colors follow traditional color theory:
            </p>
            <ul className="list-disc list-inside text-sm mt-1 ml-2 text-muted-foreground">
              <li>Red + Green = Yellow</li>
              <li>Red + Blue = Magenta</li>
              <li>Green + Blue = Cyan</li>
              <li>And other combinations shown in the Color Reference tab</li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-base font-medium">Advanced Hex Blending</h4>
            <p className="text-sm text-muted-foreground">
              When standard mixing is disabled, colors blend using RGB hex values:
            </p>
            <ul className="list-disc list-inside text-sm mt-1 ml-2 text-muted-foreground">
              <li>Each color's RGB values are linearly interpolated</li>
              <li>The blend ratio determines the weight of each color</li>
              <li>This allows for precise color gradients and transitions</li>
              <li>You can use any hex color code for unlimited possibilities</li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-base font-medium">Color Tolerance</h4>
            <p className="text-sm text-muted-foreground">
              The tolerance setting defines how close to the target color is considered a match:
            </p>
            <ul className="list-disc list-inside text-sm mt-1 ml-2 text-muted-foreground">
              <li>0 = Exact match required</li>
              <li>Higher values = More lenient matching</li>
              <li>Useful for making difficult challenges more accessible</li>
              <li>Measured in RGB value difference (0-255 scale)</li>
            </ul>
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Challenge Types</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-base font-medium">Color Path Challenge</h4>
              <p className="text-sm text-muted-foreground">
                Find any path from the start color to the target using available colors.
              </p>
            </div>
            
            <div>
              <h4 className="text-base font-medium">Minimal Steps Challenge</h4>
              <p className="text-sm text-muted-foreground">
                Reach the target in as few steps as possible, testing efficiency.
              </p>
            </div>
            
            <div>
              <h4 className="text-base font-medium">Color Restriction Challenge</h4>
              <p className="text-sm text-muted-foreground">
                Limited color palette makes finding a path more strategic.
              </p>
            </div>
            
            <div>
              <h4 className="text-base font-medium">Target Matching Challenge</h4>
              <p className="text-sm text-muted-foreground">
                Match multiple target colors in sequence for complex puzzles.
              </p>
            </div>
            
            <div>
              <h4 className="text-base font-medium">Color Mixing Puzzle</h4>
              <p className="text-sm text-muted-foreground">
                Complex mixing challenges with precise ratio requirements.
              </p>
            </div>
          </div>
        </div>
        
        <Alert>
          <div className="flex items-start gap-2">
            <Link className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <AlertDescription>
              <p>Additional Resources:</p>
              <ul className="list-disc pl-4 mt-1 text-sm">
                <li><a href="https://en.wikipedia.org/wiki/Color_theory" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Color Theory on Wikipedia</a></li>
                <li><a href="https://www.colormatters.com/color-and-design/basic-color-theory" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Basic Color Theory</a></li>
                <li><a href="https://www.sessions.edu/color-calculator/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Color Calculator Tool</a></li>
              </ul>
            </AlertDescription>
          </div>
        </Alert>
      </CardContent>
    </Card>
  );
};

export default HowToUse;
