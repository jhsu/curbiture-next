// import classnames from "classnames";
// import { useCallback } from "react";

import PageBody from "components/PageBody";
import { getPostContent } from "lib/api";
import Link from "next/link";

export default function IndexPage({ content }: { content: string }) {
  return (
    <>
      <header>
        <h1 className="text-center">Curbiture</h1>
      </header>
      <main>
        <section role="banner" className="mx-auto max-w-3xl my-10">
          <PageBody content={content} />
        </section>
        <div className="my-10">
          <p>
            Sign up to be notified when we launch our <i>Beta</i>.
          </p>
          <iframe
            src="https://curbiture.substack.com/embed"
            height="320"
            style={{
              width: "100%",
              border: "1px solid #EEE",
              backgroundColor: "white",
            }}
            frameBorder="0"
            scrolling="no"
          ></iframe>
        </div>
      </main>
      <footer>
        <div className="mx-auto max-w-3xl flex">
          <div className="flex flex-col flex-1">
            <Link href="/login">Login</Link>
            <Link href="/map">Map</Link>
            <Link href="/posts">Posts</Link>
          </div>
          <div className="flex flex-col flex-1">
            <a href="https://instagram.com/curbiturenyc" target="_blank">
              Instagram
            </a>
            <a href="https://curbiture.substack.com" target="_blank">
              Mailing list
            </a>
          </div>
        </div>
        <div className="mx-auto max-w-3xl">Curbiture &copy; 2021</div>
      </footer>
    </>
  );
}

export const getStaticProps = async () => {
  const content = await getPostContent("homepage");
  return {
    props: {
      content,
    },
  };
};
