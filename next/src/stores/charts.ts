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
      backgroundColor: string;
      backgroundImage: string;
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
  addNewChart: () => void;

  setMusicCollageItem: (index: number, item: MusicCollageItem) => void;
  setMusicCollageRows: (rows: number) => void;
  setMusicCollageColumns: (columns: number) => void;
  setMusicCollageGap: (gap: MusicCollageSpacing) => void;
  setMusicCollagePadding: (gap: MusicCollageSpacing) => void;
  setShowMusicCollageAlbumTitles: (show: boolean) => void;
  setPositionMusicCollageTitlesBelowCover: (
    positionBelowCover: boolean
  ) => void;
  setAllowEditingMusicCollageTitles: (allowEditing: boolean) => void;
  setMusicCollageBackgroundType: (
    backgroundType: MusicCollageBackgroundType
  ) => void;
  setMusicCollageBackgroundImage: (image: string) => void;
  setMusicCollageBackgroundColor: (color: string) => void;
  setMusicCollageFontStyle: (fontStyle: MusicCollageFontStyle) => void;
  setMusicCollageFontFamily: (fontFamily: string) => void;
  setMusicCollageForegroundColor: (color: string) => void;

  musicCollageEditingTitleFor: number;
  setMusicCollageEditingTitleFor: (itemIndex: number) => void;
}

const MaxNumberOfRows = 10;
const MaxNumberOfColumns = 10;

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
      items: new Array(MaxNumberOfRows * MaxNumberOfColumns)
        .fill(null)
        .map(() => ({
          title: "",
          image: null,
        })),
      backgroundType: "color",
      backgroundColor: "#000000",
      backgroundImage: "",
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

      setMusicCollageGap: (gap: MusicCollageSpacing) =>
        set((state) => ({
          charts: state.charts.map((chart) =>
            chart.id === state.selectedChartId
              ? {
                  ...chart,
                  options: {
                    ...chart.options,
                    musicCollage: {
                      ...chart.options.musicCollage,
                      gap,
                    },
                  },
                }
              : chart
          ),
        })),

      setMusicCollagePadding: (padding: MusicCollageSpacing) =>
        set((state) => ({
          charts: state.charts.map((chart) =>
            chart.id === state.selectedChartId
              ? {
                  ...chart,
                  options: {
                    ...chart.options,
                    musicCollage: {
                      ...chart.options.musicCollage,
                      padding,
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

      setPositionMusicCollageTitlesBelowCover: (
        positionBelowCover: boolean
      ) => {
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
                        positionBelowCover,
                      },
                    },
                  },
                }
              : chart
          ),
        }));
      },

      setAllowEditingMusicCollageTitles: (allowEditing: boolean) => {
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
                        allowEditing,
                      },
                    },
                  },
                }
              : chart
          ),
        }));
      },

      setMusicCollageBackgroundType: (
        backgroundType: MusicCollageBackgroundType
      ) => {
        set((state) => ({
          charts: state.charts.map((chart) =>
            chart.id === state.selectedChartId
              ? {
                  ...chart,
                  options: {
                    ...chart.options,
                    musicCollage: {
                      ...chart.options.musicCollage,
                      backgroundType,
                    },
                  },
                }
              : chart
          ),
        }));
      },

      setMusicCollageBackgroundColor: (backgroundColor: string) => {
        set((state) => ({
          charts: state.charts.map((chart) =>
            chart.id === state.selectedChartId
              ? {
                  ...chart,
                  options: {
                    ...chart.options,
                    musicCollage: {
                      ...chart.options.musicCollage,
                      backgroundColor,
                    },
                  },
                }
              : chart
          ),
        }));
      },

      setMusicCollageBackgroundImage: (backgroundImage: string) => {
        set((state) => ({
          charts: state.charts.map((chart) =>
            chart.id === state.selectedChartId
              ? {
                  ...chart,
                  options: {
                    ...chart.options,
                    musicCollage: {
                      ...chart.options.musicCollage,
                      backgroundImage,
                    },
                  },
                }
              : chart
          ),
        }));
      },

      setMusicCollageFontStyle: (fontStyle: MusicCollageFontStyle) => {
        set((state) => ({
          charts: state.charts.map((chart) =>
            chart.id === state.selectedChartId
              ? {
                  ...chart,
                  options: {
                    ...chart.options,
                    musicCollage: {
                      ...chart.options.musicCollage,
                      fontStyle,
                    },
                  },
                }
              : chart
          ),
        }));
      },

      setMusicCollageFontFamily: (fontFamily: string) => {
        set((state) => ({
          charts: state.charts.map((chart) =>
            chart.id === state.selectedChartId
              ? {
                  ...chart,
                  options: {
                    ...chart.options,
                    musicCollage: {
                      ...chart.options.musicCollage,
                      fontFamily,
                    },
                  },
                }
              : chart
          ),
        }));
      },

      setMusicCollageForegroundColor: (foregroundColor: string) => {
        set((state) => ({
          charts: state.charts.map((chart) =>
            chart.id === state.selectedChartId
              ? {
                  ...chart,
                  options: {
                    ...chart.options,
                    musicCollage: {
                      ...chart.options.musicCollage,
                      foregroundColor,
                    },
                  },
                }
              : chart
          ),
        }));
      },

      musicCollageEditingTitleFor: -1,
      setMusicCollageEditingTitleFor(itemIndex) {
        set(() => ({
          musicCollageEditingTitleFor: itemIndex,
        }));
      },
    }),
    {
      name: "charts",
      partialize: (state) =>
        Object.fromEntries(
          Object.entries(state).filter(
            ([key]) => !["musicCollageEditingTitleFor"].includes(key)
          )
        ),
    }
  )
);

export const useSelectedChart = () =>
  useChartStore((s) => s.charts.find((c) => c.id === s.selectedChartId));

export const useSelectedMusicCollageRows = (): [
  number,
  (rows: number) => void
] =>
  useChartStore((s) => [
    s.charts.find((c) => c.id === s.selectedChartId)!.options.musicCollage.rows,
    s.setMusicCollageRows,
  ]);

export const useSelectedMusicCollageColumns = (): [
  number,
  (columns: number) => void
] =>
  useChartStore((s) => [
    s.charts.find((c) => c.id === s.selectedChartId)!.options.musicCollage
      .columns,
    s.setMusicCollageColumns,
  ]);

export const useSelectedMusicCollageGap = (): [
  MusicCollageSpacing,
  (gap: MusicCollageSpacing) => void
] =>
  useChartStore((s) => [
    s.charts.find((c) => c.id === s.selectedChartId)!.options.musicCollage.gap,
    s.setMusicCollageGap,
  ]);

export const useSelectedMusicCollagePadding = (): [
  MusicCollageSpacing,
  (padding: MusicCollageSpacing) => void
] =>
  useChartStore((s) => [
    s.charts.find((c) => c.id === s.selectedChartId)!.options.musicCollage
      .padding,
    s.setMusicCollagePadding,
  ]);

export const useSelectedMusicCollageShowAlbumTitles = (): [
  boolean,
  (show: boolean) => void
] =>
  useChartStore((s) => [
    s.charts.find((c) => c.id === s.selectedChartId)!.options.musicCollage
      .titles.show,
    s.setShowMusicCollageAlbumTitles,
  ]);

export const useSelectedMusicCollageAlbumTitlesPosition = (): [
  boolean,
  (positionBelowCover: boolean) => void
] =>
  useChartStore((s) => [
    s.charts.find((c) => c.id === s.selectedChartId)!.options.musicCollage
      .titles.positionBelowCover,
    s.setPositionMusicCollageTitlesBelowCover,
  ]);

export const useSelectedMusicCollageAllowEditingTitles = (): [
  boolean,
  (allowEditing: boolean) => void
] =>
  useChartStore((s) => [
    s.charts.find((c) => c.id === s.selectedChartId)!.options.musicCollage
      .titles.allowEditing,
    s.setAllowEditingMusicCollageTitles,
  ]);

export const useSelectedMusicCollageBackgroundType = (): [
  MusicCollageBackgroundType,
  (backgroundType: MusicCollageBackgroundType) => void
] =>
  useChartStore((s) => [
    s.charts.find((c) => c.id === s.selectedChartId)!.options.musicCollage
      .backgroundType,
    s.setMusicCollageBackgroundType,
  ]);

export const useSelectedMusicCollageBackgroundColor = (): [
  string,
  (backgroundColor: string) => void
] =>
  useChartStore((s) => [
    s.charts.find((c) => c.id === s.selectedChartId)!.options.musicCollage
      .backgroundColor,
    s.setMusicCollageBackgroundColor,
  ]);

export const useSelectedMusicCollageBackgroundImage = (): [
  string,
  (backgroundImage: string) => void
] =>
  useChartStore((s) => [
    s.charts.find((c) => c.id === s.selectedChartId)!.options.musicCollage
      .backgroundImage,
    s.setMusicCollageBackgroundImage,
  ]);

export const useSelectedMusicCollageFontStyle = (): [
  MusicCollageFontStyle,
  (fontStyle: MusicCollageFontStyle) => void
] =>
  useChartStore((s) => [
    s.charts.find((c) => c.id === s.selectedChartId)!.options.musicCollage
      .fontStyle,
    s.setMusicCollageFontStyle,
  ]);

export const useSelectedMusicCollageFontFamily = (): [
  string,
  (fontFamily: string) => void
] =>
  useChartStore((s) => [
    s.charts.find((c) => c.id === s.selectedChartId)!.options.musicCollage
      .fontFamily,
    s.setMusicCollageFontFamily,
  ]);

export const useSelectedMusicCollageForegroundColor = (): [
  string,
  (foregroundColor: string) => void
] =>
  useChartStore((s) => [
    s.charts.find((c) => c.id === s.selectedChartId)!.options.musicCollage
      .foregroundColor,
    s.setMusicCollageForegroundColor,
  ]);

export const useSelectedMusicCollageEditingTitleFor = (): [
  number,
  (itemIndex: number) => void
] =>
  useChartStore((s) => [
    s.musicCollageEditingTitleFor,
    s.setMusicCollageEditingTitleFor,
  ]);

export const useAddChart = () => useChartStore((s) => s.addNewChart);

export const useSetMusicCollageItem = () =>
  useChartStore((s) => s.setMusicCollageItem);

export const getMusicCollageItem = (index: number) => {
  const state = useChartStore.getState();

  return state.charts.find((c) => c.id === state.selectedChartId)?.options
    .musicCollage.items[index];
};
