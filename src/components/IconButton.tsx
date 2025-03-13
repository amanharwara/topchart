import {
  ComponentPropsWithoutRef,
  ComponentType,
  ForwardedRef,
  forwardRef,
} from "react";
import classNames from "../utils/classNames";
import { Button, ButtonProps } from "react-aria-components";

type Props = {
  icon: ComponentType<ComponentPropsWithoutRef<"svg">>;
  label: string;
  className?: string;
  iconClassName?: string;
  disabled?: boolean;
  onClick?: ButtonProps["onPress"];
} & ButtonProps;

const IconButton = forwardRef(function IconButton(
  {
    icon: Icon,
    label,
    className,
    iconClassName,
    disabled,
    onClick,
    ...props
  }: Props,
  ref: ForwardedRef<HTMLButtonElement>
) {
  return (
    <Button
      aria-label={label}
      className={classNames(
        "peer flex select-none items-center gap-2 rounded border p-1.5",
        disabled
          ? "cursor-not-allowed border-gray-500 text-gray-400"
          : "border-slate-600 hover:bg-slate-600 dark:text-white hover:text-white",
        className
      )}
      isDisabled={disabled}
      ref={ref}
      onPress={onClick}
      {...props}
    >
      <Icon
        className={classNames(
          "h-4 w-4 select-none pointer-events-none",
          iconClassName
        )}
      />
    </Button>
  );
});

export default IconButton;
