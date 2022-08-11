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
  rowIndex: number;
  itemIndex: number;
}> = (props) => {
  const [imageContent, setImageContent] = createSignal("");
  const [isDragEntered, setIsDragEntered] = createSignal(false);

  const handleDragEnter = (event: DragEvent) => {
    event.preventDefault();
    if (event.dataTransfer.types.includes("text/plain")) {
      setIsDragEntered(true);
    }
  };

  const handleDragExit = (event: DragEvent) => {
    event.preventDefault();
    setIsDragEntered(false);
  };

  const handleDrop = async (event: DragEvent) => {
    event.preventDefault();

    const dataTransferText = event.dataTransfer.getData("text");

    if (dataTransferText.startsWith("image:")) {
      const parsedImageID = dataTransferText.replace("image:", "");
      setMusicCollageItemImage(
        selectedChart().id,
        props.rowIndex,
        props.itemIndex,
        parsedImageID
      );
    }

    if (dataTransferText.startsWith(":")) {
      const [parsedRowIndex, parsedColumnIndex] = dataTransferText
        .split(":")
        .filter((s) => !!s)
        .map((s) => Number(s));

      const itemAtParsedIndex = {
        ...selectedChart().options["music-collage"].items[parsedRowIndex][
          parsedColumnIndex
        ],
      };

      const currentItem = { ...props.item };

      setCharts(
        (chart) => chart.id === selectedChart().id,
        "options",
        "music-collage",
        "items",
        props.rowIndex,
        props.itemIndex,
        itemAtParsedIndex
      );

      setCharts(
        (chart) => chart.id === selectedChart().id,
        "options",
        "music-collage",
        "items",
        parsedRowIndex,
        parsedColumnIndex,
        currentItem
      );
    }

    setIsDragEntered(false);
  };

  createEffect(async () => {
    if (!props.item.image) {
      setImageContent("");
      return;
    }
    const imageFromDB = await getImageFromDB(props.item.image);
    if (imageFromDB) setImageContent(imageFromDB);
  });

  return (
    <div
      class={classNames(
        "select-none bg-white",
        isDragEntered() && "ring-2 ring-blue-700"
      )}
      draggable={true}
      onDragStart={(event) => {
        event.dataTransfer.setData(
          "text",
          `:${props.rowIndex}:${props.itemIndex}`
        );
      }}
      onDrag={preventDefaultOnDrag}
      onDragEnter={handleDragEnter}
      onDragExit={handleDragExit}
      onDragOver={preventDefaultOnDrag}
      onDragLeave={handleDragExit}
      onDrop={handleDrop}
    >
      <Show when={imageContent()}>
        {(src) => <img src={src} class="h-full w-full" />}
      </Show>
    </div>
  );
};

export const MusicCollage: Component = () => {
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

  const currentBackground = () =>
    selectedChart().options["music-collage"].backgroundType === "color"
      ? selectedChart().options["music-collage"].background.color
      : `url(${selectedChart().options["music-collage"].background.image})`;

  return (
    <div
      class={classNames("grid w-min", gap(), padding())}
      style={{
        background: currentBackground(),
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
          selectedChart().options["music-collage"].rows
        )}
      >
        {(row, rowIndex) => (
          <For
            each={row.slice(
              0,
              selectedChart().options["music-collage"].columns
            )}
          >
            {(item, itemIndex) => (
              <CollageItem
                item={item}
                rowIndex={rowIndex()}
                itemIndex={itemIndex()}
              />
            )}
          </For>
        )}
      </For>
    </div>
  );
};
