'use client';

import { useState } from 'react';
import { useMutation } from 'convex/react';
import { CheckIcon, CopyIcon, Globe } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import { useOrigin } from '@/hooks/use-origin';
import { api } from '@/convex/_generated/api';
import { Doc } from '@/convex/_generated/dataModel';

interface PublishProps {
  initialData: Doc<'documents'>;
}

export const Publish = ({ initialData }: PublishProps) => {
  const origin = useOrigin();
  const updateDocument = useMutation(api.documents.updateDocument);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const url = `${origin}/preview/${initialData._id}`;

  const handlePublishDocument = () => {
    setIsSubmitting(true);

    const promise = updateDocument({ id: initialData._id, isPublished: true }).finally(() =>
      setIsSubmitting(false)
    );

    toast.promise(promise, {
      loading: 'Publishing...',
      success: 'Note published!',
      error: 'Failed to publish note.',
    });
  };

  const handleUnpublishDocument = () => {
    setIsSubmitting(true);

    const promise = updateDocument({ id: initialData._id, isPublished: false }).finally(() =>
      setIsSubmitting(false)
    );

    toast.promise(promise, {
      loading: 'Unpublishing...',
      success: 'Note unpublished!',
      error: 'Failed to unpublish note.',
    });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url);
    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 1000);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="sm" variant="ghost">
          {initialData.isPublished ? 'Unpublish' : 'Publish'}
          {initialData.isPublished && <Globe className="text-sky-500 w-4 h-4 ml-2" />}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" alignOffset={8} className="w-72" forceMount>
        {initialData.isPublished ? (
          <div className="space-y-4">
            <div className="flex items-center gap-x-2">
              <Globe className="text-sky-500 animate-pulse h-4 w-4" />
              <p className="text-xs font-medium text-sky-500">This note is live on web.</p>
            </div>
            <div className="flex items-center">
              <input
                className="flex-1 px-2 text-xs border rounded-l-md h-8 bg-muted truncate"
                disabled
                value={url}
              />
              <Button className="h-8 rounded-l-none" disabled={isCopied} onClick={handleCopyLink}>
                {isCopied ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
              </Button>
            </div>
            <Button
              className="w-full text-xs"
              disabled={isSubmitting}
              size="sm"
              onClick={handleUnpublishDocument}
            >
              Unpublish
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <Globe className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm font-medium mb-2">Publish this note</p>
            <span className="text-xs text-muted-foreground mb-4">Share your work with others.</span>
            <Button
              className="w-full text-xs"
              disabled={isSubmitting}
              size="sm"
              onClick={handlePublishDocument}
            >
              Publish
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};
