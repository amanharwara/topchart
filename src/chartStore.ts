import { nanoid } from "nanoid";
import { createLocalStore } from "./utils";

export const ChartTypes = {
  "music-collage": "Music Collage",
} as const;

export type ChartType = keyof typeof ChartTypes;

export type ChartRowColumnRange = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export type Chart = {
  id: string;
  title: string;
  type: ChartType;
  rows: ChartRowColumnRange;
  columns: ChartRowColumnRange;
};

const [charts, setCharts] = createLocalStore<Chart[]>("charts", [
  {
    id: nanoid(),
    title: "Untitled",
    type: "music-collage",
    rows: 3,
    columns: 3,
  },
]);

export { charts, setCharts };

/**
 * @return ID of added chart
 */
export const addNewChart = () => {
  const id = nanoid();

  const newChart: Chart = {
    id,
    title: `Untitled ${charts.length + 1}`,
    type: "music-collage",
    rows: 3,
    columns: 3,
  };

  setCharts(charts.length, newChart);

  return id;
};

export const editChartTitle = (id: string, title: string) => {
  setCharts((chart) => chart.id === id, "title", title);
};

export const changeChartType = (id: string, type: ChartType) => {
  setCharts((chart) => chart.id === id, "type", type);
};

export const changeChartRowsOrColumns = (
  id: string,
  selector: "rows" | "columns",
  value: ChartRowColumnRange
) => {
  setCharts((chart) => chart.id === id, selector, value);
};
