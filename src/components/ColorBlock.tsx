
import React from 'react';
import { ColorCode } from '../types/color-game';
import { getColorHex, getTextColor, getColorName } from '../utils/color-utils';

interface ColorBlockProps {
  color: ColorCode | string;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  isSelected?: boolean;
  showLabel?: boolean;
  className?: string;
}

const ColorBlock: React.FC<ColorBlockProps> = ({
  color,
  size = 'md',
  onClick,
  isSelected = false,
  showLabel = false,
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  const displayHex = typeof color === 'string' && color.startsWith('#');
  const shortHex = displayHex ? color.slice(-6).substring(0, 3) : '';

  return (
    <div
      className={`color-block rounded-lg flex items-center justify-center ${sizeClasses[size]} ${getTextColor(color)} ${className} cursor-pointer hover:opacity-90 transition-opacity`}
      style={{ backgroundColor: getColorHex(color) }}
      onClick={onClick}
    >
      <div className="relative w-full h-full flex items-center justify-center">
        {isSelected && (
          <div className="absolute inset-0 border-2 border-white rounded-lg shadow-lg"></div>
        )}
        {showLabel && (
          <span className="text-xs font-semibold">
            {displayHex ? shortHex : (typeof color === 'string' && color.length === 1 ? color.toUpperCase() : '')}
          </span>
        )}
      </div>
    </div>
  );
};

export default ColorBlock;
