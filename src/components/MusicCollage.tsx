import { Component, createEffect, createSignal, For, Show } from "solid-js";
import {
  selectedChart,
  setCharts,
  setMusicCollageItemImage,
} from "../chartStore";
import type { MusicCollageItem } from "../chartStore";
import { getImageFromDB } from "../imageDB";
import classNames from "../utils/classNames";

const preventDefaultOnDrag = (event: DragEvent) => {
  event.preventDefault();
  event.stopPropagation();
};

const CollageItem: Component<{
  item: MusicCollageItem;
  index: number;
}> = (props) => {
  const [imageContent, setImageContent] = createSignal("");
  const [isDragEntered, setIsDragEntered] = createSignal(false);

  const handleDragEnter = (event: DragEvent) => {
    if (event.dataTransfer.getData("text")) {
      setIsDragEntered(true);
    }
  };

  const handleDragExit = () => {
    setIsDragEntered(false);
  };

  const handleDrop = async (event: DragEvent) => {
    const dataTransferText = event.dataTransfer.getData("text");

    if (dataTransferText.startsWith("image:")) {
      const parsedImageID = dataTransferText.replace("image:", "");
      setMusicCollageItemImage(selectedChart().id, props.index, parsedImageID);
    }

    if (dataTransferText.startsWith("index:")) {
      const parsedIndex = Number(dataTransferText.replace("index:", ""));

      const itemAtParsedIndex = {
        ...selectedChart().options["music-collage"].items.at(parsedIndex),
      };

      const currentItem = { ...props.item };

      setCharts(
        (chart) => chart.id === selectedChart().id,
        "options",
        "music-collage",
        "items",
        props.index,
        itemAtParsedIndex
      );

      setCharts(
        (chart) => chart.id === selectedChart().id,
        "options",
        "music-collage",
        "items",
        parsedIndex,
        currentItem
      );
    }

    setIsDragEntered(false);
  };

  createEffect(async () => {
    if (!props.item.image) {
      setImageContent(undefined);
      return;
    }
    const imageFromDB = await getImageFromDB(props.item.image);
    if (imageFromDB) setImageContent(imageFromDB);
  });

  return (
    <div
      class={classNames(
        "bg-white",
        isDragEntered() &&
          "ring-2 ring-blue-900 ring-offset-2 ring-offset-slate-900"
      )}
      draggable
      onDragStart={(event) => {
        event.dataTransfer.setData("text", `index:${props.index}`);
      }}
      onDrag={preventDefaultOnDrag}
      onDragEnter={handleDragEnter}
      onDragExit={handleDragExit}
      onDragOver={preventDefaultOnDrag}
      onDrop={handleDrop}
    >
      <Show when={imageContent()}>
        {(src) => <img src={src} class="h-full w-full" />}
      </Show>
    </div>
  );
};

export const MusicCollage: Component = () => {
  const totalNumberOfItems = () =>
    selectedChart().options["music-collage"].rows *
    selectedChart().options["music-collage"].columns;

  const gap = () => {
    switch (selectedChart().options["music-collage"].gap) {
      case "small":
        return "gap-2";
      case "medium":
        return "gap-4";
      case "large":
        return "gap-6";
    }
  };

  const padding = () => {
    switch (selectedChart().options["music-collage"].padding) {
      case "small":
        return "p-2";
      case "medium":
        return "p-4";
      case "large":
        return "p-6";
    }
  };

  return (
    <div
      class={classNames("grid w-min bg-black", gap(), padding())}
      style={{
        "grid-template-columns": `repeat(${
          selectedChart().options["music-collage"].columns
        }, 10rem)`,
        "grid-template-rows": `repeat(${
          selectedChart().options["music-collage"].rows
        }, 10rem)`,
      }}
    >
      <For
        each={selectedChart().options["music-collage"].items.slice(
          0,
          totalNumberOfItems()
        )}
      >
        {(item, index) => <CollageItem item={item} index={index()} />}
      </For>
    </div>
  );
};
