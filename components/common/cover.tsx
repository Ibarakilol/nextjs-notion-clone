'use client';

import { useMutation } from 'convex/react';
import { ImageIcon, X } from 'lucide-react';
import Image from 'next/image';
import { useParams } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

import { useEdgeStore } from '@/providers/edgestore-provider';
import { useCoverImage } from '@/hooks/use-cover-image';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { cn } from '@/lib/utils';

interface CoverProps {
  isPreview?: boolean;
  url?: string;
}

export const Cover = ({ isPreview, url }: CoverProps) => {
  const params = useParams();
  const { edgestore } = useEdgeStore();
  const coverImage = useCoverImage();
  const removeDocumentCoverImage = useMutation(api.documents.removeDocumentCoverImage);

  const handleRemoveCover = async () => {
    if (url) {
      await edgestore.publicFiles.delete({ url: url });
    }

    removeDocumentCoverImage({ id: params.documentId as Id<'documents'> });
  };

  return (
    <div className={cn('relative w-full h-[35vh] group', !url && 'h-[12vh]', url && 'bg-muted')}>
      {url && <Image alt="Cover" className="object-cover" fill src={url} />}
      {url && !isPreview && (
        <div className="opacity-0 group-hover:opacity-100 absolute bottom-5 right-5 flex items-center gap-x-2">
          <Button
            className="text-muted-foreground text-xs"
            size="sm"
            variant="outline"
            onClick={() => coverImage.onReplace(url)}
          >
            <ImageIcon className="h-4 2-4 mr-2" />
            Change cover
          </Button>
          <Button
            className="text-muted-foreground text-xs"
            size="sm"
            variant="outline"
            onClick={handleRemoveCover}
          >
            <X className="h-4 2-4 mr-2" />
            Remove
          </Button>
        </div>
      )}
    </div>
  );
};

Cover.Skeleton = function CoverSkeleton() {
  return <Skeleton className="w-0 h-[12vh]" />;
};
