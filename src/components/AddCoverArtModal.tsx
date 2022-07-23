import { Component, createSignal, JSX } from "solid-js";
import classNames from "../utils/classNames";
import Modal from "./Modal";

type Tab = "Search" | "Link" | "Upload";

const TabButton: Component<{
  children: JSX.Element;
  selected: boolean;
  onClick: () => void;
}> = (props) => (
  <button
    class={classNames(
      "flex-grow border-slate-600 py-2.5 text-sm uppercase first:border-r last:border-l hover:bg-slate-500",
      props.selected && "bg-slate-600"
    )}
    onClick={props.onClick}
  >
    {props.children}
  </button>
);

const AddCoverArtModal: Component = () => {
  const [currentTab, setCurrentTab] = createSignal<Tab>("Search");

  return (
    <Modal
      isOpen={true}
      closeModal={() => {
        //
      }}
      title="Add cover art"
    >
      <div class="flex">
        <TabButton
          onClick={() => setCurrentTab("Search")}
          selected={currentTab() === "Search"}
        >
          Search
        </TabButton>
        <TabButton
          onClick={() => setCurrentTab("Link")}
          selected={currentTab() === "Link"}
        >
          Link
        </TabButton>
        <TabButton
          onClick={() => setCurrentTab("Upload")}
          selected={currentTab() === "Upload"}
        >
          Upload
        </TabButton>
      </div>
    </Modal>
  );
};

export default AddCoverArtModal;
