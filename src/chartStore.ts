import { nanoid } from "nanoid";
import { createLocalStore } from "./utils";

export type Chart = { id: string; title: string };

const [charts, setCharts] = createLocalStore<Chart[]>("charts", [
  { id: nanoid(), title: "Untitled" },
]);

const addChart = (chart: Chart) => setCharts(charts.length, chart);

const editChartTitle = (id: string, title: string) => {
  setCharts(
    (chart) => chart.id === id,
    (chart) => ({
      ...chart,
      title,
    })
  );
};

export { charts, setCharts, addChart, editChartTitle };
