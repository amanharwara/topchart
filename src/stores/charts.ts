import create from "zustand";
import { persist } from "zustand/middleware";
import { nanoid } from "nanoid";
import produce from "immer";

export type ChartType = "musicCollage";

export type MusicCollageSpacing = "none" | "small" | "medium" | "large";

export type MusicCollageItem = {
  id: string;
  image: string | null;
  title: string;
};

type MusicCollageBackgroundType = "image" | "color";

export type MusicCollageFontStyle = "sans" | "serif" | "mono" | "custom";

export type MusicCollage = {
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

export type Chart = {
  id: string;
  title: string;
} & (
  | {
      type: "musicCollage";
      options: MusicCollage;
    }
  // @TODO: Add more chart types
  | {
      type: "spotify-top-5-artists";
      options: {
        //
      };
    }
  | {
      type: "spotify-top-5-tracks";
      options: {
        //
      };
    }
  | {
      type: "lastfm-top-5";
      options: {
        //
      };
    }
  | {
      type: "lastfm-collage";
      options: {
        //
      };
    }
  | {
      type: "tier-list";
      options: {
        //
      };
    }
);

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
    rows: 3,
    columns: 3,
    gap: "small",
    padding: "small",
    items: new Array(MaxNumberOfRows * MaxNumberOfColumns)
      .fill(null)
      .map(() => ({
        id: nanoid(),
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
});

export const isMusicCollageChart = (
  chart: Chart | undefined
): chart is Chart & {
  type: "musicCollage";
  options: MusicCollage;
} => {
  if (!chart) return false;
  return chart.type === "musicCollage";
};

interface ChartStore {
  selectedChartId: Chart["id"];
  setSelectedChartId: (id: string) => void;

  charts: Chart[];
  setSelectedChartTitle: (title: string) => void;
  setSelectedChartType: (type: ChartType) => void;

  setMusicCollageItem: (
    index: number,
    item: Partial<Omit<MusicCollageItem, "id">>
  ) => void;
  moveMusicCollageItem: (oldIndex: number, newIndex: number) => void;

  musicCollageEditingTitleFor: number;
  setMusicCollageEditingTitleFor: (itemIndex: number) => void;

  musicCollageAddingCoverTo: number;
  setMusicCollageAddingCoverTo: (itemIndex: number) => void;

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

      setMusicCollageItem: (
        index: number,
        item: Partial<Omit<MusicCollageItem, "id">>
      ) => {
        set(
          produce((state: ChartStore) => {
            const selectedChart = state.charts.find(
              (chart) => chart.id === state.selectedChartId
            );
            if (!isMusicCollageChart(selectedChart)) {
              return;
            }
            const existingItem = selectedChart.options.items[index]!;
            selectedChart.options.items[index] = {
              ...existingItem,
              ...item,
            };
          })
        );
      },

      moveMusicCollageItem: (oldIndex: number, newIndex: number) => {
        set(
          produce((state: ChartStore) => {
            const selectedChart = state.charts.find(
              (chart) => chart.id === state.selectedChartId
            );

            if (!isMusicCollageChart(selectedChart)) {
              return;
            }

            const items = selectedChart.options.items;

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

      musicCollageAddingCoverTo: -1,
      setMusicCollageAddingCoverTo(itemIndex) {
        set({
          musicCollageAddingCoverTo: itemIndex,
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

export const getSelectedChart = () => {
  const selectedChartId = useChartStore.getState().selectedChartId;
  const selectedChart = useChartStore
    .getState()
    .charts.find((chart) => chart.id === selectedChartId);
  if (!selectedChart) {
    throw new Error("Could not find selected chart");
  }
  return selectedChart;
};

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

export const useSelectedMusicCollageEditingTitleFor = (): [
  number,
  (itemIndex: number) => void
] =>
  useChartStore((s) => [
    s.musicCollageEditingTitleFor,
    s.setMusicCollageEditingTitleFor,
  ]);

export const useSelectedMusicCollageAddingCoverTo = (): [
  number,
  (itemIndex: number) => void
] =>
  useChartStore((s) => [
    s.musicCollageAddingCoverTo,
    s.setMusicCollageAddingCoverTo,
  ]);

export const useSetMusicCollageItem = () =>
  useChartStore((s) => s.setMusicCollageItem);

export const useMoveMusicCollageItem = () =>
  useChartStore((s) => s.moveMusicCollageItem);

export const getMusicCollageItem = (index: number) => {
  const state = useChartStore.getState();

  const selectedChart = state.charts.find(
    (chart) => chart.id === state.selectedChartId
  );

  if (!isMusicCollageChart(selectedChart)) {
    throw new Error("Selected chart is not a music collage");
  }

  return selectedChart.options.items[index];
};

export const useIsDownloading = () => useChartStore((s) => s.isDownloading);

export const useSetIsDownloading = () =>
  useChartStore((s) => s.setIsDownloading);

export function useSelectedMusicCollageProperty<
  Prop extends keyof MusicCollage
>(prop: Prop): MusicCollage[Prop] {
  return useChartStore((s) => {
    const selectedChart = s.charts.find((c) => c.id === s.selectedChartId);
    if (!isMusicCollageChart(selectedChart)) {
      throw new Error("Selected chart is not a music collage");
    }
    return selectedChart.options[prop];
  });
}

export function setSelectedMusicCollageProperty<
  Prop extends keyof MusicCollage
>(prop: Prop, value: MusicCollage[Prop]) {
  useChartStore.setState(
    produce((state: ChartStore) => {
      const selectedChart = state.charts.find(
        (c) => c.id === state.selectedChartId
      );
      if (!isMusicCollageChart(selectedChart)) {
        throw new Error("Selected chart is not a music collage");
      }
      selectedChart.options[prop] = value;
    })
  );
}
