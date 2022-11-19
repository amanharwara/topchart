import { Tab, TabList, TabPanel, TabPanelOptions, useTabState } from "ariakit";
import { memo, ReactNode } from "react";
import AddCoverArt from "./addCoverArt/AddCoverArt";
import ChartOptionsSection from "./chartOptions/ChartOptionsSection";
import Button from "./components/Button";
import Spinner from "./components/Spinner";
import { isDev } from "./constants";
import Header from "./header/Header";
import ImageIcon from "./icons/ImageIcon";
import SettingsIcon from "./icons/SettingsIcon";
import MusicCollage from "./musicCollage/MusicCollage";
import SettingsModal from "./settings/SettingsModal";
import {
  useIsDownloading,
  useSetMusicCollageItemImage,
  useSetMusicCollageItemTitle,
} from "./stores/charts";
import classNames from "./utils/classNames";
import { useMediaQuery } from "./utils/useMediaQuery";

const WrapWithTabPanelIfMobile = ({
  state,
  children,
  ...panelProps
}: {
  children: ReactNode;
} & TabPanelOptions) => {
  const isMobileScreen = useMediaQuery("(max-width: 768px)");

  return isMobileScreen ? (
    <TabPanel state={state} {...panelProps}>
      {children}
    </TabPanel>
  ) : (
    <>{children}</>
  );
};

const HomePageContent = () => {
  const setMusicCollageItemTitle = useSetMusicCollageItemTitle();
  const setMusicCollageItemImage = useSetMusicCollageItemImage();
  const isDownloading = useIsDownloading();

  const mobileTabState = useTabState({
    defaultActiveId: "chart",
    defaultSelectedId: "chart",
  });

  return (
    <>
      <Header />
      <div className="w-full min-h-0 flex-grow flex flex-col md:grid md:grid-cols-[1fr_2.5fr_1fr] [&>[role='tabpanel']]:flex-grow [&>[role='tabpanel']]:min-h-0">
        <WrapWithTabPanelIfMobile state={mobileTabState} tabId="options">
          <ChartOptionsSection />
        </WrapWithTabPanelIfMobile>
        <WrapWithTabPanelIfMobile state={mobileTabState} tabId="chart">
          <main
            className={classNames(
              "w-screen h-full md:w-auto p-4",
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
            {isDev && (
              <div className="mt-5 flex items-center gap-4 dark:text-white">
                DevTools:
                <Button
                  onClick={() => {
                    setMusicCollageItemTitle(0, "Brian Eno");
                    setMusicCollageItemImage(0, "eno.jpg");
                  }}
                >
                  Add image to first
                </Button>
              </div>
            )}
          </main>
        </WrapWithTabPanelIfMobile>
        <section className="hidden md:flex min-h-0 flex-col border-l border-gray-800 dark:border-0 dark:bg-gray-800 bg-slate-100">
          <AddCoverArt />
        </section>
        <TabList
          className="md:hidden flex w-full bg-slate-800 text-white"
          state={mobileTabState}
          aria-label="Navigation"
        >
          <Tab
            id="chart"
            className="flex flex-col gap-1 items-center p-3 flex-grow [&[aria-selected=true]]:bg-slate-900 [&[aria-selected=true]]:font-bold"
          >
            <ImageIcon className="h-6 w-6" />
            Chart
          </Tab>
          <Tab
            id="options"
            className="flex flex-col gap-1 items-center p-3 flex-grow [&[aria-selected=true]]:bg-slate-900 [&[aria-selected=true]]:font-bold"
          >
            <SettingsIcon className="w-6 h-6" />
            Options
          </Tab>
        </TabList>
      </div>
      <SettingsModal />
      {/* <AddCoverArtModal
    isOpen={isCoverArtModalOpen()}
    closeModal={() => toggleCoverArtModal(false)}
  />
  <ToastContainer /> */}
    </>
  );
};

export default memo(HomePageContent);
