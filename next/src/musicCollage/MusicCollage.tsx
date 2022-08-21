import classNames from "../utils/classNames";
import IconButton from "../components/IconButton";
import TrashIcon from "../icons/TrashIcon";
import EditIcon from "../icons/EditIcon";
import Input from "../components/Input";
import Button from "../components/Button";
import SaveIcon from "../icons/SaveIcon";
import { DragEventHandler, Fragment, useEffect, useState } from "react";
import EditTitleModal from "./EditTitleModal";
import { getImageFromDB } from "../stores/imageDB";
import {
  getMusicCollageItem,
  useSelectedChart,
  useSelectedMusicCollageAllowEditingTitles,
  useSelectedMusicCollageEditingTitleFor,
  useSetMusicCollageItem,
} from "../stores/charts";

export type MusicCollageItem = {
  image: string | null;
  title: string;
};

const preventDefaultOnDrag: DragEventHandler = (event) => {
  event.preventDefault();
  event.stopPropagation();
};

/* const [editingTitleFor, setEditingTitleFor] = createSignal<
{ rowIndex: number; itemIndex: number } | undefined
>(); */

type CollageItemProps = {
  item: MusicCollageItem;
  index: number;
  shouldPositionTitlesBelowCover: boolean;
};

const CollageItem = ({
  item,
  index,
  shouldPositionTitlesBelowCover,
}: CollageItemProps) => {
  const [editingTitleFor, setEditingTitleFor] =
    useSelectedMusicCollageEditingTitleFor();
  const [imageContent, setImageContent] = useState("");
  const [isDragEntered, setIsDragEntered] = useState(false);
  const setMusicCollageItem = useSetMusicCollageItem();
  const [allowEditingTitles] = useSelectedMusicCollageAllowEditingTitles();

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
    if (!event.dataTransfer) return;

    const dataTransferText = event.dataTransfer.getData("text");

    if (dataTransferText.startsWith("image:")) {
      const parsedImageID = dataTransferText.replace("image:", "");
      setMusicCollageItem(index, {
        title: item.title,
        image: parsedImageID,
      });
      editTitleForCurrentItem();
    }

    if (dataTransferText.startsWith(":")) {
      const [parsedIndex] = dataTransferText
        .split(":")
        .filter((s) => !!s)
        .map((s) => Number(s));

      if (typeof parsedIndex === "undefined") {
        return;
      }

      const itemAtParsedIndex = getMusicCollageItem(parsedIndex);

      if (!itemAtParsedIndex) return;

      const currentItem = { ...item };

      setMusicCollageItem(index, itemAtParsedIndex);

      setMusicCollageItem(parsedIndex, currentItem);
    }

    setIsDragEntered(false);
  };

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

  return (
    <div className="group relative flex flex-col gap-1">
      <div className="absolute right-3 top-3 flex items-center gap-2">
        {item.image && (
          <>
            {allowEditingTitles && (
              <IconButton
                icon={EditIcon}
                label="Edit title"
                className="bg-slate-700 opacity-0 transition-opacity duration-150 focus:opacity-100 group-hover:opacity-100"
                onClick={editTitleForCurrentItem}
              />
            )}
            <IconButton
              icon={TrashIcon}
              label="Delete item"
              className="bg-slate-700 opacity-0 transition-opacity duration-150 focus:opacity-100 group-hover:opacity-100"
              onClick={() => {
                setMusicCollageItem(index, {
                  title: "",
                  image: "",
                });
              }}
            />
          </>
        )}
      </div>
      <div
        className={classNames(
          "h-40 w-40 select-none bg-white",
          isDragEntered && "ring-2 ring-blue-700"
        )}
        draggable={true}
        onDragStart={(event) => {
          event.dataTransfer.setData("text", `:${index}`);
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
    selectedChart.options.musicCollage.titles.positionBelowCover;

  return (
    <div
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
      {selectedChart.options.musicCollage.titles.show &&
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
    </div>
  );
};

export default MusicCollage;
