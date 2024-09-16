'use client';

import { ElementRef, useRef, useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { useMutation } from 'convex/react';
import { ImageIcon, Smile, X } from 'lucide-react';

import { IconPicker } from '@/components/common/icon-picker';
import { Button } from '@/components/ui/button';

import { useCoverImage } from '@/hooks/use-cover-image';
import { api } from '@/convex/_generated/api';
import { Doc } from '@/convex/_generated/dataModel';

interface ToolbarProps {
  initialData: Doc<'documents'>;
  isPreview?: boolean;
}

export const Toolbar = ({ initialData, isPreview }: ToolbarProps) => {
  const inputRef = useRef<ElementRef<'textarea'>>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [value, setValue] = useState<string>(initialData.title);
  const updateDocument = useMutation(api.documents.updateDocument);
  const removeDocumentIcon = useMutation(api.documents.removeDocumentIcon);
  const coverImage = useCoverImage();

  const enableInput = () => {
    if (isPreview) {
      return;
    }

    setIsEditing(true);

    setTimeout(() => {
      setValue(initialData.title);
      inputRef.current?.focus();
    }, 0);
  };

  const disableInput = () => setIsEditing(false);

  const handleInputValue = (value: string) => {
    setValue(value);
    updateDocument({ id: initialData._id, title: value || 'Untitled' });
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();

      disableInput();
    }
  };

  const handleIconSelect = (icon: string) => {
    updateDocument({ id: initialData._id, icon });
  };

  const handleRemoveIcon = () => {
    removeDocumentIcon({ id: initialData._id });
  };

  return (
    <div className="pl-[54px] group relative">
      {!!initialData.icon && !isPreview && (
        <div className="flex items-center gap-x-2 group/icon pt-6">
          <IconPicker onChange={handleIconSelect}>
            <p className="text-6xl hover:opacity-75 transition">{initialData.icon}</p>
          </IconPicker>
          <Button
            className="rounded-full opacity-0 group-hover/icon:opacity-100 transition text-muted-foreground text-xs"
            size="icon"
            variant="outline"
            onClick={handleRemoveIcon}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
      {!!initialData.icon && isPreview && <p className="text-6xl pt-6">{initialData.icon}</p>}
      <div className="opacity-0 group-hover:opacity-100 flex items-center gap-x-1 py-4">
        {!initialData.icon && !isPreview && (
          <IconPicker asChild onChange={handleIconSelect}>
            <Button className="text-muted-foreground text-xs" size="sm" variant="outline">
              <Smile className="h-4 w-4 mr-2" />
              Add icon
            </Button>
          </IconPicker>
        )}
        {!initialData.coverImage && !isPreview && (
          <Button
            className="text-muted-foreground text-xs"
            size="sm"
            variant="outline"
            onClick={coverImage.onOpen}
          >
            <ImageIcon className="h-4 w-4 mr-2" />
            Add cover
          </Button>
        )}
      </div>
      {isEditing && !isPreview ? (
        <TextareaAutosize
          ref={inputRef}
          className="text-5xl bg-transparent font-bold break-words outline-none text-[#3F3F3F] resize-none w-full"
          value={value}
          onBlur={disableInput}
          onChange={(e) => handleInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      ) : (
        <div
          className="pb-[11.5px] text-5xl font-bold break-words outline-none text-[#3F3F3F]"
          onClick={enableInput}
        >
          {initialData.title}
        </div>
      )}
    </div>
  );
};
