import { ComponentProps } from "solid-js";
import classNames from "../utils/classNames";

const Input = (props: ComponentProps<"input">) => (
  <input
    {...props}
    class={classNames(
      "flex-grow rounded border border-slate-600 bg-transparent px-2.5 py-2 text-sm placeholder:text-slate-400",
      props.class
    )}
  />
);

export default Input;
