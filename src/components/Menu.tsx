import {
  MenuItemProps,
  MenuProps,
  Popover,
  Menu as RacMenu,
  MenuItem as RacMenuItem,
} from "react-aria-components";
import { PopoverArrow } from "./PopoverArrow";
import classNames from "../utils/classNames";

export function Menu({
  className,
  ...props
}: Omit<MenuProps<object>, "className"> & {
  className?: string;
}) {
  return (
    <Popover className="min-w-[20ch]">
      <PopoverArrow />
      <RacMenu
        className={classNames(
          "dark:bg-slate-600 dark:text-white bg-slate-100 py-1 rounded border border-gray-800 z-50",
          className
        )}
        {...props}
      >
        {props.children}
      </RacMenu>
    </Popover>
  );
}

export function MenuItem({
  className,
  ...props
}: Omit<MenuItemProps<object>, "className"> & {
  className?: string;
}) {
  return (
    <RacMenuItem
      className={classNames(
        "flex items-center gap-3 py-1.5 px-4 cursor-pointer dark:hover:bg-slate-700 dark:focus:bg-slate-700 hover:bg-slate-300 focus:bg-slate-300",
        className
      )}
      {...props}
    >
      {props.children}
    </RacMenuItem>
  );
}
