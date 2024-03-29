import {
  useSensors,
  useSensor,
  MouseSensor,
  TouchSensor,
  KeyboardSensor,
  DndContext,
  DragEndEvent,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import {
  memo,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import AddCoverArt from "./addCoverArt/AddCoverArt";
import ChartOptionsSection from "./chartOptions/ChartOptionsSection";
import Spinner from "./components/Spinner";
import { ToastProvider } from "./components/Toast";
import Header from "./header/Header";
import ImageIcon from "./icons/ImageIcon";
import SettingsIcon from "./icons/SettingsIcon";
import MusicCollage from "./musicCollage/MusicCollage";
import SettingsModal from "./settings/SettingsModal";
import {
  getSelectedChart,
  isMusicCollageChart,
  useIsDownloading,
  useMoveMusicCollageItem,
  useSetMusicCollageItem,
} from "./stores/charts";
import { storeImageToDB } from "./stores/imageDB";
import classNames from "./utils/classNames";
import { mergeRefs } from "./utils/mergeRefs";
import { useMediaQuery } from "./utils/useMediaQuery";
import { handleSpotifyAuthorization } from "./stores/spotify";

const ResponsiveContainer = ({ children }: { children: ReactNode }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const [activeTab, setActiveTab] = useState<"chart" | "options">("chart");

  const isMobileScreen = useMediaQuery("(max-width: 768px)");

  const fixContainerScroll = useCallback(
    (node: HTMLDivElement | null) => {
      if (!node) return;
      if (!isMobileScreen) {
        node.style.transform = "";
        return;
      }

      node.style.transform = `translateX(${
        activeTab === "chart" ? "100%" : 0
      })`;
    },
    [activeTab, isMobileScreen]
  );

  return (
    <>
      <div
        ref={mergeRefs([containerRef, fixContainerScroll])}
        className={classNames(
          "w-full [&>*]:w-screen [&>*]:md:w-auto min-h-0 flex-grow flex flex-row-reverse overflow-x-visible md:grid md:grid-cols-[1fr_2.5fr_1fr]",
          "motion-safe:duration-[100ms] motion-safe:transition-transform motion-safe:ease-in-out motion-safe:will-change-transform",
          "translate-x-full md:translate-x-0"
        )}
      >
        {children}
      </div>
      <section
        className="md:hidden flex w-full border-t-2 dark:border-slate-800 dark:bg-slate-800 dark:text-white bg-white border-gray-800 divide-x divide-gray-800 dark:divide-slate-800"
        aria-label="Navigation"
      >
        <button
          id="chart"
          onClick={() => {
            setActiveTab("chart");
          }}
          className={classNames(
            "flex flex-col gap-1 items-center p-3 flex-grow",
            activeTab === "chart" && "bg-slate-700 text-white"
          )}
        >
          <ImageIcon className="h-6 w-6" />
          Chart
        </button>
        <button
          id="options"
          onClick={() => {
            setActiveTab("options");
          }}
          className={classNames(
            "flex flex-col gap-1 items-center p-3 flex-grow",
            activeTab === "options" && "bg-slate-700 text-white"
          )}
        >
          <SettingsIcon className="w-6 h-6" />
          Options
        </button>
      </section>
    </>
  );
};

const HomePageContent = () => {
  const setMusicCollageItem = useSetMusicCollageItem();
  const isDownloading = useIsDownloading();

  const dndSensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const moveMusicCollageItem = useMoveMusicCollageItem();

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      const selectedChart = getSelectedChart();

      if (!active.id || !over?.id) return;
      if (active.id === over.id) return;
      if (!isMusicCollageChart(selectedChart)) return;

      const items = selectedChart.options.items;
      const overIndex = items.findIndex((item) => item.id === over.id);

      if (
        typeof active.id === "string" &&
        active.id.startsWith("cover-art-result")
      ) {
        const data = active.data.current;
        if (!data || !data.image || !data.image.id || !data.title) return;
        if (overIndex === -1) return;
        if (data.image.content) {
          storeImageToDB({
            id: data.image.id,
            content: data.image.content,
          });
        }
        setMusicCollageItem(overIndex, {
          title: data.title,
          image: data.image.id,
        });
        return;
      }

      const activeIndex = items.findIndex((item) => item.id === active.id);
      moveMusicCollageItem(activeIndex, overIndex);
    },
    [moveMusicCollageItem, setMusicCollageItem]
  );

  useEffect(() => {
    handleSpotifyAuthorization().catch(console.error);
  }, []);

  return (
    <ToastProvider>
      <Header />
      <DndContext sensors={dndSensors} onDragEnd={handleDragEnd}>
        <ResponsiveContainer>
          <ChartOptionsSection />
          <main
            className={classNames(
              "w-screen h-full flex-shrink-0 md:w-auto p-4",
              isDownloading ? "relative overflow-hidden" : "overflow-auto"
            )}
          >
            {isDownloading && (
              <div className="flex items-center justify-center gap-4 w-full h-full absolute top-0 left-0 z-50 dark:bg-slate-800/95 dark:text-white font-bold text-lg">
                <Spinner className="w-10 h-10" width={2} />
                Preparing download...
              </div>
            )}
            <MusicCollage />
          </main>
          <section className="hidden md:flex min-h-0 flex-col border-l border-gray-800 dark:border-0 dark:bg-gray-800 bg-slate-100">
            <AddCoverArt />
          </section>
        </ResponsiveContainer>
      </DndContext>
      <SettingsModal />
    </ToastProvider>
  );
};

export default memo(HomePageContent);
