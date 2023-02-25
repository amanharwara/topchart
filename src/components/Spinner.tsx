import classNames from "../utils/classNames";

const Spinner = ({
  className,
  width = 1,
}: {
  className?: string;
  width?: 1 | 2 | 4 | 8;
}) => (
  <div
    className={classNames(
      "animate-spin rounded-full border-solid border-slate-700 dark:border-gray-100 dark:border-r-transparent border-r-transparent",
      width === 1 ? "border" : `border-${width}`,
      className
    )}
  />
);

export default Spinner;
