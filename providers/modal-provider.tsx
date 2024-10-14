"use client";

import { useEffect, useState } from "react";

import { CoverImageModal } from '@/components/modals/cover-image-modal';

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <CoverImageModal />
    </>
  );
};
