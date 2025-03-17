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

export const getColorName = (code: ColorCode | string): string => {
  if (isHexColor(code)) {
    return code;
  }
  return COLORS[code as ColorCode]?.name || 'Custom';
};

export const getColorHex = (code: ColorCode | string): string => {
  if (isHexColor(code)) {
    return code;
  }
  return COLORS[code as ColorCode]?.hexValue || '#CCCCCC';
};

export const getTailwindColor = (code: ColorCode | string): string => {
  if (isHexColor(code)) {
    return 'bg-custom'; // For custom colors, styling will be applied inline
  }
  
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

export const getTextColor = (code: ColorCode | string): string => {
  if (isHexColor(code)) {
    // Calculate perceived brightness to determine text color
    const hex = code.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? 'text-black' : 'text-white';
  }
  
  return ['k', 'b', 'r'].includes(code as ColorCode) ? 'text-white' : 'text-black';
};

// Helper function to check if a color is a hex code
export const isHexColor = (color: string | ColorCode): boolean => {
  return typeof color === 'string' && color.startsWith('#');
};

// Convert hex to RGB
export const hexToRgb = (hex: string): {r: number, g: number, b: number} => {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  const formattedHex = hex.replace(shorthandRegex, (_, r, g, b) => r + r + g + g + b + b);
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(formattedHex);
  
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
};

// Convert RGB to Hex
export const rgbToHex = (r: number, g: number, b: number): string => {
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
};

// Enhanced color mixing function that can use standard mixing rules or advanced hex blending
export const mixColors = (color1: ColorCode | string, color2: ColorCode | string, ratio: number = 0.5, useSimpleMixing: boolean = false): ColorCode | string => {
  // If mixing the same color, return it
  if (color1 === color2) return color1;
  
  // If using predefined colors and simple mixing is requested, use the original simple mixing
  if (useSimpleMixing && !isHexColor(color1) && !isHexColor(color2) && ratio === 0.5) {
    // Basic RGB mixing for color codes
    const c1 = color1 as ColorCode;
    const c2 = color2 as ColorCode;
    
    if ((c1 === 'r' && c2 === 'g') || (c1 === 'g' && c2 === 'r')) return 'y';
    if ((c1 === 'r' && c2 === 'b') || (c1 === 'b' && c2 === 'r')) return 'm';
    if ((c1 === 'g' && c2 === 'b') || (c1 === 'b' && c2 === 'g')) return 'c';
    
    // White and black handling
    if (c1 === 'w' || c2 === 'w') return c1 === 'w' ? c2 : c1;
    if (c1 === 'k' || c2 === 'k') return 'k';
    
    // CMY mixing (simplistic)
    if ((c1 === 'c' && c2 === 'm') || (c1 === 'm' && c2 === 'c')) return 'b';
    if ((c1 === 'c' && c2 === 'y') || (c1 === 'y' && c2 === 'c')) return 'g';
    if ((c1 === 'm' && c2 === 'y') || (c1 === 'y' && c2 === 'm')) return 'r';
    
    // Default fallback
    return 'w';
  }
  
  // For hex colors or when using a specific ratio, properly blend the colors
  const hex1 = getColorHex(color1);
  const hex2 = getColorHex(color2);
  
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);
  
  // Mix the colors based on the ratio
  const r = Math.round(rgb1.r * (1 - ratio) + rgb2.r * ratio);
  const g = Math.round(rgb1.g * (1 - ratio) + rgb2.g * ratio);
  const b = Math.round(rgb1.b * (1 - ratio) + rgb2.b * ratio);
  
  return rgbToHex(r, g, b);
};

// Helper function to get all available colors (both standard and hex)
export const getAllAvailableColors = (includeCustom: boolean = true): (ColorCode | string)[] => {
  const standardColors = Object.keys(COLORS) as ColorCode[];
  if (!includeCustom) {
    return standardColors;
  }
  
  // Could add common hex colors here if needed
  const defaultHexColors = ['#FF9E67', '#8B5CF6', '#D946EF', '#F97316', '#0EA5E9'];
  return [...standardColors, ...defaultHexColors];
};

export const getAllColorCombinations = (): Array<{from: ColorCode | string, to: ColorCode | string, result: ColorCode | string}> => {
  const allColors: ColorCode[] = ['r', 'g', 'b', 'c', 'm', 'y', 'k', 'w'];
  const combinations: Array<{from: ColorCode | string, to: ColorCode | string, result: ColorCode | string}> = [];
  
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
  startColor: ColorCode | string, 
  targetColor: ColorCode | string, 
  allowedColors: (ColorCode | string)[],
  maxSteps: number = 5
): (ColorCode | string)[] | null => {
  // Simple BFS to find shortest path
  const queue: Array<{path: (ColorCode | string)[], current: ColorCode | string}> = [
    {path: [], current: startColor}
  ];
  const visited = new Set<ColorCode | string>([startColor]);
  
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
