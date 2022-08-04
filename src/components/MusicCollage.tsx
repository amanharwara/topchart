import { Component } from "solid-js";
import { selectedChart } from "../chartStore";
import classNames from "../utils/classNames";

export const MusicCollage: Component = () => {
  const childArray = () =>
    new Array(
      selectedChart().options["music-collage"].rows *
        selectedChart().options["music-collage"].columns
    ).fill(1);

  const gapForSelectedChart = () => {
    switch (selectedChart().options["music-collage"].gap) {
      case "small":
        return "gap-2";
      case "medium":
        return "gap-4";
      case "large":
        return "gap-6";
    }
  };

  const paddingForSelectedChart = () => {
    switch (selectedChart().options["music-collage"].padding) {
      case "small":
        return "p-2";
      case "medium":
        return "p-4";
      case "large":
        return "p-6";
    }
  };

  return (
    <div
      class={classNames(
        "grid w-min bg-black",
        gapForSelectedChart(),
        paddingForSelectedChart()
      )}
      style={{
        "grid-template-columns": `repeat(${
          selectedChart().options["music-collage"].columns
        }, 10rem)`,
        "grid-template-rows": `repeat(${
          selectedChart().options["music-collage"].rows
        }, 10rem)`,
      }}
    >
      {childArray().map(() => (
        <div class="bg-white" />
      ))}
    </div>
  );
};
