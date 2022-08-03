import { createSignal } from "solid-js";
import AddCoverArt from "./components/AddCoverArt";
import AddCoverArtModal from "./components/AddCoverArtModal";
import Button from "./components/Button";
import ChartOptions from "./components/ChartOptions";
import Header from "./components/Header";
import { addToast, ToastContainer } from "./components/Toasts";

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
          <Button
            onClick={() => {
              addToast({
                type: "error",
                message: "hi",
              });
              addToast({
                type: "success",
                message: "hi",
                autoClose: false,
              });
              addToast({
                type: "success",
                message: "should close in 1",
                duration: 1000,
              });
              addToast({
                message: "hi",
              });
              addToast({
                type: "loading",
                message: "hi",
              });
            }}
            hideLabelOnMobile={false}
          >
            Toast
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
      <ToastContainer />
    </div>
  );
}

export default App;
