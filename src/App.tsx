import { createSignal } from "solid-js";
import { selectedChart, setCharts, setMusicCollageItem } from "./chartStore";
import AddCoverArt from "./components/AddCoverArt";
import AddCoverArtModal from "./components/AddCoverArtModal";
import Button from "./components/Button";
import ChartOptions from "./components/ChartOptions";
import Header from "./components/Header";
import { MusicCollage } from "./components/MusicCollage";
import { ToastContainer } from "./components/Toasts";

function App() {
  const [isCoverArtModalOpen, toggleCoverArtModal] = createSignal(false);

  return (
    <div class="flex h-full flex-col overflow-hidden">
      <Header />
      <div class="grid min-h-0 flex-grow md:grid-cols-[1fr_2.5fr_1fr]">
        <ChartOptions />
        <main class="overflow-auto p-4">
          <div class="mb-4 text-white">
            TODO: Rip out everything and start again with mobile-first markup
          </div>
          <MusicCollage />
          <div class="mt-5 flex items-center gap-4 text-white">
            DevTools:
            <Button
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
            </Button>
          </div>
        </main>
        <section class="flex min-h-0 flex-col bg-gray-800">
          <AddCoverArt />
        </section>
      </div>
      <AddCoverArtModal
        isOpen={isCoverArtModalOpen()}
        closeModal={() => toggleCoverArtModal(false)}
      />
      <ToastContainer />
    </div>
  );
}

export default App;
