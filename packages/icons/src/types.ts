import type { IconElement } from "./icon-element";

export type IconElementConstructor = typeof IconElement & {
  readonly tagName: string;
};

export type IconManifestItem = {
  name: string;
  elementName: string;
  tagName: string;
  sourceFile: string;
};
