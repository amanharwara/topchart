import * as Tooltip from "@radix-ui/react-tooltip";
import { ComponentPropsWithoutRef, forwardRef, ReactNode, Ref } from "react";
import type { IconType } from "../icons";
import Icon from "./Icon";

type Props = {
  icon: IconType;
  label: string;
} & ComponentPropsWithoutRef<"button">;

const IconButton = forwardRef(
  ({ icon, label, ...props }: Props, ref: Ref<HTMLButtonElement>) => (
    <Tooltip.Root delayDuration={450}>
      <Tooltip.Trigger>
        <button
          aria-label={label}
          className="flex items-center gap-2 rounded border border-slate-600 p-1.5 hover:bg-slate-600"
          ref={ref}
          {...props}
        >
          <Icon icon={icon} className="h-4 w-4 text-white" />
        </button>
      </Tooltip.Trigger>
      <Tooltip.Content
        className="rounded bg-gray-900 px-2 py-1.5 text-white"
        sideOffset={4}
      >
        {label}
      </Tooltip.Content>
    </Tooltip.Root>
  )
);

export default IconButton;
