export function Loader() {
  return (
    <div
      className={[
        "fixed",
        "top-0",
        "left-0",
        "w-full",
        "h-full",
        "z-50",
        "flex",
        "justify-center",
        "items-center",
        "bg-gray-900",
        "bg-opacity-50",
      ].join(" ")}
    >
      <div className="w-16 h-16 border-4 border-t-ui-primary border-b-ui-light rounded-full animate-spin"></div>
    </div>
  );
}
