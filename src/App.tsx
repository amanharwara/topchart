import { createSignal } from "solid-js";
import { Toaster } from "solid-toast";
import AddCoverArt from "./components/AddCoverArt";
import AddCoverArtModal from "./components/AddCoverArtModal";
import Button from "./components/Button";
import ChartOptions from "./components/ChartOptions";
import Header from "./components/Header";

function App() {
  const [isCoverArtModalOpen, toggleCoverArtModal] = createSignal(false);

  return (
    <div class="flex h-full flex-col overflow-hidden">
      <Header />
      <div class="grid min-h-0 flex-grow grid-cols-[1fr_2.5fr_1fr]">
        <ChartOptions />
        <div class="p-4">
          <Button
            onClick={() => toggleCoverArtModal(true)}
            hideLabelOnMobile={false}
          >
            Cover art modal
          </Button>
        </div>
        <div class="flex min-h-0 flex-col bg-gray-800">
          <AddCoverArt />
        </div>
      </div>
      <AddCoverArtModal
        isOpen={isCoverArtModalOpen()}
        closeModal={() => toggleCoverArtModal(false)}
      />
      <Toaster position="bottom-right" />
    </div>
  );
}

export default App;
