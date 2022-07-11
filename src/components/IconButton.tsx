import { Component, ComponentProps, JSX, splitProps } from "solid-js";
import classNames from "../utils/classNames";

type Props = {
  icon: Component<JSX.IntrinsicElements["svg"]>;
  label: string;
  className?: string;
} & ComponentProps<"button">;

const IconButton = (props: Props) => {
  const [, otherProps] = splitProps(props, ["label", "icon", "className"]);
  const IconComponent = props.icon;

  return (
    <button
      aria-label={props.label}
      class={classNames(
        "flex items-center gap-2 rounded border border-slate-600 p-1.5 hover:bg-slate-600",
        props.className
      )}
      {...otherProps}
    >
      {<IconComponent class="h-4 w-4 text-white" />}
    </button>
  );
};

export default IconButton;
