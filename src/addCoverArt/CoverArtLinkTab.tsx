/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */

import IconButton from "../components/IconButton";
import CloseIcon from "../icons/CloseIcon";
import DownloadIcon from "../icons/DownloadIcon";
import { useRef, useState } from "react";
import { Image, storeImageToDB } from "../stores/imageDB";
import ErrorIcon from "../icons/ErrorIcon";
import Spinner from "../components/Spinner";
import { useQuery } from "@tanstack/react-query";
import Input from "../components/Input";
import { blobToDataURL } from "./blobToDataURL";
import { fetchLinkBlobWithCorsBackup } from "./fetchLinkBlobWithCorsBackup";

export const CoverArtLinkTab = () => {
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
      const imageBlob = await fetchLinkBlobWithCorsBackup(link);
      const content = await blobToDataURL(imageBlob);

      const imageToStore: Image = {
        id: link,
        content,
      };

      await storeImageToDB(imageToStore);
      return imageToStore;
    },
    {
      enabled: false,
      retry: 0,
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
