import { nanoid } from "nanoid";
import { createSignal } from "solid-js";
import toast from "solid-toast";
import ErrorIcon from "./components/icons/ErrorIcon";
import { createLocalStore } from "./utils";
import classNames from "./utils/classNames";

export type ChartType = "music-collage";

export type Chart = {
  id: string;
  title: string;
  type: ChartType;
  options: {
    "music-collage": {
      rows: number;
      columns: number;
    };
  };
};

const getNewChartWithDefaults = (id?: string, title?: string): Chart => ({
  id: id ?? nanoid(),
  title: title ?? "Untitled",
  type: "music-collage",
  options: {
    "music-collage": {
      rows: 3,
      columns: 3,
    },
  },
});

const [charts, setCharts] = createLocalStore<Chart[]>("charts", [
  getNewChartWithDefaults(),
]);

const [selectedChart, setSelectedChart] = createSignal<Chart>(charts[0]);

export { charts, setCharts, selectedChart, setSelectedChart };

/**
 * @return ID of added chart
 */
export const addNewChart = () => {
  const id = nanoid();

  const newChart: Chart = getNewChartWithDefaults(
    id,
    `Untitled ${charts.length + 1}`
  );

  setCharts(charts.length, newChart);

  return id;
};

export const editChartTitle = (id: string, title: string) => {
  setCharts((chart) => chart.id === id, "title", title);
};

export const changeChartType = (id: string, type: ChartType) => {
  setCharts((chart) => chart.id === id, "type", type);
};

export const deleteChart = (id: string) => {
  const chartToBeDeleted = charts.find((chart) => chart.id === id);
  setCharts((charts) => charts.filter((chart) => chart.id !== id));
  toast.custom(
    (currentToast) => {
      return (
        <div
          class={classNames(
            "flex items-center gap-2.5 rounded bg-slate-700 py-2.5 px-3.5 text-sm text-white",
            "transition-opacity duration-100",
            currentToast.visible ? "opacity-100" : "opacity-0"
          )}
        >
          <div class="rounded-full bg-white">
            <ErrorIcon class="h-6 w-6 text-red-600" />
          </div>
          Deleted chart "{chartToBeDeleted.title}"
          <button
            class="rounded bg-slate-600 p-1 px-1.5 hover:bg-slate-500"
            onClick={() => {
              toast.dismiss(currentToast.id);
              setCharts(charts.length, chartToBeDeleted);
              setSelectedChart(chartToBeDeleted);
            }}
          >
            Undo
          </button>
        </div>
      );
    },
    {
      duration: 6000,
    }
  );
  setSelectedChart(charts[0]);
};

export const changeChartRowsOrColumns = (
  id: string,
  selector: "rows" | "columns",
  value: number
) => {
  setCharts(
    (chart) => chart.id === id,
    "options",
    "music-collage",
    selector,
    value
  );
};
