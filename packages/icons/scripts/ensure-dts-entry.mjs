import { promises as fs } from "node:fs";
import path from "node:path";

const distDir = path.resolve(import.meta.dirname, "..", "dist");
const stableDtsPath = path.join(distDir, "index.d.ts");

async function ensureStableDtsEntry() {
  const files = await fs.readdir(distDir);

  if (files.includes("index.d.ts")) {
    return;
  }

  const hashedDtsFiles = files.filter((file) => /^index-[^/]+\.d\.ts$/.test(file));

  if (hashedDtsFiles.length !== 1) {
    throw new Error(
      `Expected exactly one hashed declaration file in dist/, found ${hashedDtsFiles.length}.`
    );
  }

  const sourcePath = path.join(distDir, hashedDtsFiles[0]);
  const content = await fs.readFile(sourcePath, "utf8");
  await fs.writeFile(stableDtsPath, content, "utf8");
}

ensureStableDtsEntry().catch((error) => {
  process.stderr.write(`${error.stack ?? error.message}\n`);
  process.exitCode = 1;
});
