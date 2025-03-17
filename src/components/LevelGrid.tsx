
import React from 'react';
import { LevelData, LevelBlock, ColorCode } from '../types/color-game';
import ColorBlock from './ColorBlock';
import PlayerCircle from './PlayerCircle';

interface LevelGridProps {
  level: LevelData;
  playerPosition?: { x: number; y: number };
  playerColor?: ColorCode;
  selectedBlock?: string | null;
  onBlockClick?: (block: LevelBlock) => void;
  onEmptyCellClick?: (x: number, y: number) => void;
  editMode?: boolean;
}

const LevelGrid: React.FC<LevelGridProps> = ({
  level,
  playerPosition,
  playerColor,
  selectedBlock = null,
  onBlockClick,
  onEmptyCellClick,
  editMode = false,
}) => {
  const grid = Array(level.height).fill(0).map(() => Array(level.width).fill(null));
  
  // Place blocks in the grid
  level.blocks.forEach(block => {
    if (block.x >= 0 && block.x < level.width && block.y >= 0 && block.y < level.height) {
      grid[block.y][block.x] = block;
    }
  });

  return (
    <div 
      className="grid-canvas bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm"
      style={{
        gridTemplateColumns: `repeat(${level.width}, 1fr)`,
        gridTemplateRows: `repeat(${level.height}, 1fr)`,
      }}
    >
      {grid.map((row, y) => (
        row.map((cell, x) => {
          const isPlayerHere = playerPosition && playerPosition.x === x && playerPosition.y === y;
          const isStartPosition = level.startPosition.x === x && level.startPosition.y === y;
          const cellKey = `cell-${x}-${y}`;
          
          return (
            <div 
              key={cellKey} 
              className={`relative flex items-center justify-center min-h-[40px] ${
                editMode ? 'cursor-pointer' : ''
              } ${cell ? '' : 'border border-dashed border-gray-200'}`}
              onClick={() => {
                if (editMode) {
                  if (cell && onBlockClick) {
                    onBlockClick(cell);
                  } else if (onEmptyCellClick) {
                    onEmptyCellClick(x, y);
                  }
                }
              }}
            >
              {cell && (
                <ColorBlock 
                  color={cell.color} 
                  isSelected={selectedBlock === cell.id}
                  showLabel
                  className="w-full h-full"
                />
              )}
              
              {isPlayerHere && playerColor && (
                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                  <PlayerCircle color={playerColor} animate />
                </div>
              )}
              
              {isStartPosition && !isPlayerHere && (
                <div className="absolute top-1 left-1 w-3 h-3 rounded-full bg-white border-2 border-black" />
              )}
            </div>
          );
        })
      ))}
    </div>
  );
};

export default LevelGrid;
