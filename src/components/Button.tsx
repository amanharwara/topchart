import {
  ComponentPropsWithoutRef,
  ComponentType,
  ForwardedRef,
  forwardRef,
  ReactNode,
} from "react";
import classNames from "../utils/classNames";
import { ButtonProps, Button as RacButton } from "react-aria-components";

type Props = {
  hideLabelOnMobile?: boolean;
  icon?: ComponentType<ComponentPropsWithoutRef<"svg">>;
  children: ReactNode;
  onClick?: () => void;
} & Omit<ButtonProps, "children">;

const Button = forwardRef(function Button(
  { hideLabelOnMobile, className, icon: Icon, onClick, ...props }: Props,
  ref: ForwardedRef<HTMLButtonElement>
) {
  return (
    <RacButton
      type="button"
      className={classNames(
        "flex items-center gap-1.5 rounded border border-solid border-slate-600 dark:text-white focus:bg-slate-600 focus:text-white hover:bg-slate-600 hover:text-white",
        hideLabelOnMobile ? "p-1.5 md:px-2 md:py-1.5" : "px-2 py-1.5",
        className
      )}
      ref={ref}
      onPress={onClick}
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
    </RacButton>
  );
});

export default Button;
