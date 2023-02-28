import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { NextPage } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useEffect } from "react";
import { useDarkMode } from "../stores/settings";

const DynamicContent = dynamic(() => import("../HomePageContent"), {
  ssr: false,
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const Home: NextPage = () => {
  const darkMode = useDarkMode();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  useEffect(() => {
    if (!CSS.supports("height: 100svh")) {
      if (visualViewport) {
        document.documentElement.style.setProperty(
          "--viewport-height",
          `${visualViewport.height}px`
        );
      } else {
        document.documentElement.style.setProperty(
          "--viewport-height",
          `${window.innerHeight}px`
        );
      }
    }
  }, []);

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
      <div className="flex flex-col overflow-hidden h-full max-h-screen md:max-h-max">
        <QueryClientProvider client={queryClient}>
          <DynamicContent />
        </QueryClientProvider>
      </div>
    </>
  );
};

export default Home;
