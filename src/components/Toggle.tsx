import { Checkbox, useCheckboxStore, VisuallyHidden } from "@ariakit/react";
import { ComponentPropsWithoutRef } from "react";
import classNames from "../utils/classNames";

type Props = {
  value: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
} & Omit<ComponentPropsWithoutRef<"input">, "value" | "onChange">;

const Toggle = ({ value, onChange, className, ...props }: Props) => {
  const state = useCheckboxStore<boolean>({
    value,
    setValue(value) {
      onChange(value);
    },
  });

  return (
    <div
      className={classNames(
        "focus-within-ring relative min-h-5 min-w-10 rounded-xl border border-slate-700 dark:border-slate-100 transition-colors duration-150 ease-out",
        value ? "bg-slate-100" : "",
        props.disabled && "border-gray-500",
        className
      )}
    >
      <VisuallyHidden>
        <Checkbox store={state} {...props} />
      </VisuallyHidden>
      <span
        aria-hidden
        className={classNames(
          "absolute top-1/2 block -translate-y-1/2 rounded-full transition-transform duration-150 ease-out",
          value
            ? "h-3.5 w-3.5 translate-x-[calc(2.5rem-1.125rem)] bg-slate-700"
            : "left-[0.175rem] dark:left-1 h-3.5 w-3.5 dark:w-3 dark:h-3 dark:bg-slate-100 bg-slate-700",
          props.disabled && "bg-gray-500"
        )}
      />
    </div>
  );
};

export default Toggle;
