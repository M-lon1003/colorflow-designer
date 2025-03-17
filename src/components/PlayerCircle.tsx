
import React from 'react';
import { ColorCode } from '../types/color-game';
import { getColorHex, getTextColor } from '../utils/color-utils';

interface PlayerCircleProps {
  color: ColorCode;
  size?: 'sm' | 'md' | 'lg';
  animate?: boolean;
  className?: string;
}

const PlayerCircle: React.FC<PlayerCircleProps> = ({
  color,
  size = 'md',
  animate = false,
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
  };

  return (
    <div
      className={`rounded-full flex items-center justify-center ${sizeClasses[size]} ${getTextColor(color)} ${animate ? 'animate-pulse-soft' : ''} ${className}`}
      style={{ backgroundColor: getColorHex(color) }}
    >
      <span className="text-xs font-semibold">{color.toUpperCase()}</span>
    </div>
  );
};

export default PlayerCircle;
