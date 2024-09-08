'use client';

import { BlockNoteEditor, PartialBlock } from '@blocknote/core';
import { BlockNoteView, useBlockNote } from '@blocknote/react';

import { useEdgeStore } from '@/providers/edgestore-provider';

import '@blocknote/core/style.css';

interface TextEditorProps {
  initialContent?: string;
  isEditable?: boolean;
  onChange: (value: string) => void;
}

export const TextEditor = ({ initialContent, isEditable, onChange }: TextEditorProps) => {
  const { edgestore } = useEdgeStore();

  const handleUploadFile = async (file: File) => {
    const response = await edgestore.publicFiles.upload({ file });
    return response.url;
  };

  const editor: BlockNoteEditor = useBlockNote({
    editable: !!isEditable,
    initialContent: initialContent ? (JSON.parse(initialContent) as PartialBlock[]) : undefined,
    onEditorContentChange: (editor) => {
      onChange(JSON.stringify(editor.topLevelBlocks, null, 2));
    },
    uploadFile: handleUploadFile,
  });

  return <BlockNoteView editor={editor} theme="light" />;
};
