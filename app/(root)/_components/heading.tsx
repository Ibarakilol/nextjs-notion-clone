'use client';

import { SignInButton } from '@clerk/clerk-react';
import { ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { AppRoute } from '@/constants';

const Heading = () => {
  return (
    <div className="flex flex-1 flex-col justify-center items-center max-w-3xl space-y-4">
      <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold">
        Your Ideas, Documents & Plans. Unified. Welcome to <span className="underline">Notion</span>
      </h1>

      <h2 className="text-base sm:text-xl md:text-2xl font-medium">
        Notion is the connected workspace where <br />
        better, faster work happens.
      </h2>

      <SignInButton fallbackRedirectUrl={AppRoute.DOCUMENTS} mode="modal">
        <Button>
          Enter Notion <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </SignInButton>
    </div>
  );
};

export default Heading;
