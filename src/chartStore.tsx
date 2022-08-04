import { nanoid } from "nanoid";
import { createSignal } from "solid-js";
import { addToast, dismissToast } from "./components/Toasts";
import { createLocalStore } from "./utils";

export type ChartType = "music-collage";

export type MusicCollageSpacing = "none" | "small" | "medium" | "large";

export type Chart = {
  id: string;
  title: string;
  type: ChartType;
  options: {
    "music-collage": {
      rows: number;
      columns: number;
      gap: MusicCollageSpacing;
      padding: MusicCollageSpacing;
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
      gap: "small",
      padding: "small",
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
  addToast({
    type: "error",
    message: `Deleted chart "${chartToBeDeleted.title}"`,
    actions: [
      {
        label: "Undo",
        onClick: (toast) => {
          dismissToast(toast.id);
          setCharts(charts.length, chartToBeDeleted);
          setSelectedChart(chartToBeDeleted);
        },
      },
    ],
  });
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

export const changeMusicCollageGap = (
  id: string,
  value: MusicCollageSpacing
) => {
  setCharts(
    (charts) => charts.id === id,
    "options",
    "music-collage",
    "gap",
    value
  );
};

export const changeMusicCollagePadding = (
  id: string,
  value: MusicCollageSpacing
) => {
  setCharts(
    (charts) => charts.id === id,
    "options",
    "music-collage",
    "padding",
    value
  );
};
