import Document, { Head, Html, Main, NextScript } from "next/document";

class MyDocument extends Document {
  //   static async getInitialProps(ctx) {
  //     const initialProps = await Document.getInitialProps(ctx);
  //     return { ...initialProps };
  //   }

  render() {
    return (
      <Html>
        <Head>
          <meta name="application-name" content="Curbiture" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta
            name="apple-mobile-web-app-status-bar-style"
            content="default"
          />
          <meta name="apple-mobile-web-app-title" content="Curbiture" />
          <meta name="description" content="Find it on Curbiture" />
          <meta name="format-detection" content="telephone=no" />
          <meta name="mobile-web-app-capable" content="yes" />
          {/* <meta
            name="msapplication-config"
            content="/static/icons/browserconfig.xml"
          /> */}
          {/* <meta name="msapplication-TileColor" content="#2B5797" />
          <meta name="msapplication-tap-highlight" content="no" /> */}
          <meta name="theme-color" content="#000000" />

          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/icons/curbiture-512.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/icons/curbiture-32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/icons/curbiture-16.png"
          />
          <link rel="manifest" href="/manifest.json" />
          {/* <link
            rel="mask-icon"
            href="/static/icons/safari-pinned-tab.svg"
            color="#5bbad5"
          /> */}
          {/* <link rel="shortcut icon" href="/icons/favicon.ico" /> */}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
