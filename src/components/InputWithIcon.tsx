import { Component, ComponentProps, JSX, splitProps } from "solid-js";

const InputWithIcon: Component<
  {
    icon: Component<JSX.IntrinsicElements["svg"]>;
  } & ComponentProps<"input">
> = (props) => {
  const [, inputProps] = splitProps(props, ["icon"]);

  return (
    <div class="flex flex-grow rounded border border-slate-600">
      <div class="flex items-center border-r border-slate-600 px-2.5 py-2">
        {<props.icon class="h-4 w-4" />}
      </div>
      <input
        class="flex-grow bg-transparent px-2.5 py-2 text-sm placeholder:text-slate-400"
        {...inputProps}
      />
    </div>
  );
};

export default InputWithIcon;
