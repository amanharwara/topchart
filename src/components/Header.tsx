import IconButton from "./IconButton";

function Header() {
  return (
    <header className="flex items-center justify-between bg-slate-800 py-2 px-4">
      <div className="text-base font-semibold leading-none text-white">
        Topchart
      </div>
      <div>
        <IconButton icon="hamburger-menu" label="Options menu" />
      </div>
    </header>
  );
}

export default Header;
