import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

const forbiddenCommandPatterns = [
  /(?:^|\s)--prod(?:\s|$)/i,
  /--target(?:=|\s+)production(?:\s|$)/i,
  /\b(?:promote|rollback|alias|domains?|dns)\b/i,
  /--(?:build-)?env\b/i,
];

export function validatePreviewSafety(input) {
  const errors = [];
  const command = input.command.trim();

  if (input.branch === "main") errors.push("Current branch must not be main.");
  if (!input.worktreeClean) errors.push("Worktree must be clean.");
  if (!input.expectedMainIsAncestor) errors.push("Expected main SHA must be an ancestor of HEAD.");
  if (!input.linkExists) errors.push("An explicit isolated Vercel project link is required.");
  if (input.linkedProjectId !== input.expectedProjectId) errors.push("Linked project ID mismatch.");
  if (input.linkedOrgId !== input.expectedOrgId) errors.push("Linked team/scope mismatch.");
  if (!input.projectIsIsolated) errors.push("Project isolation is not verified.");
  if (input.customDomainCount !== 0) errors.push("Custom domains are forbidden.");
  if (input.productionAliasCount !== 0) errors.push("Production aliases are forbidden.");
  if (input.productionSecretCount !== 0) errors.push("Production environment secrets are forbidden.");
  if (input.existingDeploymentCount !== 0) errors.push("Isolated project must have zero deployments.");
  if (input.attemptNumber !== 1) errors.push("Preview attempt budget must resolve to exactly one.");
  if (!/^vercel deploy --yes --scope [a-z0-9._-]+$/i.test(command)) {
    errors.push("Resolved command must use the verified default preview form.");
  }
  if (forbiddenCommandPatterns.some((pattern) => pattern.test(command))) {
    errors.push("Resolved command contains a forbidden production or mutation token.");
  }
  if (!input.rollbackVerified) errors.push("Rollback command and authority must be verified.");
  if (!input.targetVerificationDefined) errors.push("Two-source target verification must be defined.");

  return {
    pass: errors.length === 0,
    errors,
    markers: {
      PREVIEW_PREFLIGHT: errors.length === 0 ? "PASS" : "FAIL",
      PREVIEW_ATTEMPT_BUDGET: input.attemptNumber,
      PRODUCTION_PROJECT_LINKED: input.projectIsIsolated ? "NO" : "UNKNOWN",
      CUSTOM_DOMAIN_COUNT: input.customDomainCount,
      PRODUCTION_ALIAS_COUNT: input.productionAliasCount,
      PRODUCTION_SECRET_USE_COUNT: input.productionSecretCount,
    },
  };
}

function git(...args) {
  return execFileSync("git", args, { encoding: "utf8" }).trim();
}

function runCli() {
  const linkPath = process.env.VERCEL_LINK_PATH ?? ".vercel/project.json";
  const linkExists = existsSync(linkPath);
  const link = linkExists ? JSON.parse(readFileSync(linkPath, "utf8")) : {};
  let expectedMainIsAncestor = false;
  try {
    execFileSync("git", ["merge-base", "--is-ancestor", process.env.EXPECTED_MAIN_SHA ?? "", "HEAD"]);
    expectedMainIsAncestor = true;
  } catch {
    expectedMainIsAncestor = false;
  }

  const result = validatePreviewSafety({
    branch: git("branch", "--show-current"),
    worktreeClean: git("status", "--porcelain") === "",
    expectedMainIsAncestor,
    linkExists,
    linkedProjectId: link.projectId,
    linkedOrgId: link.orgId,
    expectedProjectId: process.env.EXPECTED_VERCEL_PROJECT_ID,
    expectedOrgId: process.env.EXPECTED_VERCEL_ORG_ID,
    projectIsIsolated: process.env.PROJECT_IS_ISOLATED === "YES",
    customDomainCount: Number(process.env.CUSTOM_DOMAIN_COUNT ?? -1),
    productionAliasCount: Number(process.env.PRODUCTION_ALIAS_COUNT ?? -1),
    productionSecretCount: Number(process.env.PRODUCTION_SECRET_COUNT ?? -1),
    existingDeploymentCount: Number(process.env.EXISTING_DEPLOYMENT_COUNT ?? -1),
    attemptNumber: Number(process.env.PREVIEW_ATTEMPT_NUMBER ?? -1),
    command: process.env.RESOLVED_PREVIEW_COMMAND ?? "",
    rollbackVerified: process.env.ROLLBACK_VERIFIED === "YES",
    targetVerificationDefined: process.env.TARGET_VERIFICATION_DEFINED === "YES",
  });

  console.log(JSON.stringify(result, null, 2));
  if (!result.pass) process.exitCode = 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) runCli();
