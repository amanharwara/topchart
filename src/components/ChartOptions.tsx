import { Component, createEffect, createSignal, JSX, Show } from "solid-js";
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
import {
  addNewChart,
  changeChartRowsOrColumns,
  changeChartType,
  charts,
  ChartTypes,
  editChartTitle,
} from "../chartStore";
import type { Chart, ChartType, ChartRowColumnRange } from "../chartStore";

const [selectedChart, setSelectedChart] = createSignal<Chart>(charts[0]);

const CurrentChartOption = () => {
  const [isEditingChart, setIsEditingChart] = createSignal(false);
  const isSelectingChart = () => !isEditingChart();

  const [currentTitle, setCurrentTitle] = createSignal("");

  createEffect(() => {
    setCurrentTitle(selectedChart().title);
  });

  let chartTitleInput: HTMLInputElement | undefined;

  return (
    <div class="flex flex-col gap-2.5">
      <div class="text-lg font-semibold">Current chart:</div>
      <div class="flex gap-2">
        <Show when={isSelectingChart()}>
          <Select
            value={selectedChart().id}
            onChange={(id) =>
              setSelectedChart(charts.find((chart) => chart.id === id))
            }
            options={charts.map(({ id, title }) => ({
              value: id,
              label: title,
            }))}
          />
          <IconButton
            className="px-2.5"
            icon={AddIcon}
            label="Add new chart"
            onClick={() => {
              const id = addNewChart();

              setSelectedChart(charts.find((chart) => chart.id === id));
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
            onClick={() => {
              const shouldDeleteChart = confirm(
                `Do you want to delete chart "${selectedChart().title}"?`
              );

              if (shouldDeleteChart) {
                deleteChart(selectedChart().id);
              }
            }}
          />
        </Show>
        <Show when={isEditingChart()}>
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
            label={"Save chart title"}
            onClick={() => {
              editChartTitle(selectedChart().id, currentTitle());
              setIsEditingChart(false);
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

  const onRowsInput: JSX.EventHandlerUnion<HTMLInputElement, InputEvent> = (
    event
  ) => {
    changeChartRowsOrColumns(
      selectedChart().id,
      "rows",
      parseInt(event.currentTarget.value) as ChartRowColumnRange
    );
  };

  const onColumnsInput: JSX.EventHandlerUnion<HTMLInputElement, InputEvent> = (
    event
  ) => {
    changeChartRowsOrColumns(
      selectedChart().id,
      "columns",
      parseInt(event.currentTarget.value) as ChartRowColumnRange
    );
  };

  return (
    <div class="flex flex-col gap-6 bg-gray-800 py-4 px-5 text-white">
      <CurrentChartOption />
      <div class="flex flex-col gap-2.5">
        <div class="text-lg font-semibold">Chart type:</div>
        <div class="flex gap-3">
          <Select
            value={selectedChart().type}
            options={Object.entries(ChartTypes).map(([value, label]) => ({
              value,
              label,
            }))}
            onChange={(type: ChartType) => {
              changeChartType(selectedChart().id, type);
            }}
          />
        </div>
      </div>
      <div class="flex flex-col gap-2.5">
        <div class="text-lg font-semibold">Rows:</div>
        <div class="flex gap-3">
          <input
            type="range"
            class="flex-grow "
            value={selectedChart().rows}
            min={1}
            max={10}
            onInput={onRowsInput}
          />
          <input
            type="number"
            class="max-w-[4rem] rounded border border-slate-600 bg-transparent px-2.5 py-2 text-sm placeholder:text-slate-400"
            value={selectedChart().rows}
            min={1}
            max={10}
            onInput={onRowsInput}
          />
        </div>
      </div>
      <div class="flex flex-col gap-2.5">
        <div class="text-lg font-semibold">Columns:</div>
        <div class="flex gap-3">
          <input
            type="range"
            class="flex-grow "
            value={selectedChart().columns}
            min={1}
            max={10}
            onInput={onColumnsInput}
          />
          <input
            type="number"
            class="max-w-[4rem] rounded border border-slate-600 bg-transparent px-2.5 py-2 text-sm placeholder:text-slate-400"
            value={selectedChart().columns}
            min={1}
            max={10}
            onInput={onColumnsInput}
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
