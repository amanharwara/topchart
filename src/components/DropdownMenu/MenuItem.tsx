import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
} & DropdownMenu.DropdownMenuItemProps;

const DropdownMenuItem = ({ children, ...props }: Props) => {
  return (
    <DropdownMenu.Item
      className="flex cursor-pointer items-center gap-2.5 rounded px-3.5 py-2.5 hover:bg-gray-800 hover:shadow-none hover:outline-none focus:bg-gray-800 focus:shadow-none focus:outline-none"
      {...props}
    >
      {children}
    </DropdownMenu.Item>
  );
};

export default DropdownMenuItem;
