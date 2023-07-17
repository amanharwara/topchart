import clsx, { type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export default function classNames(...values: ClassValue[]): string {
  return twMerge(clsx(...values));
}
