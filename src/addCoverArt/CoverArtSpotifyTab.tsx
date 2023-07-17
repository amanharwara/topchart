import { useState } from "react";
import RadioButtonGroup from "../components/RadioButtonGroup";
import Select from "../components/Select";
import Spinner from "../components/Spinner";
import { useQuery } from "@tanstack/react-query";
import {
  SpotifyTimeRange,
  SpotifyTopType,
  useSpotifyTopItems,
} from "../stores/spotify";
import ErrorIcon from "../icons/ErrorIcon";
import IconButton from "../components/IconButton";
import RefreshIcon from "../icons/RefreshIcon";

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

export function CoverArtSpotifyTab({ itemIndex }: { itemIndex: number }) {
  const [topType, setTopType] = useState<SpotifyTopType>("artists");
  const [timeRange, setTimeRange] = useState<SpotifyTimeRange>("short_term");

  const { data, isFetching, error, refetch } = useSpotifyTopItems(
    topType,
    timeRange
  );

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
          {error.message}
          <IconButton
            className="bg-red-500 border-transparent text-white hover:bg-red-600 ml-2"
            icon={RefreshIcon}
            iconClassName="w-3.5 h-3.5"
            label="Retry"
            onClick={() => refetch()}
          />
        </div>
      )}
    </div>
  );
}
