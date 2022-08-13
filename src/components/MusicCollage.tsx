import { Component, createEffect, createSignal, For, Show } from "solid-js";
import {
  selectedChart,
  setCharts,
  setMusicCollageItem,
  setMusicCollageItemImage,
} from "../chartStore";
import type { MusicCollageItem } from "../chartStore";
import { getImageFromDB } from "../imageDB";
import classNames from "../utils/classNames";
import IconButton from "./IconButton";
import TrashIcon from "./icons/TrashIcon";
import EditIcon from "./icons/EditIcon";
import Modal from "./Modal";
import Input from "./Input";
import Button from "./Button";
import SaveIcon from "./icons/SaveIcon";

const preventDefaultOnDrag = (event: DragEvent) => {
  event.preventDefault();
  event.stopPropagation();
};

const shouldPositionTitlesBelowCover = () =>
  selectedChart().options.musicCollage.titles.positionBelowCover;

const [editingTitleFor, setEditingTitleFor] = createSignal<
  [number, number] | undefined
>();

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
        ...selectedChart().options.musicCollage.items[parsedRowIndex][
          parsedColumnIndex
        ],
      };

      const currentItem = { ...props.item };

      setCharts(
        (chart) => chart.id === selectedChart().id,
        "options",
        "musicCollage",
        "items",
        props.rowIndex,
        props.itemIndex,
        itemAtParsedIndex
      );

      setCharts(
        (chart) => chart.id === selectedChart().id,
        "options",
        "musicCollage",
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
    <div class="group relative flex flex-col gap-1">
      <div class="absolute right-3 top-3 flex items-center gap-2">
        <Show
          when={
            selectedChart().options.musicCollage.titles.allowEditing &&
            props.item.title
          }
        >
          <IconButton
            icon={EditIcon}
            label="Edit title"
            className="bg-slate-700 opacity-0 transition-opacity duration-150 focus:opacity-100 group-hover:opacity-100"
            onClick={() => {
              setEditingTitleFor([props.rowIndex, props.itemIndex]);
            }}
          />
        </Show>
        <IconButton
          icon={TrashIcon}
          label="Delete item"
          className="bg-slate-700 opacity-0 transition-opacity duration-150 focus:opacity-100 group-hover:opacity-100"
          onClick={() => {
            setCharts(
              (chart) => chart.id === selectedChart().id,
              "options",
              "musicCollage",
              "items",
              props.rowIndex,
              props.itemIndex,
              {
                title: "",
                image: "",
              }
            );
          }}
        />
      </div>
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
        <div>{props.item.title}</div>
      </Show>
    </div>
  );
};

export const MusicCollage: Component = () => {
  const gap = () => {
    switch (selectedChart().options.musicCollage.gap) {
      case "small":
        return "gap-2";
      case "medium":
        return "gap-4";
      case "large":
        return "gap-6";
    }
  };

  const padding = () => {
    switch (selectedChart().options.musicCollage.padding) {
      case "small":
        return "p-2 gap-2";
      case "medium":
        return "p-4 gap-4";
      case "large":
        return "p-6 gap-6";
    }
  };

  const currentBackground = () =>
    selectedChart().options.musicCollage.backgroundType === "color"
      ? selectedChart().options.musicCollage.background.color
      : `url(${selectedChart().options.musicCollage.background.image})`;

  const rows = () => selectedChart().options.musicCollage.rows;
  const columns = () => selectedChart().options.musicCollage.columns;

  const hasAnyTitle = () =>
    selectedChart()
      .options.musicCollage.items.flat()
      .some((item) => !!item.title);

  let editTitleInputRef: HTMLInputElement | null;

  return (
    <div
      class={classNames("flex w-max gap-4", padding())}
      style={{
        background: currentBackground(),
        color: selectedChart().options.musicCollage.foreground.color,
        "font-family": `"${
          selectedChart().options.musicCollage.foreground.font
        }", sans-serif`,
      }}
    >
      <div
        class={classNames("grid w-min", gap())}
        style={{
          "grid-template-columns": `repeat(${columns()}, auto)`,
          "grid-template-rows": `repeat(${rows()}, auto)`,
        }}
      >
        <For each={selectedChart().options.musicCollage.items.slice(0, rows())}>
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
          selectedChart().options.musicCollage.titles.show &&
          hasAnyTitle() &&
          !shouldPositionTitlesBelowCover()
        }
      >
        <div class="flex flex-col gap-2">
          <For
            each={selectedChart().options.musicCollage.items.slice(0, rows())}
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
      <Show
        when={
          selectedChart().options.musicCollage.items?.[
            editingTitleFor()?.[0]
          ]?.[editingTitleFor()?.[1]]
        }
      >
        {(item) => (
          <Modal
            title="Edit title"
            isOpen={true}
            closeModal={() => {
              setEditingTitleFor(undefined);
            }}
          >
            <div class="flex flex-col items-start gap-2.5 px-2.5 py-3">
              <Input
                class="w-full"
                value={item.title}
                ref={editTitleInputRef}
              />
              <Button
                icon={SaveIcon}
                onClick={() => {
                  setMusicCollageItem(
                    selectedChart().id,
                    editingTitleFor()[0],
                    editingTitleFor()[1],
                    {
                      ...item,
                      title: editTitleInputRef.value,
                    }
                  );
                  setEditingTitleFor(undefined);
                }}
              >
                Save
              </Button>
            </div>
          </Modal>
        )}
      </Show>
    </div>
  );
};
