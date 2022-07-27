import { Component, ComponentProps, createSignal, splitProps } from "solid-js";
import classNames from "../utils/classNames";

type Props = {
  defaultValue?: boolean;
  value?: boolean;
  onChange?: (checked: boolean) => void;
  invertedColors?: boolean;
  disabled?: boolean;
} & Omit<ComponentProps<"input">, "value" | "onChange" | "disabled">;

const Toggle: Component<Props> = (props) => {
  const [, checkboxProps] = splitProps(props, [
    "defaultValue",
    "value",
    "onChange",
    "invertedColors",
  ]);

  const [checked, setChecked] = createSignal(props.defaultValue ?? false);
  const isChecked = () =>
    typeof props.value !== "undefined" ? props.value : checked();
  const invertedColors = props.invertedColors ?? false;

  const colors = {
    container: {
      checked: invertedColors
        ? "border-slate-100 bg-slate-100"
        : "bg-slate-100",
      unchecked: invertedColors ? "border-slate-100 bg-slate-100" : "",
      disabled: invertedColors
        ? "bg-gray-500 border-gray-500"
        : "border-gray-500",
    },
    indicator: {
      checked: invertedColors
        ? "translate-x-[calc(2.5rem-1.25rem)]"
        : "h-3.5 w-3.5 translate-x-[calc(2.5rem-1.125rem)] bg-slate-700",
      unchecked: !invertedColors && "left-1 h-3 w-3 bg-slate-100",
      common: invertedColors && "left-0.5 h-3.5 w-3.5 bg-slate-700",
      disabled: !invertedColors && "bg-gray-500",
    },
  };

  return (
    <div
      class={classNames(
        "focus-within-ring relative min-h-5 min-w-10 rounded-xl border transition-colors duration-150 ease-out",
        isChecked() ? colors.container.checked : colors.container.unchecked,
        props.disabled && colors.container.disabled
      )}
    >
      <input
        type="checkbox"
        class={classNames(
          "absolute top-0 left-0 z-[1] m-0 h-full w-full p-0 opacity-0 shadow-none outline-none",
          props.disabled ? "cursor-not-allowed" : "cursor-pointer"
        )}
        disabled={props.disabled}
        onChange={() => {
          const currentValue = isChecked();

          setChecked(!currentValue);
          props.onChange?.(!currentValue);
        }}
        {...checkboxProps}
      />
      <span
        aria-hidden
        class={classNames(
          "absolute top-1/2 block -translate-y-1/2 rounded-full transition-transform duration-150 ease-out",
          colors.indicator.common,
          isChecked() ? colors.indicator.checked : colors.indicator.unchecked,
          props.disabled && colors.indicator.disabled
        )}
      />
    </div>
  );
};

export default Toggle;
