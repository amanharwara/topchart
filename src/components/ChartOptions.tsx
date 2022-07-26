import {
  Component,
  ComponentProps,
  createSignal,
  JSX,
  Show,
  splitProps,
} from "solid-js";
import classNames from "../utils/classNames";
import IconButton from "./IconButton";
import ColorPickerIcon from "./icons/ColorPickerIcon";
import EditIcon from "./icons/EditIcon";
import HashIcon from "./icons/HashIcon";
import LinkIcon from "./icons/LinkIcon";
import TrashIcon from "./icons/TrashIcon";
import Toggle from "./Toggle";

const InputWithIcon: Component<
  {
    icon: Component<JSX.IntrinsicElements["svg"]>;
  } & ComponentProps<"input">
> = (props) => {
  const [, inputProps] = splitProps(props, ["icon"]);

  return (
    <div class="flex flex-grow rounded border border-slate-600">
      <div class="flex items-center border-r border-slate-600 px-2.5 py-2">
        {<props.icon class="h-4 w-4" />}
      </div>
      <input
        class="flex-grow bg-transparent px-2.5 py-2 text-sm placeholder:text-slate-400"
        {...inputProps}
      />
    </div>
  );
};

const ChartOptions: Component = () => {
  const [showBgColorInput, setShowBgColorInput] = createSignal(false);
  const [showAlbumTitles, setShowAlbumTitles] = createSignal(true);

  return (
    <div class="flex flex-col gap-6 bg-gray-800 py-4 px-5 text-white">
      <div class="flex flex-col gap-2.5">
        <div class="text-lg font-semibold">Current chart:</div>
        <div class="flex gap-2">
          <input
            class="flex-grow rounded border border-slate-600 bg-transparent px-2.5 py-2 text-sm placeholder:text-slate-400"
            placeholder="Select chart"
            value="Untitled chart"
          />
          <IconButton
            className="px-2.5"
            icon={EditIcon}
            label="Edit chart title"
          />
          <IconButton
            className="px-2.5"
            icon={TrashIcon}
            label="Delete chart"
          />
        </div>
      </div>
      <div class="flex flex-col gap-2.5">
        <div class="text-lg font-semibold">Chart type:</div>
        <div class="flex gap-3">
          <input
            class="flex-grow rounded border border-slate-600 bg-transparent px-2.5 py-2 text-sm placeholder:text-slate-400"
            placeholder="Select chart type"
            value="Music Collage"
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
