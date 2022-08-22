import BugsIcon from "../icons/BugsIcon";
import DownloadIcon from "../icons/DownloadIcon";
import HamburgerMenuIcon from "../icons/HamburgerMenuIcon";
import ImportExportIcon from "../icons/ImportExportIcon";
import SettingsIcon from "../icons/SettingsIcon";
import SponsorIcon from "../icons/SponsorIcon";
import Button from "../components/Button";
import IconButton from "../components/IconButton";

const Header = () => {
  return (
    <header className="flex items-center justify-between bg-slate-800 py-2 px-4">
      <div className="text-base font-semibold leading-none text-white">
        Topchart
      </div>
      <div className="flex items-center gap-2">
        <Button icon={DownloadIcon} hideLabelOnMobile={false}>
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
