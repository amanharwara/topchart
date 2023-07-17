import {
  ComponentPropsWithoutRef,
  ComponentType,
  ForwardedRef,
  forwardRef,
} from "react";
import classNames from "../utils/classNames";

type Props = {
  icon: ComponentType<ComponentPropsWithoutRef<"svg">>;
  label: string;
  className?: string;
  iconClassName?: string;
} & ComponentPropsWithoutRef<"button">;

const IconButton = forwardRef(function IconButton(
  { icon: Icon, label, className, iconClassName, disabled, ...props }: Props,
  ref: ForwardedRef<HTMLButtonElement>
) {
  return (
    <button
      type="button"
      aria-label={label}
      className={classNames(
        "peer flex select-none items-center gap-2 rounded border p-1.5",
        disabled
          ? "cursor-not-allowed border-gray-500 text-gray-400"
          : "border-slate-600 hover:bg-slate-600 dark:text-white hover:text-white",
        className
      )}
      disabled={disabled}
      ref={ref}
      {...props}
    >
      {<Icon className={classNames("h-4 w-4", iconClassName)} />}
    </button>
  );
});

export default IconButton;
