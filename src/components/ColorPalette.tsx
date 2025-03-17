
import React, { useState } from 'react';
import { ColorCode } from '../types/color-game';
import ColorBlock from './ColorBlock';
import { COLORS, isHexColor } from '../utils/color-utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface ColorPaletteProps {
  selectedColor: ColorCode | string | null;
  onColorSelect: (color: ColorCode | string) => void;
  availableColors?: (ColorCode | string)[];
  showLabels?: boolean;
  allowCustomColors?: boolean;
}

const ColorPalette: React.FC<ColorPaletteProps> = ({
  selectedColor,
  onColorSelect,
  availableColors,
  showLabels = true,
  allowCustomColors = false,
}) => {
  const colorCodes = availableColors || Object.keys(COLORS) as ColorCode[];
  const [customColor, setCustomColor] = useState('#FF9E67');
  
  // Filter out hex colors for proper display
  const standardColors = colorCodes.filter(c => !isHexColor(c as string));
  const hexColors = colorCodes.filter(c => isHexColor(c as string));

  const handleCustomColorAdd = () => {
    if (customColor && customColor.startsWith('#') && customColor.length >= 4) {
      onColorSelect(customColor);
    }
  };
  
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2 p-2">
        {standardColors.map((code) => (
          <ColorBlock
            key={code}
            color={code as ColorCode}
            isSelected={selectedColor === code}
            onClick={() => onColorSelect(code)}
            showLabel={showLabels}
          />
        ))}
      </div>
      
      {hexColors.length > 0 && (
        <div className="flex flex-wrap gap-2 p-2 border-t pt-2">
          <div className="w-full text-xs text-muted-foreground mb-1">Custom Colors</div>
          {hexColors.map((hexCode) => (
            <ColorBlock
              key={hexCode}
              color={hexCode as ColorCode}
              isSelected={selectedColor === hexCode}
              onClick={() => onColorSelect(hexCode)}
              showLabel={false}
            />
          ))}
        </div>
      )}
      
      {allowCustomColors && (
        <div className="border-t pt-3">
          <div className="text-xs text-muted-foreground mb-2">Add Custom Color (Hex)</div>
          <div className="flex gap-2">
            <Input
              value={customColor}
              onChange={(e) => setCustomColor(e.target.value)}
              placeholder="#RRGGBB"
              className="h-8 text-xs"
            />
            <Button variant="outline" size="sm" className="h-8 px-2" onClick={handleCustomColorAdd}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorPalette;
