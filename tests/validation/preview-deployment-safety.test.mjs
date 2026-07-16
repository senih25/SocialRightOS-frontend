import assert from "node:assert/strict";
import test from "node:test";
import { validatePreviewSafety } from "../../scripts/validation/validate-preview-deployment-safety.mjs";

const safeInput = {
  branch: "chore/m2.1-safe-preview-target-recovery",
  worktreeClean: true,
  expectedMainIsAncestor: true,
  linkExists: true,
  linkedProjectId: "prj_preview",
  linkedOrgId: "team_preview",
  expectedProjectId: "prj_preview",
  expectedOrgId: "team_preview",
  projectIsIsolated: true,
  customDomainCount: 0,
  productionAliasCount: 0,
  productionSecretCount: 0,
  existingDeploymentCount: 0,
  attemptNumber: 1,
  command: "vercel deploy --yes --scope safe-preview-team",
  rollbackVerified: true,
  targetVerificationDefined: true,
};

test("passes only an isolated single-attempt default preview plan", () => {
  const result = validatePreviewSafety(safeInput);
  assert.equal(result.pass, true);
  assert.deepEqual(result.errors, []);
  assert.equal(result.markers.PRODUCTION_PROJECT_LINKED, "NO");
});

test("rejects production, alias, domain, DNS and environment mutation commands", () => {
  for (const command of [
    "vercel deploy --yes --prod --scope safe-preview-team",
    "vercel deploy --yes --target=production --scope safe-preview-team",
    "vercel promote deployment",
    "vercel alias set deployment domain",
    "vercel domains add example.com",
    "vercel dns add example.com @ A 1.2.3.4",
    "vercel deploy --yes --env SECRET=value --scope safe-preview-team",
  ]) {
    assert.equal(validatePreviewSafety({ ...safeInput, command }).pass, false, command);
  }
});

test("rejects main, dirty tree, wrong link, non-isolated state and attempt reuse", () => {
  for (const override of [
    { branch: "main" },
    { worktreeClean: false },
    { expectedMainIsAncestor: false },
    { linkedProjectId: "wrong" },
    { linkedOrgId: "wrong" },
    { projectIsIsolated: false },
    { customDomainCount: 1 },
    { productionAliasCount: 1 },
    { productionSecretCount: 1 },
    { existingDeploymentCount: 1 },
    { attemptNumber: 2 },
    { rollbackVerified: false },
    { targetVerificationDefined: false },
  ]) {
    assert.equal(validatePreviewSafety({ ...safeInput, ...override }).pass, false);
  }
});
