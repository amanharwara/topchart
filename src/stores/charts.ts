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
      showTitles: boolean;
      positionTitlesBelowCover: boolean;
      allowEditingTitles: boolean;
    };
  };
};

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
      showTitles: false,
      positionTitlesBelowCover: false,
      allowEditingTitles: false,
    },
  },
});

interface ChartStore {
  selectedChartId: Chart["id"];
  setSelectedChartId: (id: string) => void;

  charts: Chart[];
  setSelectedChartTitle: (title: string) => void;
  setSelectedChartType: (type: ChartType) => void;

  setMusicCollageItem: (index: number, item: MusicCollageItem) => void;
  moveMusicCollageItem: (oldIndex: number, newIndex: number) => void;

  musicCollageEditingTitleFor: number;
  setMusicCollageEditingTitleFor: (itemIndex: number) => void;

  isDownloading: boolean;
  setIsDownloading: (isDownloading: boolean) => void;
}
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

      musicCollageEditingTitleFor: -1,
      setMusicCollageEditingTitleFor(itemIndex) {
        set({
          musicCollageEditingTitleFor: itemIndex,
        });
      },

      isDownloading: Boolean(false),
      setIsDownloading(isDownloading: boolean) {
        set({
          isDownloading,
        });
      },
    }),
    {
      name: "charts",
      partialize: (state) =>
        Object.fromEntries(
          Object.entries(state).filter(
            ([key]) =>
              !["musicCollageEditingTitleFor", "isDownloading"].includes(key)
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

export const setMusicCollageRows = (rows: number) =>
  useChartStore.setState(
    produce((state: ChartStore) => {
      const selectedChart = state.charts.find(
        (chart) => chart.id === state.selectedChartId
      );
      if (selectedChart) selectedChart.options.musicCollage.rows = rows;
    })
  );

export const setMusicCollageColumns = (columns: number) =>
  useChartStore.setState(
    produce((state: ChartStore) => {
      const selectedChart = state.charts.find(
        (chart) => chart.id === state.selectedChartId
      );
      if (selectedChart) selectedChart.options.musicCollage.columns = columns;
    })
  );

export const setMusicCollageGap = (gap: MusicCollageSpacing) =>
  useChartStore.setState(
    produce((state: ChartStore) => {
      const selectedChart = state.charts.find(
        (chart) => chart.id === state.selectedChartId
      );
      if (selectedChart) selectedChart.options.musicCollage.gap = gap;
    })
  );

export const setMusicCollagePadding = (padding: MusicCollageSpacing) =>
  useChartStore.setState(
    produce((state: ChartStore) => {
      const selectedChart = state.charts.find(
        (chart) => chart.id === state.selectedChartId
      );
      if (selectedChart) selectedChart.options.musicCollage.padding = padding;
    })
  );

export const setMusicCollageForegroundColor = (foregroundColor: string) => {
  useChartStore.setState(
    produce((state: ChartStore) => {
      const selectedChart = state.charts.find(
        (chart) => chart.id === state.selectedChartId
      );
      if (selectedChart)
        selectedChart.options.musicCollage.foregroundColor = foregroundColor;
    })
  );
};

export const setShowMusicCollageAlbumTitles = (show: boolean) => {
  useChartStore.setState(
    produce((state: ChartStore) => {
      const selectedChart = state.charts.find(
        (chart) => chart.id === state.selectedChartId
      );
      if (selectedChart) selectedChart.options.musicCollage.showTitles = show;
    })
  );
};

export const setPositionMusicCollageTitlesBelowCover = (
  positionBelowCover: boolean
) => {
  useChartStore.setState(
    produce((state: ChartStore) => {
      const selectedChart = state.charts.find(
        (chart) => chart.id === state.selectedChartId
      );
      if (selectedChart)
        selectedChart.options.musicCollage.positionTitlesBelowCover =
          positionBelowCover;
    })
  );
};

export const setAllowEditingMusicCollageTitles = (allowEditing: boolean) => {
  useChartStore.setState(
    produce((state: ChartStore) => {
      const selectedChart = state.charts.find(
        (chart) => chart.id === state.selectedChartId
      );
      if (selectedChart)
        selectedChart.options.musicCollage.allowEditingTitles = allowEditing;
    })
  );
};

export const setMusicCollageBackgroundType = (
  backgroundType: MusicCollageBackgroundType
) => {
  useChartStore.setState(
    produce((state: ChartStore) => {
      const selectedChart = state.charts.find(
        (chart) => chart.id === state.selectedChartId
      );
      if (selectedChart)
        selectedChart.options.musicCollage.backgroundType = backgroundType;
    })
  );
};

export const setMusicCollageBackgroundColor = (backgroundColor: string) => {
  useChartStore.setState(
    produce((state: ChartStore) => {
      const selectedChart = state.charts.find(
        (chart) => chart.id === state.selectedChartId
      );
      if (selectedChart)
        selectedChart.options.musicCollage.backgroundColor = backgroundColor;
    })
  );
};

export const setMusicCollageBackgroundImage = (backgroundImage: string) => {
  useChartStore.setState(
    produce((state: ChartStore) => {
      const selectedChart = state.charts.find(
        (chart) => chart.id === state.selectedChartId
      );
      if (selectedChart)
        selectedChart.options.musicCollage.backgroundImage = backgroundImage;
    })
  );
};

export const setMusicCollageFontStyle = (fontStyle: MusicCollageFontStyle) => {
  useChartStore.setState(
    produce((state: ChartStore) => {
      const selectedChart = state.charts.find(
        (chart) => chart.id === state.selectedChartId
      );
      if (selectedChart)
        selectedChart.options.musicCollage.fontStyle = fontStyle;
    })
  );
};

export const setMusicCollageFontFamily = (fontFamily: string) => {
  useChartStore.setState(
    produce((state: ChartStore) => {
      const selectedChart = state.charts.find(
        (chart) => chart.id === state.selectedChartId
      );
      if (selectedChart)
        selectedChart.options.musicCollage.fontFamily = fontFamily;
    })
  );
};

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

export const useIsDownloading = () => useChartStore((s) => s.isDownloading);

export const useSetIsDownloading = () =>
  useChartStore((s) => s.setIsDownloading);
