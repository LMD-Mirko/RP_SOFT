export function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none h-10 px-7 text-white";

  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-400",
    secondary: "bg-gray-200 hover:bg-gray-300 focus:ring-gray-400",
    ghost: "bg-transparent hover:bg-gray-100",
    outline: "border border-gray-300 hover:bg-gray-100",
    success: "bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-400",
    light:
      "bg-white border border-gray-300 hover:bg-gray-50 focus:ring-gray-300",
    dark: "bg-black hover:bg-neutral-800 focus:ring-black",
  };

  return (
    <button
      className={`${base} ${
        variants[variant] ?? variants.primary
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
