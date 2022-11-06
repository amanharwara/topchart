import create from "zustand";
import { persist } from "zustand/middleware";

interface SettingsStore {
  darkMode: boolean;
  setDarkMode: (darkMode: boolean) => void;

  isSettingsModalOpen: boolean;
  setSettingsModalOpen: (isSettingsModalOpen: boolean) => void;
}
const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      darkMode: true,
      setDarkMode: (darkMode) => set({ darkMode }),

      isSettingsModalOpen: false,
      setSettingsModalOpen: (isSettingsModalOpen) =>
        set({ isSettingsModalOpen }),
    }),
    {
      name: "settings",
      getStorage: () => localStorage,
      partialize: (state) =>
        Object.fromEntries(
          Object.entries(state).filter(
            ([key]) => !["isSettingsModalOpen"].includes(key)
          )
        ),
    }
  )
);

export const useDarkMode = () => useSettingsStore((state) => state.darkMode);
export const useSetDarkMode = () =>
  useSettingsStore((state) => state.setDarkMode);

export const useIsSettingsModalOpen = () =>
  useSettingsStore((state) => state.isSettingsModalOpen);
export const useSetSettingsModalOpen = () =>
  useSettingsStore((state) => state.setSettingsModalOpen);
