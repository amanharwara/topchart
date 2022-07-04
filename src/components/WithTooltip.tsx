import * as Tooltip from "@radix-ui/react-tooltip";
import { ReactNode } from "react";

type Props = {
  label: string;
  children: ReactNode;
};

const WithTooltip = ({ label, children }: Props) => {
  return (
    <Tooltip.Root delayDuration={400}>
      <Tooltip.Trigger asChild={true}>{children}</Tooltip.Trigger>
      <Tooltip.Content
        className="rounded bg-gray-900 px-2.5 py-1.5 text-sm text-white"
        sideOffset={4}
      >
        {label}
      </Tooltip.Content>
    </Tooltip.Root>
  );
};

export default WithTooltip;
