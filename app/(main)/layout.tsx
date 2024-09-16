'use client';

import { ReactNode } from 'react';
import { useConvexAuth } from 'convex/react';

import { SearchCommand } from '@/components/common/search-command';
import { Spinner } from '@/components/common/spinner';
import { Sidebar } from './_components/sidebar';

const MainLayout = ({ children }: { children: ReactNode }) => {
  const { isLoading } = useConvexAuth();

  if (isLoading) {
    return (
      <div className="h-full flex justify-center items-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="h-full flex">
      <Sidebar />
      <main className="h-full flex-1 overflow-y-auto">
        <SearchCommand />
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
