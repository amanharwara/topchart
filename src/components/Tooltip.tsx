import { ReactNode } from "react";
import { TooltipTrigger, Tooltip as RacTooltip } from "react-aria-components";
import { PopoverArrow } from "./PopoverArrow";

export function Tooltip({
  content,
  children,
}: {
  content: ReactNode;
  children: ReactNode;
}) {
  return (
    <TooltipTrigger delay={500}>
      {children}
      <RacTooltip className="dark:bg-slate-600 dark:text-white bg-slate-100 py-1 px-2.5 rounded border border-gray-800 dark:border-0 mt-2">
        <PopoverArrow />
        {content}
      </RacTooltip>
    </TooltipTrigger>
  );
}
