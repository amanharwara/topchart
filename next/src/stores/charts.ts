import create from "zustand";
import { persist } from "zustand/middleware";
import { nanoid } from "nanoid";

export type ChartType = "musicCollage";

export type MusicCollageSpacing = "none" | "small" | "medium" | "large";

export type MusicCollageItem = {
  image: string | null;
  title: string;
};

type MusicCollageBackgroundType = "image" | "color";

export type MusicCollageFontStyle = "sans" | "serif" | "mono" | "custom";

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
      items: MusicCollageItem[];
      backgroundType: MusicCollageBackgroundType;
      background: Record<MusicCollageBackgroundType, string>;
      fontStyle: MusicCollageFontStyle;
      fontFamily: string;
      foregroundColor: string;
      titles: {
        show: boolean;
        positionBelowCover: boolean;
        allowEditing: boolean;
      };
    };
  };
};

interface ChartStore {
  selectedChartId: Chart["id"];
  charts: Chart[];
  addNewChart: (chart: Chart) => void;
  setMusicCollageItem: (index: number, item: MusicCollageItem) => void;
  setMusicCollageRows: (rows: number) => void;
  setMusicCollageColumns: (columns: number) => void;
  setShowMusicCollageAlbumTitles: (show: boolean) => void;
}

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
      items: new Array(10).fill(null).map(() => ({
        title: "",
        image: null,
      })),
      backgroundType: "color",
      background: {
        image: "",
        color: "#000000",
      },
      fontStyle: "sans",
      fontFamily: "Inter",
      foregroundColor: "#FFFFFF",
      titles: {
        show: false,
        positionBelowCover: false,
        allowEditing: false,
      },
    },
  },
});

const useChartStore = create<ChartStore>()(
  persist(
    (set) => ({
      selectedChartId: "initial",

      charts: [getNewChartWithDefaults("initial")],
      addNewChart: () => {
        set((state) => ({
          charts: [...state.charts, getNewChartWithDefaults()],
        }));
      },

      setMusicCollageItem: (index: number, item: MusicCollageItem) => {
        set((state) => ({
          charts: state.charts.map((chart) =>
            chart.id === state.selectedChartId
              ? {
                  ...chart,
                  options: {
                    ...chart.options,
                    musicCollage: {
                      ...chart.options.musicCollage,
                      items: chart.options.musicCollage.items.map(
                        (currentItem, itemIndex) =>
                          itemIndex === index ? item : currentItem
                      ),
                    },
                  },
                }
              : chart
          ),
        }));
      },

      setMusicCollageRows: (rows: number) =>
        set((state) => ({
          charts: state.charts.map((chart) =>
            chart.id === state.selectedChartId
              ? {
                  ...chart,
                  options: {
                    ...chart.options,
                    musicCollage: {
                      ...chart.options.musicCollage,
                      rows,
                    },
                  },
                }
              : chart
          ),
        })),

      setMusicCollageColumns: (columns: number) =>
        set((state) => ({
          charts: state.charts.map((chart) =>
            chart.id === state.selectedChartId
              ? {
                  ...chart,
                  options: {
                    ...chart.options,
                    musicCollage: {
                      ...chart.options.musicCollage,
                      columns,
                    },
                  },
                }
              : chart
          ),
        })),

      setShowMusicCollageAlbumTitles: (show: boolean) => {
        set((state) => ({
          charts: state.charts.map((chart) =>
            chart.id === state.selectedChartId
              ? {
                  ...chart,
                  options: {
                    ...chart.options,
                    musicCollage: {
                      ...chart.options.musicCollage,
                      titles: {
                        ...chart.options.musicCollage.titles,
                        show,
                      },
                    },
                  },
                }
              : chart
          ),
        }));
      },
    }),
    {
      name: "charts",
    }
  )
);

export const useSelectedChart = () =>
  useChartStore((s) => s.charts.find((c) => c.id === s.selectedChartId));

export const useSelectedChartRows = (): [
  number | undefined,
  (rows: number) => void
] =>
  useChartStore((s) => [
    s.charts.find((c) => c.id === s.selectedChartId)?.options.musicCollage.rows,
    s.setMusicCollageRows,
  ]);

export const useSelectedChartColumns = (): [
  number | undefined,
  (columns: number) => void
] =>
  useChartStore((s) => [
    s.charts.find((c) => c.id === s.selectedChartId)?.options.musicCollage
      .columns,
    s.setMusicCollageColumns,
  ]);

export const useSelectedChartShowAlbumTitles = (): [
  boolean | undefined,
  (show: boolean) => void
] =>
  useChartStore((s) => [
    s.charts.find((c) => c.id === s.selectedChartId)?.options.musicCollage
      .titles.show,
    s.setShowMusicCollageAlbumTitles,
  ]);

export const useAddChart = () => useChartStore((s) => s.addNewChart);

export const useSetMusicCollageItem = () =>
  useChartStore((s) => s.setMusicCollageItem);

export const getMusicCollageItem = (index: number) => {
  const state = useChartStore.getState();

  return state.charts.find((c) => c.id === state.selectedChartId)?.options
    .musicCollage.items[index];
};
