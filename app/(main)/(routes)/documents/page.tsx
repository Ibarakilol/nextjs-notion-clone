'use client';

import { useUser } from '@clerk/clerk-react';
import { useMutation } from 'convex/react';
import { PlusCircle } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';

import { AppRoute, MOCK_USERNAME } from '@/constants';
import { api } from '@/convex/_generated/api';

const DocumentsPage = () => {
  const router = useRouter();
  const { user } = useUser();
  const createDocument = useMutation(api.documents.createDocument);

  const handleCreateNewDocument = () => {
    const promise = createDocument({ title: 'Untitled' }).then((documentId) =>
      router.push(`${AppRoute.DOCUMENTS}/${documentId}`)
    );

    toast.promise(promise, {
      loading: 'Creating a new note...',
      success: 'New note created!',
      error: 'Failed to create a new note.',
    });
  };

  return (
    <div className="h-full flex flex-col justify-center items-center space-y-4">
      <Image alt="Empty" height="288" priority src="/empty.png" width="384" />
      <h2 className="text-lg font-medium">
        Welcome to {user?.firstName ?? MOCK_USERNAME}&apos;s Notion
      </h2>
      <Button onClick={handleCreateNewDocument}>
        <PlusCircle className="h-4 w-4 mr-2" />
        Create a note
      </Button>
    </div>
  );
};

export default DocumentsPage;
