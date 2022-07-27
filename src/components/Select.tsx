import {
  Component,
  ComponentProps,
  createSignal,
  For,
  splitProps,
} from "solid-js";
import CaretDownIcon from "./icons/CaretDownIcon";

type SelectProps = Omit<ComponentProps<"select">, "value" | "onChange">;

type Props = SelectProps & {
  value?: string;
  initialValue?: string;
  onChange?: (value: string) => void;
  options: {
    value: string;
    label: string;
  }[];
};

const Select: Component<Props> = (props) => {
  const [, selectProps] = splitProps(props, [
    "value",
    "initialValue",
    "onChange",
    "options",
  ]);

  const [value, setValue] = createSignal<string>(
    props.initialValue ?? props.options[0].value
  );

  const currentValue = () => (!props.value ? value() : props.value);

  return (
    <div class="relative flex flex-grow">
      <select
        class="flex-grow appearance-none rounded border border-slate-600 bg-gray-800 px-2.5 py-2 text-sm text-white"
        value={currentValue()}
        onChange={(event) => {
          setValue(event.currentTarget.value);
          props.onChange?.(event.currentTarget.value);
        }}
        {...selectProps}
      >
        <For each={props.options}>
          {(option) => <option value={option.value}>{option.label}</option>}
        </For>
      </select>
      <CaretDownIcon class="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-white" />
    </div>
  );
};

export default Select;
