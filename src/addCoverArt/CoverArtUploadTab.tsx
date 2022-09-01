/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */

import classNames from "../utils/classNames";
import ImageIcon from "../icons/ImageIcon";
import { DragEventHandler, useRef, useState } from "react";
import { Image, storeImageToDB } from "../stores/imageDB";
import { blobToDataURL } from "./blobToDataURL";

export const CoverArtUploadTab = () => {
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
        const content = await blobToDataURL(image);

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
            draggable={true}
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
