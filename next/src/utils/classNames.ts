export default function classNames(
  ...values: (string | boolean | (() => string) | undefined)[]
): string {
  return values
    .map((value) => {
      if (typeof value === "string") {
        return value;
      } else if (typeof value === "function") {
        return value();
      } else {
        return null;
      }
    })
    .join(" ");
}
