const Spinner = ({ className }: { className?: string }) => (
  <div
    className={`animate-spin rounded-full border border-solid border-info border-r-transparent ${className}`}
  />
);

export default Spinner;
