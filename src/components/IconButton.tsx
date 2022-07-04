import { ComponentPropsWithoutRef, forwardRef, ReactNode, Ref } from "react";
import type { IconType } from "../icons";
import classNames from "../utils/classNames";
import Icon from "./Icon";

type Props = {
  icon: IconType;
  label: string;
  className?: string;
} & ComponentPropsWithoutRef<"button">;

const IconButton = forwardRef(
  (
    { icon, label, className, ...props }: Props,
    ref: Ref<HTMLButtonElement>
  ) => (
    <button
      aria-label={label}
      className={classNames(
        "flex items-center gap-2 rounded border border-slate-600 p-1.5 hover:bg-slate-600",
        className
      )}
      ref={ref}
      {...props}
    >
      <Icon icon={icon} className="h-4 w-4 text-white" />
    </button>
  )
);

export default IconButton;
