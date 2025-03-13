import classNames from "../utils/classNames";
import {
  Button,
  ListBox,
  ListBoxItem,
  Popover,
  Select as RacSelect,
  SelectProps,
  SelectValue,
} from "react-aria-components";
import CaretDownIcon from "../icons/CaretDownIcon";

type Props = {
  value?: string;
  setValue?: (value: string) => void;
  options: { value: string; label: string }[];
  wrapperClassName?: string;
  selectClassName?: string;
  popoverClassName?: string;
} & SelectProps;

export function Select({
  value,
  setValue,
  options,
  wrapperClassName,
  selectClassName,
  popoverClassName,
  ...props
}: Props) {
  return (
    <RacSelect
      className={classNames(
        "focus-within-ring group/select flex flex-grow overflow-hidden",
        wrapperClassName
      )}
      selectedKey={value}
      onSelectionChange={(v) => {
        setValue?.(v as string);
      }}
      {...props}
    >
      <Button
        className={classNames(
          "flex flex-grow appearance-none items-center justify-between rounded border border-slate-600 dark:bg-gray-800 px-2.5 py-2 text-sm dark:text-white overflow-hidden whitespace-nowrap",
          selectClassName
        )}
      >
        <span className="overflow-hidden text-ellipsis">
          <SelectValue />
        </span>
        <CaretDownIcon className="w-4 h-4 group-data-[open=true]/select:rotate-180" />
      </Button>
      <Popover
        offset={2}
        className={classNames(
          "w-[--trigger-width] rounded border border-slate-600 dark:bg-gray-800 bg-slate-100 p-1",
          popoverClassName
        )}
      >
        <ListBox>
          {options.map(({ value, label }) => (
            <ListBoxItem
              id={value}
              key={value}
              className="cursor-pointer rounded px-2.5 py-1.5 dark:text-white hover:bg-gray-700 hover:text-white [&[data-active-item]]:bg-gray-700 [&[data-active-item]]:text-white"
            >
              {label}
            </ListBoxItem>
          ))}
        </ListBox>
      </Popover>
    </RacSelect>
  );
}
