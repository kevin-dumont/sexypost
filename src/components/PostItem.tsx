import React from 'react';
import { ListItem } from '../types';
import { X } from 'lucide-react';
import { Input } from './ui/input';
import TextareaAutosize from 'react-textarea-autosize';

interface PostItemProps {
  item: ListItem;
  index: number;
  onUpdate: (index: number, field: keyof ListItem, value: string) => void;
  onRemove: (index: number) => void;
}

const PostItem = React.memo(({ item, index, onUpdate, onRemove }: PostItemProps) => {
  return (
    <div className="relative bg-white rounded-lg border p-4 shadow-sm pt-8">
      <button
        onClick={() => onRemove(index)}
        className="absolute top-2 right-2 p-1 hover:text-gray-900 transition-colors"
      >
        <X className="h-4 w-4 text-gray-500" />
      </button>
      <div className="space-y-2">
        <Input
          value={item.title}
          onChange={(e) => onUpdate(index, 'title', e.target.value)}
          placeholder="Titre de l'item"
          className="w-full"
        />
        <TextareaAutosize
          value={item.description || ''}
          onChange={(e) => onUpdate(index, 'description', e.target.value)}
          placeholder="Description"
          className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>
    </div>
  );
});

PostItem.displayName = 'PostItem';

export default PostItem;