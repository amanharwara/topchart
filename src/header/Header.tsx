import BugsIcon from "../icons/BugsIcon";
import DownloadIcon from "../icons/DownloadIcon";
import HamburgerMenuIcon from "../icons/HamburgerMenuIcon";
import SettingsIcon from "../icons/SettingsIcon";
import SponsorIcon from "../icons/SponsorIcon";
import Button from "../components/Button";
import IconButton from "../components/IconButton";
import { getSelectedChart, useSetIsDownloading } from "../stores/charts";
import { toPng } from "html-to-image";
import { useSetSettingsModalOpen } from "../stores/settings";
import Tooltip from "../components/Tooltip";
import { Menu, MenuArrow, MenuItem, useMenuStore } from "@ariakit/react";
import { useRef } from "react";
import GithubIcon from "../icons/GithubIcon";
import KofiIcon from "../icons/KofiIcon";
import { ImportExportMenu } from "./ImportExportMenu";

function reportIssue() {
  window.open("https://github.com/amanharwara/topchart/issues", "_blank");
}

const SponsorMenu = () => {
  const anchorRef = useRef<HTMLButtonElement>(null);

  const menuState = useMenuStore();

  const open = menuState.useState("open");

  return (
    <>
      <Tooltip text="Donate or Sponsor" forceHide={open}>
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
        store={menuState}
        className="dark:bg-slate-600 dark:text-white bg-slate-100 py-1 rounded border border-gray-800 z-50"
        portal={true}
        getAnchorRect={() => {
          const refRect = anchorRef.current?.getBoundingClientRect();

          return {
            x: refRect?.x,
            y: refRect?.y,
            width: refRect?.width,
            height: refRect?.height,
          };
        }}
        gutter={4}
      >
        <MenuArrow className="hidden" />
        <MenuItem
          className="flex items-center gap-3 py-1.5 px-5 cursor-pointer dark:hover:bg-slate-700 dark:focus:bg-slate-700 hover:bg-slate-300 focus:bg-slate-300"
          onClick={() => {
            window.open("https://github.com/sponsors/amanharwara", "_blank");
          }}
        >
          <GithubIcon className="w-5 h-5" />
          Sponsor on GitHub
        </MenuItem>
        <MenuItem
          className="flex items-center gap-3 py-1.5 px-5 cursor-pointer dark:hover:bg-slate-700 dark:focus:bg-slate-700 hover:bg-slate-300 focus:bg-slate-300"
          onClick={() => {
            window.open("https://ko-fi.com/amanharwara", "_blank");
          }}
        >
          <KofiIcon className="w-5 h-5" />
          Donate on Ko-Fi
        </MenuItem>
      </Menu>
    </>
  );
};

const MobileHamburgerMenu = () => {
  const setSettingsModalOpen = useSetSettingsModalOpen();

  const anchorRef = useRef<HTMLButtonElement>(null);

  const menuState = useMenuStore();

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
        store={menuState}
        className="dark:bg-slate-600 dark:text-white bg-slate-100 py-1 rounded border border-gray-800 z-50"
        getAnchorRect={() => {
          const refRect = anchorRef.current?.getBoundingClientRect();

          return {
            x: refRect?.x,
            y: refRect?.y,
            width: refRect?.width,
            height: refRect?.height,
          };
        }}
        gutter={4}
      >
        <MenuArrow className="hidden" />
        <MenuItem
          className="flex items-center gap-3 py-1.5 px-4 cursor-pointer dark:hover:bg-slate-700 dark:focus:bg-slate-700 hover:bg-slate-300 focus:bg-slate-300"
          onClick={() => {
            window.open("https://ko-fi.com/amanharwara", "_blank");
          }}
        >
          <SponsorIcon className="w-5 h-5" />
          Donate or Sponsor
        </MenuItem>
        <MenuItem
          className="flex items-center gap-3 py-1.5 px-4 cursor-pointer dark:hover:bg-slate-700 dark:focus:bg-slate-700 hover:bg-slate-300 focus:bg-slate-300"
          onClick={reportIssue}
        >
          <BugsIcon className="w-5 h-5" />
          Report an issue
        </MenuItem>
        <MenuItem
          className="flex items-center gap-3 py-1.5 px-4 cursor-pointer dark:hover:bg-slate-700 dark:focus:bg-slate-700 hover:bg-slate-300 focus:bg-slate-300"
          onClick={() => {
            setSettingsModalOpen(true);
          }}
        >
          <SettingsIcon className="w-5 h-5" />
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
        <ImportExportMenu />
        <MobileHamburgerMenu />
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
