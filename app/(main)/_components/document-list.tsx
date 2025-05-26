'use client';

import { useState } from 'react';
import { useQuery } from 'convex/react';
import { FileIcon } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

import { SidebarItem } from './sidebar-item';

import { AppRoute } from '@/constants';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { cn } from '@/lib/utils';

interface DocumentListProps {
  level?: number;
  parentDocumentId?: Id<'documents'>;
}

export const DocumentList = ({ level = 0, parentDocumentId }: DocumentListProps) => {
  const params = useParams();
  const router = useRouter();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const handleExpandDocument = (documentId: string) => {
    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [documentId]: !prevExpanded[documentId],
    }));
  };

  const documents = useQuery(api.documents.getDocuments, {
    parentDocumentId: parentDocumentId,
  });

  const handleRedirectToDocument = (documentId: string) => {
    router.push(`${AppRoute.DOCUMENTS}/${documentId}`);
  };

  if (documents === undefined) {
    return (
      <>
        <SidebarItem.Skeleton level={level} />
        {level === 0 && (
          <>
            <SidebarItem.Skeleton level={level} />
            <SidebarItem.Skeleton level={level} />
          </>
        )}
      </>
    );
  }

  return (
    <>
      <p
        className={cn(
          'hidden text-sm font-medium text-muted-foreground/80 py-1',
          expanded && 'last:block',
          level === 0 && 'hidden'
        )}
        style={{ paddingLeft: level ? `${level * 12 + 25}px` : undefined }}
      >
        No pages inside
      </p>
      {documents?.map((document) => (
        <div key={document._id}>
          <SidebarItem
            active={params.documentId === document._id}
            documentIcon={document.icon}
            expanded={expanded[document._id]}
            icon={FileIcon}
            id={document._id}
            label={document.title}
            level={level}
            onClick={() => handleRedirectToDocument(document._id)}
            onExpand={() => handleExpandDocument(document._id)}
          />
          {expanded[document._id] && (
            <DocumentList level={level + 1} parentDocumentId={document._id} />
          )}
        </div>
      ))}
    </>
  );
};
