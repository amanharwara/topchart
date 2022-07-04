import IconButton from "./IconButton";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import Icon from "./Icon";
import DropdownMenuItem from "./DropdownMenu/MenuItem";

type Props = {};

const HeaderMenu = ({}: Props) => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild={true}>
        <IconButton
          icon="hamburger-menu"
          label="Options menu"
          className="md:hidden"
        />
      </DropdownMenu.Trigger>
      <DropdownMenu.Content className="rounded bg-gray-900 px-1.5 py-2 text-white">
        <DropdownMenuItem>
          <Icon icon="settings" className="h-5 w-5" />
          App settings
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Icon icon="bugs" className="h-5 w-5" />
          Report an issue
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Icon icon="sponsor" className="h-5 w-5" />
          Donate / Sponsor
        </DropdownMenuItem>
        <DropdownMenu.Arrow offset={8} className="fill-gray-900" />
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export default HeaderMenu;
