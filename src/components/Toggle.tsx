import { Component, ComponentProps, createSignal, splitProps } from "solid-js";
import classNames from "../utils/classNames";

type Props = {
  defaultValue?: boolean;
  value?: boolean;
  onChange?: (checked: boolean) => void;
  invertedColors?: boolean;
} & Omit<ComponentProps<"input">, "value" | "onChange">;

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
    },
    indicator: {
      checked: invertedColors
        ? "translate-x-[calc(2.5rem-1.25rem)]"
        : "h-3.5 w-3.5 translate-x-[calc(2.5rem-1.125rem)] bg-slate-700",
      unchecked: !invertedColors && "left-1 h-3 w-3 bg-slate-100",
      common: invertedColors && "left-0.5 h-3.5 w-3.5 bg-slate-700",
    },
  };

  return (
    <div
      class={classNames(
        "focus-within-ring relative min-h-5 min-w-10 rounded-xl border transition-colors duration-150 ease-out",
        isChecked() ? colors.container.checked : colors.container.unchecked
      )}
    >
      <input
        type="checkbox"
        class="absolute top-0 left-0 z-[1] m-0 h-full w-full cursor-pointer p-0 opacity-0 shadow-none outline-none"
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
          isChecked() ? colors.indicator.checked : colors.indicator.unchecked
        )}
      />
    </div>
  );
};

export default Toggle;
