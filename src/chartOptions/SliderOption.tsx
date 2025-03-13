import {
  Label,
  Slider,
  SliderOutput,
  SliderThumb,
  SliderTrack,
} from "react-aria-components";

export function SliderOption({
  label,
  value,
  onChange,
  min,
  max,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
}) {
  return (
    <Slider
      className="flex flex-col gap-2.5"
      minValue={min}
      maxValue={max}
      value={value}
      onChange={onChange}
    >
      <div className="flex justify-between items-center">
        <Label className="text-lg font-semibold">{label}</Label>
        <SliderOutput />
      </div>
      <SliderTrack className="relative h-6 focus-within-ring">
        {({ state }) => (
          <>
            <div className="absolute h-1 top-1/2 -translate-y-1/2 w-full rounded-full bg-slate-700 dark:bg-white" />
            <div
              className="absolute h-1 top-1/2 -translate-y-1/2 rounded-full bg-blue-500"
              style={{
                width: state.getThumbPercent(0) * 100 + "%",
              }}
            />
            <SliderThumb className="top-1/2 flex items-center justify-center w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-700 border-2 dark:border-white border-slate-700" />
          </>
        )}
      </SliderTrack>
    </Slider>
  );
}
