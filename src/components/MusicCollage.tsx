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

const shouldPositionTitlesBelowCover = () =>
  selectedChart().options["music-collage"].titles.positionBelowCover;

type CollageItemProps = {
  item: MusicCollageItem;
  rowIndex: number;
  itemIndex: number;
};

const CollageItem: Component<CollageItemProps> = (props) => {
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
    <div class="flex flex-col gap-1">
      <div
        class={classNames(
          "h-40 w-40 select-none bg-white",
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
      <Show when={shouldPositionTitlesBelowCover() && props.item.title}>
        <div class="text-white">{props.item.title}</div>
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
        return "p-2 gap-2";
      case "medium":
        return "p-4 gap-4";
      case "large":
        return "p-6 gap-6";
    }
  };

  const currentBackground = () =>
    selectedChart().options["music-collage"].backgroundType === "color"
      ? selectedChart().options["music-collage"].background.color
      : `url(${selectedChart().options["music-collage"].background.image})`;

  const rows = () => selectedChart().options["music-collage"].rows;
  const columns = () => selectedChart().options["music-collage"].columns;

  const hasAnyTitle = () =>
    selectedChart()
      .options["music-collage"].items.flat()
      .some((item) => !!item.title);

  return (
    <div
      class={classNames("flex w-max gap-4", padding())}
      style={{
        background: currentBackground(),
      }}
    >
      <div
        class={classNames("grid w-min", gap())}
        style={{
          "grid-template-columns": `repeat(${columns()}, auto)`,
          "grid-template-rows": `repeat(${rows()}, auto)`,
        }}
      >
        <For
          each={selectedChart().options["music-collage"].items.slice(0, rows())}
        >
          {(row, rowIndex) => (
            <For each={row.slice(0, columns())}>
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
      <Show
        when={
          selectedChart().options["music-collage"].titles.show &&
          hasAnyTitle() &&
          !shouldPositionTitlesBelowCover()
        }
      >
        <div class="flex flex-col gap-2 text-white">
          <For
            each={selectedChart().options["music-collage"].items.slice(
              0,
              rows()
            )}
          >
            {(row) => (
              <div>
                <For each={row.slice(0, columns())}>
                  {(item) => (
                    <Show when={item.title}>
                      <div>{item.title}</div>
                    </Show>
                  )}
                </For>
              </div>
            )}
          </For>
        </div>
      </Show>
    </div>
  );
};
