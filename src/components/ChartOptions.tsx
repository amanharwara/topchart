import { nanoid } from "nanoid";
import { Component, createEffect, createSignal, Show } from "solid-js";
import classNames from "../utils/classNames";
import IconButton from "./IconButton";
import AddIcon from "./icons/AddIcon";
import ColorPickerIcon from "./icons/ColorPickerIcon";
import EditIcon from "./icons/EditIcon";
import HashIcon from "./icons/HashIcon";
import LinkIcon from "./icons/LinkIcon";
import SaveIcon from "./icons/SaveIcon";
import TrashIcon from "./icons/TrashIcon";
import InputWithIcon from "./InputWithIcon";
import Select from "./Select";
import Toggle from "./Toggle";
import { charts, setCharts } from "../chartStore";
import type { Chart } from "../chartStore";

const CurrentChartOption = () => {
  const [selectedChart, setSelectedChart] = createSignal<Chart>({
    id: charts[0].id,
    name: charts[0].name,
  });

  const [isAddingChart, setIsAddingChart] = createSignal(false);
  const [isEditingChart, setIsEditingChart] = createSignal(false);
  const isSelectingChart = () => !isAddingChart() && !isEditingChart();

  const [currentTitle, setCurrentTitle] = createSignal("");

  createEffect(() => {
    setCurrentTitle(selectedChart().name);
  });

  let chartTitleInput: HTMLInputElement | undefined;

  return (
    <div class="flex flex-col gap-2.5">
      <div class="text-lg font-semibold">Current chart:</div>
      <div class="flex gap-2">
        <Show when={isSelectingChart()}>
          <Select
            value={selectedChart().id}
            onChange={(value) =>
              setSelectedChart(charts.find((chart) => chart.id === value))
            }
            options={charts.map(({ id, name }) => ({
              value: id,
              label: name,
            }))}
          />
          <IconButton
            className="px-2.5"
            icon={AddIcon}
            label="Add new chart"
            onClick={() => {
              setIsAddingChart(true);
              setCurrentTitle("");
              chartTitleInput?.focus();
            }}
          />
          <IconButton
            className="px-2.5"
            icon={EditIcon}
            label="Edit chart title"
            onClick={() => {
              setIsEditingChart(true);
              chartTitleInput?.focus();
            }}
          />
          <IconButton
            className="px-2.5"
            icon={TrashIcon}
            label="Delete chart"
          />
        </Show>
        <Show when={isAddingChart() || isEditingChart()}>
          <input
            class="flex-grow rounded border border-slate-600 bg-transparent px-2.5 py-2 text-sm placeholder:text-slate-400"
            placeholder="Enter chart title..."
            value={currentTitle()}
            onInput={(event) => {
              setCurrentTitle(event.currentTarget.value);
            }}
            ref={chartTitleInput}
          />
          <IconButton
            className="px-2.5"
            icon={SaveIcon}
            label={isAddingChart() ? "Add chart" : "Save chart"}
            onClick={() => {
              if (isAddingChart()) {
                const id = nanoid();
                const title = currentTitle();

                setCharts(charts.length, {
                  id,
                  name: title.length ? title : `Untitled ${charts.length + 1}`,
                });
                setIsAddingChart(false);
                setSelectedChart(charts.find((chart) => chart.id === id));
              } else {
                setCharts(
                  (chart) => chart.id === selectedChart().id,
                  (chart) => ({
                    ...chart,
                    name: currentTitle(),
                  })
                );
                setIsEditingChart(false);
              }
            }}
          />
        </Show>
      </div>
    </div>
  );
};

const ChartOptions: Component = () => {
  const [showBgColorInput, setShowBgColorInput] = createSignal(false);
  const [showAlbumTitles, setShowAlbumTitles] = createSignal(true);

  return (
    <div class="flex flex-col gap-6 bg-gray-800 py-4 px-5 text-white">
      <CurrentChartOption />
      <div class="flex flex-col gap-2.5">
        <div class="text-lg font-semibold">Chart type:</div>
        <div class="flex gap-3">
          <Select
            options={[{ value: "music-collage", label: "Music Collage" }]}
          />
        </div>
      </div>
      <div class="flex flex-col gap-2.5">
        <div class="text-lg font-semibold">Rows:</div>
        <div class="flex gap-3">
          <input type="range" class="flex-grow " value={3} min={1} max={10} />
          <input
            type="number"
            class="max-w-[4rem] rounded border border-slate-600 bg-transparent px-2.5 py-2 text-sm placeholder:text-slate-400"
            value={3}
          />
        </div>
      </div>
      <div class="flex flex-col gap-2.5">
        <div class="text-lg font-semibold">Columns:</div>
        <div class="flex gap-3">
          <input type="range" class="flex-grow " value={3} min={1} max={10} />
          <input
            type="number"
            class="max-w-[4rem] rounded border border-slate-600 bg-transparent px-2.5 py-2 text-sm placeholder:text-slate-400"
            value={3}
          />
        </div>
      </div>
      <div class="flex flex-col gap-2.5">
        <div class="text-lg font-semibold">Album Titles:</div>
        <label class="flex items-center gap-3">
          <Toggle
            value={showAlbumTitles()}
            onChange={(checked) => setShowAlbumTitles(checked)}
          />
          Show album titles
        </label>
        <label
          class={classNames(
            "flex items-center gap-3",
            !showAlbumTitles() && "cursor-not-allowed text-gray-500"
          )}
        >
          <Toggle disabled={!showAlbumTitles()} />
          Position album titles below cover
        </label>
        <label
          class={classNames(
            "flex items-center gap-3",
            !showAlbumTitles() && "cursor-not-allowed text-gray-500"
          )}
        >
          <Toggle disabled={!showAlbumTitles()} />
          Allow editing titles
        </label>
      </div>
      <div class="flex flex-col gap-2.5">
        <div class="text-lg font-semibold">Background:</div>
        <label class="flex items-center gap-4">
          <div>Image URL</div>
          <Toggle
            value={showBgColorInput()}
            onChange={(checked) => setShowBgColorInput(checked)}
            invertedColors
            id="image-or-color-toggle"
          />
          <div>Color</div>
        </label>
        <Show
          when={showBgColorInput()}
          fallback={
            <InputWithIcon
              icon={LinkIcon}
              placeholder="Enter image URL..."
              value="https://somewebsite.com/image.png"
            />
          }
        >
          <div class="flex flex-grow gap-1.5">
            <InputWithIcon
              icon={HashIcon}
              placeholder="Enter color..."
              value="FFFFFF"
            />
            <IconButton
              className="px-2.5"
              icon={ColorPickerIcon}
              label="Pick color"
            />
          </div>
        </Show>
      </div>
      <div class="flex flex-col gap-2.5">
        <div class="text-lg font-semibold">Font style:</div>
        <input
          class="flex-grow rounded border border-slate-600 bg-transparent px-2.5 py-2 text-sm placeholder:text-slate-400"
          placeholder="Select font"
          value="Inter"
        />
        <div class="flex flex-grow gap-1.5">
          <InputWithIcon
            icon={HashIcon}
            placeholder="Enter color..."
            value="FFFFFF"
          />
          <IconButton
            className="px-2.5"
            icon={ColorPickerIcon}
            label="Pick color"
          />
        </div>
      </div>
    </div>
  );
};

export default ChartOptions;
