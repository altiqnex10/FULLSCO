import React from 'react';
import { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SiteSettingsProvider } from '@/contexts/site-settings-context';
import '@/styles/globals.css';

// إنشاء كائن QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 دقائق
    },
  },
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <SiteSettingsProvider>
        <Component {...pageProps} />
      </SiteSettingsProvider>
    </QueryClientProvider>
  );
}