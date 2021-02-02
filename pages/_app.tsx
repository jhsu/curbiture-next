import { Provider } from "jotai";
import Head from "next/head";

import { FirebaseProvider } from "components/firebase";
import { BottomNav } from "components/nav/BottomNav";

import "styles/tailwind.css";
import "styles/tailwind-utilities.css";
import "styles/index.css";

function MyApp({ Component, pageProps }) {
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
      <FirebaseProvider>
        <Provider>
          <Component {...pageProps} />
        </Provider>
      </FirebaseProvider>
    </>
  );
}

export default MyApp;
