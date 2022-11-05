import BugsIcon from "../icons/BugsIcon";
import DownloadIcon from "../icons/DownloadIcon";
import HamburgerMenuIcon from "../icons/HamburgerMenuIcon";
import ImportExportIcon from "../icons/ImportExportIcon";
import SettingsIcon from "../icons/SettingsIcon";
import SponsorIcon from "../icons/SponsorIcon";
import Button from "../components/Button";
import IconButton from "../components/IconButton";
import { useSelectedChart, useSetIsDownloading } from "../stores/charts";
import { toPng } from "html-to-image";

const Header = () => {
  const selectedChart = useSelectedChart();
  const setIsDownloading = useSetIsDownloading();

  const downloadChart = async () => {
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
    <header className="flex items-center justify-between bg-slate-800 py-2 px-4">
      <div className="text-base font-semibold leading-none text-white">
        Topchart
      </div>
      <div className="flex items-center gap-2">
        <Button
          icon={DownloadIcon}
          onClick={downloadChart}
          hideLabelOnMobile={false}
        >
          Download
        </Button>
        <Button icon={ImportExportIcon}>Import/Export</Button>
        <IconButton
          icon={SponsorIcon}
          label="Donate or Sponsor"
          className="hidden md:flex"
        />
        <IconButton
          icon={BugsIcon}
          label="Report an issue"
          className="hidden md:flex"
        />
        <IconButton
          icon={SettingsIcon}
          label="App settings"
          className={"hidden md:flex"}
        />
        <IconButton
          icon={HamburgerMenuIcon}
          label="App settings"
          className={"md:hidden"}
        />
      </div>
    </header>
  );
};

export default Header;
