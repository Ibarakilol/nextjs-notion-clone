'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useQuery } from 'convex/react';
import { File } from 'lucide-react';
import { useRouter } from 'next/navigation';

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';

import { useSearch } from '@/hooks/use-search';
import { AppRoute, MOCK_USERNAME } from '@/constants';
import { api } from '@/convex/_generated/api';

export const SearchCommand = () => {
  const { user } = useUser();
  const router = useRouter();
  const documents = useQuery(api.documents.getSearchDocuments);

  const toggle = useSearch((store) => store.toggle);
  const isOpen = useSearch((store) => store.isOpen);
  const onClose = useSearch((store) => store.onClose);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();

        toggle();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [toggle]);

  const handleSelectDocument = (id: string) => {
    onClose();
    router.push(`${AppRoute.DOCUMENTS}/${id}`);
  };

  return (
    <CommandDialog open={isOpen} onOpenChange={onClose}>
      <CommandInput placeholder={`Search ${user?.fullName ?? MOCK_USERNAME}'s Notion...`} />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Documents">
          {documents?.map((document) => (
            <CommandItem
              key={document._id}
              title={document.title}
              value={document._id}
              onSelect={handleSelectDocument}
            >
              {document.icon ? (
                <div className="mr-2 text-[16px] h-5 w-5">{document.icon}</div>
              ) : (
                <File className="mr-2 h-4 w-4" />
              )}
              <span>{document.title}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};
