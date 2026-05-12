import { promises as fs } from "node:fs";
import path from "node:path";

const packageRoot = path.resolve(import.meta.dirname, "..");
const rawDir = path.join(packageRoot, "src", "raw");
const componentsDir = path.join(packageRoot, "src", "components");
const webComponentsDir = path.join(packageRoot, "src", "web-components");
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

function toKebabCase(fileName) {
  return fileName
    .replace(/\.svg$/i, "")
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((part) => part.toLowerCase())
    .join("-");
}

async function cleanGeneratedComponents() {
  await fs.rm(componentsDir, { force: true, recursive: true });
  await fs.mkdir(webComponentsDir, { recursive: true });

  const files = await fs.readdir(webComponentsDir);
  await Promise.all(
    files
      .filter((file) => file.endsWith(".ts"))
      .map((file) => fs.unlink(path.join(webComponentsDir, file)))
  );
}

function buildElementSource({ className, fileName, tagName }) {
  return `/// <reference path="../svg.d.ts" />
import type { TemplateResult } from "lit";
import { defineIconElement, IconElement } from "../icon-element";
import svgSource from "../raw/${fileName}";

export class ${className} extends IconElement {
  static readonly tagName = "${tagName}";

  protected override renderSvg(): TemplateResult {
    return this.renderSvgSource(svgSource);
  }
}

defineIconElement(${className}.tagName, ${className});

declare global {
  interface HTMLElementTagNameMap {
    "${tagName}": ${className};
  }
}
`;
}

async function generate() {
  const rawFiles = (await fs.readdir(rawDir))
    .filter((file) => file.endsWith(".svg"))
    .sort((a, b) => a.localeCompare(b));

  if (rawFiles.length === 0) {
    throw new Error(`No SVG files found in ${rawDir}`);
  }

  await cleanGeneratedComponents();

  const manifest = [];

  for (const fileName of rawFiles) {
    const baseName = toPascalCase(fileName);
    const elementName = `${baseName}IconElement`;
    const tagName = `repo-${toKebabCase(fileName)}-icon`;

    const elementPath = path.join(webComponentsDir, `${elementName}.ts`);
    const elementSource = buildElementSource({
      className: elementName,
      fileName,
      tagName
    });
    await fs.writeFile(elementPath, `${elementSource.trim()}\n`, "utf8");

    manifest.push({
      name: fileName.replace(/\.svg$/i, ""),
      elementName,
      tagName,
      sourceFile: `src/raw/${fileName}`
    });
  }

  const exportLines = manifest.map(
    ({ elementName }) =>
      `export { ${elementName} } from "./web-components/${elementName}";`
  );

  const indexContent = [
    'export type { IconElementConstructor, IconManifestItem } from "./types";',
    'export { defineIconElement, IconElement } from "./icon-element";',
    'export { iconsManifest } from "./manifest";',
    ...exportLines,
    ""
  ].join("\n");

  const manifestItems = manifest
    .map(
      (item) =>
        `  { name: "${item.name}", elementName: "${item.elementName}", tagName: "${item.tagName}", sourceFile: "${item.sourceFile}" }`
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

  process.stdout.write(`Generated ${manifest.length} icon components.\n`);
}

generate().catch((error) => {
  process.stderr.write(`${error.stack ?? error.message}\n`);
  process.exitCode = 1;
});
