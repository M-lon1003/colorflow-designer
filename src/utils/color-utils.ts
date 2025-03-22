
import { ColorCode, ColorInfo, ColorMixResult, ClassicColorBlend } from '../types/color-game';

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

// Classic color blends that represent traditional color theory
export const CLASSIC_COLOR_BLENDS: ClassicColorBlend[] = [
  { color1: 'r', color2: 'y', result: '#FF7F00', name: 'Orange' },
  { color1: 'b', color2: 'y', result: '#7FFF00', name: 'Chartreuse' },
  { color1: 'g', color2: 'c', result: '#00FF7F', name: 'Spring Green' },
  { color1: 'b', color2: 'c', result: '#007FFF', name: 'Azure' },
  { color1: 'b', color2: 'm', result: '#7F00FF', name: 'Violet' },
  { color1: 'r', color2: 'm', result: '#FF007F', name: 'Rose' },
];

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

export const getAllColorCombinations = (): Array<ColorMixResult> => {
  const allColors: ColorCode[] = ['r', 'g', 'b', 'c', 'm', 'y', 'k', 'w'];
  const combinations: Array<ColorMixResult> = [];
  
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
  
  // Add popular hex color combinations
  const popularHexCombos = [
    { from: '#FF5555', to: '#5555FF', result: mixColors('#FF5555', '#5555FF') },
    { from: '#55FF55', to: '#FF55FF', result: mixColors('#55FF55', '#FF55FF') },
    { from: '#FFFF55', to: '#5555FF', result: mixColors('#FFFF55', '#5555FF') }
  ];
  
  return [...combinations, ...popularHexCombos];
};

// Compare colors with tolerance
export const colorsMatch = (color1: ColorCode | string, color2: ColorCode | string, tolerance: number = 0): boolean => {
  if (color1 === color2) return true;
  
  const hex1 = getColorHex(color1);
  const hex2 = getColorHex(color2);
  
  if (tolerance === 0) return hex1 === hex2;
  
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);
  
  const rDiff = Math.abs(rgb1.r - rgb2.r);
  const gDiff = Math.abs(rgb1.g - rgb2.g);
  const bDiff = Math.abs(rgb1.b - rgb2.b);
  
  return rDiff <= tolerance && gDiff <= tolerance && bDiff <= tolerance;
};

// Calculate color distance (Euclidean distance in RGB space)
export const colorDistance = (color1: ColorCode | string, color2: ColorCode | string): number => {
  const rgb1 = hexToRgb(getColorHex(color1));
  const rgb2 = hexToRgb(getColorHex(color2));
  
  const rDiff = rgb1.r - rgb2.r;
  const gDiff = rgb1.g - rgb2.g;
  const bDiff = rgb1.b - rgb2.b;
  
  return Math.sqrt(rDiff * rDiff + gDiff * gDiff + bDiff * bDiff);
};

// Find optimal blend ratio between two colors to get closest to target
export const findOptimalBlendRatio = (color1: ColorCode | string, color2: ColorCode | string, target: ColorCode | string): number => {
  const targetRgb = hexToRgb(getColorHex(target));
  const rgb1 = hexToRgb(getColorHex(color1));
  const rgb2 = hexToRgb(getColorHex(color2));
  
  // Solve for ratio using least squares
  const numerator = (targetRgb.r - rgb1.r) * (rgb2.r - rgb1.r) + 
                   (targetRgb.g - rgb1.g) * (rgb2.g - rgb1.g) + 
                   (targetRgb.b - rgb1.b) * (rgb2.b - rgb1.b);
  
  const denominator = Math.pow(rgb2.r - rgb1.r, 2) + 
                     Math.pow(rgb2.g - rgb1.g, 2) + 
                     Math.pow(rgb2.b - rgb1.b, 2);
  
  if (denominator === 0) return 0.5;
  
  const ratio = numerator / denominator;
  
  // Clamp between 0 and 1
  return Math.max(0, Math.min(1, ratio));
};

export const findPathBetweenColors = (
  startColor: ColorCode | string, 
  targetColor: ColorCode | string, 
  allowedColors: (ColorCode | string)[],
  maxSteps: number = 50,
  tolerance: number = 0,
  useOptimalRatio: boolean = true
): {path: (ColorCode | string)[], ratios: number[]} | null => {
  // Simple BFS to find shortest path
  const queue: Array<{
    path: (ColorCode | string)[], 
    ratios: number[],
    current: ColorCode | string
  }> = [
    {path: [], ratios: [], current: startColor}
  ];
  const visited = new Set<string>([getColorHex(startColor)]);
  
  while (queue.length > 0) {
    const {path, ratios, current} = queue.shift()!;
    
    if (colorsMatch(current, targetColor, tolerance)) {
      return {
        path: [...path, current],
        ratios: ratios
      };
    }
    
    if (path.length >= maxSteps) continue;
    
    for (const color of allowedColors) {
      // If using optimal ratio, calculate best blend ratio
      const ratio = useOptimalRatio
        ? findOptimalBlendRatio(current, color, targetColor)
        : 0.5;
      
      const mixed = mixColors(current, color, ratio);
      const mixedHex = getColorHex(mixed);
      
      if (!visited.has(mixedHex)) {
        visited.add(mixedHex);
        queue.push({
          path: [...path, current],
          ratios: [...ratios, ratio],
          current: mixed
        });
      }
    }
  }
  
  return null;
};

export const calculateMinSteps = (
  startColor: ColorCode | string,
  targetColor: ColorCode | string,
  allowedColors: (ColorCode | string)[],
  tolerance: number = 0
): number => {
  const result = findPathBetweenColors(
    startColor,
    targetColor,
    allowedColors,
    50, // Use a high max steps value for calculation
    tolerance,
    true // Use optimal ratios
  );
  
  return result ? result.path.length - 1 : -1; // -1 means no path found
};
