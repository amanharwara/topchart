/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */

import classNames from "../utils/classNames";
import IconButton from "../components/IconButton";
import TrashIcon from "../icons/TrashIcon";
import EditIcon from "../icons/EditIcon";
import { useCallback, useEffect, useRef, useState } from "react";
import EditTitleModal from "./EditTitleModal";
import { getImageFromDB } from "../stores/imageDB";
import {
  MusicCollageItem,
  useIsDownloading,
  useMoveMusicCollageItem,
  useSelectedChart,
  useSelectedMusicCollageAddingCoverTo,
  useSelectedMusicCollageEditingTitleFor,
  useSetMusicCollageItemImage,
  useSetMusicCollageItemTitle,
} from "../stores/charts";
import AddIcon from "../icons/AddIcon";
import AddCoverArtModal from "../addCoverArt/AddCoverArtModal";
import {
  useSensors,
  useSensor,
  DndContext,
  closestCenter,
  DragEndEvent,
  TouchSensor,
  KeyboardSensor,
  MouseSensor,
} from "@dnd-kit/core";
import {
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { mergeRefs } from "../utils/mergeRefs";

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
  const [, setEditingTitleFor] = useSelectedMusicCollageEditingTitleFor();
  const [, setAddingCoverTo] = useSelectedMusicCollageAddingCoverTo();
  const [imageContent, setImageContent] = useState("");
  const [isFocusWithinItem, setIsFocusWithinItem] = useState(false);
  const chart = useSelectedChart();
  const setMusicCollageItemTitle = useSetMusicCollageItemTitle();
  const setMusicCollageItemImage = useSetMusicCollageItemImage();
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
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
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

  if (!chart) return null;

  const { allowEditingTitles } = chart.options.musicCollage;

  const editTitleForCurrentItem = () => {
    setEditingTitleFor(index);
  };

  /* const handleKeyDown: KeyboardEventHandler = (event) => {
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
        if (nextItemIndex >= chart.options.musicCollage.items.length) return;
        moveMusicCollageItem(index, nextItemIndex);
      }
    }
  }; */

  const shouldHideButtons = isDownloading || isDragging || isOver || isSorting;

  return (
    <div
      className={classNames("group relative flex flex-col gap-1")}
      onFocus={(event) => {
        event.stopPropagation();
        setIsFocusWithinItem(true);
      }}
      onBlur={(event) => {
        event.stopPropagation();
        setIsFocusWithinItem(false);
      }}
      // onKeyDown={handleKeyDown}
      ref={itemRef}
    >
      <div className="absolute right-3 top-3 flex items-center gap-2">
        {item.image && !shouldHideButtons && (
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
                setMusicCollageItemTitle(index, "");
                setMusicCollageItemImage(index, "");
              }}
              tabIndex={isFocusWithinItem ? 0 : -1}
            />
          </>
        )}
      </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
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
          "h-40 w-40 select-none bg-white",
          isDragging && "ring-2 ring-blue-500"
        )}
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
      >
        {imageContent && <img src={imageContent} className="h-full w-full" />}
      </div>
      {shouldPositionTitlesBelowCover && item.title && <div>{item.title}</div>}
    </div>
  );
};

const MusicCollage = () => {
  const dndSensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const selectedChart = useSelectedChart();

  const moveMusicCollageItem = useMoveMusicCollageItem();

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (!active.id || !over?.id) return;
      if (active.id === over.id) return;
      if (!selectedChart) return;

      const items = selectedChart.options.musicCollage.items;
      const activeIndex = items.findIndex((item) => item.id === active.id);
      const overIndex = items.findIndex((item) => item.id === over.id);

      moveMusicCollageItem(activeIndex, overIndex);
    },
    [moveMusicCollageItem, selectedChart]
  );

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
    <DndContext
      sensors={dndSensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={selectedChart.options.musicCollage.items.slice(
          0,
          rows * columns
        )}
        strategy={rectSortingStrategy}
      >
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
                  key={item.id}
                  index={index}
                  shouldPositionTitlesBelowCover={
                    shouldPositionTitlesBelowCover
                  }
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
      </SortableContext>
    </DndContext>
  );
};

export default MusicCollage;
