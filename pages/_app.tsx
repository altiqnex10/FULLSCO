import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { SiteSettingsProvider } from '@/contexts/site-settings-context';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SiteSettingsProvider>
      <Component {...pageProps} />
    </SiteSettingsProvider>
  );
}