/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import RadioButtonGroup from "../components/RadioButtonGroup";
import Select from "../components/Select";
import Spinner from "../components/Spinner";
import { useQuery } from "@tanstack/react-query";
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
import MusicIcon from "../icons/MusicIcon";
import UserIcon from "../icons/UserIcon";
import classNames from "../utils/classNames";

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
  isAddingToSpecificItem,
}: {
  item: SpotifyArtist | SpotifyTrack;
  isAddingToSpecificItem: boolean;
}) {
  const image = item.type === "artist" ? item.images[0] : item.album.images[0];

  if (!image) return null;

  return (
    <div
      className={classNames(
        "flex items-center p-2 gap-4 select-none hover:cursor-grab hover:bg-slate-200 hover:dark:bg-slate-700 rounded",
        isAddingToSpecificItem && "hover:cursor-pointer"
      )}
    >
      {!isAddingToSpecificItem && <DragIcon className="w-5 h-5" />}
      <img className="w-20 h-20 bg-slate-400" src={image.url} alt={item.name} />
      <div className="flex flex-col">
        <div className="text-lg font-semibold">{item.name}</div>
        {item.type === "track" && (
          <div className="text-xs dark:text-slate-300">
            {item.artists.map((artist) => artist.name).join(", ")}
          </div>
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
    <div className="flex flex-col gap-4 p-4">
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
      {isFetching && (
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
      <div className="flex flex-col gap-1">
        <Result
          item={{
            id: "1",
            name: "Aman Harwara",
            images: [
              {
                url: "https://i.scdn.co/image/ab67616d00001e02ff9ca10b55ce82ae553c8228",
              },
            ],
            type: "artist",
          }}
          isAddingToSpecificItem={isAddingToSpecificItem}
        />
        <Result
          item={{
            id: "2",
            name: "Crab Nebula",
            artists: [
              {
                id: "1",
                name: "Aman Harwara",
                images: [
                  {
                    url: "https://i.scdn.co/image/ab67616d00001e02ff9ca10b55ce82ae553c8228",
                  },
                ],
                type: "artist",
              },
            ],
            album: {
              id: "1",
              name: "Crab Nebula",
              images: [
                {
                  url: "https://i.scdn.co/image/ab67616d00001e02ff9ca10b55ce82ae553c8228",
                },
              ],
            },
            type: "track",
          }}
          isAddingToSpecificItem={isAddingToSpecificItem}
        />
      </div>
      {!isAddingToSpecificItem && (
        <div className="py-2">
          <Button className="mx-auto">Add all to chart</Button>
        </div>
      )}
    </div>
  );
}
