import { ComponentPropsWithoutRef, ComponentType } from "react";
import classNames from "../utils/classNames";

type Props = {
  icon: ComponentType<ComponentPropsWithoutRef<"svg">>;
  label: string;
  className?: string;
} & ComponentPropsWithoutRef<"button">;

const IconButton = ({
  icon: Icon,
  label,
  className,
  disabled,
  ...props
}: Props) => {
  return (
    <button
      type="button"
      aria-label={label}
      className={classNames(
        "peer flex select-none items-center gap-2 rounded border p-1.5",
        disabled
          ? "cursor-not-allowed border-gray-500 text-gray-400"
          : "border-slate-600 hover:bg-slate-600 text-white",
        className
      )}
      disabled={disabled}
      {...props}
    >
      {<Icon className="h-4 w-4" />}
    </button>
  );
};

export default IconButton;
