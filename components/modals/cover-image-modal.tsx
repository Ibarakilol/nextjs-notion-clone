'use client';

import { useState } from 'react';
import { useMutation } from 'convex/react';
import { useParams } from 'next/navigation';

import { SingleImageDropzone } from '@/components/common/single-image-dropzone';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import { useEdgeStore } from '@/providers/edgestore-provider';
import { useCoverImage } from '@/hooks/use-cover-image';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';

export const CoverImageModal = () => {
  const params = useParams();
  const [file, setFile] = useState<File>();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const updateDocument = useMutation(api.documents.updateDocument);
  const coverImage = useCoverImage();
  const { edgestore } = useEdgeStore();

  const handleChangeImage = async (file?: File) => {
    if (file) {
      setIsSubmitting(true);
      setFile(file);

      const res = await edgestore.publicFiles.upload({
        file,
        options: { replaceTargetUrl: coverImage.url },
      });

      await updateDocument({
        id: params.documentId as Id<'documents'>,
        coverImage: res.url,
      });

      setFile(undefined);
      setIsSubmitting(false);
      coverImage.onClose();
    }
  };

  return (
    <Dialog open={coverImage.isOpen} onOpenChange={coverImage.onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cover Image</DialogTitle>
        </DialogHeader>
        <SingleImageDropzone
          className="w-full outline-none"
          isDisabled={isSubmitting}
          value={file}
          onChange={handleChangeImage}
        />
      </DialogContent>
    </Dialog>
  );
};
