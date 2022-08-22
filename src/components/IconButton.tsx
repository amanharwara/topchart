import { ComponentPropsWithoutRef, ComponentType, useMemo } from "react";
import classNames from "../utils/classNames";

type Props = {
  icon: ComponentType<ComponentPropsWithoutRef<"svg">>;
  label: string;
  className?: string;
} & ComponentPropsWithoutRef<"button">;

const IconButton = ({ icon: Icon, label, className, ...props }: Props) => {
  return (
    <button
      type="button"
      aria-label={label}
      className={classNames(
        "peer flex select-none items-center gap-2 rounded border border-slate-600 p-1.5 hover:bg-slate-600",
        className
      )}
      {...props}
    >
      {<Icon className="h-4 w-4 text-white" />}
    </button>
  );
};

export default IconButton;
