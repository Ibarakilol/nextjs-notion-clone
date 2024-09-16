'use client';

import { useMutation } from 'convex/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { ConfirmModal } from '@/components/modals/confirm-modal';
import { Button } from '@/components/ui/button';

import { AppRoute } from '@/constants';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';

interface BannerProps {
  documentId: Id<'documents'>;
}

export const Banner = ({ documentId }: BannerProps) => {
  const router = useRouter();

  const deleteDocument = useMutation(api.documents.deleteDocument);
  const restoreDocument = useMutation(api.documents.restoreDocument);

  const handleDeleteDocument = () => {
    const promise = deleteDocument({ id: documentId }).then(() => router.push(AppRoute.DOCUMENTS));

    toast.promise(promise, {
      loading: 'Deleting note...',
      success: 'Note deleted!',
      error: 'Failed to delete note.',
    });
  };

  const handleRestoreDocument = () => {
    const promise = restoreDocument({ id: documentId });

    toast.promise(promise, {
      loading: 'Restoring note...',
      success: 'Note restored!',
      error: 'Failed to restore note.',
    });
  };

  return (
    <div className="w-full bg-rose-500 text-center text-sm p-2 text-white flex items-center gap-x-2 justify-center">
      <p>This page is in the trash</p>
      <Button
        className="border-white bg-transparent hover:bg-primary/5 text-white hover:text-white p-1 px-2 h-auto font-normal"
        size="sm"
        variant="outline"
        onClick={handleRestoreDocument}
      >
        Restore page
      </Button>
      <ConfirmModal onConfirm={handleDeleteDocument}>
        <Button
          className="border-white bg-transparent hover:bg-primary/5 text-white hover:text-white p-1 px-2 h-auto font-normal"
          size="sm"
          variant="outline"
        >
          Delete forever
        </Button>
      </ConfirmModal>
    </div>
  );
};
