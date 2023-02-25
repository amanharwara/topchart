import { ComponentPropsWithoutRef } from "react";

const ExportIcon = (props: ComponentPropsWithoutRef<"svg">) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    viewBox="0 0 36 36"
    {...props}
  >
    <path fill="currentColor" d="M6 22h24v2H6z" />
    <path
      fill="currentColor"
      d="M30.84 13.37A1.94 1.94 0 0 0 28.93 12h-2.38a3 3 0 0 1-.14 2h2.54c1.05 2.94 2.77 7.65 3.05 8.48V30H4v-7.52C4.28 21.65 7.05 14 7.05 14h2.53a3 3 0 0 1-.14-2H7.07a1.92 1.92 0 0 0-1.9 1.32C2 22 2 22.1 2 22.33V30a2 2 0 0 0 2 2h28a2 2 0 0 0 2-2v-7.67c0-.23 0-.33-3.16-8.96Z"
    />
    <path
      fill="currentColor"
      d="m18 19.84l6.38-6.35A1 1 0 1 0 23 12.08L19 16V4a1 1 0 1 0-2 0v12l-4-3.95a1 1 0 0 0-1.41 1.42Z"
    />
    <path fill="none" d="M0 0h36v36H0z" />
  </svg>
);

export default ExportIcon;
