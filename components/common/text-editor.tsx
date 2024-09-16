'use client';

import { BlockNoteEditor, PartialBlock } from '@blocknote/core';
import { BlockNoteView } from '@blocknote/mantine';
import { useCreateBlockNote } from '@blocknote/react';

import { useEdgeStore } from '@/providers/edgestore-provider';

import '@blocknote/mantine/style.css';

interface TextEditorProps {
  initialContent?: string;
  isEditable?: boolean;
  onChange: (value: string) => void;
}

const TextEditor = ({ initialContent, isEditable, onChange }: TextEditorProps) => {
  const { edgestore } = useEdgeStore();

  const handleUploadFile = async (file: File) => {
    const response = await edgestore.publicFiles.upload({ file });
    return response.url;
  };

  const editor: BlockNoteEditor = useCreateBlockNote({
    initialContent: initialContent ? (JSON.parse(initialContent) as PartialBlock[]) : undefined,
    uploadFile: handleUploadFile,
  });

  return (
    <BlockNoteView
      editable={isEditable}
      editor={editor}
      theme="light"
      onChange={() => onChange(JSON.stringify(editor.document, null, 2))}
    />
  );
};

export default TextEditor;
