import { ComponentPropsWithoutRef, ForwardedRef, forwardRef } from "react";
import classNames from "../utils/classNames";

const Input = forwardRef(function Input(
  { className, disabled, ...props }: ComponentPropsWithoutRef<"input">,
  ref: ForwardedRef<HTMLInputElement>
) {
  return (
    <input
      {...props}
      disabled={disabled}
      className={classNames(
        "flex-grow rounded border border-slate-600 bg-transparent px-2.5 py-2 text-sm",
        disabled
          ? "cursor-not-allowed border-gray-500 text-gray-400 placeholder:text-gray-400"
          : "border-slate-600 dark:text-white dark:placeholder:text-slate-400 placeholder:text-slate-600",
        className
      )}
      ref={ref}
    />
  );
});

export default Input;
