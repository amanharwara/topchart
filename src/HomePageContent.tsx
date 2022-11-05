import AddCoverArt from "./addCoverArt/AddCoverArt";
import ChartOptionsSection from "./chartOptions/ChartOptionsSection";
import Button from "./components/Button";
import Spinner from "./components/Spinner";
import { isDev } from "./constants";
import Header from "./header/Header";
import MusicCollage from "./musicCollage/MusicCollage";
import { useIsDownloading, useSetMusicCollageItem } from "./stores/charts";
import classNames from "./utils/classNames";

const HomePageContent = () => {
  const setMusicCollageItem = useSetMusicCollageItem();
  const isDownloading = useIsDownloading();

  return (
    <>
      <Header />
      <div className="grid min-h-0 flex-grow md:grid-cols-[1fr_2.5fr_1fr]">
        <ChartOptionsSection />
        <main
          className={classNames(
            "p-4",
            isDownloading ? "relative overflow-hidden" : "overflow-auto"
          )}
        >
          {isDownloading && (
            <div className="flex items-center justify-center gap-4 w-full h-full absolute top-0 left-0 z-50 bg-slate-800/95 text-white font-bold text-lg">
              <Spinner className="w-10 h-10" width={2} />
              Preparing download...
            </div>
          )}
          <MusicCollage />
          {isDev && (
            <div className="mt-5 flex items-center gap-4 text-white">
              DevTools:
              <Button
                onClick={() => {
                  setMusicCollageItem(0, {
                    title: "Brian Eno",
                    image: "eno.jpg",
                  });
                }}
              >
                Add image to first
              </Button>
            </div>
          )}
        </main>
        <section className="flex min-h-0 flex-col bg-gray-800">
          <AddCoverArt />
        </section>
      </div>
      {/* <AddCoverArtModal
    isOpen={isCoverArtModalOpen()}
    closeModal={() => toggleCoverArtModal(false)}
  />
  <ToastContainer /> */}
    </>
  );
};

export default HomePageContent;
