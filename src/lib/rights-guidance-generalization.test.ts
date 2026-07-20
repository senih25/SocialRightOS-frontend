import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import {
  buildRightsGuidanceApplicationCopy,
  buildRightsGuidanceInput,
  DeterministicRightsGuidanceMockProvider,
  generateRightsGuidanceExplanation,
  type RightsGuidanceApprovedCatalog,
  type RightsGuidanceInputSelection,
  type RightsGuidanceProvider,
} from "./rights-guidance.ts";

type GeneralizationFixture = {
  catalog: RightsGuidanceApprovedCatalog;
  selection: RightsGuidanceInputSelection;
};

const fixtures: readonly GeneralizationFixture[] = [
  {
    catalog: {
      assessmentType: "GSS_PRELIMINARY_GUIDANCE",
      reasons: [
        {
          evidenceId: "EVIDENCE_SYNTHETIC_GSS_GENERALIZATION",
          approvedText: "Sentetik GSS koşulu sağlanmış görünüyor.",
        },
      ],
      nextSteps: [
        {
          evidenceId: "SOURCE_SYNTHETIC_GSS_GENERALIZATION",
          approvedText: "Sentetik GSS kanalından güncel bilgiyi doğrulayın.",
        },
      ],
      limitations: ["Bu sentetik GSS açıklaması resmî karar değildir."],
    },
    selection: {
      assessmentType: "GSS_PRELIMINARY_GUIDANCE",
      coarseDisplayStatus: "CONDITION_APPEARS_SATISFIED",
      reasonEvidenceIds: ["EVIDENCE_SYNTHETIC_GSS_GENERALIZATION"],
      nextStepEvidenceIds: ["SOURCE_SYNTHETIC_GSS_GENERALIZATION"],
      validAsOf: "2026-07-20",
      basisVersion: "synthetic-gss-generalization-v1",
    },
  },
  {
    catalog: {
      assessmentType: "OLD_AGE_PENSION_PRELIMINARY_GUIDANCE",
      reasons: [
        {
          evidenceId: "EVIDENCE_SYNTHETIC_OLD_AGE_GENERALIZATION",
          approvedText: "Sentetik yaşlı aylığı koşulu sağlanmamış görünüyor.",
        },
      ],
      nextSteps: [
        {
          evidenceId: "SOURCE_SYNTHETIC_OLD_AGE_GENERALIZATION",
          approvedText: "Sentetik yaşlı aylığı kanalından güncel bilgiyi doğrulayın.",
        },
      ],
      limitations: ["Bu sentetik yaşlı aylığı açıklaması resmî karar değildir."],
    },
    selection: {
      assessmentType: "OLD_AGE_PENSION_PRELIMINARY_GUIDANCE",
      coarseDisplayStatus: "CONDITION_APPEARS_NOT_SATISFIED",
      reasonEvidenceIds: ["EVIDENCE_SYNTHETIC_OLD_AGE_GENERALIZATION"],
      nextStepEvidenceIds: ["SOURCE_SYNTHETIC_OLD_AGE_GENERALIZATION"],
      validAsOf: "2026-07-20",
      basisVersion: "synthetic-old-age-generalization-v1",
    },
  },
];

test("one guidance input contract accepts GSS and old-age synthetic fixtures", () => {
  for (const fixture of fixtures) {
    const input = buildRightsGuidanceInput(fixture.selection, fixture.catalog);
    assert.equal(input.assessmentType, fixture.selection.assessmentType);
    assert.deepEqual(input.approvedReasons, fixture.catalog.reasons);
    assert.deepEqual(input.approvedNextSteps, fixture.catalog.nextSteps);
    assert.equal("sourcePayload" in input, false);
    assert.equal("validationCarrier" in input, false);
    assert.equal("decisionId" in input, false);
  }
});

test("application-owned authority copy remains outside both model contracts", () => {
  for (const fixture of fixtures) {
    const input = buildRightsGuidanceInput(fixture.selection, fixture.catalog);
    const copy = buildRightsGuidanceApplicationCopy(fixture.selection, fixture.catalog);
    assert.equal(copy.heading, "Ön değerlendirme açıklaması");
    assert.match(copy.disclaimer, /resmî bir uygunluk kararı değildir/u);
    assert.deepEqual(copy.limitations, fixture.catalog.limitations);
    assert.equal("heading" in input, false);
    assert.equal("disclaimer" in input, false);
    assert.equal("limitations" in input, false);
  }
});

test("one provider-independent pipeline preserves exact evidence for both fixtures", async () => {
  const provider = new DeterministicRightsGuidanceMockProvider();
  for (const fixture of fixtures) {
    const input = buildRightsGuidanceInput(fixture.selection, fixture.catalog);
    const result = await generateRightsGuidanceExplanation(input, provider, { enabled: true });
    assert.equal(result.overallStatus, "EXPLANATION_AVAILABLE");
    assert.deepEqual(
      result.reasonExplanations.map((item) => item.evidenceId),
      fixture.selection.reasonEvidenceIds,
    );
    assert.deepEqual(
      result.nextStepExplanations.map((item) => item.evidenceId),
      fixture.selection.nextStepEvidenceIds,
    );
  }
});

test("old-age evidence coverage violations fail closed without changing the shared core", async () => {
  const oldAge = fixtures[1];
  const input = buildRightsGuidanceInput(oldAge.selection, oldAge.catalog);
  const incompleteProvider: RightsGuidanceProvider = {
    mode: "MOCK",
    async generate() {
      return {
        output: { reasonExplanations: [], nextStepExplanations: [] },
        usage: { inputTokens: 0, outputTokens: 0 },
      };
    },
  };
  assert.deepEqual(
    await generateRightsGuidanceExplanation(input, incompleteProvider, { enabled: true }),
    { overallStatus: "UNAVAILABLE", reasonExplanations: [], nextStepExplanations: [] },
  );
});

test("generalization proof adds no second competition UI or runtime scenario", () => {
  const oldAgePage = readFileSync(
    new URL("../app/65-yas-ayligi-uygunluk-testi/OldAgeToolPageClient.tsx", import.meta.url),
    "utf8",
  );
  const runtime = readFileSync(new URL("./build-week-guidance-runtime.ts", import.meta.url), "utf8");
  assert.doesNotMatch(oldAgePage, /BuildWeekGuidancePanel/u);
  assert.doesNotMatch(runtime, /OLD_AGE_PENSION_PRELIMINARY_GUIDANCE/u);
});
