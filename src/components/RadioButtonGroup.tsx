import {
  VisuallyHidden,
  Radio,
  RadioGroup,
  useRadioStore,
} from "@ariakit/react";
import classNames from "../utils/classNames";

type Props<Value> = {
  items: { label: string; value: Value }[];
  value: Value;
  onChange: (value: Value) => void;
};

function RadioButtonGroup<Value extends string>({
  value,
  items,
  onChange,
}: Props<Value>) {
  const radio = useRadioStore({
    value,
    orientation: "horizontal",
    setValue(value) {
      onChange(value as Value);
    },
  });

  return (
    <RadioGroup
      store={radio}
      className="flex divide-x divide-slate-600 rounded border border-slate-600"
    >
      {items.map(({ label, value: itemValue }) => (
        <label
          className={classNames(
            "focus-within-ring flex-grow select-none py-1.5 text-center",
            itemValue === value && "bg-slate-600 text-white"
          )}
          key={itemValue}
        >
          <VisuallyHidden>
            <Radio value={itemValue} />
          </VisuallyHidden>
          {label}
        </label>
      ))}
    </RadioGroup>
  );
}

export default RadioButtonGroup;
