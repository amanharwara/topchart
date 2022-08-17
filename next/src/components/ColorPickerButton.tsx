import { useRef } from "react";
import ColorPickerIcon from "../icons/ColorPickerIcon";
import IconButton from "./IconButton";

type Props = {
  value: string;
  onChange: (value: string) => void;
  className?: string;
};

const ColorPickerButton = ({ value, onChange, className }: Props) => {
  const inputElementRef = useRef<HTMLInputElement>(null);

  return (
    <div className="relative flex">
      <input
        className="pointer-events-none absolute top-0 left-0 h-full w-full opacity-0"
        type="color"
        value={value}
        onChange={(event) => {
          onChange(event.currentTarget.value);
        }}
        ref={inputElementRef}
      />
      <IconButton
        className={className}
        icon={ColorPickerIcon}
        label="Pick color"
        onClick={() => inputElementRef.current?.click()}
      />
    </div>
  );
};

export default ColorPickerButton;
