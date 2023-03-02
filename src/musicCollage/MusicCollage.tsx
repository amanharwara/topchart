/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */

import classNames from "../utils/classNames";
import IconButton from "../components/IconButton";
import TrashIcon from "../icons/TrashIcon";
import EditIcon from "../icons/EditIcon";
import { useEffect, useRef, useState } from "react";
import EditTitleModal from "./EditTitleModal";
import { getImageFromDB } from "../stores/imageDB";
import {
  isMusicCollageChart,
  MusicCollageItem,
  useIsDownloading,
  useSelectedChart,
  useSelectedMusicCollageAddingCoverTo,
  useSelectedMusicCollageEditingTitleFor,
  useSetMusicCollageItem,
} from "../stores/charts";
import AddIcon from "../icons/AddIcon";
import AddCoverArtModal from "../addCoverArt/AddCoverArtModal";
import {
  rectSortingStrategy,
  SortableContext,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS as CSSUtils } from "@dnd-kit/utilities";

const CollageItem = ({
  item,
  index,
  showTitle,
  shouldPositionTitleBelowCover,
}: {
  item: MusicCollageItem;
  index: number;
  showTitle: boolean;
  shouldPositionTitleBelowCover: boolean;
}) => {
  const [, setEditingTitleFor] = useSelectedMusicCollageEditingTitleFor();
  const [, setAddingCoverTo] = useSelectedMusicCollageAddingCoverTo();
  const [imageContent, setImageContent] = useState("");
  const [isFocusWithinItem, setIsFocusWithinItem] = useState(false);
  const chart = useSelectedChart();
  const setMusicCollageItem = useSetMusicCollageItem();
  const isDownloading = useIsDownloading();
  const itemRef = useRef<HTMLDivElement>(null);

  const {
    isDragging,
    isOver,
    isSorting,
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: item.id,
  });
  const dragStyle = {
    transform: CSSUtils.Transform.toString(transform),
    transition,
    willChange: "transform",
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

  if (!isMusicCollageChart(chart)) return null;

  const { allowEditingTitles } = chart.options;

  const editTitleForCurrentItem = () => {
    setEditingTitleFor(index);
  };

  const shouldHideButtons = isDownloading || isDragging || isOver || isSorting;

  return (
    <div
      className="group relative flex flex-col gap-1 z-0"
      onFocus={(event) => {
        event.stopPropagation();
        setIsFocusWithinItem(true);
      }}
      onBlur={(event) => {
        event.stopPropagation();
        if (!itemRef.current?.contains(event.relatedTarget)) {
          setIsFocusWithinItem(false);
        }
      }}
      ref={itemRef}
    >
      <div className="absolute right-3 top-3 flex items-center gap-2 z-[1]">
        {item.image && !shouldHideButtons && isFocusWithinItem && (
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
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1]">
        {!item.image && !shouldHideButtons && (
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
          "relative h-40 w-40 select-none bg-white",
          isDragging && "ring-2 ring-blue-700"
        )}
        ref={setNodeRef}
        style={dragStyle}
        {...attributes}
        {...listeners}
      >
        {imageContent && (
          <>
            <div className="absolute top-0 left-0 h-full w-full z-[1]" />
            <img src={imageContent} className="h-full w-full select-none" />
          </>
        )}
      </div>
      {showTitle &&
        shouldPositionTitleBelowCover &&
        item.title &&
        !isDragging && <div>{item.title}</div>}
    </div>
  );
};

const MusicCollage = () => {
  const selectedChart = useSelectedChart();

  if (!isMusicCollageChart(selectedChart)) return null;

  const collage = selectedChart.options;

  const gap = () => {
    switch (collage.gap) {
      case "small":
        return "gap-2";
      case "medium":
        return "gap-4";
      case "large":
        return "gap-6";
    }
  };

  const padding = () => {
    switch (collage.padding) {
      case "small":
        return "p-2 gap-2";
      case "medium":
        return "p-4 gap-4";
      case "large":
        return "p-6 gap-6";
    }
  };

  const font = `font-${collage.fontStyle}`;

  const currentBackground =
    collage.backgroundType === "color"
      ? collage.backgroundColor
      : `url(${collage.backgroundImage})`;

  const rows = collage.rows;
  const columns = collage.columns;

  const hasAnyTitle = collage.items.some(
    (item: MusicCollageItem) => !!item.title
  );

  const shouldPositionTitlesBelowCover = collage.positionTitlesBelowCover;

  const visibleItems = collage.items.slice(0, rows * columns);

  const showTitlesColumn =
    collage.showTitles && hasAnyTitle && !shouldPositionTitlesBelowCover;

  return (
    <SortableContext items={visibleItems} strategy={rectSortingStrategy}>
      <div
        id="music-collage"
        className={classNames("flex w-max select-none", padding(), font)}
        style={{
          background: currentBackground,
          color: collage.foregroundColor,
          ...(collage.fontStyle === "custom" && {
            fontFamily: collage.fontFamily,
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
          {visibleItems.map((item, index) => (
            <CollageItem
              item={item}
              key={item.id}
              index={index}
              showTitle={collage.showTitles}
              shouldPositionTitleBelowCover={shouldPositionTitlesBelowCover}
            />
          ))}
        </div>
        {showTitlesColumn ? (
          <div className="flex flex-col gap-1">
            {visibleItems.map((item, index) =>
              item.title ? <div key={index}>{item.title}</div> : null
            )}
          </div>
        ) : null}
        <EditTitleModal />
        <AddCoverArtModal />
      </div>
    </SortableContext>
  );
};

export default MusicCollage;
