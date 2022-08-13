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

  const id = otherProps.id
    ? otherProps.id
    : `icon-button-${Math.random() * 69 + 420}`;

  return (
    <div class="relative flex">
      <button
        type="button"
        aria-aria-labelledby={`${id}-tooltip`}
        class={classNames(
          "peer flex select-none items-center gap-2 rounded border border-slate-600 p-1.5 hover:bg-slate-600",
          props.className
        )}
        {...otherProps}
      >
        {<IconComponent class="h-4 w-4 text-white" />}
      </button>
      <div
        role="tooltip"
        class={classNames(
          "absolute left-auto right-0 w-max select-none rounded bg-slate-900 py-2 px-3 font-sans text-sm text-white",
          "hidden peer-hover:block peer-focus:block",
          "top-[110%] z-10"
        )}
        id={`${id}-tooltip`}
      >
        {props.label}
      </div>
    </div>
  );
};

export default IconButton;
