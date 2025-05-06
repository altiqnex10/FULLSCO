import React from 'react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { SiteSettingsProvider } from '../src/contexts/SiteSettingsContext';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SiteSettingsProvider>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Component {...pageProps} />
    </SiteSettingsProvider>
  );
}