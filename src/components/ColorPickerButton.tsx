import { Component } from "solid-js";
import IconButton from "./IconButton";
import ColorPickerIcon from "./icons/ColorPickerIcon";

const ColorPickerButton: Component<{
  value: string;
  onChange: (value: string) => void;
  class?: string;
}> = (props) => {
  let inputElementRef: HTMLInputElement | null;

  return (
    <div class="relative flex">
      <input
        class="pointer-events-none absolute top-0 left-0 h-full w-full opacity-0"
        type="color"
        value={props.value}
        onChange={(event) => {
          props.onChange(event.currentTarget.value);
        }}
        ref={inputElementRef}
      />
      <IconButton
        className={props.class}
        icon={ColorPickerIcon}
        label="Pick color"
        onClick={() => inputElementRef.click()}
      />
    </div>
  );
};

export default ColorPickerButton;
