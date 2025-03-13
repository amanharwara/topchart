import { OverlayArrow } from "react-aria-components";

export function PopoverArrow() {
  return (
    <OverlayArrow>
      <svg
        width={8}
        height={8}
        viewBox="0 0 8 8"
        className="dark:fill-slate-600 fill-slate-100"
      >
        <path d="M0 0 L4 4 L8 0" />
      </svg>
    </OverlayArrow>
  );
}
