
import React from 'react';
import { ColorCode } from '../types/color-game';
import { getAllColorCombinations, getColorName } from '../utils/color-utils';
import ColorBlock from './ColorBlock';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ColorChart: React.FC = () => {
  const colorCombinations = getAllColorCombinations();
  const allColors: ColorCode[] = ['r', 'g', 'b', 'c', 'm', 'y', 'k', 'w'];
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Color Mixing Reference</CardTitle>
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  );
};

export default ColorChart;
