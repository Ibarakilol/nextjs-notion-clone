'use client';

import { useState } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { Search, Trash, Undo } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { Spinner } from '@/components/common/spinner';
import { ConfirmModal } from '@/components/modals/confirm-modal';
import { Input } from '@/components/ui/input';

import { AppRoute } from '@/constants';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';

export const TrashBox = () => {
  const router = useRouter();
  const params = useParams();
  const archivedDocuments = useQuery(api.documents.getArchivedDocuments);
  const restoreDocument = useMutation(api.documents.restoreDocument);
  const deleteDocument = useMutation(api.documents.deleteDocument);
  const [search, setSearch] = useState<string>('');

  const filteredDocuments = archivedDocuments?.filter((document) => {
    return document.title.toLowerCase().includes(search.toLowerCase());
  });

  const handleDocumentClick = (documentId: string) => {
    router.push(`${AppRoute.DOCUMENTS}/${documentId}`);
  };

  const handleRestoreDocument = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    documentId: Id<'documents'>
  ) => {
    event.stopPropagation();

    const promise = restoreDocument({ id: documentId });

    toast.promise(promise, {
      loading: 'Restoring note...',
      success: 'Note restored!',
      error: 'Failed to restore note.',
    });
  };

  const handleDeleteDocument = (documentId: Id<'documents'>) => {
    const promise = deleteDocument({ id: documentId });

    toast.promise(promise, {
      loading: 'Deleting note...',
      success: 'Note deleted!',
      error: 'Failed to delete note.',
    });

    if (params.documentId === documentId) {
      router.push(AppRoute.DOCUMENTS);
    }
  };

  if (archivedDocuments === undefined) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="text-sm">
      <div className="flex items-center gap-x-1 p-2">
        <Search className="h-4 w-4" />
        <Input
          className="h-7 px-2 focus-visible:ring-transparent bg-secondary"
          placeholder="Filter by page title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="mt-2 px-1 pb-1">
        <p className="hidden last:block text-xs text-center text-muted-foreground pb-2">
          No documents found.
        </p>
        {filteredDocuments?.map((document) => (
          <div
            key={document._id}
            className="text-sm rounded-sm w-full hover:bg-primary/5 flex items-center text-primary justify-between"
            role="button"
            onClick={() => handleDocumentClick(document._id)}
          >
            <span className="truncate pl-2">{document.title}</span>
            <div className="flex items-center">
              <div
                className="rounded-sm p-2 hover:bg-neutral-200"
                role="button"
                onClick={(e) => handleRestoreDocument(e, document._id)}
              >
                <Undo className="h-4 w-4 text-muted-foreground" />
              </div>
              <ConfirmModal onConfirm={() => handleDeleteDocument(document._id)}>
                <div className="rounded-sm p-2 hover:bg-neutral-200" role="button">
                  <Trash className="h-4 w-4 text-muted-foreground" />
                </div>
              </ConfirmModal>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
