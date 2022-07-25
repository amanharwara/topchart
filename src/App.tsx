import { createSignal } from "solid-js";
import AddCoverArt from "./components/AddCoverArt";
import AddCoverArtModal from "./components/AddCoverArtModal";
import Button from "./components/Button";
import Header from "./components/Header";

function App() {
  const [isCoverArtModalOpen, toggleCoverArtModal] = createSignal(false);

  return (
    <div class="flex h-full flex-col overflow-hidden">
      <Header />
      <div class="grid min-h-0 flex-grow grid-cols-[1fr_2.5fr_1fr]">
        <div class="bg-gray-800">
          <Button
            onClick={() => toggleCoverArtModal(true)}
            hideLabelOnMobile={false}
          >
            Cover art modal
          </Button>
        </div>
        <div class=""></div>
        <div class="flex min-h-0 flex-col bg-gray-800">
          <AddCoverArt />
        </div>
      </div>
      <AddCoverArtModal
        isOpen={isCoverArtModalOpen()}
        closeModal={() => toggleCoverArtModal(false)}
      />
    </div>
  );
}

export default App;
