/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import classNames from "../utils/classNames";
import IconButton from "../components/IconButton";
import CloseIcon from "../icons/CloseIcon";
import DownloadIcon from "../icons/DownloadIcon";
import ImageIcon from "../icons/ImageIcon";
import MusicIcon from "../icons/MusicIcon";
import SearchIcon from "../icons/SearchIcon";
import { DragEventHandler, ReactNode, useRef, useState } from "react";
import { Image, storeImageToDB } from "../stores/imageDB";
import ErrorIcon from "../icons/ErrorIcon";
import Spinner from "../components/Spinner";
import { useQuery } from "@tanstack/react-query";
import { blobToDataURL } from "../utils/blobToDataURL";
import Input from "../components/Input";

type Tab = "Search" | "Link" | "Upload";

const TabButton = (props: {
  children: ReactNode;
  selected: boolean;
  onClick: () => void;
}) => (
  <button
    className={classNames(
      "flex-grow border-slate-600 py-2.5 text-sm uppercase first:border-r last:border-l hover:bg-slate-500",
      props.selected && "bg-slate-600 font-semibold"
    )}
    onClick={props.onClick}
  >
    {props.children}
  </button>
);

const getImageOnlyDataURL = async (blob: Blob) => {
  const imageContent = await blobToDataURL(blob);

  if (!imageContent) {
    throw new Error("Could not parse retrieved data");
  }

  const content = imageContent.toString();

  if (!content.startsWith("data:image")) {
    throw new Error("Provided link is not an image");
  }

  return content;
};

const CoverArtSearchTab = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const results = new Array(23).fill(0);

  return (
    <div className="flex min-h-0 flex-grow flex-col">
      <div className="flex gap-2.5 px-2.5 py-3.5">
        <input
          className="flex-grow rounded border border-slate-600 bg-transparent px-2.5 py-1.5 text-xs placeholder:text-slate-400"
          placeholder="Search for music..."
          value={searchQuery}
          onInput={(event) => {
            setSearchQuery(event.currentTarget.value);
          }}
        />
        {searchQuery.length > 1 && (
          <IconButton
            icon={CloseIcon}
            label="Clear search"
            onClick={() => setSearchQuery("")}
          />
        )}
        <IconButton icon={SearchIcon} label="Search" />
      </div>
      <div className="flex flex-col items-center gap-2.5 overflow-y-auto px-3 pt-1 pb-5">
        {!searchQuery && (
          <>
            <div className="rounded-full bg-slate-600 p-4">
              <MusicIcon className="h-12 w-12 text-white" />
            </div>
            <div className="max-w-[20ch] text-center font-semibold">
              Search for any album, artist or song to add cover art
            </div>
            <div className="text-xs text-slate-200">
              Example: &quot;
              <span
                className="cursor-pointer border-b border-dotted border-slate-300 font-semibold"
                onClick={() => setSearchQuery("It's Almost Dry by Pusha T")}
              >
                It&apos;s Almost Dry by Pusha T
              </span>
              &quot;
            </div>
          </>
        )}
        {searchQuery && searchQuery !== "Brian Eno" && (
          <>
            <div className="rounded-full bg-slate-600 p-4">
              <MusicIcon className="h-12 w-12 text-white" />
            </div>
            <div className="max-w-[20ch] text-center font-semibold">
              Couldn’t find any results
            </div>
            <div className="max-w-[40ch] text-center text-xs text-slate-200">
              Check your search for typos, or try a different search. For
              example, &quot;
              <span
                className="cursor-pointer border-b border-dotted border-slate-300 font-semibold"
                onClick={() => setSearchQuery("Brian Eno")}
              >
                Brian Eno
              </span>
              &quot;
            </div>
          </>
        )}
        {searchQuery === "Brian Eno" && (
          <div className="grid w-full max-w-sm grid-cols-3 gap-2">
            {results.map((_, index) => (
              <div className="h-28 rounded bg-slate-600" key={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const CoverArtLinkTab = () => {
  const linkInputRef = useRef<HTMLInputElement>(null);

  const [link, setLink] = useState("");

  const {
    isFetching,
    data: image,
    error,
    refetch,
  } = useQuery(
    [link],
    async () => {
      const response = await fetch(link);
      const imageAsBlob = await response.blob();

      const content = await getImageOnlyDataURL(imageAsBlob);

      const imageToStore: Image = {
        id: link,
        content,
      };

      try {
        await storeImageToDB(imageToStore);
        return imageToStore;
      } catch (error) {
        if (error instanceof Error) {
          throw error;
        } else {
          throw new Error("Could not store image to database");
        }
      }
    },
    {
      enabled: false,
      retry: 1,
    }
  );

  const reset = () => {
    setLink("");
    linkInputRef.current?.focus();
  };

  const linkInputId = `link-input-${Date.now()}`;

  return (
    <div className="flex flex-col gap-1.5">
      <form
        className="px-2.5 py-3"
        onSubmit={async (event) => {
          event.preventDefault();
          refetch();
        }}
      >
        <label
          className="mb-1.5 block text-sm font-semibold"
          htmlFor={linkInputId}
        >
          Image link:
        </label>
        <div className="flex gap-2.5">
          <Input
            id={linkInputId}
            className="text-xs py-1.5"
            placeholder="https://example.com"
            value={link}
            onInput={(event) => setLink(event.currentTarget.value)}
            ref={linkInputRef}
            disabled={isFetching}
          />
          <IconButton
            type="submit"
            icon={DownloadIcon}
            label="Download image"
            disabled={isFetching}
          />
          {!!link && (
            <IconButton
              icon={CloseIcon}
              label="Clear search"
              onClick={reset}
              disabled={isFetching}
            />
          )}
        </div>
        {error instanceof Error && (
          <div className="flex items-center gap-2.5 mt-2.5 text-red-500 text-sm">
            <ErrorIcon className="w-5 h-5" />
            {error.message}
          </div>
        )}
      </form>
      <div className="flex flex-col items-center gap-2 px-2.5 pb-5">
        <div className="text-sm">Preview:</div>
        <div className="flex items-center justify-center h-36 w-36 rounded bg-slate-600">
          {isFetching && <Spinner className="w-10 h-10" />}
          {image && (
            <img
              src={image.content}
              draggable={true}
              onDragStart={(event) => {
                event.dataTransfer.setData("text", `image:${image.id}`);
              }}
              className="h-36 w-36 rounded border-0"
            />
          )}
        </div>
      </div>
    </div>
  );
};

const CoverArtUploadTab = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounterRef = useRef(0);

  const [isDraggingFiles, setIsDraggingFiles] = useState(false);
  const [currentImage, setCurrentImage] = useState<Image>();

  const preventDefaultOnDrag: DragEventHandler = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDragEnter: DragEventHandler = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (!event.dataTransfer) return;

    dragCounterRef.current = dragCounterRef.current + 1;

    if (event.dataTransfer.items.length) {
      setIsDraggingFiles(true);
    }
  };

  const handleDragExit: DragEventHandler = (event) => {
    event.preventDefault();
    event.stopPropagation();

    dragCounterRef.current = dragCounterRef.current - 1;

    if (dragCounterRef.current > 0) {
      return;
    }

    setIsDraggingFiles(false);
  };

  const getFirstImageFile = (files: File[]) => {
    return files.filter((file) => file.type.startsWith("image/"))[0];
  };

  const handleFileInput = async (files: File[]) => {
    const image = getFirstImageFile(files);
    if (image) {
      try {
        const content = await getImageOnlyDataURL(image);

        const imageToStore = {
          id: image.name,
          content,
        };

        storeImageToDB(imageToStore);
        setCurrentImage(imageToStore);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleDrop: DragEventHandler = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (!event.dataTransfer) return;

    setIsDraggingFiles(false);

    if (event.dataTransfer.items.length) {
      handleFileInput(
        Array.from(event.dataTransfer.items)
          .map((item) => item.getAsFile())
          .filter((item) => !!item) as File[]
      );

      event.dataTransfer.clearData();
      dragCounterRef.current = 0;
    }
  };

  return (
    <div className="flex flex-col gap-2.5 p-4">
      <input
        type="file"
        className="hidden"
        accept="image/*"
        ref={fileInputRef}
        onChange={() => {
          if (!fileInputRef.current || !fileInputRef.current.files) return;
          handleFileInput(Array.from(fileInputRef.current.files));
        }}
      />
      <button
        className={classNames(
          "flex w-full cursor-pointer flex-col items-center gap-1 rounded border-2 border-dashed border-slate-600 py-6 transition-colors duration-150 hover:border-slate-500",
          isDraggingFiles && "border-slate-500"
        )}
        onClick={() => {
          fileInputRef.current?.click();
        }}
        onDrag={preventDefaultOnDrag}
        onDragEnter={handleDragEnter}
        onDragExit={handleDragExit}
        onDragOver={preventDefaultOnDrag}
        onDrop={handleDrop}
      >
        <div className="mb-1 rounded-full bg-slate-600 p-4">
          <ImageIcon className="h-12 w-12 text-white" />
        </div>
        <div className="font-semibold">Click to browse images</div>
        <div className="text-sm">Or drop your files here</div>
      </button>
      {currentImage && (
        <div className="flex flex-col items-center gap-2 px-2.5 pb-5">
          <div className="text-sm">Drag this to your desired cell:</div>
          <img
            draggable
            onDragStart={(event) => {
              event.dataTransfer.setData("text", `image:${currentImage.id}`);
            }}
            className="h-36 w-36 rounded border-0"
            src={currentImage.content}
          />
        </div>
      )}
    </div>
  );
};

const AddCoverArt = () => {
  const [currentTab, setCurrentTab] = useState<Tab>("Search");

  return (
    <div className="flex h-full min-h-0 flex-col text-white">
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
        <CoverArtSearchTab />
      ) : currentTab === "Link" ? (
        <CoverArtLinkTab />
      ) : currentTab === "Upload" ? (
        <CoverArtUploadTab />
      ) : null}
    </div>
  );
};

export default AddCoverArt;
