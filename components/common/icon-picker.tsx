'use client';

import { ReactNode } from 'react';
import EmojiPicker, { Theme } from 'emoji-picker-react';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface IconPickerProps {
  asChild?: boolean;
  children: ReactNode;
  onChange: (icon: string) => void;
}

export const IconPicker = ({ asChild, children, onChange }: IconPickerProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild={asChild}>{children}</PopoverTrigger>
      <PopoverContent className="p-0 w-full border-none shadow-none">
        <EmojiPicker
          height={350}
          theme={Theme.LIGHT}
          onEmojiClick={(data) => onChange(data.emoji)}
        />
      </PopoverContent>
    </Popover>
  );
};
