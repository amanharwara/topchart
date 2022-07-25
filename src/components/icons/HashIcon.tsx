import { ComponentProps } from "solid-js";

const HashIcon = (props: ComponentProps<"svg">) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    preserveAspectRatio="xMidYMid meet"
    viewBox="0 0 24 24"
    {...props}
  >
    <path
      fill="currentColor"
      d="M16.018 3.815L15.232 8h-4.966l.716-3.815l-1.964-.37L8.232 8H4v2h3.857l-.751 4H3v2h3.731l-.714 3.805l1.965.369L8.766 16h4.966l-.714 3.805l1.965.369l.783-4.174H20v-2h-3.859l.751-4H21V8h-3.733l.716-3.815l-1.965-.37zM14.106 14H9.141l.751-4h4.966l-.752 4z"
    />
  </svg>
);

export default HashIcon;
