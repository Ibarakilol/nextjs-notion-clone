'use client';

import { useUser } from '@clerk/clerk-react';
import { useMutation } from 'convex/react';
import { MoreHorizontal, Trash } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';

import { MOCK_USERNAME } from '@/constants';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';

interface MenuProps {
  documentId: Id<'documents'>;
}

export const Menu = ({ documentId }: MenuProps) => {
  const { user } = useUser();

  const updateDocument = useMutation(api.documents.updateDocument);
  const archiveDocument = useMutation(api.documents.archiveDocument);

  const handleArchiveDocument = () => {
    const promise = Promise.all([
      updateDocument({ id: documentId, isPublished: false }),
      archiveDocument({ id: documentId }),
    ]);

    toast.promise(promise, {
      loading: 'Moving to trash...',
      success: 'Note moved to trash!',
      error: 'Failed to archive note.',
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant="ghost">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" alignOffset={8} className="w-60" forceMount>
        <DropdownMenuItem className="cursor-pointer" onClick={handleArchiveDocument}>
          <Trash className="h-4 w-4 mr-2" />
          Delete
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <div className="text-xs text-muted-foreground p-2">
          Last edited by: {user?.fullName ?? MOCK_USERNAME}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

Menu.Skeleton = function MenuSkeleton() {
  return <Skeleton className="h-10 w-10" />;
};
