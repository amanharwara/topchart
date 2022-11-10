/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */

import classNames from "../utils/classNames";
import IconButton from "../components/IconButton";
import TrashIcon from "../icons/TrashIcon";
import EditIcon from "../icons/EditIcon";
import { DragEventHandler, useEffect, useRef, useState } from "react";
import EditTitleModal from "./EditTitleModal";
import { getImageFromDB } from "../stores/imageDB";
import {
  useIsDownloading,
  useMoveMusicCollageItem,
  useSelectedChart,
  useSelectedMusicCollageAddingCoverTo,
  useSelectedMusicCollageEditingTitleFor,
  useSetMusicCollageItem,
} from "../stores/charts";
import { z } from "zod";
import AddIcon from "../icons/AddIcon";
import AddCoverArtModal from "../addCoverArt/AddCoverArtModal";

export type MusicCollageItem = {
  image: string | null;
  title: string;
};

const preventDefaultOnDrag: DragEventHandler = (event) => {
  event.preventDefault();
  event.stopPropagation();
};

type CollageItemProps = {
  item: MusicCollageItem;
  index: number;
  shouldPositionTitlesBelowCover: boolean;
};

const DragDataTransferObject = z.union([
  z.object({
    image: z.string(),
    title: z.string().optional(),
  }),
  z.object({
    index: z.number(),
  }),
]);

const CollageItem = ({
  item,
  index,
  shouldPositionTitlesBelowCover,
}: CollageItemProps) => {
  const [, setEditingTitleFor] = useSelectedMusicCollageEditingTitleFor();
  const [, setAddingCoverTo] = useSelectedMusicCollageAddingCoverTo();
  const [imageContent, setImageContent] = useState("");
  const [isDragEntered, setIsDragEntered] = useState(false);
  const [isFocusWithinItem, setIsFocusWithinItem] = useState(false);
  const chart = useSelectedChart();
  const setMusicCollageItem = useSetMusicCollageItem();
  const moveMusicCollageItem = useMoveMusicCollageItem();
  const isDownloading = useIsDownloading();
  const itemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const getImage = async () => {
      if (!item.image) {
        setImageContent("");
        return;
      }
      const imageFromDB = await getImageFromDB(item.image);
      if (imageFromDB) setImageContent(imageFromDB);
    };
    getImage();
  }, [item.image]);

  if (!chart) return null;

  const { allowEditingTitles } = chart.options.musicCollage;

  const editTitleForCurrentItem = () => {
    setEditingTitleFor(index);
  };

  const handleDragEnter: DragEventHandler = (event) => {
    event.preventDefault();
    if (!event.dataTransfer) return;
    if (event.dataTransfer.types.includes("text/plain")) {
      setIsDragEntered(true);
    }
  };

  const handleDragExit: DragEventHandler = (event) => {
    event.preventDefault();
    setIsDragEntered(false);
  };

  const handleDrop: DragEventHandler = async (event) => {
    event.preventDefault();
    if (!event.dataTransfer || !event.dataTransfer.getData("text")) return;

    const parsedDataTransferText = JSON.parse(
      event.dataTransfer.getData("text")
    );

    const dataTransferObject = DragDataTransferObject.parse(
      parsedDataTransferText
    );

    if ("image" in dataTransferObject) {
      const title = dataTransferObject.title ?? item.title;
      setMusicCollageItem(index, {
        title,
        image: dataTransferObject.image,
      });
      if (!title) editTitleForCurrentItem();
    }

    if ("index" in dataTransferObject) {
      moveMusicCollageItem(dataTransferObject.index, index);
    }

    setIsDragEntered(false);
  };

  return (
    <div
      className="group relative flex flex-col gap-1"
      tabIndex={index === 0 ? 0 : isFocusWithinItem ? 0 : -1}
      onFocus={(event) => {
        event.stopPropagation();
        setIsFocusWithinItem(true);
      }}
      onBlur={(event) => {
        event.stopPropagation();
        setIsFocusWithinItem(false);
      }}
      onKeyDown={(event) => {
        if (event.currentTarget !== itemRef.current) return;

        if (event.key === "ArrowLeft") {
          event.stopPropagation();

          const previousItem = event.currentTarget
            .previousElementSibling as HTMLDivElement | null;
          previousItem?.focus();

          if (event.shiftKey) {
            const previousItemIndex = index - 1;
            if (previousItemIndex < 0) return;
            moveMusicCollageItem(index, previousItemIndex);
          }
        } else if (event.key === "ArrowRight") {
          event.stopPropagation();

          const nextItem = event.currentTarget
            .nextElementSibling as HTMLDivElement | null;
          nextItem?.focus();

          if (event.shiftKey) {
            const nextItemIndex = index + 1;
            if (nextItemIndex >= chart.options.musicCollage.items.length)
              return;
            moveMusicCollageItem(index, nextItemIndex);
          }
        }
      }}
      ref={itemRef}
    >
      <div className="absolute right-3 top-3 flex items-center gap-2">
        {item.image && !isDownloading && (
          <>
            {allowEditingTitles && (
              <IconButton
                icon={EditIcon}
                label="Edit title"
                className="bg-slate-700 opacity-0 transition-opacity duration-150 focus:opacity-100 group-focus:opacity-100 group-focus-within:opacity-100 group-hover:opacity-100"
                onClick={editTitleForCurrentItem}
                tabIndex={isFocusWithinItem ? 0 : -1}
              />
            )}
            <IconButton
              icon={TrashIcon}
              label="Delete item"
              className="bg-slate-700 opacity-0 transition-opacity duration-150 focus:opacity-100 group-focus:opacity-100 group-focus-within:opacity-100 group-hover:opacity-100"
              onClick={() => {
                setMusicCollageItem(index, {
                  title: "",
                  image: "",
                });
              }}
              tabIndex={isFocusWithinItem ? 0 : -1}
            />
          </>
        )}
      </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        {!item.image && !isDownloading && (
          <IconButton
            icon={AddIcon}
            label="Add cover art"
            className="bg-slate-700 opacity-0 transition-opacity duration-150 focus:opacity-100 group-focus:opacity-100 group-focus-within:opacity-100 group-hover:opacity-100"
            onClick={() => {
              setAddingCoverTo(index);
            }}
            tabIndex={isFocusWithinItem ? 0 : -1}
          />
        )}
      </div>
      <div
        className={classNames(
          "h-40 w-40 select-none bg-white",
          isDragEntered && "ring-2 ring-blue-700"
        )}
        draggable={true}
        onDragStart={(event) => {
          event.dataTransfer.setData("text", JSON.stringify({ index }));
        }}
        onDrag={preventDefaultOnDrag}
        onDragEnter={handleDragEnter}
        onDragExit={handleDragExit}
        onDragOver={preventDefaultOnDrag}
        onDragLeave={handleDragExit}
        onDrop={handleDrop}
      >
        {imageContent && <img src={imageContent} className="h-full w-full" />}
      </div>
      {shouldPositionTitlesBelowCover && item.title && <div>{item.title}</div>}
    </div>
  );
};

const MusicCollage = () => {
  const selectedChart = useSelectedChart();

  if (!selectedChart) return null;

  const gap = () => {
    switch (selectedChart.options.musicCollage.gap) {
      case "small":
        return "gap-2";
      case "medium":
        return "gap-4";
      case "large":
        return "gap-6";
    }
  };

  const padding = () => {
    switch (selectedChart.options.musicCollage.padding) {
      case "small":
        return "p-2 gap-2";
      case "medium":
        return "p-4 gap-4";
      case "large":
        return "p-6 gap-6";
    }
  };

  const font = `font-${selectedChart.options.musicCollage.fontStyle}`;

  const currentBackground =
    selectedChart.options.musicCollage.backgroundType === "color"
      ? selectedChart.options.musicCollage.backgroundColor
      : `url(${selectedChart.options.musicCollage.backgroundImage})`;

  const rows = selectedChart.options.musicCollage.rows;
  const columns = selectedChart.options.musicCollage.columns;

  const hasAnyTitle = () =>
    selectedChart.options.musicCollage.items.some(
      (item: MusicCollageItem) => !!item.title
    );

  const shouldPositionTitlesBelowCover =
    selectedChart.options.musicCollage.positionTitlesBelowCover;

  return (
    <div
      id="music-collage"
      className={classNames("flex w-max", padding(), font)}
      style={{
        background: currentBackground,
        color: selectedChart.options.musicCollage.foregroundColor,
        ...(selectedChart.options.musicCollage.fontStyle === "custom" && {
          "font-family": selectedChart.options.musicCollage.fontFamily,
        }),
      }}
    >
      <div
        className={classNames("grid w-min", gap())}
        style={{
          gridTemplateColumns: `repeat(${columns}, auto)`,
          gridTemplateRows: `repeat(${rows}, auto)`,
        }}
      >
        {selectedChart.options.musicCollage.items
          .slice(0, rows * columns)
          .map((item, index) => (
            <CollageItem
              item={item}
              key={index}
              index={index}
              shouldPositionTitlesBelowCover={shouldPositionTitlesBelowCover}
            />
          ))}
      </div>
      {selectedChart.options.musicCollage.showTitles &&
      hasAnyTitle() &&
      !shouldPositionTitlesBelowCover ? (
        <div className="flex flex-col gap-1">
          {selectedChart.options.musicCollage.items
            .slice(0, rows * columns)
            .map((item, index) =>
              item.title ? <div key={index}>{item.title}</div> : null
            )}
        </div>
      ) : null}
      <EditTitleModal />
      <AddCoverArtModal />
    </div>
  );
};

export default MusicCollage;
