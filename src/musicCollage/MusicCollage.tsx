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
  useSetMusicCollageItem,
} from "../stores/charts";
import AddIcon from "../icons/AddIcon";
import AddCoverArtModal from "../addCoverArt/AddCoverArtModal";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS as CSSUtils } from "@dnd-kit/utilities";

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

  const shouldHideButtons = isDownloading || isDragging || isOver || isSorting;

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
          isDragging && "ring-2 ring-blue-700"
        )}
        ref={setNodeRef}
        style={dragStyle}
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

  const collage = selectedChart.options.musicCollage;

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
    <DndContext
      sensors={dndSensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={visibleItems} strategy={rectSortingStrategy}>
        <div
          id="music-collage"
          className={classNames("flex w-max", padding(), font)}
          style={{
            background: currentBackground,
            color: collage.foregroundColor,
            ...(collage.fontStyle === "custom" && {
              "font-family": collage.fontFamily,
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
                shouldPositionTitlesBelowCover={shouldPositionTitlesBelowCover}
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
    </DndContext>
  );
};

export default MusicCollage;
