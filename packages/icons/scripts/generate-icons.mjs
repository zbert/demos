import { promises as fs } from "node:fs";
import path from "node:path";
import { transform } from "@svgr/core";

const packageRoot = path.resolve(import.meta.dirname, "..");
const rawDir = path.join(packageRoot, "src", "raw");
const componentsDir = path.join(packageRoot, "src", "components");
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

async function cleanGeneratedComponents() {
  await fs.mkdir(componentsDir, { recursive: true });
  const files = await fs.readdir(componentsDir);
  await Promise.all(
    files
      .filter((file) => file.endsWith(".tsx"))
      .map((file) => fs.unlink(path.join(componentsDir, file)))
  );
}

function buildComponentTemplate() {
  return (variables, { tpl }) => {
    const { componentName, jsx } = variables;
    return tpl`
import type { IconProps } from "../types";

const ${componentName} = ({ title, ...props }: IconProps) => ${jsx};

export default ${componentName};
`;
  };
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
    const sourcePath = path.join(rawDir, fileName);
    const rawSvg = await fs.readFile(sourcePath, "utf8");

    const baseName = toPascalCase(fileName);
    const componentName = `${baseName}Icon`;

    const tsx = await transform(
      rawSvg,
      {
        typescript: true,
        expandProps: "end",
        icon: false,
        titleProp: false,
        jsxRuntime: "automatic",
        plugins: ["@svgr/plugin-jsx"],
        svgo: false,
        template: buildComponentTemplate()
      },
      { componentName }
    );

    const componentPath = path.join(componentsDir, `${componentName}.tsx`);
    await fs.writeFile(componentPath, `${tsx.trim()}\n`, "utf8");

    manifest.push({
      name: fileName.replace(/\.svg$/i, ""),
      componentName,
      sourceFile: `src/raw/${fileName}`
    });
  }

  const exportLines = manifest.map(
    ({ componentName }) =>
      `export { default as ${componentName} } from "./components/${componentName}";`
  );

  const indexContent = [
    'export type { IconProps, IconManifestItem } from "./types";',
    'export { iconsManifest } from "./manifest";',
    ...exportLines,
    ""
  ].join("\n");

  const manifestItems = manifest
    .map(
      (item) =>
        `  { name: "${item.name}", componentName: "${item.componentName}", sourceFile: "${item.sourceFile}" }`
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
