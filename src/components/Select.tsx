import {
  Select as AriaKitSelect,
  PopoverArrow,
  SelectArrow,
  SelectItem,
  SelectPopover,
  useSelectStore,
} from "@ariakit/react";

type Props<Value> = {
  value?: Value;
  setValue?: (value: Value) => void;
  options: { value: Value; label: string }[];
};

function Select<Value extends string>({
  value,
  setValue,
  options,
}: Props<Value>) {
  const state = useSelectStore({
    defaultValue: value ? value : options[0]?.value,
    value,
    setValue,
  });

  return (
    <div className="flex flex-grow">
      <AriaKitSelect
        store={state}
        className="flex flex-grow appearance-none items-center justify-between rounded border border-slate-600 dark:bg-gray-800 px-2.5 py-2 text-sm dark:text-white"
      >
        {options.find((option) => option.value === value)?.label}
        <SelectArrow />
      </AriaKitSelect>
      <SelectPopover
        store={state}
        className="w-[--popover-anchor-width] rounded border border-slate-600 dark:bg-gray-800 bg-slate-100 p-1"
        portal={true}
      >
        <PopoverArrow className="hidden" />
        {options.map(({ value, label }) => (
          <SelectItem
            value={value}
            key={value}
            className="cursor-pointer rounded px-2.5 py-1.5 dark:text-white hover:bg-gray-700 hover:text-white [&[data-active-item]]:bg-gray-700 [&[data-active-item]]:text-white"
          >
            {label}
          </SelectItem>
        ))}
      </SelectPopover>
    </div>
  );
}

export default Select;
