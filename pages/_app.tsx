import { Provider } from "jotai";
import Head from "next/head";

import { QueryClient, QueryClientProvider } from "react-query";

import { useRef } from "react";

import { FirebaseProvider } from "components/firebase";

import "styles/tailwind.css";
import "styles/tailwind-utilities.css";
import "styles/index.css";

function MyApp({ Component, pageProps }) {
  const queryClientRef = useRef<QueryClient>();
  if (!queryClientRef.current) {
    queryClientRef.current = new QueryClient();
  }
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
        />
        <title>Curbiture</title>
        {/* <script async src="https://cdn.splitbee.io/sb.js"></script> */}
      </Head>
      <QueryClientProvider client={queryClientRef.current}>
        <FirebaseProvider>
          <Provider>
            <Component {...pageProps} />
          </Provider>
        </FirebaseProvider>
      </QueryClientProvider>
    </>
  );
}

export default MyApp;
