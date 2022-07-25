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
        <div>
          <Button
            onClick={() => toggleCoverArtModal(true)}
            hideLabelOnMobile={false}
          >
            Cover art modal
          </Button>
        </div>
        <div class="border-x border-slate-600"></div>
        <AddCoverArt />
      </div>
      <AddCoverArtModal
        isOpen={isCoverArtModalOpen()}
        closeModal={() => toggleCoverArtModal(false)}
      />
    </div>
  );
}

export default App;
