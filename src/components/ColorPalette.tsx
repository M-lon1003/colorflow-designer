
import React from 'react';
import { ColorCode } from '../types/color-game';
import ColorBlock from './ColorBlock';
import { COLORS } from '../utils/color-utils';

interface ColorPaletteProps {
  selectedColor: ColorCode | null;
  onColorSelect: (color: ColorCode) => void;
  availableColors?: ColorCode[];
  showLabels?: boolean;
}

const ColorPalette: React.FC<ColorPaletteProps> = ({
  selectedColor,
  onColorSelect,
  availableColors,
  showLabels = true,
}) => {
  const colorCodes = availableColors || Object.keys(COLORS) as ColorCode[];

  return (
    <div className="flex flex-wrap gap-2 p-2">
      {colorCodes.map((code) => (
        <ColorBlock
          key={code}
          color={code}
          isSelected={selectedColor === code}
          onClick={() => onColorSelect(code)}
          showLabel={showLabels}
        />
      ))}
    </div>
  );
};

export default ColorPalette;
