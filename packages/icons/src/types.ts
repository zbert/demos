import type { SVGProps } from "react";

export type IconProps = SVGProps<SVGSVGElement> & {
  title?: string;
};

export type IconManifestItem = {
  name: string;
  componentName: string;
  sourceFile: string;
};
