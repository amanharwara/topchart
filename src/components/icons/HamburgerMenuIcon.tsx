import { ComponentProps } from "solid-js";

const HamburgerMenuIcon = (props: ComponentProps<"svg">) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    preserveAspectRatio="xMidYMid meet"
    viewBox="0 0 16 16"
    {...props}
  >
    <path
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="1.5"
      d="M2.75 12.25h10.5m-10.5-4h10.5m-10.5-4h10.5"
    />
  </svg>
);

export default HamburgerMenuIcon;
