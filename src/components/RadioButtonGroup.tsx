import { Radio, RadioGroup, RadioGroupProps } from "react-aria-components";
import classNames from "../utils/classNames";

type Props = {
  items: { label: string; value: string }[];
  value: string;
  onChange: (value: string) => void;
} & Omit<RadioGroupProps, "value" | "onChange">;

export function RadioButtonGroup({ value, items, onChange, ...props }: Props) {
  return (
    <RadioGroup
      value={value}
      onChange={onChange}
      className="flex divide-x divide-slate-600 rounded border border-slate-600"
      {...props}
    >
      {items.map(({ label, value: itemValue }) => (
        <Radio
          value={itemValue}
          key={itemValue}
          className={classNames(
            "focus-within-ring flex-grow select-none py-1.5 text-center",
            itemValue === value && "bg-slate-600 text-white"
          )}
        >
          {label}
        </Radio>
      ))}
    </RadioGroup>
  );
}
