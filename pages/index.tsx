// import classnames from "classnames";
// import { useCallback } from "react";

import Mailchimp from "components/Mailchimp";
import PageBody from "components/PageBody";
import { getPostContent } from "lib/api";
import Link from "next/link";

export default function IndexPage({ content }: { content: string }) {
  return (
    <>
      <main>
        <section
          role="banner"
          className="mx-auto mb-4 flex flex-col md:flex-row bg-bottom bg-cover py-16 flex-wrap"
          style={{
            backgroundImage: 'url("/images/nyc_street.jpg")',
          }}
        >
          <header className="box-border overflow-auto py-4 md:mb-10 w-full px-8">
            <h1 className="text-white md:text-4xl text-xl">
              <a
                href="/"
                className="text-white hover:text-gray-200 bg-gray-800 bg-opacity-40 p-2"
              >
                Curbiture
              </a>
            </h1>
          </header>
          <div className="flex-1 p-6 relative">
            <div className="w-full max-w-2xl">
              <div
                className="p-4 rounded text-white md:text-xl font-medium bg-gray-600 bg-opacity-80"
                style={{
                  textShadow: "2px 1px #333",
                }}
              >
                <h2>
                  Curbiture is a service for residents of New York City to
                  share, discover and pickup free furniture.
                </h2>
                <p className="font-normal md:text-base text-sm">
                  Most of it goes to waste in the landfill because people don't
                  know there is free furniture out there or what condition it is
                  in.
                </p>
              </div>
            </div>
          </div>
          <div className="flex-1 relative" style={{ minHeight: 320 }}>
            <div className="md:max-w-md">
              <Mailchimp />
            </div>
          </div>
        </section>
        <section className="flex flex-col sm:flex-row justify-center mb-12 p-6">
          <div className="md:mr-6 text-center flex-1 mb-6 md:mb-0">
            <div
              style={{
                margin: "0 auto",
                width: 65,
                height: 65,
                backgroundImage: "url('/icons/noun/recycle.jpg')",
                backgroundSize: "cover",
              }}
            ></div>
            <p>Reuse</p>
          </div>
          <div className="md:mr-6 text-center flex-1 mb-6 md:mb-0">
            <div
              style={{
                margin: "0 auto",
                width: 65,
                height: 65,
                backgroundImage: "url('/icons/noun/map.jpg')",
                backgroundSize: "cover",
              }}
            ></div>
            <p>Locate items</p>
          </div>
          <div className="flex-1 text-center mb-6 md:mb-0">
            <div
              style={{
                margin: "0 auto",
                width: 65,
                height: 65,
                backgroundImage: "url('/icons/noun/couch.jpg')",
                backgroundSize: "cover",
              }}
            ></div>
            <p>Share treasure</p>
          </div>
        </section>
        <section className="mb-12 p-6 bg-gray-200" style={{ height: 400 }}>
          <div>collect furniture</div>
          <div>build community</div>
        </section>
        <section className="md:px-8 px-4">
          <PageBody content={content} />
        </section>
      </main>
      <footer className="mt-28 p-4">
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
