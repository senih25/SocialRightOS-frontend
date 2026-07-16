import { execFileSync } from "node:child_process";

const status = execFileSync("git", ["status", "--porcelain", "--untracked-files=no"], {
  encoding: "utf8",
}).trim();

if (status) {
  console.error("Tracked files changed during verification.");
  console.error(status);
  process.exit(1);
}
console.log("UNEXPECTED_TRACKED_CHANGE_COUNT=0");
