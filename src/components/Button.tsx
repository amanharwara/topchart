import classNames from "../utils/classNames";
import {
  Component,
  ComponentProps,
  JSX,
  mergeProps,
  splitProps,
} from "solid-js";

type Props = {
  hideLabelOnMobile?: boolean;
  icon?: Component<JSX.IntrinsicElements["svg"]>;
} & ComponentProps<"button">;

const Button = (props: Props) => {
  const propsWithDefaults = mergeProps(
    {
      hideLabelOnMobile: true,
    },
    props
  );
  const [currentProps, otherProps] = splitProps(propsWithDefaults, [
    "hideLabelOnMobile",
    "icon",
  ]);

  return (
    <button
      class={classNames(
        "flex items-center gap-1.5 rounded border border-solid border-slate-600 text-white hover:bg-slate-600",
        currentProps.hideLabelOnMobile
          ? "p-1.5 md:px-2 md:py-1.5"
          : "px-2 py-1.5"
      )}
      {...otherProps}
    >
      {props.icon ? <props.icon class="h-4 w-4" /> : null}
      <span
        class={classNames(
          "text-xs font-semibold",
          currentProps.hideLabelOnMobile && "hidden md:inline"
        )}
      >
        {otherProps.children}
      </span>
    </button>
  );
};

export default Button;
