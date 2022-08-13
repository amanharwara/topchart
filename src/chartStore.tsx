import { nanoid } from "nanoid";
import { createEffect, createSignal } from "solid-js";
import { addToast, dismissToast } from "./components/Toasts";
import { createLocalStore } from "./utils";

export type ChartType = "musicCollage";

export type MusicCollageSpacing = "none" | "small" | "medium" | "large";

export type MusicCollageItem = {
  image: string | null;
  title: string;
};

type MusicCollageBackgroundType = "image" | "color";

export type Chart = {
  id: string;
  title: string;
  type: ChartType;
  options: {
    musicCollage: {
      rows: number;
      columns: number;
      gap: MusicCollageSpacing;
      padding: MusicCollageSpacing;
      items: MusicCollageItem[][];
      backgroundType: MusicCollageBackgroundType;
      background: Record<MusicCollageBackgroundType, string>;
      foreground: {
        font: string;
        color: string;
      };
      titles: {
        show: boolean;
        positionBelowCover: boolean;
        allowEditing: boolean;
      };
    };
  };
};

const getNewChartWithDefaults = (id?: string, title?: string): Chart => ({
  id: id ?? nanoid(),
  title: title ?? "Untitled",
  type: "musicCollage",
  options: {
    musicCollage: {
      rows: 3,
      columns: 3,
      gap: "small",
      padding: "small",
      items: new Array(10).fill(
        new Array(10).fill(null).map(() => ({
          title: "",
          image: null,
        }))
      ),
      backgroundType: "color",
      background: {
        image: "",
        color: "#000000",
      },
      foreground: {
        font: "Inter",
        color: "#FFFFFF",
      },
      titles: {
        show: false,
        positionBelowCover: false,
        allowEditing: false,
      },
    },
  },
});

const [charts, setCharts] = createLocalStore<Chart[]>("charts", []);

createEffect(() => {
  if (charts.length < 1) {
    setCharts([getNewChartWithDefaults()]);
  }
});

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
    "musicCollage",
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
    "musicCollage",
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
    "musicCollage",
    "padding",
    value
  );
};

export const setMusicCollageItemImage = (
  chartId: string,
  rowIndex: number,
  itemIndex: number,
  image: string
) => {
  setCharts(
    (chart) => chart.id === chartId,
    "options",
    "musicCollage",
    "items",
    rowIndex,
    itemIndex,
    "image",
    image
  );
};

export const setMusicCollageItem = (
  chartId: string,
  rowIndex: number,
  itemIndex: number,
  item: MusicCollageItem
) => {
  setCharts(
    (chart) => chart.id === chartId,
    "options",
    "musicCollage",
    "items",
    rowIndex,
    itemIndex,
    item
  );
};

export const setMusicCollageBackgroundType = (
  id: string,
  type: MusicCollageBackgroundType
) => {
  setCharts(
    (chart) => chart.id === id,
    "options",
    "musicCollage",
    "backgroundType",
    type
  );
};

export const setMusicCollageBackground = (
  id: string,
  type: MusicCollageBackgroundType,
  value: string
) => {
  setCharts(
    (chart) => chart.id === id,
    "options",
    "musicCollage",
    "background",
    type,
    value
  );
};

export const setMusicCollageForegroundColor = (id: string, value: string) => {
  setCharts(
    (chart) => chart.id === id,
    "options",
    "musicCollage",
    "foreground",
    "color",
    value
  );
};

export const setMusicCollageFont = (id: string, value: string) => {
  setCharts(
    (chart) => chart.id === id,
    "options",
    "musicCollage",
    "foreground",
    "font",
    value
  );
};
