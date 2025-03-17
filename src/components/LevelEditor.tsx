
import React, { useState, useEffect } from 'react';
import { LevelData, LevelBlock, ColorCode } from '../types/color-game';
import { v4 as uuidv4 } from 'uuid';
import LevelGrid from './LevelGrid';
import ColorPalette from './ColorPalette';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, Save, Play, Settings } from 'lucide-react';
import { toast } from 'sonner';

interface LevelEditorProps {
  initialLevel: Partial<LevelData>;
  onSave?: (level: LevelData) => void;
  onTest?: (level: LevelData) => void;
}

const LevelEditor: React.FC<LevelEditorProps> = ({
  initialLevel,
  onSave,
  onTest,
}) => {
  const [level, setLevel] = useState<LevelData>({
    id: initialLevel.id || uuidv4(),
    name: initialLevel.name || 'Untitled Level',
    width: initialLevel.width || 8,
    height: initialLevel.height || 8,
    startPosition: initialLevel.startPosition || { x: 0, y: 0 },
    startColor: initialLevel.startColor || 'r',
    targetColor: initialLevel.targetColor || 'b',
    blocks: initialLevel.blocks || [],
    allowedColors: initialLevel.allowedColors || ['r', 'g', 'b'],
    maxSteps: initialLevel.maxSteps || 5,
    description: initialLevel.description || '',
    challengeType: initialLevel.challengeType || 'colorPath',
  });

  const [selectedColor, setSelectedColor] = useState<ColorCode>('r');
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [isSettingStart, setIsSettingStart] = useState(false);

  // Create an empty level if none exists
  useEffect(() => {
    if (level.blocks.length === 0) {
      const defaultBlocks: LevelBlock[] = [];
      setLevel({
        ...level,
        blocks: defaultBlocks,
      });
    }
  }, []);

  const handleBlockClick = (block: LevelBlock) => {
    setSelectedBlockId(block.id);
  };

  const handleEmptyCellClick = (x: number, y: number) => {
    if (isSettingStart) {
      setLevel({
        ...level,
        startPosition: { x, y },
      });
      setIsSettingStart(false);
      return;
    }

    const newBlock: LevelBlock = {
      id: uuidv4(),
      x,
      y,
      color: selectedColor,
    };

    setLevel({
      ...level,
      blocks: [...level.blocks, newBlock],
    });
  };

  const handleDeleteBlock = () => {
    if (!selectedBlockId) return;

    setLevel({
      ...level,
      blocks: level.blocks.filter((block) => block.id !== selectedBlockId),
    });
    setSelectedBlockId(null);
  };

  const handleUpdateBlock = () => {
    if (!selectedBlockId) return;

    setLevel({
      ...level,
      blocks: level.blocks.map((block) =>
        block.id === selectedBlockId
          ? { ...block, color: selectedColor }
          : block
      ),
    });
  };

  const handleSave = () => {
    if (onSave) {
      onSave(level);
      toast.success("Level saved successfully!");
    }
  };

  const handleTest = () => {
    if (onTest) {
      onTest(level);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <div className="space-y-2 flex-1">
          <Label htmlFor="level-name">Level Name</Label>
          <Input
            id="level-name"
            value={level.name}
            onChange={(e) => setLevel({ ...level, name: e.target.value })}
            className="max-w-md"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Save
          </Button>
          <Button variant="outline" size="sm" onClick={handleTest}>
            <Play className="mr-2 h-4 w-4" />
            Test
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-2">Level Grid</h3>
            <LevelGrid
              level={level}
              selectedBlock={selectedBlockId}
              onBlockClick={handleBlockClick}
              onEmptyCellClick={handleEmptyCellClick}
              editMode={true}
            />
          </div>
        </div>

        <div>
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-2">Tools</h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Color Palette</h4>
                <ColorPalette
                  selectedColor={selectedColor}
                  onColorSelect={setSelectedColor}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Button
                  variant={isSettingStart ? "default" : "outline"}
                  size="sm"
                  onClick={() => setIsSettingStart(!isSettingStart)}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  {isSettingStart ? "Cancel" : "Set Start Position"}
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleUpdateBlock}
                  disabled={!selectedBlockId}
                >
                  Update Selected Block
                </Button>

                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDeleteBlock}
                  disabled={!selectedBlockId}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Block
                </Button>
              </div>

              <div className="p-3 bg-muted rounded-lg">
                <h4 className="text-sm font-medium mb-2">Challenge Info</h4>
                <p className="text-sm mb-1">
                  <span className="font-medium">Type:</span>{" "}
                  {level.challengeType === "colorPath"
                    ? "Color Path"
                    : level.challengeType === "minimalSteps"
                    ? "Minimal Steps"
                    : level.challengeType === "colorRestriction"
                    ? "Color Restriction"
                    : level.challengeType === "targetMatching"
                    ? "Target Matching"
                    : "Color Mixing"}
                </p>
                <p className="text-sm mb-1">
                  <span className="font-medium">Start Color:</span>{" "}
                  {level.startColor.toUpperCase()}
                </p>
                <p className="text-sm mb-1">
                  <span className="font-medium">Target Color:</span>{" "}
                  {level.targetColor.toUpperCase()}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Max Steps:</span> {level.maxSteps}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LevelEditor;
