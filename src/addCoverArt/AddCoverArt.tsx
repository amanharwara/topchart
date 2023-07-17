/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */

import classNames from "../utils/classNames";
import { ReactNode, useState } from "react";
import { CoverArtSearchTab } from "./CoverArtSearchTab";
import { CoverArtLinkTab } from "./CoverArtLinkTab";
import { CoverArtUploadTab } from "./CoverArtUploadTab";
import SpotifyIcon from "../icons/SpotifyIcon";
import { CoverArtSpotifyTab } from "./CoverArtSpotifyTab";

type Tab = "Search" | "Link" | "Upload" | "Spotify";

const TabButton = (props: {
  children: ReactNode;
  selected: boolean;
  onClick: () => void;
  className?: string;
}) => (
  <button
    className={classNames(
      "flex-grow border-slate-600 py-2.5 text-sm uppercase hover:bg-slate-500",
      props.selected && "bg-slate-600 text-white font-semibold",
      props.className
    )}
    onClick={props.onClick}
  >
    {props.children}
  </button>
);

const AddCoverArt = ({ itemIndex = -1 }: { itemIndex?: number }) => {
  const [currentTab, setCurrentTab] = useState<Tab>("Search");

  return (
    <div className="flex h-full min-h-0 flex-col dark:text-white">
      <div className="flex border-b divide-x divide-slate-600 border-slate-600">
        <TabButton
          onClick={() => setCurrentTab("Search")}
          selected={currentTab === "Search"}
        >
          Search
        </TabButton>
        <TabButton
          onClick={() => setCurrentTab("Link")}
          selected={currentTab === "Link"}
        >
          Link
        </TabButton>
        <TabButton
          onClick={() => setCurrentTab("Upload")}
          selected={currentTab === "Upload"}
        >
          Upload
        </TabButton>
        <TabButton
          className="flex-grow-0 px-3"
          onClick={() => setCurrentTab("Spotify")}
          selected={currentTab === "Spotify"}
        >
          <SpotifyIcon className="w-6 h-6" />
        </TabButton>
      </div>
      {currentTab === "Search" ? (
        <CoverArtSearchTab itemIndex={itemIndex} />
      ) : currentTab === "Link" ? (
        <CoverArtLinkTab itemIndex={itemIndex} />
      ) : currentTab === "Upload" ? (
        <CoverArtUploadTab itemIndex={itemIndex} />
      ) : currentTab === "Spotify" ? (
        <CoverArtSpotifyTab itemIndex={itemIndex} />
      ) : null}
    </div>
  );
};

export default AddCoverArt;
