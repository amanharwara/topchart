import * as slider from "@zag-js/slider";
import { useMachine, normalizeProps } from "@zag-js/react";
import { useId } from "react";

const SliderOption = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) => {
  const [state, send] = useMachine(
    slider.machine({
      id: useId(),
      value,
      onChange: ({ value }) => onChange(value),
      min: 1,
      max: 10,
    })
  );

  const api = slider.connect(state, send, normalizeProps);

  return (
    <div {...api.rootProps} className="flex flex-col gap-2.5">
      <div className="flex justify-between items-center">
        <label className="text-lg font-semibold" {...api.labelProps}>
          {label}
        </label>
        <output {...api.outputProps}>{api.value}</output>
      </div>
      <div
        className="select-none touch-none relative flex items-center py-2.5"
        {...api.controlProps}
      >
        <div
          className="relative h-1 rounded-full flex-1 bg-slate-700 dark:bg-white"
          {...api.trackProps}
        >
          <div
            className="absolute bg-blue-500 h-1 rounded-full"
            style={{
              left: "var(--slider-range-start)",
              right: "var(--slider-range-end)",
            }}
            {...api.rangeProps}
          />
        </div>
        <div
          {...api.thumbProps}
          className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-700 border-2 dark:border-white border-slate-700"
        >
          <input {...api.hiddenInputProps} />
        </div>
      </div>
    </div>
  );
};

export default SliderOption;
