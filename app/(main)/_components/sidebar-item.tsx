'use client';

import { useUser } from '@clerk/clerk-react';
import { useMutation } from 'convex/react';
import { ChevronDown, ChevronRight, LucideIcon, MoreHorizontal, Plus, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';

import { AppRoute, MOCK_USERNAME } from '@/constants';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { cn } from '@/lib/utils';

interface SidebarItemProps {
  id?: Id<'documents'>;
  active?: boolean;
  documentIcon?: string;
  expanded?: boolean;
  icon: LucideIcon;
  isSearched?: boolean;
  label: string;
  level?: number;
  onClick?: () => void;
  onExpand?: () => void;
}

export const SidebarItem = ({
  id,
  active,
  documentIcon,
  expanded,
  icon: Icon,
  isSearched,
  label,
  level = 0,
  onClick,
  onExpand,
}: SidebarItemProps) => {
  const { user } = useUser();
  const router = useRouter();
  const createDocument = useMutation(api.documents.createDocument);
  const updateDocument = useMutation(api.documents.updateDocument);
  const archiveDocument = useMutation(api.documents.archiveDocument);

  const handleArchiveDocument = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation();

    if (!id) {
      return;
    }

    const promise = Promise.all([
      updateDocument({ id, isPublished: false }),
      archiveDocument({ id }),
    ]);

    toast.promise(promise, {
      loading: 'Moving to trash...',
      success: 'Note moved to trash!',
      error: 'Failed to archive note.',
    });
  };

  const handleExpandSidebar = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation();
    onExpand?.();
  };

  const handleCreateDocument = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation();

    if (!id) {
      return;
    }

    const promise = createDocument({ title: 'Untitled', parentDocumentId: id }).then(
      (documentId) => {
        if (!expanded) {
          onExpand?.();
        }

        router.push(`${AppRoute.DOCUMENTS}/${documentId}`);
      }
    );

    toast.promise(promise, {
      loading: 'Creating a new note...',
      success: 'New note created!',
      error: 'Failed to create a new note.',
    });
  };

  const ChevronIcon = expanded ? ChevronDown : ChevronRight;

  return (
    <div
      className={cn(
        'group min-h-[27px] text-sm py-1 pr-3 w-full hover:bg-primary/5 flex items-center text-muted-foreground font-medium',
        active && 'bg-primary/5 text-primary'
      )}
      role="button"
      style={{ paddingLeft: level ? `${level * 12 + 12}px` : '12px' }}
      onClick={onClick}
    >
      {!!id && (
        <div
          className="h-full rounded-sm hover:bg-neutral-300 mr-1"
          role="button"
          onClick={handleExpandSidebar}
        >
          <ChevronIcon className="h-4 w-4 shrink-0 text-muted-foreground/50" />
        </div>
      )}
      {documentIcon ? (
        <div className="flex justify-center items-center shrink-0 mr-2 text-[15px] h-[18px] w-[18px]">
          {documentIcon}
        </div>
      ) : (
        <Icon className="shrink-0 h-[18px] w-[18px] mr-2 text-muted-foreground" />
      )}
      <span className="truncate">{label}</span>
      {isSearched && (
        <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">Ctrl+K</span>
        </kbd>
      )}
      {!!id && (
        <div className="ml-auto flex items-center gap-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <div
                className="opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300"
                role="button"
              >
                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-60" forceMount side="right">
              <DropdownMenuItem onClick={handleArchiveDocument}>
                <Trash className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <div className="text-xs text-muted-foreground p-2">
                Last edited by: {user?.fullName ?? MOCK_USERNAME}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          <div
            className="opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300"
            role="button"
            onClick={handleCreateDocument}
          >
            <Plus className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      )}
    </div>
  );
};

SidebarItem.Skeleton = function SidebarItemSkeleton({ level }: { level?: number }) {
  return (
    <div
      className="flex gap-x-2 py-[3px]"
      style={{ paddingLeft: level ? `${level * 12 + 25}px` : '12px' }}
    >
      <Skeleton className="h-4 w-4" />
      <Skeleton className="h-4 w-[30%]" />
    </div>
  );
};
