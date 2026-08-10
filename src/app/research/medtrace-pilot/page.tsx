import type { Metadata } from "next";
import MedTracePilot from "./pilot-client";

export const metadata: Metadata = {
  title: "MedTrace Research Pilot — Synthetic Longitudinal Evidence",
  description:
    "A public, synthetic-only MedTrace research pilot demonstrating longitudinal clinical event reconstruction, evidence consistency checks, provenance links, and human-review boundaries.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function MedTracePilotPage() {
  return <MedTracePilot />;
}
