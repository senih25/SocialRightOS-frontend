import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Evde bakım maaşı hesaplama",
  description:
    "Evde bakım maaşı için hane, gelir ve bakım bilgileriyle anonim ön değerlendirme yapmanızı sağlayan hesaplama aracı. Resmî karar vermez.",
  alternates: {
    canonical: "/evde-bakim-maasi/hesaplama",
  },
};

export default function HomeCareCalculatorLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return children;
}
