
import { ColorCode, ColorInfo } from '../types/color-game';

export const COLORS: Record<ColorCode, ColorInfo> = {
  'r': { code: 'r', name: 'Red', hexValue: '#FF5555' },
  'g': { code: 'g', name: 'Green', hexValue: '#55FF55' },
  'b': { code: 'b', name: 'Blue', hexValue: '#5555FF' },
  'c': { code: 'c', name: 'Cyan', hexValue: '#55FFFF' },
  'm': { code: 'm', name: 'Magenta', hexValue: '#FF55FF' },
  'y': { code: 'y', name: 'Yellow', hexValue: '#FFFF55' },
  'k': { code: 'k', name: 'Black', hexValue: '#333333' },
  'w': { code: 'w', name: 'White', hexValue: '#FFFFFF' },
};

export const getColorName = (code: ColorCode): string => {
  return COLORS[code].name;
};

export const getColorHex = (code: ColorCode): string => {
  return COLORS[code].hexValue;
};

export const getTailwindColor = (code: ColorCode): string => {
  switch (code) {
    case 'r': return 'bg-game-red';
    case 'g': return 'bg-game-green';
    case 'b': return 'bg-game-blue';
    case 'c': return 'bg-game-cyan';
    case 'm': return 'bg-game-magenta';
    case 'y': return 'bg-game-yellow';
    case 'k': return 'bg-game-black';
    case 'w': return 'bg-game-white';
    default: return 'bg-gray-200';
  }
};

export const getTextColor = (code: ColorCode): string => {
  return ['k', 'b', 'r'].includes(code) ? 'text-white' : 'text-black';
};

export const mixColors = (color1: ColorCode, color2: ColorCode): ColorCode => {
  if (color1 === color2) return color1;
  
  // Basic RGB mixing
  if ((color1 === 'r' && color2 === 'g') || (color1 === 'g' && color2 === 'r')) return 'y';
  if ((color1 === 'r' && color2 === 'b') || (color1 === 'b' && color2 === 'r')) return 'm';
  if ((color1 === 'g' && color2 === 'b') || (color1 === 'b' && color2 === 'g')) return 'c';
  
  // White and black handling
  if (color1 === 'w' || color2 === 'w') return color1 === 'w' ? color2 : color1;
  if (color1 === 'k' || color2 === 'k') return 'k';
  
  // CMY mixing (simplistic)
  if ((color1 === 'c' && color2 === 'm') || (color1 === 'm' && color2 === 'c')) return 'b';
  if ((color1 === 'c' && color2 === 'y') || (color1 === 'y' && color2 === 'c')) return 'g';
  if ((color1 === 'm' && color2 === 'y') || (color1 === 'y' && color2 === 'm')) return 'r';
  
  // Default fallback
  return 'w';
};

export const getAllColorCombinations = (): Array<{from: ColorCode, to: ColorCode, result: ColorCode}> => {
  const allColors: ColorCode[] = ['r', 'g', 'b', 'c', 'm', 'y', 'k', 'w'];
  const combinations: Array<{from: ColorCode, to: ColorCode, result: ColorCode}> = [];
  
  for (const color1 of allColors) {
    for (const color2 of allColors) {
      if (color1 <= color2) { // Avoid duplicates like (r,g) and (g,r)
        combinations.push({
          from: color1,
          to: color2,
          result: mixColors(color1, color2)
        });
      }
    }
  }
  
  return combinations;
};

export const findPathBetweenColors = (
  startColor: ColorCode, 
  targetColor: ColorCode, 
  allowedColors: ColorCode[],
  maxSteps: number = 5
): ColorCode[] | null => {
  // Simple BFS to find shortest path
  const queue: Array<{path: ColorCode[], current: ColorCode}> = [
    {path: [], current: startColor}
  ];
  const visited = new Set<ColorCode>([startColor]);
  
  while (queue.length > 0) {
    const {path, current} = queue.shift()!;
    
    if (current === targetColor) {
      return [...path, current];
    }
    
    if (path.length >= maxSteps) continue;
    
    for (const color of allowedColors) {
      const mixed = mixColors(current, color);
      if (!visited.has(mixed)) {
        visited.add(mixed);
        queue.push({
          path: [...path, current],
          current: mixed
        });
      }
    }
  }
  
  return null;
};
