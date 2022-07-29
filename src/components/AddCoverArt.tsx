import { Component, createSignal, JSX, Match, Switch } from "solid-js";
import classNames from "../utils/classNames";
import IconButton from "./IconButton";
import CloseIcon from "./icons/CloseIcon";
import DownloadIcon from "./icons/DownloadIcon";
import ImageIcon from "./icons/ImageIcon";
import MusicIcon from "./icons/MusicIcon";
import SearchIcon from "./icons/SearchIcon";

type Tab = "Search" | "Link" | "Upload";

const TabButton: Component<{
  children: JSX.Element;
  selected: boolean;
  onClick: () => void;
}> = (props) => (
  <button
    class={classNames(
      "flex-grow border-slate-600 py-2.5 text-sm uppercase first:border-r last:border-l hover:bg-slate-500",
      props.selected && "bg-slate-600 font-semibold"
    )}
    onClick={props.onClick}
  >
    {props.children}
  </button>
);

const CoverArtSearchTab: Component = () => {
  const [searchQuery, setSearchQuery] = createSignal("");
  const results = new Array(23).fill(0);

  return (
    <div class="flex min-h-0 flex-grow flex-col">
      <div class="flex gap-2.5 px-2.5 py-3.5">
        <input
          class="flex-grow rounded border border-slate-600 bg-transparent px-2.5 py-1.5 text-xs placeholder:text-slate-400"
          placeholder="Search for music..."
          value={searchQuery()}
          onInput={(event) => {
            setSearchQuery(event.currentTarget.value);
          }}
        />
        {searchQuery().length > 1 && (
          <IconButton
            icon={CloseIcon}
            label="Clear search"
            onClick={() => setSearchQuery("")}
          />
        )}
        <IconButton icon={SearchIcon} label="Search" />
      </div>
      <div class="flex flex-col items-center gap-2.5 overflow-y-auto px-3 pt-1 pb-5">
        <Switch>
          <Match when={!searchQuery()}>
            <div class="rounded-full bg-slate-600 p-4">
              <MusicIcon class="h-12 w-12 text-white" />
            </div>
            <div class="max-w-[20ch] text-center font-semibold">
              Search for any album, artist or song to add cover art
            </div>
            <div class="text-xs text-slate-200">
              Example: "
              <span
                class="cursor-pointer border-b border-dotted border-slate-300 font-semibold"
                onClick={() => setSearchQuery("It's Almost Dry by Pusha T")}
              >
                It's Almost Dry by Pusha T
              </span>
              "
            </div>
          </Match>
          <Match when={searchQuery() !== "Brian Eno"}>
            <div class="rounded-full bg-slate-600 p-4">
              <MusicIcon class="h-12 w-12 text-white" />
            </div>
            <div class="max-w-[20ch] text-center font-semibold">
              Couldn’t find any results
            </div>
            <div class="max-w-[40ch] text-center text-xs text-slate-200">
              Check your search for typos, or try a different search. For
              example, "
              <span
                class="cursor-pointer border-b border-dotted border-slate-300 font-semibold"
                onClick={() => setSearchQuery("Brian Eno")}
              >
                Brian Eno
              </span>
              "
            </div>
          </Match>
          <Match when={searchQuery() === "Brian Eno"}>
            <div class="grid w-full max-w-sm grid-cols-3 gap-2">
              {results.map(() => (
                <div class="h-28 rounded bg-slate-600" />
              ))}
            </div>
          </Match>
        </Switch>
      </div>
    </div>
  );
};

const CoverArtLinkTab: Component = () => {
  return (
    <div class="flex flex-col gap-1.5">
      <div class="px-2.5 py-3">
        <div class="mb-1.5 text-sm font-semibold">Paste image link:</div>
        <div class="flex gap-2.5">
          <input
            class="flex-grow rounded border border-slate-600 bg-transparent px-2.5 py-1.5 text-xs placeholder:text-slate-400"
            placeholder="https://example.com"
          />
          <IconButton icon={DownloadIcon} label="Search" />
        </div>
      </div>
      <div class="flex flex-col items-center gap-2 px-2.5 pb-5">
        <div class="text-sm">Preview:</div>
        <div class="h-36 w-36 rounded bg-slate-600" />
      </div>
    </div>
  );
};

const CoverArtUploadTab: Component = () => {
  let fileInputRef: HTMLInputElement | null;
  let dragCounter = 0;

  const [isDraggingFiles, setIsDraggingFiles] = createSignal(false);

  const preventDefaultOnDrag = (event: DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDragEnter = (event: DragEvent) => {
    event.preventDefault();
    event.stopPropagation();

    dragCounter = dragCounter + 1;

    if (event.dataTransfer.items.length) {
      setIsDraggingFiles(true);
    }
  };

  const handleDragExit = (event: DragEvent) => {
    event.preventDefault();
    event.stopPropagation();

    dragCounter = dragCounter - 1;

    if (dragCounter > 0) {
      return;
    }

    setIsDraggingFiles(false);
  };

  const getFirstImageFile = (files: File[]) => {
    return files.filter((file) => file.type.startsWith("image/"))[0];
  };

  const handleDrop = (event: DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    setIsDraggingFiles(false);

    if (event.dataTransfer.items.length) {
      const imageFile = getFirstImageFile(
        Array.from(event.dataTransfer.items).map((item) => item.getAsFile())
      );

      console.log(imageFile);

      event.dataTransfer.clearData();
      dragCounter = 0;
    }
  };

  return (
    <div class="p-4">
      <input
        type="file"
        class="hidden"
        accept="image/*"
        ref={fileInputRef}
        onChange={() => {
          console.log(getFirstImageFile(Array.from(fileInputRef.files)));
        }}
      />
      <button
        class={classNames(
          "flex w-full cursor-pointer flex-col items-center gap-1 rounded border-2 border-dashed border-slate-600 py-6 transition-colors duration-150 hover:border-slate-500",
          isDraggingFiles() && "border-slate-500"
        )}
        onClick={() => {
          fileInputRef.click();
        }}
        onDrag={preventDefaultOnDrag}
        onDragEnter={handleDragEnter}
        onDragExit={handleDragExit}
        onDragOver={preventDefaultOnDrag}
        onDrop={handleDrop}
      >
        <div class="mb-1 rounded-full bg-slate-600 p-4">
          <ImageIcon class="h-12 w-12 text-white" />
        </div>
        <div class="font-semibold">Click to browse images</div>
        <div class="text-sm">Or drop your files here</div>
      </button>
    </div>
  );
};

const AddCoverArt: Component = () => {
  const [currentTab, setCurrentTab] = createSignal<Tab>("Search");

  return (
    <div class="flex h-full min-h-0 flex-col text-white">
      <div class="flex border-b border-slate-600">
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
      <Switch>
        <Match when={currentTab() === "Search"}>
          <CoverArtSearchTab />
        </Match>
        <Match when={currentTab() === "Link"}>
          <CoverArtLinkTab />
        </Match>
        <Match when={currentTab() === "Upload"}>
          <CoverArtUploadTab />
        </Match>
      </Switch>
    </div>
  );
};

export default AddCoverArt;