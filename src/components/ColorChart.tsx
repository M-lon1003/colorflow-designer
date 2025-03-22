
import React, { useState } from 'react';
import { ColorCode, ClassicColorBlend } from '../types/color-game';
import { 
  getAllColorCombinations, 
  getColorName, 
  CLASSIC_COLOR_BLENDS, 
  mixColors,
  hexToRgb
} from '../utils/color-utils';
import ColorBlock from './ColorBlock';
import PlayerCircle from './PlayerCircle';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon, Link } from 'lucide-react';

const ColorChart: React.FC = () => {
  const [activeTab, setActiveTab] = useState('standard');
  const [customColor1, setCustomColor1] = useState('#FF5555');
  const [customColor2, setCustomColor2] = useState('#5555FF');
  const [blendRatio, setBlendRatio] = useState(0.5);
  const [customResult, setCustomResult] = useState(mixColors('#FF5555', '#5555FF', 0.5));
  
  const colorCombinations = getAllColorCombinations();
  const allColors: ColorCode[] = ['r', 'g', 'b', 'c', 'm', 'y', 'k', 'w'];
  
  const handleCustomMix = () => {
    const result = mixColors(customColor1, customColor2, blendRatio);
    setCustomResult(result);
  };

  const handleRatioChange = (value: number[]) => {
    const newRatio = value[0] / 100;
    setBlendRatio(newRatio);
    setCustomResult(mixColors(customColor1, customColor2, newRatio));
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Color Mixing Reference</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="standard">Standard Colors</TabsTrigger>
            <TabsTrigger value="classic">Classic Blends</TabsTrigger>
            <TabsTrigger value="custom">Custom Hex Mixer</TabsTrigger>
          </TabsList>
          
          <TabsContent value="standard" className="space-y-4">
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr>
                    <th className="p-2 border"></th>
                    {allColors.map(color => (
                      <th key={color} className="p-2 border">
                        <ColorBlock color={color} size="sm" showLabel />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {allColors.map(color1 => (
                    <tr key={color1}>
                      <td className="p-2 border">
                        <ColorBlock color={color1} size="sm" showLabel />
                      </td>
                      {allColors.map(color2 => {
                        const combo = colorCombinations.find(
                          c => (c.from === color1 && c.to === color2) || (c.from === color2 && c.to === color1)
                        );
                        return (
                          <td key={`${color1}-${color2}`} className="p-2 border text-center">
                            {combo && <ColorBlock color={combo.result} size="sm" showLabel />}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">Legend</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {allColors.map(color => (
                  <div key={color} className="flex items-center gap-2">
                    <ColorBlock color={color} size="sm" />
                    <span className="text-sm">{getColorName(color)}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <Alert>
              <InfoIcon className="h-4 w-4" />
              <AlertDescription>
                In standard mode, colors mix according to RGB color model with preset combinations.
              </AlertDescription>
            </Alert>
          </TabsContent>
          
          <TabsContent value="classic" className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {CLASSIC_COLOR_BLENDS.map((blend, index) => (
                <div key={index} className="border rounded-lg p-3">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <ColorBlock color={blend.color1} size="md" />
                    <span>+</span>
                    <ColorBlock color={blend.color2} size="md" />
                    <span>=</span>
                    <PlayerCircle color={blend.result} size="md" />
                  </div>
                  <p className="text-center text-sm">{blend.name}</p>
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <div>
                <h3 className="text-sm font-medium mb-2">Primary Colors</h3>
                <p className="text-sm mb-1">• Red (R) + Yellow (Y) = Orange</p>
                <p className="text-sm mb-1">• Yellow (Y) + Blue (B) = Green</p>
                <p className="text-sm mb-1">• Blue (B) + Red (R) = Purple</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Secondary Colors</h3>
                <p className="text-sm mb-1">• Red (R) + Green (G) = Yellow</p>
                <p className="text-sm mb-1">• Green (G) + Blue (B) = Cyan</p>
                <p className="text-sm mb-1">• Blue (B) + Red (R) = Magenta</p>
              </div>
            </div>
            
            <Alert>
              <InfoIcon className="h-4 w-4" />
              <AlertDescription>
                Classic color theory identifies common color combinations used in art and design.
              </AlertDescription>
            </Alert>
          </TabsContent>
          
          <TabsContent value="custom" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="color1">First Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="color1"
                    value={customColor1}
                    onChange={(e) => setCustomColor1(e.target.value)}
                    className="font-mono"
                  />
                  <div 
                    className="w-10 h-10 border rounded" 
                    style={{backgroundColor: customColor1}}
                  ></div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="color2">Second Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="color2"
                    value={customColor2}
                    onChange={(e) => setCustomColor2(e.target.value)}
                    className="font-mono"
                  />
                  <div 
                    className="w-10 h-10 border rounded" 
                    style={{backgroundColor: customColor2}}
                  ></div>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Blend Ratio: {blendRatio.toFixed(2)}</Label>
              <Slider
                value={[blendRatio * 100]}
                min={0}
                max={100}
                step={1}
                onValueChange={handleRatioChange}
              />
            </div>
            
            <div className="space-y-2">
              <Button onClick={handleCustomMix} className="w-full">Mix Colors</Button>
              
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-center gap-4">
                  <div className="text-center">
                    <div 
                      className="w-12 h-12 rounded-full mx-auto" 
                      style={{backgroundColor: customColor1}}
                    ></div>
                    <p className="text-xs mt-1">{customColor1}</p>
                  </div>
                  
                  <span>+</span>
                  
                  <div className="text-center">
                    <div 
                      className="w-12 h-12 rounded-full mx-auto" 
                      style={{backgroundColor: customColor2}}
                    ></div>
                    <p className="text-xs mt-1">{customColor2}</p>
                  </div>
                  
                  <span>=</span>
                  
                  <div className="text-center">
                    <div 
                      className="w-12 h-12 rounded-full mx-auto" 
                      style={{backgroundColor: customResult.toString()}}
                    ></div>
                    <p className="text-xs mt-1">{customResult.toString()}</p>
                  </div>
                </div>
                
                <div className="mt-4">
                  <p className="text-sm font-medium">RGB Values:</p>
                  <div className="grid grid-cols-3 gap-2 mt-1">
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">First</p>
                      <p className="text-xs">{JSON.stringify(hexToRgb(customColor1))}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Second</p>
                      <p className="text-xs">{JSON.stringify(hexToRgb(customColor2))}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Result</p>
                      <p className="text-xs">{JSON.stringify(hexToRgb(customResult.toString()))}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">How Hex Color Blending Works</h3>
              <p className="text-sm text-muted-foreground">
                The blending algorithm uses linear interpolation between the RGB values of each color
                according to the blend ratio. A ratio of 0 gives the first color, 1 gives the second color,
                and values in between create a gradient.
              </p>
            </div>
            
            <Alert className="mt-4">
              <div className="flex items-start gap-2">
                <Link className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <AlertDescription>
                  <p>Learn more about color theory and tools:</p>
                  <ul className="list-disc pl-4 mt-1 text-sm">
                    <li><a href="https://color.adobe.com" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Adobe Color Wheel</a></li>
                    <li><a href="https://coolors.co" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Coolors Palette Generator</a></li>
                    <li><a href="https://colorhunt.co" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Color Hunt</a></li>
                  </ul>
                </AlertDescription>
              </div>
            </Alert>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ColorChart;
