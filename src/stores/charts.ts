import create from "zustand";
import { persist } from "zustand/middleware";
import { nanoid } from "nanoid";
import produce from "immer";

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
  setSelectedChartId: (id: string) => void;

  charts: Chart[];
  setSelectedChartTitle: (title: string) => void;
  setSelectedChartType: (type: ChartType) => void;

  setMusicCollageItem: (index: number, item: MusicCollageItem) => void;
  moveMusicCollageItem: (oldIndex: number, newIndex: number) => void;
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

const getNewChartWithDefaults = ({
  id,
  title,
}: {
  id?: string;
  title?: string;
}): Chart => ({
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
      setSelectedChartId: (id: string) => {
        set({
          selectedChartId: id,
        });
      },

      charts: [getNewChartWithDefaults({ id: "initial" })],

      setSelectedChartTitle: (title: string) => {
        set(
          produce((state: ChartStore) => {
            const selectedChart = state.charts.find(
              (chart) => chart.id === state.selectedChartId
            );
            if (selectedChart) selectedChart.title = title;
          })
        );
      },

      setSelectedChartType: (type: ChartType) => {
        set(
          produce((state: ChartStore) => {
            const selectedChart = state.charts.find(
              (chart) => chart.id === state.selectedChartId
            );
            if (selectedChart) selectedChart.type = type;
          })
        );
      },

      setMusicCollageItem: (index: number, item: MusicCollageItem) => {
        set(
          produce((state: ChartStore) => {
            const selectedChart = state.charts.find(
              (chart) => chart.id === state.selectedChartId
            );
            if (selectedChart)
              selectedChart.options.musicCollage.items[index] = item;
          })
        );
      },

      moveMusicCollageItem: (oldIndex: number, newIndex: number) => {
        set(
          produce((state: ChartStore) => {
            const selectedChart = state.charts.find(
              (chart) => chart.id === state.selectedChartId
            );

            if (!selectedChart) {
              throw new Error("Could not find selected chart");
            }

            const items = selectedChart.options.musicCollage.items;

            if (
              oldIndex < 0 ||
              newIndex < 0 ||
              newIndex >= items.length ||
              oldIndex >= items.length
            ) {
              throw new Error("Index(s) are out of bounds.");
            }

            const itemToInsert = items.splice(oldIndex, 1)[0];

            if (!itemToInsert) {
              throw new Error("Could not get item to insert");
            }

            items.splice(newIndex, 0, itemToInsert);
          })
        );
      },

      setMusicCollageRows: (rows: number) =>
        set(
          produce((state: ChartStore) => {
            const selectedChart = state.charts.find(
              (chart) => chart.id === state.selectedChartId
            );
            if (selectedChart) selectedChart.options.musicCollage.rows = rows;
          })
        ),

      setMusicCollageColumns: (columns: number) =>
        set(
          produce((state: ChartStore) => {
            const selectedChart = state.charts.find(
              (chart) => chart.id === state.selectedChartId
            );
            if (selectedChart)
              selectedChart.options.musicCollage.columns = columns;
          })
        ),

      setMusicCollageGap: (gap: MusicCollageSpacing) =>
        set(
          produce((state: ChartStore) => {
            const selectedChart = state.charts.find(
              (chart) => chart.id === state.selectedChartId
            );
            if (selectedChart) selectedChart.options.musicCollage.gap = gap;
          })
        ),

      setMusicCollagePadding: (padding: MusicCollageSpacing) =>
        set(
          produce((state: ChartStore) => {
            const selectedChart = state.charts.find(
              (chart) => chart.id === state.selectedChartId
            );
            if (selectedChart)
              selectedChart.options.musicCollage.padding = padding;
          })
        ),

      setShowMusicCollageAlbumTitles: (show: boolean) => {
        set(
          produce((state: ChartStore) => {
            const selectedChart = state.charts.find(
              (chart) => chart.id === state.selectedChartId
            );
            if (selectedChart)
              selectedChart.options.musicCollage.titles.show = show;
          })
        );
      },

      setPositionMusicCollageTitlesBelowCover: (
        positionBelowCover: boolean
      ) => {
        set(
          produce((state: ChartStore) => {
            const selectedChart = state.charts.find(
              (chart) => chart.id === state.selectedChartId
            );
            if (selectedChart)
              selectedChart.options.musicCollage.titles.positionBelowCover =
                positionBelowCover;
          })
        );
      },

      setAllowEditingMusicCollageTitles: (allowEditing: boolean) => {
        set(
          produce((state: ChartStore) => {
            const selectedChart = state.charts.find(
              (chart) => chart.id === state.selectedChartId
            );
            if (selectedChart)
              selectedChart.options.musicCollage.titles.allowEditing =
                allowEditing;
          })
        );
      },

      setMusicCollageBackgroundType: (
        backgroundType: MusicCollageBackgroundType
      ) => {
        set(
          produce((state: ChartStore) => {
            const selectedChart = state.charts.find(
              (chart) => chart.id === state.selectedChartId
            );
            if (selectedChart)
              selectedChart.options.musicCollage.backgroundType =
                backgroundType;
          })
        );
      },

      setMusicCollageBackgroundColor: (backgroundColor: string) => {
        set(
          produce((state: ChartStore) => {
            const selectedChart = state.charts.find(
              (chart) => chart.id === state.selectedChartId
            );
            if (selectedChart)
              selectedChart.options.musicCollage.backgroundColor =
                backgroundColor;
          })
        );
      },

      setMusicCollageBackgroundImage: (backgroundImage: string) => {
        set(
          produce((state: ChartStore) => {
            const selectedChart = state.charts.find(
              (chart) => chart.id === state.selectedChartId
            );
            if (selectedChart)
              selectedChart.options.musicCollage.backgroundImage =
                backgroundImage;
          })
        );
      },

      setMusicCollageFontStyle: (fontStyle: MusicCollageFontStyle) => {
        set(
          produce((state: ChartStore) => {
            const selectedChart = state.charts.find(
              (chart) => chart.id === state.selectedChartId
            );
            if (selectedChart)
              selectedChart.options.musicCollage.fontStyle = fontStyle;
          })
        );
      },

      setMusicCollageFontFamily: (fontFamily: string) => {
        set(
          produce((state: ChartStore) => {
            const selectedChart = state.charts.find(
              (chart) => chart.id === state.selectedChartId
            );
            if (selectedChart)
              selectedChart.options.musicCollage.fontFamily = fontFamily;
          })
        );
      },

      setMusicCollageForegroundColor: (foregroundColor: string) => {
        set(
          produce((state: ChartStore) => {
            const selectedChart = state.charts.find(
              (chart) => chart.id === state.selectedChartId
            );
            if (selectedChart)
              selectedChart.options.musicCollage.foregroundColor =
                foregroundColor;
          })
        );
      },

      musicCollageEditingTitleFor: -1,
      setMusicCollageEditingTitleFor(itemIndex) {
        set({
          musicCollageEditingTitleFor: itemIndex,
        });
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

export const addNewChart = () => {
  const newChart = getNewChartWithDefaults({
    title: `Untitled ${useChartStore.getState().charts.length + 1}`,
  });
  useChartStore.setState((state) => ({
    charts: [...state.charts, newChart],
  }));
  return newChart.id;
};

export const deleteChart = (id: string) => {
  const charts = useChartStore.getState().charts;
  const chartIndex = charts.findIndex((chart) => chart.id === id);
  const nextChart = charts[chartIndex - 1];
  useChartStore.setState((state) => ({
    charts: state.charts.filter((chart) => chart.id !== id),
  }));
  if (nextChart) {
    useChartStore.getState().setSelectedChartId(nextChart.id);
  } else {
    const id = addNewChart();
    useChartStore.getState().setSelectedChartId(id);
  }
};

export const useChartsList = () => useChartStore((s) => s.charts);

export const useSelectedChart = () =>
  useChartStore((s) => s.charts.find((c) => c.id === s.selectedChartId));

export const useSetSelectedChartId = () =>
  useChartStore((s) => s.setSelectedChartId);

export const useSetSelectedChartTitle = () =>
  useChartStore((s) => s.setSelectedChartTitle);

export const useSetSelectedChartType = () =>
  useChartStore((s) => s.setSelectedChartType);

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

export const useSetMusicCollageItem = () =>
  useChartStore((s) => s.setMusicCollageItem);

export const useMoveMusicCollageItem = () =>
  useChartStore((s) => s.moveMusicCollageItem);

export const getMusicCollageItem = (index: number) => {
  const state = useChartStore.getState();

  return state.charts.find((c) => c.id === state.selectedChartId)?.options
    .musicCollage.items[index];
};
