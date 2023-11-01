import "@/styles/globals.css";
import PlausibleProvider from "next-plausible";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <PlausibleProvider
      domain='1177.ai'
      customDomain='https://analytics.eliasson.me'
      selfHosted={true}
      enabled={true}
    >
      <Component {...pageProps} />
    </PlausibleProvider>
  );
}
