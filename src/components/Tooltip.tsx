import {
  Tooltip as AriakitTooltip,
  TooltipAnchor,
  TooltipArrow,
  useTooltipStore,
} from "@ariakit/react";

const Tooltip = ({
  text,
  children,
  forceHide,
}: {
  text: string;
  children: React.ReactNode;
  forceHide?: boolean;
}) => {
  const state = useTooltipStore({
    gutter: -1,
    open: forceHide ? false : undefined,
  });

  return (
    <>
      <TooltipAnchor className="hidden md:block" store={state}>
        {children}
      </TooltipAnchor>
      <AriakitTooltip
        store={state}
        className="dark:bg-slate-600 dark:text-white bg-slate-100 py-1 px-2.5 rounded border border-gray-800 dark:border-0"
      >
        <TooltipArrow />
        {text}
      </AriakitTooltip>
    </>
  );
};

export default Tooltip;
