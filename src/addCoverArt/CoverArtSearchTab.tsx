/* eslint-disable @next/next/no-img-element */

import IconButton from "../components/IconButton";
import CloseIcon from "../icons/CloseIcon";
import MusicIcon from "../icons/MusicIcon";
import SearchIcon from "../icons/SearchIcon";
import { useEffect, useRef, useState } from "react";
import { Image, storeImageToDB } from "../stores/imageDB";
import ErrorIcon from "../icons/ErrorIcon";
import Spinner from "../components/Spinner";
import { useQuery } from "@tanstack/react-query";
import { blobToDataURL } from "./blobToDataURL";
import { z } from "zod";

const LastFmImage = z.object({
  "#text": z.string(),
  size: z.string(),
});

const LastFmAlbum = z.object({
  name: z.string(),
  artist: z.string(),
  url: z.string(),
  image: z.array(LastFmImage).length(4),
  streamable: z.string(),
  mbid: z.string(),
});

const LastFmSearchResponse = z.object({
  results: z.object({
    albummatches: z.object({
      album: z.array(LastFmAlbum),
    }),
  }),
});

const SearchResult = ({ alt, link }: { alt: string; link: string }) => {
  const {
    isFetching,
    data: image,
    error,
  } = useQuery(
    [link],
    async () => {
      const response = await fetch(link);
      const imageBlob = await response.blob();
      const content = await blobToDataURL(imageBlob);

      const imageToStore: Image = {
        id: link,
        content,
      };

      await storeImageToDB(imageToStore);
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

  if (error) return null;

  return (
    <div
      className="flex items-center justify-center rounded select-none bg-slate-600"
      draggable={!!image}
      onDragStart={(event) => {
        if (!image) return;
        event.dataTransfer.setData(
          "text",
          JSON.stringify({
            title: alt,
            image: image.id,
          })
        );
      }}
    >
      {isFetching && <Spinner className="w-7 h-7" />}
      {image && (
        <img alt={alt} src={image.content} className="rounded h-full w-full" />
      )}
    </div>
  );
};

export const CoverArtSearchTab = () => {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const {
    isFetching,
    data: results,
    error,
    refetch,
  } = useQuery(
    [searchQuery],
    async () => {
      try {
        const response = await fetch("/api/search-lastfm", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: searchQuery,
          }),
        });
        const responseJSON = await response.json();

        const parsedResponse = LastFmSearchResponse.parse(responseJSON);
        const results = parsedResponse.results.albummatches.album
          .filter((album) => !!album.image[3]?.["#text"])
          .map((album) => ({
            ...album,
            image: album.image[3]?.["#text"],
          }));

        return results;
      } catch (error) {
        if (error instanceof Error) {
          console.error(error);
          throw error;
        } else {
          throw new Error("Could not search");
        }
      }
    },
    {
      enabled: false,
      retry: 0,
    }
  );

  return (
    <div className="flex min-h-0 flex-grow flex-col">
      <form
        className="flex gap-2.5 px-2.5 py-3.5"
        onSubmit={async (event) => {
          event.preventDefault();
          refetch();
        }}
      >
        <input
          className="flex-grow rounded border border-slate-600 bg-transparent px-2.5 py-1.5 text-xs placeholder:text-slate-400"
          placeholder="Search for music..."
          value={searchQuery}
          onInput={(event) => {
            setSearchQuery(event.currentTarget.value);
          }}
          ref={searchInputRef}
        />
        <IconButton
          type="submit"
          icon={SearchIcon}
          label="Search"
          disabled={isFetching}
        />
        {!!searchQuery && (
          <IconButton
            icon={CloseIcon}
            label="Clear search"
            onClick={() => {
              setSearchQuery("");
              searchInputRef.current?.focus();
            }}
            disabled={isFetching}
          />
        )}
      </form>
      <div className="flex flex-col items-center gap-2.5 overflow-y-auto px-2.5 pb-5">
        {error instanceof Error && (
          <div className="flex items-center gap-2.5 text-red-500 text-sm">
            <ErrorIcon className="w-5 h-5" />
            {error.message}
          </div>
        )}
        {isFetching && <Spinner className="w-10 h-10" />}
        {!isFetching && !results && (
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
                onClick={() => {
                  setSearchQuery("It's Almost Dry by Pusha T");
                  searchInputRef.current?.focus();
                }}
              >
                It&apos;s Almost Dry by Pusha T
              </span>
              &quot;
            </div>
          </>
        )}
        {results && !results.length && (
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
                onClick={() => {
                  setSearchQuery("Brian Eno");
                  searchInputRef.current?.focus();
                }}
              >
                Brian Eno
              </span>
              &quot;
            </div>
          </>
        )}
        {results && (
          <div className="grid w-full grid-cols-3 gap-2.5">
            {results.map((result) => {
              const image = result.image;

              if (!image) {
                return null;
              }

              return (
                <SearchResult
                  alt={`${result.artist} - ${result.name}`}
                  link={image}
                  key={image}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
