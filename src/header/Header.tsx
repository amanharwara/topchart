import BugsIcon from "../icons/BugsIcon";
import DownloadIcon from "../icons/DownloadIcon";
import HamburgerMenuIcon from "../icons/HamburgerMenuIcon";
import ImportExportIcon from "../icons/ImportExportIcon";
import SettingsIcon from "../icons/SettingsIcon";
import SponsorIcon from "../icons/SponsorIcon";
import Button from "../components/Button";
import IconButton from "../components/IconButton";
import { getSelectedChart, useSetIsDownloading } from "../stores/charts";
import { toPng } from "html-to-image";
import { isDev } from "../constants";
import { useSetSettingsModalOpen } from "../stores/settings";
import Tooltip from "../components/Tooltip";
import { Menu, MenuArrow, MenuItem, useMenuState } from "ariakit";
import { useRef } from "react";
import GithubIcon from "../icons/GithubIcon";
import KofiIcon from "../icons/KofiIcon";

function reportIssue() {
  window.open("https://github.com/amanharwara/topchart/issues", "_blank");
}

const SponsorMenu = () => {
  const anchorRef = useRef<HTMLButtonElement>(null);

  const menuState = useMenuState({
    getAnchorRect() {
      const refRect = anchorRef.current?.getBoundingClientRect();

      return {
        x: refRect?.x,
        y: refRect?.y,
        width: refRect?.width,
        height: refRect?.height,
      };
    },
  });

  return (
    <>
      <Tooltip text="Donate or Sponsor" forceHide={menuState.open}>
        <IconButton
          icon={SponsorIcon}
          label="Donate or Sponsor"
          className="hidden md:flex"
          onClick={() => {
            menuState.toggle();
          }}
          ref={anchorRef}
        />
      </Tooltip>
      <Menu
        state={menuState}
        className="dark:bg-slate-600 dark:text-white bg-slate-100 py-2 px-2 rounded border border-gray-800 dark:border-0"
      >
        <MenuArrow />
        <MenuItem
          className="flex items-center gap-3 py-2 px-3 cursor-pointer dark:hover:bg-slate-700 hover:bg-slate-300 rounded"
          onClick={() => {
            window.open("https://github.com/sponsors/amanharwara", "_blank");
          }}
        >
          <GithubIcon className="w-6 h-6" />
          Sponsor on GitHub
        </MenuItem>
        <MenuItem
          className="flex items-center gap-3 py-2 px-3 cursor-pointer dark:hover:bg-slate-700 hover:bg-slate-300 rounded"
          onClick={() => {
            window.open("https://ko-fi.com/amanharwara", "_blank");
          }}
        >
          <KofiIcon className="w-6 h-6" />
          Donate on Ko-Fi
        </MenuItem>
      </Menu>
    </>
  );
};

const MobileHamburgerMenu = () => {
  const setSettingsModalOpen = useSetSettingsModalOpen();

  const anchorRef = useRef<HTMLButtonElement>(null);

  const menuState = useMenuState({
    getAnchorRect() {
      const refRect = anchorRef.current?.getBoundingClientRect();

      return {
        x: refRect?.x,
        y: refRect?.y,
        width: refRect?.width,
        height: refRect?.height,
      };
    },
  });

  return (
    <>
      <IconButton
        icon={HamburgerMenuIcon}
        label="App settings"
        className={"md:hidden"}
        ref={anchorRef}
        onClick={menuState.toggle}
      />
      <Menu
        portal={true}
        state={menuState}
        className="dark:bg-slate-600 dark:text-white bg-slate-100 py-2 px-2 rounded border border-gray-800 dark:border-0 z-50"
      >
        <MenuArrow />
        <MenuItem
          className="flex items-center gap-3 py-2 px-3 cursor-pointer dark:hover:bg-slate-700 hover:bg-slate-300 rounded"
          onClick={() => {
            window.open("https://ko-fi.com/amanharwara", "_blank");
          }}
        >
          <SponsorIcon className="w-6 h-6" />
          Donate or Sponsor
        </MenuItem>
        <MenuItem
          className="flex items-center gap-3 py-2 px-3 cursor-pointer dark:hover:bg-slate-700 hover:bg-slate-300 rounded"
          onClick={reportIssue}
        >
          <BugsIcon className="w-6 h-6" />
          Report an issue
        </MenuItem>
        <MenuItem
          className="flex items-center gap-3 py-2 px-3 cursor-pointer dark:hover:bg-slate-700 hover:bg-slate-300 rounded"
          onClick={() => {
            setSettingsModalOpen(true);
          }}
        >
          <SettingsIcon className="w-6 h-6" />
          App settings
        </MenuItem>
      </Menu>
    </>
  );
};

const Header = () => {
  const setIsDownloading = useSetIsDownloading();
  const setSettingsModalOpen = useSetSettingsModalOpen();

  const downloadChart = async () => {
    const selectedChart = getSelectedChart();
    if (!selectedChart) throw new Error("No chart selected");

    setIsDownloading(true);

    const chartElement = document.getElementById(
      "music-collage"
    ) as HTMLDivElement;

    chartElement.style.transformOrigin = "top left";
    chartElement.style.transform = "scale(2)";

    const renderedPngDataUrl = await toPng(chartElement, {
      width: chartElement.offsetWidth * 2,
      height: chartElement.offsetHeight * 2,
    });

    const link = document.createElement("a");

    link.href = renderedPngDataUrl;

    link.download = `${selectedChart.title}.png`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    chartElement.style.transformOrigin = "";
    chartElement.style.transform = "";

    setIsDownloading(false);
  };

  return (
    <header className="flex items-center justify-between bg-white border-b border-gray-800 dark:border-0 dark:bg-slate-800 py-2 px-4">
      <div className="text-base font-semibold leading-none dark:text-white">
        Topchart
      </div>
      <div className="flex items-center gap-2">
        <Button icon={DownloadIcon} onClick={downloadChart}>
          Download
        </Button>
        {isDev && (
          <>
            <Button icon={ImportExportIcon} hideLabelOnMobile={true}>
              Import/Export
            </Button>
            <MobileHamburgerMenu />
          </>
        )}
        <SponsorMenu />
        <Tooltip text="Report an issue">
          <IconButton
            icon={BugsIcon}
            label="Report an issue"
            className="hidden md:flex"
            onClick={reportIssue}
          />
        </Tooltip>
        <Tooltip text="App settings">
          <IconButton
            icon={SettingsIcon}
            label="App settings"
            className={"hidden md:flex"}
            onClick={() => setSettingsModalOpen(true)}
          />
        </Tooltip>
      </div>
    </header>
  );
};

export default Header;
