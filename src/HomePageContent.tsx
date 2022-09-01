import AddCoverArt from "./addCoverArt/AddCoverArt";
import ChartOptionsSection from "./chartOptions/ChartOptionsSection";
import Button from "./components/Button";
import Header from "./header/Header";
import MusicCollage from "./musicCollage/MusicCollage";
import { useSetMusicCollageItem } from "./stores/charts";

const HomePageContent = () => {
  const setMusicCollageItem = useSetMusicCollageItem();

  return (
    <>
      <Header />
      <div className="grid min-h-0 flex-grow md:grid-cols-[1fr_2.5fr_1fr]">
        <ChartOptionsSection />
        <main className="overflow-auto p-4">
          <MusicCollage />
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
