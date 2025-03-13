import { ReactNode } from "react";
import classNames from "../utils/classNames";
import { Switch, SwitchProps } from "react-aria-components";

interface Props extends Omit<SwitchProps, "children"> {
  children: ReactNode;
}

export function Toggle({ isSelected, isDisabled, onChange, ...props }: Props) {
  return (
    <Switch isSelected={isSelected} onChange={onChange} {...props}>
      {({ isFocusVisible }) => (
        <>
          <div
            className={classNames(
              "relative min-h-5 min-w-10 rounded-xl border border-slate-700 dark:border-slate-100 transition-colors duration-150 ease-out",
              isSelected ? "bg-slate-100" : "",
              isDisabled && "border-gray-500",
              isFocusVisible && "focus-visible"
            )}
          >
            <span
              aria-hidden
              className={classNames(
                "absolute top-1/2 block -translate-y-1/2 rounded-full transition-transform duration-150 ease-out",
                isSelected
                  ? "h-3.5 w-3.5 translate-x-[calc(2.5rem-1.125rem)] bg-slate-700"
                  : "left-[0.175rem] dark:left-1 h-3.5 w-3.5 dark:w-3 dark:h-3 dark:bg-slate-100 bg-slate-700",
                isDisabled && "bg-gray-500"
              )}
            />
          </div>
          {props.children}
        </>
      )}
    </Switch>
  );
}
