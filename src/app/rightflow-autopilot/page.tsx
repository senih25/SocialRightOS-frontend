import type { Metadata } from "next";
import { RightFlowWorkspace } from "./RightFlowWorkspace";

export const metadata: Metadata = {
  title: "RightFlow Autopilot",
  description: "An explainable Qwen-powered social-rights caseworker with deterministic tools and human approval gates.",
};

export default function RightFlowAutopilotPage() {
  return (
    <main>
      <section className="hero-shell">
        <div className="hero-grid">
          <div className="hero-copy min-h-0">
            <div>
              <p className="hero-kicker">Qwen Cloud · Autopilot Agent</p>
              <h1 className="hero-title mt-5 text-[clamp(3rem,7vw,6rem)] text-slate-950">RightFlow Autopilot</h1>
              <p className="hero-lead mt-6 max-w-3xl">
                Turn ambiguous life stories into structured, verifiable social-rights cases—without handing legal decisions to a language model.
              </p>
            </div>
            <div className="hero-note-grid mt-8">
              <div className="hero-note"><p className="hero-note-title">Qwen understands</p><p className="hero-note-body">Extracts explicit facts and selects bounded tools.</p></div>
              <div className="hero-note"><p className="hero-note-title">Humans control</p><p className="hero-note-body">Every consequential step stops for review.</p></div>
            </div>
          </div>
          <aside className="hero-aside">
            <p className="eyebrow">Production boundary</p>
            <h2 className="mt-4 text-3xl font-semibold">AI orchestrates. Rules decide.</h2>
            <div className="mt-6 space-y-3 text-sm leading-7 text-slate-700">
              <p>✓ Strict fact schema</p><p>✓ Prompt-injection boundary</p><p>✓ Fail-closed Qwen fallback</p><p>✓ Auditable execution trace</p><p>✓ Human-in-the-loop approval</p>
            </div>
          </aside>
        </div>
      </section>
      <section className="section-shell pb-10"><RightFlowWorkspace /></section>
    </main>
  );
}
