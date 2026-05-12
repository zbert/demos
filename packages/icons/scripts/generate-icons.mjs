import { promises as fs } from "node:fs";
import path from "node:path";

const packageRoot = path.resolve(import.meta.dirname, "..");
const rawDir = path.join(packageRoot, "src", "raw");
const webComponentsDir = path.join(packageRoot, "src", "web-components");
const legacyComponentsDir = path.join(packageRoot, "src", "components");
const indexFile = path.join(packageRoot, "src", "index.ts");
const manifestFile = path.join(packageRoot, "src", "manifest.ts");

function toPascalCase(fileName) {
  return fileName
    .replace(/\.svg$/i, "")
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join("");
}

function toCamelCase(value) {
  return value.charAt(0).toLowerCase() + value.slice(1);
}

function toKebabCase(fileName) {
  return fileName
    .replace(/\.svg$/i, "")
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((part) => part.toLowerCase())
    .join("-");
}

async function cleanGeneratedFiles() {
  await fs.mkdir(webComponentsDir, { recursive: true });
  const webComponentFiles = await fs.readdir(webComponentsDir);
  await Promise.all(
    webComponentFiles
      .filter((file) => file.endsWith(".ts"))
      .map((file) => fs.unlink(path.join(webComponentsDir, file)))
  );

  try {
    const legacyFiles = await fs.readdir(legacyComponentsDir);
    await Promise.all(
      legacyFiles
        .filter((file) => file.endsWith(".tsx"))
        .map((file) => fs.unlink(path.join(legacyComponentsDir, file)))
    );
  } catch (error) {
    if (error?.code !== "ENOENT") {
      throw error;
    }
  }
}

function buildWebComponentSource({ className, svg, tagName, tagNameExport }) {
  return [
    'import { createIconElement, defineIconElement } from "../icon-element";',
    "",
    `const svg = ${JSON.stringify(svg)};`,
    "",
    `export class ${className} extends createIconElement(svg) {}`,
    "",
    `export const ${tagNameExport} = "${tagName}";`,
    "",
    `defineIconElement(${tagNameExport}, ${className});`,
    "",
    `export default ${className};`,
    ""
  ].join("\n");
}

async function generate() {
  const rawFiles = (await fs.readdir(rawDir))
    .filter((file) => file.endsWith(".svg"))
    .sort((a, b) => a.localeCompare(b));

  if (rawFiles.length === 0) {
    throw new Error(`No SVG files found in ${rawDir}`);
  }

  await cleanGeneratedFiles();

  const manifest = [];

  for (const fileName of rawFiles) {
    const sourcePath = path.join(rawDir, fileName);
    const rawSvg = (await fs.readFile(sourcePath, "utf8")).trim();

    const baseName = toPascalCase(fileName);
    const className = `${baseName}IconElement`;
    const tagName = `repo-icon-${toKebabCase(fileName)}`;
    const tagNameExport = `${toCamelCase(baseName)}IconTagName`;

    const webComponentPath = path.join(webComponentsDir, `${className}.ts`);
    await fs.writeFile(
      webComponentPath,
      buildWebComponentSource({ className, svg: rawSvg, tagName, tagNameExport }),
      "utf8"
    );

    manifest.push({
      name: fileName.replace(/\.svg$/i, ""),
      className,
      tagName,
      tagNameExport,
      sourceFile: `src/raw/${fileName}`
    });
  }

  const exportLines = manifest.map(
    ({ className, tagNameExport }) =>
      `export { default as ${className}, ${tagNameExport} } from "./web-components/${className}";`
  );

  const indexContent = [
    'export type { IconElementConstructor, IconManifestItem } from "./types";',
    'export { defineIconElement } from "./icon-element";',
    'export { iconsManifest } from "./manifest";',
    ...exportLines,
    ""
  ].join("\n");

  const manifestItems = manifest
    .map(
      (item) =>
        `  { name: "${item.name}", className: "${item.className}", tagName: "${item.tagName}", sourceFile: "${item.sourceFile}" }`
    )
    .join(",\n");

  const manifestContent = [
    'import type { IconManifestItem } from "./types";',
    "",
    "export const iconsManifest: IconManifestItem[] = [",
    manifestItems,
    "];",
    ""
  ].join("\n");

  await fs.writeFile(indexFile, indexContent, "utf8");
  await fs.writeFile(manifestFile, manifestContent, "utf8");

  process.stdout.write(`Generated ${manifest.length} icon web components.\n`);
}

generate().catch((error) => {
  process.stderr.write(`${error.stack ?? error.message}\n`);
  process.exitCode = 1;
});
