import produce from "immer";
import { createStore } from "zustand";
import { persist } from "zustand/middleware";

type RecentsStore = {
  recentlyUploadedImages: string[];
  addRecentlyUploadedImage: (id: string) => void;
  clearRecentlyUploadedImages: () => void;

  lastSearchQuery: string;
};

export const recentsStore = createStore<RecentsStore>()(
  persist(
    (set) => ({
      recentlyUploadedImages: [],
      addRecentlyUploadedImage: (id: string) => {
        set(
          produce((state: RecentsStore) => {
            if (state.recentlyUploadedImages.length === 5) {
              state.recentlyUploadedImages.shift();
            }
            if (state.recentlyUploadedImages.includes(id)) {
              state.recentlyUploadedImages =
                state.recentlyUploadedImages.filter((s) => s !== id);
            }
            state.recentlyUploadedImages.push(id);
          })
        );
      },
      clearRecentlyUploadedImages: () => {
        set({
          recentlyUploadedImages: [],
        });
      },

      lastSearchQuery: "",
    }),
    {
      name: "recents",
      partialize: (state) =>
        Object.fromEntries(
          Object.entries(state).filter(
            ([key]) => !["lastSearchQuery"].includes(key)
          )
        ),
    }
  )
);
