import {
  Select as AriaKitSelect,
  SelectArrow,
  SelectItem,
  SelectPopover,
  SelectState,
  useSelectState,
} from "ariakit/select";

type Props = {
  value?: string;
  setValue?: (value: string) => void;
  options: { value: string; label: string }[];
};

const Select = ({ value, setValue, options }: Props) => {
  const state = useSelectState({
    defaultValue: value ? value : options[0]?.value,
    value,
    setValue,
  });

  return (
    <div className="flex flex-grow">
      <AriaKitSelect
        state={state}
        className="flex flex-grow appearance-none items-center justify-between rounded border border-slate-600 dark:bg-gray-800 px-2.5 py-2 text-sm dark:text-white"
      >
        {options.find((option) => option.value === state.value)?.label}
        <SelectArrow />
      </AriaKitSelect>
      <SelectPopover
        state={state}
        className="w-[var(--popover-anchor-width)] rounded border border-slate-600 dark:bg-gray-800 bg-slate-100 p-1"
      >
        {options.map(({ value, label }) => (
          <SelectItem
            value={value}
            key={value}
            className="cursor-pointer rounded px-2.5 py-1.5 hover:bg-gray-700 hover:text-white [&[data-active-item]]:bg-gray-700 [&[data-active-item]]:text-white"
          >
            {label}
          </SelectItem>
        ))}
      </SelectPopover>
    </div>
  );
};

export default Select;
