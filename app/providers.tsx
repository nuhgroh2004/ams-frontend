'use client';

import { ApolloProvider } from '@apollo/client';
import { apolloClient } from '@/lib/core/apollo';
import React from 'react';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { Toaster } from '@/components/ui/sonner';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ApolloProvider client={apolloClient}>
        {children}
        <Toaster />
      </ApolloProvider>
    </ThemeProvider>
  );
}
