import Button from "./Button";
import IconButton from "./IconButton";
import WithTooltip from "./WithTooltip";

function Header() {
  return (
    <header className="flex items-center justify-between bg-slate-800 py-2 px-4">
      <div className="text-base font-semibold leading-none text-white">
        Topchart
      </div>
      <div className="flex items-center gap-2">
        <Button icon="download" hideLabelOnMobile={false}>
          Download
        </Button>
        <Button icon="import-export">Import/Export</Button>
        <WithTooltip label="Donate / Sponsor">
          <IconButton
            icon="sponsor"
            label="Donate or Sponsor"
            className="hidden md:flex"
          />
        </WithTooltip>
        <WithTooltip label="Report an issue">
          <IconButton
            icon="bugs"
            label="Report an issue"
            className="hidden md:flex"
          />
        </WithTooltip>
        <WithTooltip label="App settings">
          <IconButton
            icon="settings"
            label="App settings"
            className="hidden md:flex"
          />
        </WithTooltip>
        <IconButton
          icon="hamburger-menu"
          label="Options menu"
          className="md:hidden"
        />
      </div>
    </header>
  );
}

export default Header;
