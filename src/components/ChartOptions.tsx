import { Component, ComponentProps, JSX, splitProps } from "solid-js";
import IconButton from "./IconButton";
import ColorPickerIcon from "./icons/ColorPickerIcon";
import EditIcon from "./icons/EditIcon";
import HashIcon from "./icons/HashIcon";
import LinkIcon from "./icons/LinkIcon";
import TrashIcon from "./icons/TrashIcon";

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
        class="flex-grow bg-transparent px-2.5 py-2 text-xs placeholder:text-slate-400"
        {...inputProps}
      />
    </div>
  );
};

const ChartOptions: Component = () => {
  return (
    <div class="flex flex-col gap-6 bg-gray-800 py-4 px-5 text-white">
      <div class="flex flex-col gap-2.5">
        <div class="text-lg font-semibold">Current chart:</div>
        <div class="flex gap-3">
          <input
            class="flex-grow rounded border border-slate-600 bg-transparent px-2.5 py-2 text-xs placeholder:text-slate-400"
            placeholder="Select chart"
            value="Untitled chart"
          />
          <IconButton icon={EditIcon} label="Edit chart title" />
          <IconButton icon={TrashIcon} label="Delete chart" />
        </div>
      </div>
      <div class="flex flex-col gap-2.5">
        <div class="text-lg font-semibold">Chart type:</div>
        <div class="flex gap-3">
          <input
            class="flex-grow rounded border border-slate-600 bg-transparent px-2.5 py-2 text-xs placeholder:text-slate-400"
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
            class="max-w-[4rem] rounded border border-slate-600 bg-transparent px-2.5 py-2 text-xs placeholder:text-slate-400"
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
            class="max-w-[4rem] rounded border border-slate-600 bg-transparent px-2.5 py-2 text-xs placeholder:text-slate-400"
            value={3}
          />
        </div>
      </div>
      <div class="flex flex-col gap-2.5">
        <div class="text-lg font-semibold">Background:</div>
        <InputWithIcon
          icon={LinkIcon}
          placeholder="Enter image URL..."
          value="https://somewebsite.com/image.png"
        />
      </div>
      <div class="flex flex-col gap-2.5">
        <div class="text-lg font-semibold">Font style:</div>
        <input
          class="flex-grow rounded border border-slate-600 bg-transparent px-2.5 py-2 text-xs placeholder:text-slate-400"
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
            className="flex-shrink-0"
            icon={ColorPickerIcon}
            label="Pick color"
          />
        </div>
      </div>
    </div>
  );
};

export default ChartOptions;
