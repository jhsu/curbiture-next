import Head from "next/head";
import "../styles/index.css";
import { Provider } from "jotai";
import { FirebaseProvider } from "../components/firebase";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Curbiture</title>
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
