import { ComponentPropsWithoutRef, ComponentType } from "react";
import classNames from "../utils/classNames";

type Props = {
  hideLabelOnMobile?: boolean;
  icon?: ComponentType<ComponentPropsWithoutRef<"svg">>;
} & ComponentPropsWithoutRef<"button">;

const Button = ({
  hideLabelOnMobile,
  className,
  icon: Icon,
  ...props
}: Props) => (
  <button
    type="button"
    className={classNames(
      "flex items-center gap-1.5 rounded border border-solid border-slate-600 dark:text-white hover:bg-slate-600 hover:text-white",
      hideLabelOnMobile ? "p-1.5 md:px-2 md:py-1.5" : "px-2 py-1.5",
      className
    )}
    {...props}
  >
    {Icon ? <Icon className="h-4 w-4" /> : null}
    <span
      className={classNames(
        "text-xs font-semibold",
        hideLabelOnMobile && "hidden md:inline"
      )}
    >
      {props.children}
    </span>
  </button>
);

export default Button;
