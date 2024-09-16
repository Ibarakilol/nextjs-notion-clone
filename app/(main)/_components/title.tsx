'use client';

import { useRef, useState } from 'react';
import { useMutation } from 'convex/react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { api } from '@/convex/_generated/api';
import { Doc } from '@/convex/_generated/dataModel';

interface TitleProps {
  initialData: Doc<'documents'>;
}

export const Title = ({ initialData }: TitleProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const updateDocument = useMutation(api.documents.updateDocument);
  const [title, setTitle] = useState<string>(initialData.title || 'Untitled');
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const enableInput = () => {
    setTitle(initialData.title);
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.setSelectionRange(0, inputRef.current.value.length);
    }, 0);
  };

  const disableInput = () => {
    setIsEditing(false);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    updateDocument({ id: initialData._id, title: event.target.value || 'Untitled' });
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      disableInput();
    }
  };

  return (
    <div className="flex items-center gap-x-1">
      {!!initialData.icon && <p>{initialData.icon}</p>}
      {isEditing ? (
        <Input
          ref={inputRef}
          className="h-7 px-2 focus-visible:ring-transparent"
          value={title}
          onBlur={disableInput}
          onChange={handleChange}
          onClick={enableInput}
          onKeyDown={handleKeyDown}
        />
      ) : (
        <Button className="font-normal h-auto p-1" size="sm" variant="ghost" onClick={enableInput}>
          <span className="truncate">{initialData.title}</span>
        </Button>
      )}
    </div>
  );
};
