import { createSignal } from "solid-js";
import AddCoverArt from "./components/AddCoverArt";
import AddCoverArtModal from "./components/AddCoverArtModal";
import ChartOptions from "./components/ChartOptions";
import Header from "./components/Header";
import { MusicCollage } from "./components/MusicCollage";
import { ToastContainer } from "./components/Toasts";

function App() {
  const [isCoverArtModalOpen, toggleCoverArtModal] = createSignal(false);

  return (
    <div class="flex h-full flex-col overflow-hidden">
      <Header />
      <div class="grid min-h-0 flex-grow grid-cols-[1fr_2.5fr_1fr]">
        <ChartOptions />
        <main class="overflow-auto p-4">
          <MusicCollage />
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
