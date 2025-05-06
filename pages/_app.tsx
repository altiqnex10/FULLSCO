import React from 'react';
import type { AppProps } from 'next/app';
import { Inter } from 'next/font/google';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../src/lib/queryClient';
import '../styles/globals.css';

// Font configuration
const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <main className={`${inter.variable} font-sans`}>
        <Component {...pageProps} />
      </main>
    </QueryClientProvider>
  );
}