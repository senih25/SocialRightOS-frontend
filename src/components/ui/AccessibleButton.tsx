import React from "react";

type Variant = "turquoise" | "orange";

interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  children: React.ReactNode;
}

const variantClasses: Record<Variant, string> = {
  turquoise:
    "bg-[var(--accent)] text-white hover:bg-[var(--accent-deep)] border-transparent",
  orange: "bg-[var(--action)] text-white hover:bg-orange-600 border-transparent",
};

export default function AccessibleButton({
  variant = "turquoise",
  className = "",
  children,
  ...rest
}: AccessibleButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-lg font-semibold disabled:opacity-60 transition-shadow focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300 focus-visible:ring-offset-2 min-h-14 min-w-44 px-6 py-3";

  return (
    <button
      {...rest}
      className={[base, variantClasses[variant], className].filter(Boolean).join(" ")}
      aria-pressed={rest["aria-pressed"]}
    >
      {children}
    </button>
  );
}
