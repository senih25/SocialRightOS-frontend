import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";

const trackedFiles = execFileSync("git", ["ls-files", "-z"], { encoding: "utf8" })
  .split("\0")
  .filter(Boolean);
const untrackedFiles = execFileSync(
  "git",
  ["ls-files", "--others", "--exclude-standard", "-z"],
  { encoding: "utf8" },
)
  .split("\0")
  .filter(Boolean);
const repositoryFiles = [...new Set([...trackedFiles, ...untrackedFiles])];
const textExtensions = new Set([
  ".css", ".html", ".js", ".json", ".jsx", ".md", ".mjs", ".ts", ".tsx", ".txt", ".yml", ".yaml",
]);
const patterns = [
  /ghp_[A-Za-z0-9]{20,}/g,
  /github_pat_[A-Za-z0-9_]{20,}/g,
  /AIza[0-9A-Za-z_-]{20,}/g,
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/g,
  /\bsk-[A-Za-z0-9]{20,}/g,
];

const findings = [];
for (const file of repositoryFiles) {
  if (!existsSync(file)) continue;
  const extension = file.slice(file.lastIndexOf("."));
  if (!textExtensions.has(extension)) continue;
  const content = readFileSync(file, "utf8");
  if (patterns.some((pattern) => (pattern.lastIndex = 0, pattern.test(content)))) findings.push(file);
}

if (findings.length > 0) {
  console.error(`Potential secret patterns found in: ${findings.join(", ")}`);
  process.exit(1);
}
console.log("SECRET_EXPOSURE_COUNT=0");
