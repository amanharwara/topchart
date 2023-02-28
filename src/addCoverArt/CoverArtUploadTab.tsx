/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */

import classNames from "../utils/classNames";
import ImageIcon from "../icons/ImageIcon";
import {
  Dispatch,
  DragEventHandler,
  SetStateAction,
  useRef,
  useState,
} from "react";
import { getImageFromDB, Image, storeImageToDB } from "../stores/imageDB";
import { blobToDataURL } from "./blobToDataURL";
import Button from "../components/Button";
import {
  useSelectedMusicCollageAddingCoverTo,
  useSetMusicCollageItem,
} from "../stores/charts";
import { useResultDrag } from "./useResultDrag";
import { Disclosure, DisclosureContent, useDisclosureState } from "ariakit";
import CaretDownIcon from "../icons/CaretDownIcon";
import { useQuery } from "@tanstack/react-query";
import { recentsStore } from "../stores/recents";
import { useStore } from "zustand";
import Spinner from "../components/Spinner";

const RecentlyUploadedImage = ({
  id,
  setCurrentImage,
  toggleDisclosure,
}: {
  id: string;
  setCurrentImage: Dispatch<SetStateAction<Image | undefined>>;
  toggleDisclosure: () => void;
}) => {
  const { data: image, isFetching } = useQuery(
    [id],
    async () => {
      try {
        return await getImageFromDB(id);
      } catch (error) {
        console.error(error);
      }
    },
    {
      networkMode: "always",
    }
  );

  if (!isFetching && !image) return null;

  return (
    <button
      className="relative aspect-square rounded border-0 bg-slate-600 overflow-hidden"
      onClick={() => {
        if (!image) return;
        setCurrentImage({
          id,
          content: image,
        });
        toggleDisclosure();
      }}
    >
      {isFetching && (
        <Spinner className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5" />
      )}
      {image && <img src={image} className="w-full h-full" />}
    </button>
  );
};

export const CoverArtUploadTab = ({ itemIndex }: { itemIndex: number }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounterRef = useRef(0);

  const [isDraggingFiles, setIsDraggingFiles] = useState(false);
  const [currentImage, setCurrentImage] = useState<Image>();

  const setMusicCollageItem = useSetMusicCollageItem();
  const [, setAddingCoverTo] = useSelectedMusicCollageAddingCoverTo();

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
    if (!image) {
      return;
    }
    try {
      const content = await blobToDataURL(image);

      const imageToStore = {
        id: image.name,
        content,
      };

      await storeImageToDB(imageToStore);
      setCurrentImage(imageToStore);
      recentsStore.getState().addRecentlyUploadedImage(imageToStore.id);
    } catch (error) {
      console.error(error);
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

  const isAddingToSpecificItem = itemIndex > -1;

  const dragAttributes = useResultDrag({
    isDraggable: !!currentImage && !isAddingToSpecificItem,
    title: currentImage?.id,
    image: currentImage?.id,
  });

  const recentlyUploadedImageIds = useStore(
    recentsStore,
    (s) => s.recentlyUploadedImages
  );
  const showRecentDisclosureState = useDisclosureState();

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
        <div className="hidden md:block text-sm">Or drop your files here</div>
      </button>
      {currentImage && (
        <div className="flex flex-col items-center gap-2 px-2.5 pb-5">
          <div className="text-sm">
            {!isAddingToSpecificItem
              ? "Drag this to your desired cell:"
              : "Preview:"}
          </div>
          <div className="h-36 w-36 rounded border-0 bg-slate-600">
            <img
              {...dragAttributes}
              className="h-36 w-36 rounded border-0"
              src={currentImage.content}
            />
          </div>
          {isAddingToSpecificItem && (
            <Button
              className="mt-1 text-base"
              onClick={() => {
                setMusicCollageItem(itemIndex, {
                  title: currentImage.id,
                  image: currentImage.id,
                });
                setAddingCoverTo(-1);
              }}
            >
              Add cover
            </Button>
          )}
        </div>
      )}
      {recentlyUploadedImageIds.length > 0 && (
        <div className="rounded px-2 py-1 border border-slate-600 dark:bg-slate-600 max-w-sm">
          <Disclosure
            className="w-full flex items-center justify-between text-sm font-semibold"
            state={showRecentDisclosureState}
          >
            <div>Recently uploaded</div>
            <CaretDownIcon
              className={classNames(
                "w-4 h-4 transition-transform",
                showRecentDisclosureState.open && "rotate-180"
              )}
            />
          </Disclosure>
          <DisclosureContent
            className="flex flex-col gap-2.5 pt-1.5 pb-1"
            state={showRecentDisclosureState}
          >
            <div className="grid grid-cols-3 gap-2">
              {recentlyUploadedImageIds.map((id) => (
                <RecentlyUploadedImage
                  id={id}
                  key={id}
                  setCurrentImage={setCurrentImage}
                  toggleDisclosure={showRecentDisclosureState.toggle}
                />
              ))}
            </div>
            <Button
              className="border-slate-500 hover:!bg-slate-500 justify-center"
              onClick={() => {
                recentsStore.getState().clearRecentlyUploadedImages();
              }}
            >
              Clear recents
            </Button>
          </DisclosureContent>
        </div>
      )}
    </div>
  );
};
