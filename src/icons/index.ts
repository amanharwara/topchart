import HamburgerMenuIcon from "../icons/hamburger-menu.svg";
import DownloadIcon from "../icons/download.svg";
import ImportExportIcon from "../icons/import-export.svg";
import SponsorIcon from "../icons/sponsor.svg";
import SettingsIcon from "../icons/settings.svg";
import BugsIcon from "../icons/bugs.svg";

export const Icons = {
  "hamburger-menu": HamburgerMenuIcon,
  download: DownloadIcon,
  "import-export": ImportExportIcon,
  sponsor: SponsorIcon,
  settings: SettingsIcon,
  bugs: BugsIcon,
};

export type IconType = keyof typeof Icons;
