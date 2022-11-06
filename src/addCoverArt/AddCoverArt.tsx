/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */

import classNames from "../utils/classNames";
import { ReactNode, useState } from "react";
import { CoverArtSearchTab } from "./CoverArtSearchTab";
import { CoverArtLinkTab } from "./CoverArtLinkTab";
import { CoverArtUploadTab } from "./CoverArtUploadTab";

type Tab = "Search" | "Link" | "Upload";

const TabButton = (props: {
  children: ReactNode;
  selected: boolean;
  onClick: () => void;
}) => (
  <button
    className={classNames(
      "flex-grow border-slate-600 py-2.5 text-sm uppercase first:border-r last:border-l hover:bg-slate-500",
      props.selected && "bg-slate-600 text-white font-semibold"
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
      <div className="flex border-b border-slate-600">
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
      </div>
      {currentTab === "Search" ? (
        <CoverArtSearchTab itemIndex={itemIndex} />
      ) : currentTab === "Link" ? (
        <CoverArtLinkTab itemIndex={itemIndex} />
      ) : currentTab === "Upload" ? (
        <CoverArtUploadTab itemIndex={itemIndex} />
      ) : null}
    </div>
  );
};

export default AddCoverArt;
