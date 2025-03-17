
import React from 'react';
import { SavedLevel } from '../types/color-game';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit2, Play, Trash2 } from 'lucide-react';
import PlayerCircle from './PlayerCircle';

interface SavedLevelsProps {
  levels: SavedLevel[];
  onEdit: (level: SavedLevel) => void;
  onPlay: (level: SavedLevel) => void;
  onDelete: (levelId: string) => void;
}

const SavedLevels: React.FC<SavedLevelsProps> = ({
  levels,
  onEdit,
  onPlay,
  onDelete,
}) => {
  if (levels.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Saved Levels</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-8 text-center">
            <p className="text-muted-foreground">No saved levels yet. Create a new level to get started!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Saved Levels</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {levels.map((level) => (
            <div
              key={level.id}
              className="border rounded-lg p-4 flex justify-between items-center"
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <PlayerCircle color={level.data.startColor} size="sm" />
                  <span className="text-sm">→</span>
                  <PlayerCircle color={level.data.targetColor} size="sm" />
                </div>
                <div>
                  <h3 className="font-medium">{level.name}</h3>
                  <p className="text-xs text-muted-foreground">Last edited: {level.lastEdited}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => onPlay(level)}>
                  <Play className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => onEdit(level)}>
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="destructive" onClick={() => onDelete(level.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SavedLevels;
