"use client";

import { useMemo, useState } from "react";
import styles from "./pilot.module.css";

type Category = "all" | "imaging" | "visit" | "lab" | "procedure";

type EventItem = {
  id: string;
  date: string;
  time: string;
  title: string;
  detail: string;
  category: Exclude<Category, "all">;
  source: string;
};

const events: EventItem[] = [
  {
    id: "evt-001",
    date: "07.01.2026",
    time: "09:20",
    title: "Synthetic outpatient encounter",
    detail: "A fictional source event used only to demonstrate traceable longitudinal organization.",
    category: "visit",
    source: "SYN-VIS-20260107-0920",
  },
  {
    id: "evt-002",
    date: "07.01.2026",
    time: "10:05",
    title: "Synthetic laboratory record",
    detail: "A structured fixture with no real laboratory value or identifiable health information.",
    category: "lab",
    source: "SYN-LAB-20260107-1005",
  },
  {
    id: "evt-003",
    date: "12.01.2026",
    time: "14:40",
    title: "Synthetic imaging index event",
    detail: "An imaging metadata fixture; no image, DICOM object, diagnosis, or interpretation is included.",
    category: "imaging",
    source: "SYN-IMG-20260112-1440",
  },
  {
    id: "evt-004",
    date: "15.01.2026",
    time: "11:15",
    title: "Synthetic report index event",
    detail: "A fictional report reference used to test chronology and provenance continuity only.",
    category: "imaging",
    source: "SYN-REP-20260115-1115",
  },
  {
    id: "evt-005",
    date: "22.01.2026",
    time: "08:50",
    title: "Synthetic follow-up encounter",
    detail: "A second fictional visit used to demonstrate longitudinal review without clinical inference.",
    category: "visit",
    source: "SYN-VIS-20260122-0850",
  },
  {
    id: "evt-006",
    date: "03.02.2026",
    time: "13:30",
    title: "Synthetic procedure record",
    detail: "A synthetic fixture used to verify source lineage and deterministic ordering.",
    category: "procedure",
    source: "SYN-PROC-20260203-1330",
  },
];

const evidence = [
  { title: "Source identity", detail: "Every event carries a closed synthetic source identifier.", tone: "cyan" },
  { title: "Chronology integrity", detail: "Events are ordered deterministically by date and time.", tone: "violet" },
  { title: "Fail-visible consistency", detail: "A missing or altered fixture is surfaced instead of silently accepted.", tone: "lime" },
  { title: "Human authority", detail: "No clinical decision is generated; any future controlled study requires human review.", tone: "amber" },
];

const researchQuestions = [
  "Can fragmented longitudinal records be organized into a traceable evidence view without exposing real patient data during early research?",
  "Can evidence gaps, ordering problems, and source inconsistencies be detected deterministically before AI-assisted interpretation is introduced?",
  "Can biomedical literature be linked to structured events while keeping source evidence, model inference, and human judgment explicitly separate?",
  "Can the methodology validated first in Türkiye generalize to source-independent international health-data research settings?",
];

const categoryLabels: Record<Category, string> = {
  all: "All",
  imaging: "Imaging",
  visit: "Encounter",
  lab: "Laboratory",
  procedure: "Procedure",
};

export default function MedTracePilot() {
  const [filter, setFilter] = useState<Category>("all");
  const [mutated, setMutated] = useState(false);

  const visibleEvents = useMemo(
    () => events.filter((event) => filter === "all" || event.category === filter),
    [filter],
  );

  const verification = mutated ? "FAIL" : "PASS";

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <a className={styles.brand} href="#overview" aria-label="MedTrace Research Pilot overview">
          <span className={styles.brandMark} aria-hidden="true">M</span>
          <span>
            <strong>MedTrace</strong>
            <small>Longitudinal Evidence Research Pilot</small>
          </span>
        </a>
        <nav className={styles.nav} aria-label="Pilot sections">
          <a href="#overview">Overview</a>
          <a href="#timeline">Timeline</a>
          <a href="#evidence">Evidence</a>
          <a href="#research">Research</a>
        </nav>
        <div className={styles.syntheticSeal}>Synthetic only · No real patient data</div>
      </header>

      <section id="overview" className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.projectLabel}>Public research demonstrator · Türkiye-first, internationally oriented</p>
          <h1>Turning fragmented health events into traceable evidence before AI becomes part of the workflow.</h1>
          <p className={styles.lead}>
            MedTrace is a privacy-first research program for organizing authorized health-record information into
            source-preserving, chronological views. This public pilot intentionally uses only fictional fixtures to
            demonstrate the evidence layer: capture-independent event structure, provenance continuity, deterministic
            consistency checks, and explicit human authority.
          </p>
          <div className={styles.trustRow} aria-label="Pilot boundaries">
            <span>Synthetic-first</span>
            <span>Local-first design target</span>
            <span>Evidence over assertion</span>
            <span>Human oversight</span>
            <span className={styles.dangerPill}>Not for clinical use</span>
          </div>
          <div className={styles.notice}>
            <strong>Research methodology demonstration only.</strong>
            <span>No diagnosis, treatment recommendation, risk score, triage, alert, or autonomous clinical decision is produced.</span>
          </div>
        </div>

        <aside className={styles.definitionCard}>
          <div className={styles.orbit} aria-hidden="true"><span /></div>
          <div className={styles.definitionContent}>
            <h2>What is actually demonstrated?</h2>
            <ul>
              <li>Source-preserving reconstruction of synthetic longitudinal events</li>
              <li>Deterministic ordering and loss-visible consistency behavior</li>
              <li>Clear separation between source evidence and future AI-assisted reasoning</li>
              <li>Public claims constrained to synthetic validation, not clinical effectiveness</li>
              <li>A research path from synthetic benchmark to controlled human-reviewed studies</li>
            </ul>
          </div>
        </aside>
      </section>

      <section className={styles.metrics} aria-label="Pilot indicators">
        <article><span>06</span><p>Synthetic events</p><small>One entirely fictional case</small></article>
        <article><span>06</span><p>Source identities</p><small>One closed identifier per event</small></article>
        <article><span>04</span><p>Research safeguards</p><small>Evidence, privacy, determinism, human authority</small></article>
        <article><span>{verification}</span><p>Consistency state</p><small>{mutated ? "Controlled mutation detected" : "Synthetic baseline intact"}</small></article>
      </section>

      <section id="timeline" className={styles.workspace}>
        <div className={styles.timelinePanel}>
          <div className={styles.panelHead}>
            <div>
              <p className={styles.sectionLabel}>Synthetic longitudinal record</p>
              <h2>One fictional case, six source-linked events</h2>
            </div>
            <div className={styles.filters} role="group" aria-label="Event filter">
              {(Object.keys(categoryLabels) as Category[]).map((category) => (
                <button
                  key={category}
                  type="button"
                  className={filter === category ? styles.activeFilter : ""}
                  onClick={() => setFilter(category)}
                >
                  {categoryLabels[category]}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.timelineList}>
            {visibleEvents.map((event, index) => (
              <article className={styles.eventRow} key={event.id}>
                <div className={styles.timeBlock}>
                  <strong>{event.date}</strong>
                  <span>{event.time}</span>
                </div>
                <div className={styles.eventRail} aria-hidden="true">
                  <span className={`${styles.dot} ${styles[event.category]}`} />
                  {index < visibleEvents.length - 1 ? <i /> : null}
                </div>
                <div className={styles.eventBody}>
                  <div className={styles.eventTitleRow}>
                    <h3>{event.title}</h3>
                    <span className={`${styles.categoryTag} ${styles[event.category]}`}>{categoryLabels[event.category]}</span>
                  </div>
                  <p>{event.detail}</p>
                  <code>{mutated && event.id === "evt-004" ? `${event.source}-MUTATED` : event.source}</code>
                </div>
              </article>
            ))}
          </div>
        </div>

        <aside id="evidence" className={styles.evidencePanel}>
          <div className={styles.panelHeadCompact}>
            <div>
              <p className={styles.sectionLabel}>Evidence integrity demonstration</p>
              <h2>Fail-visible by design</h2>
            </div>
            <strong className={`${styles.verification} ${mutated ? styles.fail : styles.pass}`}>{verification}</strong>
          </div>

          <div className={styles.evidenceStack}>
            {evidence.map((item) => (
              <article key={item.title} className={styles.evidenceCard} data-tone={item.tone}>
                <span className={styles.evidenceIcon} aria-hidden="true">✓</span>
                <div><h3>{item.title}</h3><p>{item.detail}</p></div>
              </article>
            ))}
          </div>

          <div className={styles.mutationBox}>
            <p>
              The controlled mutation changes one fictional source identifier. The demonstration must expose the
              mismatch instead of presenting an unchanged success state. This is a consistency check, not clinical validation.
            </p>
            <button type="button" onClick={() => setMutated((value) => !value)}>
              {mutated ? "Restore synthetic baseline" : "Run controlled mutation"}
            </button>
          </div>
        </aside>
      </section>

      <section id="research" className={styles.researchSection}>
        <div className={styles.researchIntro}>
          <p className={styles.sectionLabel}>Research direction</p>
          <h2>Türkiye is the first research context, not the architectural boundary</h2>
          <p>
            MedTrace starts from the practical realities of health-record review in Türkiye, while the underlying
            research problem is broader: how source-independent longitudinal events, provenance, privacy controls,
            deterministic validation, and human review can support trustworthy health-data research across systems.
          </p>
        </div>
        <div className={styles.questionList}>
          {researchQuestions.map((question, index) => (
            <article key={question}><span>0{index + 1}</span><p>{question}</p></article>
          ))}
        </div>
      </section>

      <section className={styles.publicWork} aria-labelledby="rosalind-scope-title">
        <div>
          <p className={styles.sectionLabel}>Proposed GPT-Rosalind research scope</p>
          <h2 id="rosalind-scope-title">What we want to evaluate — and what we are not asking for</h2>
          <p>
            The proposed first phase is a tightly scoped, synthetic-only research evaluation led by one researcher.
            It does not request autonomous clinical deployment or patient-facing model use.
          </p>
        </div>
        <div className={styles.publicLinks}>
          <article><strong>Biomedical evidence synthesis</strong><span>Compare scientific literature with structured research questions and clearly separate evidence from inference.</span></article>
          <article><strong>Longitudinal event reasoning</strong><span>Study temporal relationships, missing evidence, and contradictions in reproducible synthetic cases.</span></article>
          <article><strong>Research-method support</strong><span>Improve protocol design, evidence extraction, evaluation criteria, and reproducible analysis workflows.</span></article>
          <article><strong>Controlled collaboration path</strong><span>Start with one researcher; expand only after methodology review to a small human-reviewed research or clinical evaluation team.</span></article>
        </div>
      </section>

      <section className={styles.publicWork} aria-labelledby="public-work-title">
        <div>
          <p className={styles.sectionLabel}>Existing public-interest work</p>
          <h2 id="public-work-title">Research artifacts already in public use</h2>
          <p>These public links show that the proposal extends ongoing work rather than starting from a speculative idea.</p>
        </div>
        <div className={styles.publicLinks}>
          <a href="https://www.sosyalhakrehberi.com/" target="_blank" rel="noreferrer noopener">
            <strong>Sosyal Hak Rehberi</strong><span>Live public-interest social-rights information platform</span>
          </a>
          <a href="https://www.kaggle.com/datasets/senihbayankulu/turkish-clinical-events-datasetsynthetictemporal" target="_blank" rel="noreferrer noopener">
            <strong>Turkish Clinical Events Dataset</strong><span>Public synthetic temporal health-data research artifact</span>
          </a>
          <a href="https://www.kaggle.com/datasets/senihbayankulu/sosyal-yardim-uygunluk-motoru-2026" target="_blank" rel="noreferrer noopener">
            <strong>Sosyal Yardım Uygunluk Motoru 2026</strong><span>Public social-protection research dataset</span>
          </a>
        </div>
      </section>

      <footer className={styles.footer}>
        <div>
          <strong>MedTrace Longitudinal Evidence Research Pilot</strong>
          <span>Synthetic-first · Privacy-first · Evidence over assertion · Human authority</span>
        </div>
        <p>No real patient data · No external clinical model execution · No clinical decisions</p>
      </footer>
    </main>
  );
}
