import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { NextPage } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";

const DynamicContent = dynamic(() => import("../HomePageContent"), {
  ssr: false,
});

const queryClient = new QueryClient();

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Topchart</title>
        <meta charSet="utf-8" />
        <meta
          name="description"
          content="Create customized music charts and collages."
        />
        <meta name="theme-color" content="#151c24" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <div className="flex flex-col overflow-hidden">
        <QueryClientProvider client={queryClient}>
          <DynamicContent />
        </QueryClientProvider>
      </div>
    </>
  );
};

export default Home;
