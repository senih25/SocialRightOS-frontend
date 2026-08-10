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
    date: "10.10.2021",
    time: "22:09",
    title: "Sentetik toraks BT kaydı",
    detail: "Görüntüleme olayı — yalnız örnek zaman çizelgesi girdisi.",
    category: "imaging",
    source: "SYN-IMG-20211010-2209",
  },
  {
    id: "evt-002",
    date: "15.10.2021",
    time: "10:16",
    title: "Sentetik radyoloji raporu onayı",
    detail: "Rapor olayı — içerik klinik yorum olarak kullanılmaz.",
    category: "imaging",
    source: "SYN-REP-20211015-1016",
  },
  {
    id: "evt-003",
    date: "18.10.2021",
    time: "09:00",
    title: "Sentetik dahiliye ziyareti",
    detail: "Muayene olayı — karar, tanı veya tedavi sonucu üretmez.",
    category: "visit",
    source: "SYN-VIS-20211018-0900",
  },
  {
    id: "evt-004",
    date: "19.10.2021",
    time: "09:30",
    title: "Sentetik kontrol ziyareti",
    detail: "Takip olayı — yalnız longitudinal bağlam gösterimi.",
    category: "visit",
    source: "SYN-VIS-20211019-0930",
  },
  {
    id: "evt-005",
    date: "25.10.2021",
    time: "14:20",
    title: "Sentetik laboratuvar sonucu",
    detail: "Yapısal laboratuvar olayı — gerçek test değeri içermez.",
    category: "lab",
    source: "SYN-LAB-20211025-1420",
  },
  {
    id: "evt-006",
    date: "02.11.2021",
    time: "11:10",
    title: "Sentetik prosedür kaydı",
    detail: "Prosedür olayı — kaynak izi ve sıra kontrolü için fixture.",
    category: "procedure",
    source: "SYN-PROC-20211102-1110",
  },
];

const evidence = [
  { title: "Kaynak kimliği", detail: "Her olay kapalı sentetik kaynak kimliği taşır.", tone: "cyan" },
  { title: "Kronoloji bütünlüğü", detail: "Olaylar tarih ve saat üzerinden deterministik sıralanır.", tone: "violet" },
  { title: "Tutarlılık kapısı", detail: "Eksik veya değiştirilmiş örnek kayıt görünür biçimde başarısız olur.", tone: "lime" },
  { title: "İnsan otoritesi", detail: "Sistem klinik karar üretmez; gelecekteki pilot insan incelemesi gerektirir.", tone: "amber" },
];

const researchQuestions = [
  "Uzunlamasına sağlık olayları kaynak izi korunarak nasıl daha hızlı incelenebilir?",
  "Sentetik klinik veride kanıt boşlukları ve zamanlama çelişkileri nasıl güvenli biçimde bulunabilir?",
  "Biyomedikal literatür ile yapılandırılmış olay zinciri arasında denetlenebilir bağ nasıl kurulabilir?",
  "Gelişmiş yaşam bilimleri modelleri insan kararını ikame etmeden araştırma metodolojisini nasıl güçlendirebilir?",
];

const categoryLabels: Record<Category, string> = {
  all: "Tümü",
  imaging: "Görüntüleme",
  visit: "Ziyaret",
  lab: "Laboratuvar",
  procedure: "Prosedür",
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
        <a className={styles.brand} href="#overview" aria-label="MedTrace Research Pilot ana bölüm">
          <span className={styles.brandMark} aria-hidden="true">M</span>
          <span>
            <strong>MedTrace</strong>
            <small>Research Pilot Demo</small>
          </span>
        </a>
        <nav className={styles.nav} aria-label="Pilot bölümleri">
          <a href="#overview">Overview</a>
          <a href="#timeline">Timeline</a>
          <a href="#evidence">Evidence</a>
          <a href="#research">Research</a>
        </nav>
        <div className={styles.syntheticSeal}>Synthetic only · No real patient data</div>
      </header>

      <section id="overview" className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.projectLabel}>Public research demonstrator</p>
          <h1>Longitudinal health evidence, reconstructed with privacy-first boundaries.</h1>
          <p className={styles.lead}>
            This live pilot shows how MedTrace can organize fully synthetic clinical events into a
            traceable timeline, connect each event to a source identifier, run deterministic
            consistency checks, and keep clinical authority with humans.
          </p>
          <div className={styles.trustRow} aria-label="Pilot sınırları">
            <span>Synthetic data</span>
            <span>Privacy-first</span>
            <span>Human oversight</span>
            <span className={styles.dangerPill}>Not for clinical use</span>
          </div>
          <div className={styles.notice}>
            <strong>Research methodology demonstration only.</strong>
            <span>No diagnosis, treatment recommendation, risk score, or autonomous clinical decision is produced.</span>
          </div>
        </div>

        <aside className={styles.definitionCard}>
          <div className={styles.orbit} aria-hidden="true"><span /></div>
          <div className={styles.definitionContent}>
            <h2>What is demonstrated?</h2>
            <ul>
              <li>Chronological reconstruction of synthetic health events</li>
              <li>Evidence linking through closed source identifiers</li>
              <li>Consistency checks, not clinical validation</li>
              <li>Fail-visible behavior when a fixture is altered</li>
              <li>Human review boundary for any future pilot</li>
            </ul>
          </div>
        </aside>
      </section>

      <section className={styles.metrics} aria-label="Pilot göstergeleri">
        <article><span>06</span><p>Synthetic events</p><small>Across one fictional case</small></article>
        <article><span>06</span><p>Source links</p><small>One per event</small></article>
        <article><span>04</span><p>Evidence principles</p><small>Closed public scope</small></article>
        <article><span>{verification}</span><p>Consistency state</p><small>{mutated ? "Controlled mutation detected" : "Baseline intact"}</small></article>
      </section>

      <section id="timeline" className={styles.workspace}>
        <div className={styles.timelinePanel}>
          <div className={styles.panelHead}>
            <div>
              <p className={styles.sectionLabel}>Synthetic timeline</p>
              <h2>One fictional case, six traceable events</h2>
            </div>
            <div className={styles.filters} role="group" aria-label="Olay filtresi">
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
                  <code>{mutated && event.id === "evt-002" ? `${event.source}-MUTATED` : event.source}</code>
                </div>
              </article>
            ))}
          </div>
        </div>

        <aside id="evidence" className={styles.evidencePanel}>
          <div className={styles.panelHeadCompact}>
            <div>
              <p className={styles.sectionLabel}>Evidence & consistency</p>
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
              Controlled mutation changes one synthetic source identifier. The pilot must surface
              the mismatch instead of silently continuing.
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
          <h2>Questions this pilot is designed to make testable</h2>
          <p>
            The public surface intentionally exposes the research problem and safety boundary,
            not private product code, live-system selectors, production schemas, credentials, or patient data.
          </p>
        </div>
        <div className={styles.questionList}>
          {researchQuestions.map((question, index) => (
            <article key={question}><span>0{index + 1}</span><p>{question}</p></article>
          ))}
        </div>
      </section>

      <section className={styles.publicWork} aria-labelledby="public-work-title">
        <div>
          <p className={styles.sectionLabel}>Public-interest evidence</p>
          <h2 id="public-work-title">Existing public work behind the research direction</h2>
          <p>These links demonstrate ongoing work in synthetic health data and social-impact information systems.</p>
        </div>
        <div className={styles.publicLinks}>
          <a href="https://www.sosyalhakrehberi.com/" target="_blank" rel="noreferrer noopener">
            <strong>Sosyal Hak Rehberi</strong><span>Live public-interest social-rights platform</span>
          </a>
          <a href="https://www.kaggle.com/datasets/senihbayankulu/turkish-clinical-events-datasetsynthetictemporal" target="_blank" rel="noreferrer noopener">
            <strong>Turkish Clinical Events Dataset</strong><span>Public synthetic temporal health dataset</span>
          </a>
          <a href="https://www.kaggle.com/datasets/senihbayankulu/sosyal-yardim-uygunluk-motoru-2026" target="_blank" rel="noreferrer noopener">
            <strong>Sosyal Yardım Uygunluk Motoru 2026</strong><span>Public social-protection research dataset</span>
          </a>
        </div>
      </section>

      <footer className={styles.footer}>
        <div>
          <strong>MedTrace Research Pilot</strong>
          <span>Privacy-first by design · Synthetic-only public demonstrator</span>
        </div>
        <p>No real patient data · No external clinical model execution · No clinical decisions</p>
      </footer>
    </main>
  );
}
