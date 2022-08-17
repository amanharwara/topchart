import type { NextPage } from "next";
import Head from "next/head";
import ChartOptionsSection from "../chartOptions/ChartOptionsSection";
import Header from "../header/Header";

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
      <div className="flex h-full flex-col overflow-hidden">
        <Header />
        <div className="grid min-h-0 flex-grow md:grid-cols-[1fr_2.5fr_1fr]">
          <ChartOptionsSection />
          <main className="overflow-auto p-4">
            <div className="mb-4 text-white">
              TODO: Rip out everything and start again with mobile-first markup
            </div>
            {/* <MusicCollage /> */}
            <div className="mt-5 flex items-center gap-4 text-white">
              DevTools:
              {/* <Button
                onClick={() => {
                  setMusicCollageItem(selectedChart().id, 0, 0, {
                    title: "Brian Eno",
                    image: "eno.jpg",
                  });
                }}
              >
                Add image to first
              </Button>
              <Button
                onClick={() => {
                  setCharts(
                    (chart) => selectedChart().id === chart.id,
                    "options",
                    "musicCollage",
                    "items",
                    (rows) =>
                      rows.map((row) =>
                        row.map(() => ({
                          title: "",
                          image: null,
                        }))
                      )
                  );
                }}
              >
                Clear items
              </Button>
              <Button
                onClick={() => {
                  setCharts(
                    (chart) => selectedChart().id === chart.id,
                    "options",
                    "musicCollage",
                    "items",
                    (items) => items.slice()
                  );
                }}
              >
                Force refresh chart
              </Button> */}
            </div>
          </main>
          <section className="flex min-h-0 flex-col bg-gray-800">
            {/* <AddCoverArt /> */}
          </section>
        </div>
        {/* <AddCoverArtModal
          isOpen={isCoverArtModalOpen()}
          closeModal={() => toggleCoverArtModal(false)}
        />
        <ToastContainer /> */}
      </div>
    </>
  );
};

export default Home;
