import { Checkbox, useCheckboxState, VisuallyHidden } from "ariakit";
import { ComponentPropsWithoutRef } from "react";
import classNames from "../utils/classNames";

type Props = {
  value: boolean;
  onChange: (checked: boolean) => void;
  invertedColors?: boolean;
} & Omit<ComponentPropsWithoutRef<"input">, "value" | "onChange">;

const Toggle = ({
  value,
  onChange,
  invertedColors = false,
  ...props
}: Props) => {
  const state = useCheckboxState<boolean>({
    value,
    setValue(value) {
      onChange(value);
    },
  });

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
      className={classNames(
        "focus-within-ring relative min-h-5 min-w-10 rounded-xl border transition-colors duration-150 ease-out",
        value ? colors.container.checked : colors.container.unchecked,
        props.disabled && colors.container.disabled
      )}
    >
      <VisuallyHidden>
        <Checkbox state={state} />
      </VisuallyHidden>
      <span
        aria-hidden
        className={classNames(
          "absolute top-1/2 block -translate-y-1/2 rounded-full transition-transform duration-150 ease-out",
          colors.indicator.common,
          value ? colors.indicator.checked : colors.indicator.unchecked,
          props.disabled && colors.indicator.disabled
        )}
      />
    </div>
  );
};

export default Toggle;
