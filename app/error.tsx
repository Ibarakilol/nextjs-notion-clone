'use client';

import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

import { AppRoute } from '@/constants';

const Error = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center space-y-4">
      <Image alt="Error" height="288" priority src="/error.png" width="384" />
      <h2 className="text-xl font-medium">Something went wrong!</h2>
      <Button asChild>
        <Link href={AppRoute.DOCUMENTS}>Go back</Link>
      </Button>
    </div>
  );
};

export default Error;
