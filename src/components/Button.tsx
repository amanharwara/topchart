import { ComponentPropsWithoutRef, forwardRef, ReactNode, Ref } from "react";
import { IconType } from "../icons";
import classNames from "../utils/classNames";
import Icon from "./Icon";

type Props = {
  children: ReactNode;
  hideLabelOnMobile?: boolean;
  icon?: IconType;
} & ComponentPropsWithoutRef<"button">;

const Button = forwardRef(
  (
    { children, hideLabelOnMobile = true, icon, ...props }: Props,
    ref: Ref<HTMLButtonElement>
  ) => {
    return (
      <button
        className={classNames(
          "flex items-center gap-1.5 rounded border border-solid border-slate-600 text-white hover:bg-slate-600",
          hideLabelOnMobile ? "p-1.5 md:px-2 md:py-1.5" : "px-2 py-1.5"
        )}
        ref={ref}
        {...props}
      >
        {icon ? <Icon className="h-4 w-4" icon={icon} /> : null}
        <span
          className={classNames(
            "text-xs font-semibold",
            hideLabelOnMobile && "hidden md:inline"
          )}
        >
          {children}
        </span>
      </button>
    );
  }
);

export default Button;
