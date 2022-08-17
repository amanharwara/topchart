import { ComponentPropsWithoutRef } from "react";
import classNames from "../utils/classNames";

const Input = ({ className, ...props }: ComponentPropsWithoutRef<"input">) => (
  <input
    {...props}
    className={classNames(
      "flex-grow rounded border border-slate-600 bg-transparent px-2.5 py-2 text-sm placeholder:text-slate-400",
      className
    )}
  />
);

export default Input;
