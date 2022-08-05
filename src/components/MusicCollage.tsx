import { Component, createEffect, createSignal, Show } from "solid-js";
import { selectedChart, setMusicCollageItemImage } from "../chartStore";
import { getImageFromDB } from "../imageDB";
import classNames from "../utils/classNames";

export const MusicCollage: Component = () => {
  const totalNumberOfItems = () =>
    selectedChart().options["music-collage"].rows *
    selectedChart().options["music-collage"].columns;

  const gap = () => {
    switch (selectedChart().options["music-collage"].gap) {
      case "small":
        return "gap-2";
      case "medium":
        return "gap-4";
      case "large":
        return "gap-6";
    }
  };

  const padding = () => {
    switch (selectedChart().options["music-collage"].padding) {
      case "small":
        return "p-2";
      case "medium":
        return "p-4";
      case "large":
        return "p-6";
    }
  };

  const preventDefaultOnDrag = (event: DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDragEnter = (event: DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDragExit = (event: DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <div
      class={classNames("grid w-min bg-black", gap(), padding())}
      style={{
        "grid-template-columns": `repeat(${
          selectedChart().options["music-collage"].columns
        }, 10rem)`,
        "grid-template-rows": `repeat(${
          selectedChart().options["music-collage"].rows
        }, 10rem)`,
      }}
    >
      {selectedChart()
        .options["music-collage"].items.slice(0, totalNumberOfItems())
        .map((item, index) => {
          const [imageContent, setImageContent] = createSignal("");

          const handleDrop = async (event: DragEvent) => {
            const imageID = event.dataTransfer.getData("text");

            setMusicCollageItemImage(selectedChart().id, index, imageID);
          };

          createEffect(async () => {
            if (!item.image) return;
            const imageFromDB = await getImageFromDB(item.image);
            if (imageFromDB) setImageContent(imageFromDB);
          });

          return (
            <div
              class="bg-white"
              onDrag={preventDefaultOnDrag}
              onDragEnter={handleDragEnter}
              onDragExit={handleDragExit}
              onDragOver={preventDefaultOnDrag}
              onDrop={handleDrop}
            >
              <Show when={imageContent()}>
                {(src) => <img src={src} class="h-full w-full" />}
              </Show>
            </div>
          );
        })}
    </div>
  );
};
