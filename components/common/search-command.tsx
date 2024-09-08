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

import { AppRoute, MOCK_USERNAME } from '@/constants';
import { api } from '@/convex/_generated/api';

export const SearchCommand = () => {
  const { user } = useUser();
  const router = useRouter();
  const documents = useQuery(api.documents.getSearchDocuments);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();

        setIsSearchOpen((prevState) => !prevState);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSelectDocument = (id: string) => {
    setIsSearchOpen(false);
    router.push(`${AppRoute.DOCUMENTS}/${id}`);
  };

  if (!isMounted) {
    return null;
  }

  return (
    <CommandDialog open={isSearchOpen} onOpenChange={() => setIsSearchOpen(false)}>
      <CommandInput placeholder={`Search ${user?.fullName ?? MOCK_USERNAME}'s Notion...`} />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Documents">
          {documents?.map((document) => (
            <CommandItem
              key={document._id}
              title={document.title}
              value={`${document._id}-${document.title}`}
              onSelect={handleSelectDocument}
            >
              {document.icon ? (
                <p className="mr-2 text-[18px]">{document.icon}</p>
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
