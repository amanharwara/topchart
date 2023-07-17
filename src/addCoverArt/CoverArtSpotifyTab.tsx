/* eslint-disable @next/next/no-img-element */
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import RadioButtonGroup from "../components/RadioButtonGroup";
import Select from "../components/Select";
import Spinner from "../components/Spinner";
import {
  SpotifyArtist,
  SpotifyTimeRange,
  SpotifyTopType,
  SpotifyTrack,
  useSpotifyTopItems,
} from "../stores/spotify";
import ErrorIcon from "../icons/ErrorIcon";
import IconButton from "../components/IconButton";
import RefreshIcon from "../icons/RefreshIcon";
import Button from "../components/Button";
import DragIcon from "../icons/DragIcon";
import classNames from "../utils/classNames";
import { useQuery } from "@tanstack/react-query";
import { blobToDataURL } from "./blobToDataURL";
import { storeImageToDB, type Image } from "../stores/imageDB";
import { useDraggable } from "@dnd-kit/core";
import { CSS as CSSUtils } from "@dnd-kit/utilities";
import {
  useSetMusicCollageItem,
  useSelectedMusicCollageAddingCoverTo,
} from "../stores/charts";
import { mergeRefs } from "../utils/mergeRefs";

const TopTypeOptions = [
  {
    label: "Top Artists",
    value: "artists" as SpotifyTopType,
  },
  {
    label: "Top Tracks",
    value: "tracks" as SpotifyTopType,
  },
];

const TimeRangeOptions = [
  {
    label: "Last 4 Weeks",
    value: "short_term" as SpotifyTimeRange,
  },
  {
    label: "Last 6 Months",
    value: "medium_term" as SpotifyTimeRange,
  },
  {
    label: "All Time",
    value: "long_term" as SpotifyTimeRange,
  },
];

function Result({
  item,
  indexOfChartItem,
}: {
  item: SpotifyArtist | SpotifyTrack;
  indexOfChartItem: number;
}) {
  const setMusicCollageItem = useSetMusicCollageItem();
  const [, setAddingCoverTo] = useSelectedMusicCollageAddingCoverTo();

  const imageToUse =
    item.type === "artist" ? item.images[0] : item.album.images[0];
  const imageLink = imageToUse ? imageToUse.url : null;
  const artist =
    item.type === "artist"
      ? item.name
      : item.artists.map((artist) => artist.name).join(", ");

  const {
    isLoading,
    data: image,
    error,
  } = useQuery(
    [item.id],
    async () => {
      if (!imageLink) throw new Error("No image link");

      const response = await fetch(imageLink);
      const imageBlob = await response.blob();
      const content = await blobToDataURL(imageBlob);

      const imageToStore: Image = {
        id: imageLink,
        content,
      };

      return imageToStore;
    },
    {
      retry: 1,
      refetchOnWindowFocus: false,
    }
  );

  useEffect(() => {
    if (error) {
      console.error(error);
    }
  }, [error]);

  const title = `${artist} ${item.type === "track" ? "- " + item.name : ""}`;
  const isAddingToSpecificItem = indexOfChartItem > -1;
  const isDraggable = !isAddingToSpecificItem && !!image;
  const { isDragging, attributes, listeners, transform, setNodeRef } =
    useDraggable({
      id: `cover-art-result-${item.id}`,
      data: {
        title,
        image,
      },
    });
  const dragImageStyle = {
    transform: CSSUtils.Transform.toString(transform),
  };

  const containerRef = useRef<HTMLDivElement>(null);
  const draggableRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!containerRef.current || !draggableRef.current) return;

    if (isDragging) {
      const draggableRect = draggableRef.current.getBoundingClientRect();
      containerRef.current.style.height = `${draggableRect.height}px`;
    } else {
      containerRef.current.style.height = "";
    }
  }, [isDragging]);

  const dragAttributes = isDraggable
    ? {
        ref: mergeRefs([setNodeRef, draggableRef]),
        style: dragImageStyle,
        ...attributes,
        ...listeners,
      }
    : {};

  if (error) return null;

  return (
    <div ref={containerRef}>
      <div
        className={classNames(
          "flex items-center p-2 gap-4 select-none hover:cursor-grab hover:bg-slate-200 hover:dark:bg-slate-700 rounded",
          isAddingToSpecificItem && "hover:cursor-pointer",
          isLoading && "justify-center cursor-wait",
          isDragging && "cursor-grabbing fixed [&>*:not(img)]:hidden"
        )}
        onClick={() => {
          if (!isAddingToSpecificItem || !image) return;
          storeImageToDB(image);
          setMusicCollageItem(indexOfChartItem, {
            title,
            image: image.id,
          });
          setAddingCoverTo(-1);
        }}
        {...dragAttributes}
      >
        {isLoading ? (
          <div className="flex items-center justify-center w-20 h-20">
            <Spinner className="w-10 h-10" width={2} />
          </div>
        ) : (
          <>
            {!isAddingToSpecificItem && <DragIcon className="w-5 h-5" />}
            <img
              className="w-20 h-20 bg-slate-400"
              src={image?.content}
              alt={item.name}
            />
            <div className="flex flex-col">
              <div className="text-lg font-semibold">{item.name}</div>
              {item.type === "track" && (
                <div className="text-xs dark:text-slate-300">{artist}</div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export function CoverArtSpotifyTab({ itemIndex }: { itemIndex: number }) {
  const [topType, setTopType] = useState<SpotifyTopType>("artists");
  const [timeRange, setTimeRange] = useState<SpotifyTimeRange>("short_term");

  const { data, isFetching, error, refetch } = useSpotifyTopItems(
    topType,
    timeRange
  );

  const isAddingToSpecificItem = itemIndex > -1;

  return (
    <div className="flex flex-col gap-4 p-4 min-h-0 overflow-y-auto">
      <RadioButtonGroup
        value={topType}
        onChange={setTopType}
        items={TopTypeOptions}
      />
      <div className="flex flex-col gap-1">
        <div className="font-semibold">Time Range</div>
        <Select
          value={timeRange}
          setValue={setTimeRange}
          options={TimeRangeOptions}
        />
      </div>
      {isFetching && !data && (
        <div className="flex items-center justify-center py-2 gap-4">
          <Spinner className="w-5 h-5" />
          Loading...
        </div>
      )}
      {error instanceof Error && (
        <div className="flex items-center gap-2 bg-red-400 text-black rounded p-2.5 px-3.5 text-sm w-full mb-1">
          <ErrorIcon className="w-5 h-5 flex-shrink-0" />
          <div className="mr-2">{error.message}</div>
          <IconButton
            className="bg-red-500 border-transparent text-white hover:bg-red-600 ml-auto"
            icon={RefreshIcon}
            iconClassName="w-3.5 h-3.5"
            label="Retry"
            onClick={() => refetch()}
          />
        </div>
      )}
      {data && (
        <div className="flex flex-col gap-1">
          {data.map((item) => (
            <Result key={item.id} item={item} indexOfChartItem={itemIndex} />
          ))}
        </div>
      )}
      {!isAddingToSpecificItem && (
        <div className="py-2">
          <Button className="mx-auto">Add all to chart</Button>
        </div>
      )}
    </div>
  );
}
