import { Component, ComponentProps, For, splitProps } from "solid-js";
import classNames from "../utils/classNames";

const RadioButton: Component<ComponentProps<"input">> = (props) => {
  const [labelProps, inputProps] = splitProps(props, ["children"]);

  return (
    <label
      class={classNames(
        "focus-within-ring flex-grow py-1.5 text-center",
        props.checked && "bg-slate-600"
      )}
    >
      <input
        type="radio"
        class="m-0 appearance-none focus:ring-0 focus:ring-offset-0"
        {...inputProps}
      />
      {labelProps.children}
    </label>
  );
};

type Props = {
  items: { label: string; value: string }[];
  name: string;
  value: string;
  onChange: (value: string) => void;
};

export const RadioButtonGroup: Component<Props> = (props) => {
  return (
    <div class="flex divide-x divide-slate-600 rounded border border-slate-600">
      <For each={props.items}>
        {(item) => (
          <RadioButton
            name={props.name}
            checked={item.value === props.value}
            onChange={(event) => {
              if (event.currentTarget.checked) {
                props.onChange(item.value);
              }
            }}
          >
            {item.label}
          </RadioButton>
        )}
      </For>
    </div>
  );
};
