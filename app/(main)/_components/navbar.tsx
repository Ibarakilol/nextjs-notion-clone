'use client';

import { useQuery } from 'convex/react';
import { MenuIcon } from 'lucide-react';
import { useParams } from 'next/navigation';

import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';

import { Banner } from './banner';
import { Menu } from './menu';
import { Publish } from './publish';
import { Title } from './title';

interface NavbarProps {
  isCollapsed: boolean;
  onResetWidth: () => void;
}

export const Navbar = ({ isCollapsed, onResetWidth }: NavbarProps) => {
  const params = useParams();

  const document = useQuery(api.documents.getDocumentById, {
    id: params.documentId as Id<'documents'>,
  });

  if (document === undefined || document === null) {
    return null;
  }

  return (
    <>
      <nav className="bg-background px-3 py-2 w-full flex items-center gap-x-4">
        {isCollapsed && (
          <MenuIcon
            className="h-5 w-5 text-muted-foreground"
            role="button"
            onClick={onResetWidth}
          />
        )}
        <div className="flex items-center justify-between w-full">
          <Title initialData={document} />
          {!document.isArchived && (
            <div className="flex items-center gap-x-2">
              <Publish initialData={document} />
              <Menu documentId={document._id} />
            </div>
          )}
        </div>
      </nav>
      {document.isArchived && <Banner documentId={document._id} />}
    </>
  );
};
